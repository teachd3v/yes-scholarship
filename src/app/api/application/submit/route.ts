import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/client";
import { calculateScore, checkPreScreening } from "@/lib/scoring";
import { sendConfirmationEmail } from "@/lib/mail";

export const runtime = 'edge';

if (!writeClient) throw new Error("Sanity writeClient not configured");
const client = writeClient;

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB for photos
// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for documents - NOT USED ANYMORE
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, "application/pdf"]; - REMOVED

function validateFile(file: File, fieldName: string): string | null {
  // All files are now treated as photos/images
  const maxSize = MAX_IMAGE_SIZE; 
  const allowedTypes = ALLOWED_IMAGE_TYPES;

  if (file.size > maxSize) {
    return `File ${fieldName} terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal ${maxSize / 1024 / 1024}MB.`;
  }
  if (!allowedTypes.includes(file.type)) {
    return `File ${fieldName} bertipe ${file.type || 'unknown'}. Hanya ${allowedTypes.join(', ')} yang diizinkan.`;
  }
  return null;
}

async function uploadImageToSanity(file: File) {
  const buffer = await file.arrayBuffer();
  const asset = await client.assets.upload("image", Buffer.from(buffer), {
    filename: file.name,
  });
  return asset._id;
}

function safeParseJSON(value: any) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      return [];
    }
  }
  return value || [];
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawData: any = {};

    // Helper to parse FormData into object
    formData.forEach((value, key) => {
        // Handle arrays (e.g. list_organisasi[0][jenis])
        if (key.includes("[")) {
            const matches = key.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
            if (matches) {
                const [_, parent, indexStr, field] = matches;
                const index = parseInt(indexStr);
                if (!rawData[parent]) rawData[parent] = [];
                if (!rawData[parent][index]) rawData[parent][index] = {};
                rawData[parent][index][field] = value;
                return;
            }
        }
        
        // Handle boolean conversions
        if (value === "true") {
            rawData[key] = true;
        } else if (value === "false") {
            rawData[key] = false;
        } else if (key === "jumlah_saudara" || key.startsWith("nilai_raport")) {
            rawData[key] = Number(value);
        } else {
             rawData[key] = value;
        }
    });
    
    console.log("Raw Data Received:", JSON.stringify(rawData, null, 2));

    // Zod Validation (Rough check, detailed validation is tricky with FormData + Files)
    // We will trust the types for now and validate critical logic manually or via schema-master if adapted
    // Note: Schema validation with files in API route is complex, we'll proceed processing valid inputs.

    // 1. Upload Files
    // 1. Upload Files - Optimized with Promise.all for parallelism
    const fileKeys = [
      "foto_diri", "file_kk", "file_sktm", "file_skb",
      "foto_raport_1", "foto_raport_2", "foto_raport_3"
    ];

    // Validate all files before uploading
    const fileErrors: string[] = [];
    for (const key of fileKeys) {
        const file = formData.get(key) as File;
        if (file && file.size > 0) {
            const error = validateFile(file, key);
            if (error) fileErrors.push(error);
        }
    }
    if (fileErrors.length > 0) {
        return NextResponse.json({ success: false, message: fileErrors.join("; ") }, { status: 400 });
    }

    const uploadPromises = fileKeys.map(async (key) => {
        const file = formData.get(key) as File;
        if (file && file.size > 0) {
            // ALL uploads are now images
            return { key, id: await uploadImageToSanity(file) };
        }
        return null;
    });

    const uploadResults = await Promise.all(uploadPromises);
    const fileUploads: any = {};
    uploadResults.forEach(result => {
        if (result) fileUploads[result.key] = result.id;
    });

    // 2. Prepare Data for Sanity
    const biodata = {
      nama: rawData.nama,
      nik: rawData.nik,
      no_kk: rawData.no_kk,
      email: rawData.email,
      whatsapp: rawData.whatsapp,
      jenis_kelamin: rawData.jenis_kelamin,
      agama: rawData.agama,
      tempat_lahir: rawData.tempat_lahir,
      tanggal_lahir: rawData.tanggal_lahir,
      provinsi: rawData.provinsi,
      provinsi_nama: rawData.provinsi_nama,
      kabupaten: rawData.kabupaten,
      kabupaten_nama: rawData.kabupaten_nama,
      kecamatan: rawData.kecamatan,
      kecamatan_nama: rawData.kecamatan_nama,
      kelurahan: rawData.kelurahan,
      kelurahan_nama: rawData.kelurahan_nama,
      alamat_detail: rawData.alamat_detail,
      foto_diri: fileUploads.foto_diri ? { _type: 'image', asset: { _type: "reference", _ref: fileUploads.foto_diri } } : undefined
    };

    const keluarga = {
      nama_ayah: rawData.nama_ayah,
      nama_ibu: rawData.nama_ibu,
      kondisi_ayah: rawData.kondisi_ayah,
      kondisi_ibu: rawData.kondisi_ibu,
      penghasilan_ortu: rawData.penghasilan_ortu,
      kontak_ortu: rawData.kontak_ortu,
      jumlah_saudara: Number(rawData.jumlah_saudara),
      // Changed to _type: 'image' to match new schema
      file_kk: fileUploads.file_kk ? { _type: 'image', asset: { _type: "reference", _ref: fileUploads.file_kk } } : undefined,
      file_sktm: fileUploads.file_sktm ? { _type: 'image', asset: { _type: "reference", _ref: fileUploads.file_sktm } } : undefined,
      file_skb: fileUploads.file_skb ? { _type: 'image', asset: { _type: "reference", _ref: fileUploads.file_skb } } : undefined,
    };

    const seleksi = {
      asal_sekolah: rawData.asal_sekolah,
      jenjang_pendidikan: rawData.jenjang_pendidikan,
      nilai_raport_1: Number(rawData.nilai_raport_1),
      nilai_raport_2: Number(rawData.nilai_raport_2),
      nilai_raport_3: Number(rawData.nilai_raport_3),
      // Changed to _type: 'image' to match new schema
      foto_raport_1: fileUploads.foto_raport_1 ? { _type: 'image', asset: { _type: "reference", _ref: fileUploads.foto_raport_1 } } : undefined,
      foto_raport_2: fileUploads.foto_raport_2 ? { _type: 'image', asset: { _type: "reference", _ref: fileUploads.foto_raport_2 } } : undefined,
      foto_raport_3: fileUploads.foto_raport_3 ? { _type: 'image', asset: { _type: "reference", _ref: fileUploads.foto_raport_3 } } : undefined,
      status_beasiswa: rawData.status_beasiswa,
      keterangan_beasiswa: rawData.keterangan_beasiswa,
      motivasi: rawData.motivasi,
      // Parse JSON strings if necessary
      list_organisasi: safeParseJSON(rawData.list_organisasi), 
      list_prestasi: safeParseJSON(rawData.list_prestasi),
      kategori_hafalan: rawData.kategori_hafalan,
      sumber_info: rawData.sumber_info,
    };

    // 3. Scoring Calculation
    // Reconstruct flat data object for scoring function compatibility
    // IMPORTANT: Spread rawData FIRST so that processed fields (like list_organisasi) overwrite it correctly
    const flatData = { ...rawData, ...biodata, ...keluarga, ...seleksi }; 
    const screening = checkPreScreening(flatData);
    const score = calculateScore(flatData);

    const scoring = {
        total_skor: score.total,
        lolos_screening: screening.lolos,
        alasan_gagal: screening.alasan,
        detail_skor: JSON.stringify(score.detail)
    };

    // 4. Create Document
    const doc = {
      _type: "application",
      status: screening.lolos ? "pending" : "rejected",
      biodata,
      keluarga,
      seleksi,
      scoring,
      submittedAt: new Date().toISOString()
    };

    await client.create(doc);
    
    // Send Confirmation Email (don't await to avoid blocking response)
    sendConfirmationEmail(doc.biodata.email, doc.biodata.nama);

    return NextResponse.json({ success: true, message: "Application submitted successfully" });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Submission Error:", errMsg);
    return NextResponse.json({ success: false, message: "Internal Server Error: " + errMsg }, { status: 500 });
  }
}
