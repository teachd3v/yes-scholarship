import { z } from "zod";
import { validateFile } from "./validate-file";

export const seleksiSchema = z.object({
    // a. Asal Sekolah
    asal_sekolah: z.string().min(3, "Nama sekolah wajib diisi"),

    // b. Jenjang
    jenjang_pendidikan: z.enum(["SMA", "MA", "SMK"], {
        message: "Pilih jenjang pendidikan",
    }),

    // c-e. Foto Raport
    foto_raport_1: validateFile("Raport Sem 1"),
    foto_raport_2: validateFile("Raport Sem 2"),
    foto_raport_3: validateFile("Raport Sem 3"),

    // f-h. Nilai Rata-rata (2 desimal handled by UI step, validation here)
    nilai_raport_1: z.coerce.number().min(0).max(100),
    nilai_raport_2: z.coerce.number().min(0).max(100),
    nilai_raport_3: z.coerce.number().min(0).max(100),

    // i. Beasiswa
    status_beasiswa: z.enum(["Tidak", "Ya_PIP", "Ya_Lainnya"], {
        message: "Pilih status beasiswa",
    }),
    keterangan_beasiswa: z.string().optional(), // Wajib jika Ya_Lainnya (cek di superRefine)

    // j. Organisasi (Toggle & Array)
    toggle_organisasi: z.boolean(),
    list_organisasi: z.array(z.object({
        jenis: z.string().min(1, "Pilih jenis organisasi"),
        ket_lainnya: z.string().optional(),
        jabatan: z.enum(["Ketua", "Pengurus", "Anggota"], { message: "Pilih jabatan" }),
    })).optional(),

    // k. Prestasi (Toggle & Array)
    toggle_prestasi: z.boolean(),
    list_prestasi: z.array(z.object({
        tingkat: z.string().min(1, "Pilih tingkat"),
        juara: z.string().min(1, "Pilih juara"),
        keterangan: z.string().min(1, "Keterangan lomba wajib diisi"),
    })).optional(),

    // l. Hafalan (Toggle & Select)
    toggle_hafalan: z.boolean(),
    kategori_hafalan: z.string().optional(),

    // m. Motivasi
    motivasi: z.string().min(20, "Motivasi minimal 20 karakter"),

    // n. Sumber Info
    sumber_info: z.enum(["IG", "Website", "Whatsapp"], {
        message: "Pilih sumber informasi",
    }),

    // o. Social Media
    social_media: z
        .string()
        .min(1, "Link social media wajib diisi")
        .url("Format harus berupa URL yang valid, contoh: https://instagram.com/username"),

});

export type SeleksiSchemaType = z.infer<typeof seleksiSchema>;