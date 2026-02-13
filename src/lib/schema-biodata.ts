import { z } from "zod";

// Helper untuk validasi file di browser
const MAX_FILE_SIZE = 1000000; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const biodataSchema = z.object({
    // a. Foto Diri
    foto_diri: z
        .any()
        .refine((files) => files?.length === 1, "Wajib upload 1 foto diri.")
        .refine(
            (files) => files?.[0]?.size <= MAX_FILE_SIZE,
            "Ukuran file maksimal 1MB."
        )
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Format wajib .jpg, .jpeg, .png, atau .webp"
        ),

    // b. Nama Lengkap
    nama: z.string().min(3, "Nama terlalu pendek"),

    // c. No KTP (16 Digit)
    nik: z.string().length(16, "NIK wajib 16 digit angka").regex(/^\d+$/, "Hanya angka"),

    // d. No KK (16 Digit)
    no_kk: z.string().length(16, "No KK wajib 16 digit angka").regex(/^\d+$/, "Hanya angka"),

    // e. Jenis Kelamin
    jenis_kelamin: z.enum(["Laki-Laki", "Perempuan"], {
        message: "Wajib pilih jenis kelamin",
    }),

    // f. Agama
    agama: z.enum(["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"], {
        message: "Wajib pilih agama",
    }),

    // g. Tempat Lahir
    tempat_lahir: z.string().min(1, "Tempat lahir wajib diisi"),

    // h. Tanggal Lahir
    tanggal_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),

    // i. Email (Wajib Gmail)
    email: z
        .string()
        .email("Email tidak valid")
        .refine((val) => val.endsWith("@gmail.com"), {
            message: "Wajib menggunakan akun @gmail.com",
        }),

    // j. Whatsapp
    whatsapp: z.string().min(10, "Nomor Whatsapp minimal 10 digit").regex(/^\d+$/, "Hanya angka"),

    // k - m. Wilayah (Menyimpan ID wilayah dari API)
    provinsi: z.string().min(1, "Pilih Provinsi"),
    kabupaten: z.string().min(1, "Pilih Kabupaten/Kota"),
    kabupaten_nama: z.string().optional(),
    provinsi_nama: z.string().optional(), // Nama provinsi untuk pre-screening domisili
    kecamatan: z.string().min(1, "Pilih Kecamatan"),
    kelurahan: z.string().min(1, "Pilih Kelurahan"),

    // o. Alamat Detail (Hanya muncul jika kelurahan terisi)
    alamat_detail: z.string().min(5, "Alamat detail wajib diisi lengkap"),
});

export type BiodataSchemaType = z.infer<typeof biodataSchema>;