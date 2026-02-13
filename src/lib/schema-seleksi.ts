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
        jabatan: z.string().min(1, "Pilih jabatan"),
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

}).superRefine((data, ctx) => {
    // 1. Validasi Conditional Beasiswa
    if (data.status_beasiswa === "Ya_Lainnya" && !data.keterangan_beasiswa) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["keterangan_beasiswa"],
            message: "Sebutkan nama beasiswa lainnya",
        });
    }

    // 2. Validasi Conditional Organisasi
    if (data.toggle_organisasi) {
        if (!data.list_organisasi || data.list_organisasi.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["list_organisasi"],
                message: "Minimal isi 1 organisasi jika diaktifkan",
            });
        }
        // Cek jika pilih 'Lainnya' di dalam list
        data.list_organisasi?.forEach((item, index) => {
            if (item.jenis === "Lainnya" && !item.ket_lainnya) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [`list_organisasi`, index, `ket_lainnya`],
                    message: "Sebutkan organisasi lainnya",
                });
            }
        });
    }

    // 3. Validasi Conditional Hafalan
    if (data.toggle_hafalan && !data.kategori_hafalan) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["kategori_hafalan"],
            message: "Pilih jumlah hafalan",
        });
    }
});

export type SeleksiSchemaType = z.infer<typeof seleksiSchema>;