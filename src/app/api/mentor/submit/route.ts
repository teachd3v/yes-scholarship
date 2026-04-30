import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/client";
import { checkMentorScreening } from "@/lib/mentor-scoring";
import { sendMentorConfirmationEmail, type MentorEmailData } from "@/lib/mail";

if (!writeClient) throw new Error("Sanity writeClient not configured");
const client = writeClient;

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

async function uploadAssetToSanity(file: File, type: "image" | "file") {
  const buffer = await file.arrayBuffer();
  const asset = await client.assets.upload(type, Buffer.from(buffer), {
    filename: file.name,
  });
  return asset._id;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: "Terlalu banyak percobaan. Silakan coba lagi nanti.", code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const rawData: any = {};

    formData.forEach((value, key) => {
      if (typeof value === "string") {
        rawData[key] = value;
      }
    });

    // Duplicate check: reject if email or whatsapp already exists
    const email = rawData.email?.toLowerCase().trim();
    const whatsapp = rawData.whatsapp?.trim();
    const existing = await client.fetch(
      `*[_type == "mentor" && (biodata.email == $email || biodata.whatsapp == $whatsapp)][0]{ _id, "foundEmail": biodata.email }`,
      { email, whatsapp }
    );

    if (existing) {
      const isEmail = existing.foundEmail === email;
      return NextResponse.json(
        {
          success: false,
          message: isEmail 
            ? "Email ini sudah terdaftar sebagai mentor." 
            : "Nomor WhatsApp ini sudah terdaftar sebagai mentor.",
          code: "DUPLICATE_ENTRY",
        },
        { status: 409 }
      );
    }

    // 1. Upload Assets
    const fotoProfilFile = formData.get("foto_profil") as File;
    const cvResumeFile = formData.get("cv_resume") as File;

    let fotoProfilAssetId;
    let cvResumeAssetId;

    if (fotoProfilFile && fotoProfilFile.size > 0) {
      fotoProfilAssetId = await uploadAssetToSanity(fotoProfilFile, "image");
    }

    if (cvResumeFile && cvResumeFile.size > 0) {
      const isImage = cvResumeFile.type.startsWith("image/");
      cvResumeAssetId = await uploadAssetToSanity(cvResumeFile, isImage ? "image" : "file");
    }

    // 2. Prepare Sanity Doc
    const flatData = { ...rawData };
    // Convert boolean strings to boolean
    const boolFields = [
        "berakhlak_islam_tidak_merokok", 
        "bersedia_rangkaian_program", 
        "mampu_mengajar_ptn", 
        "komunikatif_remaja", 
        "hafalan_1_juz", 
        "siap_komitmen"
    ];
    boolFields.forEach(field => {
        flatData[field] = rawData[field] === "true" || rawData[field] === true;
    });

    const screening = checkMentorScreening(flatData);
    let finalStatus = "pending";
    if (!screening.lolos) {
        finalStatus = "rejected";
    }

    const doc = {
      _type: "mentor",
      status: finalStatus,
      biodata: {
        nama_lengkap: rawData.nama_lengkap,
        jenis_kelamin: rawData.jenis_kelamin,
        tempat_lahir: rawData.tempat_lahir,
        tanggal_lahir: rawData.tanggal_lahir,
        whatsapp: rawData.whatsapp?.startsWith("62") ? rawData.whatsapp : `62${rawData.whatsapp}`,
        email: rawData.email,
        status_pernikahan: rawData.status_pernikahan,
        foto_profil: fotoProfilAssetId ? { _type: "image", asset: { _type: "reference", _ref: fotoProfilAssetId } } : undefined,
      },
      domisili: {
        provinsi: rawData.provinsi,
        provinsi_nama: rawData.provinsi_nama,
        kabupaten: rawData.kabupaten,
        kabupaten_nama: rawData.kabupaten_nama,
        kecamatan: rawData.kecamatan,
        kecamatan_nama: rawData.kecamatan_nama,
        kelurahan: rawData.kelurahan,
        kelurahan_nama: rawData.kelurahan_nama,
        alamat_detail: rawData.alamat_detail,
      },
      pendidikan: {
        jenjang: rawData.jenjang_pendidikan,
        jurusan: rawData.jurusan,
      },
      tambahan: {
        social_media: rawData.social_media,
        lancar_quran: rawData.lancar_quran,
        sumber_info: rawData.sumber_info,
        motivasi: rawData.motivasi,
        cv_resume: cvResumeAssetId ? { 
            _type: cvResumeFile.type.startsWith("image/") ? "image" : "file", 
            asset: { _type: "reference", _ref: cvResumeAssetId } 
        } : undefined,
        berakhlak_islam_tidak_merokok: flatData.berakhlak_islam_tidak_merokok,
        bersedia_rangkaian_program: flatData.bersedia_rangkaian_program,
        mampu_mengajar_ptn: flatData.mampu_mengajar_ptn,
        komunikatif_remaja: flatData.komunikatif_remaja,
        hafalan_1_juz: flatData.hafalan_1_juz,
        siap_komitmen: flatData.siap_komitmen,
      },
      scoring: {
        lolos_screening: screening.lolos,
        alasan_gagal: screening.alasan,
      },
      submittedAt: new Date().toISOString(),
    };

    await client.create(doc);

    // 6. Send Confirmation Email
    const alamatLengkap = [rawData.alamat_detail, rawData.kelurahan_nama, rawData.kecamatan_nama, rawData.kabupaten_nama, rawData.provinsi_nama].filter(Boolean).join(", ");
    const emailData: MentorEmailData = {
        nama_lengkap: rawData.nama_lengkap,
        email: rawData.email,
        whatsapp: rawData.whatsapp,
        jenis_kelamin: rawData.jenis_kelamin,
        tempat_lahir: rawData.tempat_lahir,
        tanggal_lahir: rawData.tanggal_lahir,
        alamat_lengkap: alamatLengkap,
        status_pernikahan: rawData.status_pernikahan,
        jenjang_pendidikan: rawData.jenjang_pendidikan,
        jurusan: rawData.jurusan,
        social_media: rawData.social_media,
        lancar_quran: rawData.lancar_quran,
        sumber_info: rawData.sumber_info,
        motivasi: rawData.motivasi,
        foto_profil_assetId: fotoProfilAssetId,
        cv_resume_assetId: cvResumeAssetId
    };

    await sendMentorConfirmationEmail(rawData.email, emailData);

    return NextResponse.json({ success: true, message: "Pendaftaran mentor berhasil dikirim" });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Mentor Submission Error:", errMsg);
    return NextResponse.json({ success: false, message: "Internal Server Error: " + errMsg }, { status: 500 });
  }
}
