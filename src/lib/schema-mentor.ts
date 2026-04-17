import { z } from "zod";

const MAX_FILE_SIZE = 20_000_000; // 20MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOC_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png"];

export const mentorSchema = z.object({
    // a. Foto Profil Terbaru
    foto_profil: z
        .any()
        .refine((files) => files?.length === 1, "Wajib upload foto profil.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Ukuran maksimal 20MB.")
        .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Format wajib .jpg, .png, atau .webp"),

    // b. Nama Lengkap dan Gelar
    nama_lengkap: z.string().min(3, "Nama lengkap dan gelar wajib diisi (Min. 3 karakter)"),

    // c. Jenis Kelamin
    jenis_kelamin: z.enum(["Laki-Laki", "Perempuan"], {
        message: "Wajib pilih jenis kelamin",
    }),

    // d. Tempat Lahir
    tempat_lahir: z.string().min(1, "Tempat lahir wajib diisi"),

    // e. Tanggal Lahir
    tanggal_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),

    // f. Kontak WA
    whatsapp: z.string().min(10, "Nomor Whatsapp minimal 10 digit").regex(/^\d+$/, "Hanya angka"),

    // e. Email (Wajib Gmail)
    email: z
        .string()
        .email("Email tidak valid")
        .refine((val) => val.toLowerCase().endsWith("@gmail.com"), {
            message: "Wajib menggunakan akun @gmail.com",
        }),

    // f. Alamat Domisili
    provinsi: z.string().min(1, "Provinsi wajib diisi"),
    provinsi_nama: z.string().optional(),
    kabupaten: z.string().min(1, "Kabupaten wajib diisi"),
    kabupaten_nama: z.string().optional(),
    kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
    kecamatan_nama: z.string().optional(),
    kelurahan: z.string().min(1, "Kelurahan wajib diisi"),
    kelurahan_nama: z.string().optional(),
    alamat_detail: z.string().min(10, "Alamat detail wajib diisi lengkap (Min. 10 karakter)"),

    // g. Status Pernikahan
    status_pernikahan: z.enum(["Belum Menikah", "Menikah", "Pernah Menikah"], {
        message: "Pilih status pernikahan",
    }),

    // h. Riwayat Pendidikan
    jenjang_pendidikan: z.enum(["S1", "S2", "S3"], {
        message: "Pilih jenjang pendidikan terakhir",
    }),
    jurusan: z.string().min(2, "Jurusan wajib diisi"),

    // i. Link Sosial Media
    social_media: z
        .string()
        .min(1, "Link social media wajib diisi")
        .url("Format harus berupa URL yang valid"),

    // j. Lancar Membaca Al-Qur'an?
    lancar_quran: z.enum(["Lancar", "Belum Lancar"], {
        message: "Wajib dijawab",
    }),

    // k. Sumber informasi seleksi YES
    sumber_info: z.enum(["IG", "Website", "Whatsapp"], {
        message: "Pilih sumber informasi",
    }),

    // l. Motivasi Bergabung Menjadi Mentor YES?
    motivasi: z.string().min(20, "Motivasi minimal 20 karakter"),

    // m. Upload CV/Resume terbaru
    cv_resume: z
        .any()
        .refine((files) => files?.length === 1, "Wajib upload CV/Resume.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Ukuran maksimal 20MB.")
        .refine((files) => ACCEPTED_DOC_TYPES.includes(files?.[0]?.type), "Format wajib .pdf, .doc, .docx atau gambar"),

    // n. Pakta Integritas / Kriteria Khusus
    berakhlak_islam_tidak_merokok: z.boolean().default(false),
    bersedia_rangkaian_program: z.boolean().default(false),
    mampu_mengajar_ptn: z.boolean().default(false),
    komunikatif_remaja: z.boolean().default(false),
    hafalan_1_juz: z.boolean().default(false),
    siap_komitmen: z.boolean().default(false),
});

export type MentorSchemaType = z.infer<typeof mentorSchema>;
