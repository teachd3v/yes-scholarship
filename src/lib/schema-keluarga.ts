import { z } from "zod";
import { validateFile, validateFileOptional } from "./validate-file";

export const keluargaSchema = z.object({
    // a. Kartu Keluarga
    file_kk: validateFile("Kartu Keluarga"),

    // b. SKTM — opsional (bisa diganti KIP/PKH/KIS)
    file_sktm: validateFileOptional(),

    // c. Surat Kelakuan Baik — opsional
    file_skb: validateFileOptional(),

    // d & e. Nama Orang Tua
    nama_ayah: z.string().min(1, "Nama Ayah wajib diisi"),
    nama_ibu: z.string().min(1, "Nama Ibu wajib diisi"),

    // f & g. Kondisi Orang Tua
    kondisi_ayah: z.enum(["Wafat", "Bekerja", "Tidak Bekerja"]),
    kondisi_ibu: z.enum(["Wafat", "Bekerja", "Tidak Bekerja"]),

    // f2 & g2. Pekerjaan Orang Tua (wajib jika kondisi = Bekerja, dicek di superRefine)
    pekerjaan_ayah: z.string().optional(),
    pekerjaan_ibu: z.string().optional(),

    // h. Penghasilan (Sesuai Opsi a-e) - Optional di awal, dicek di superRefine
    penghasilan_ortu: z.enum([
        "range_a", // 0 - < 1 Juta
        "range_b", // 1 - 2.5 Juta
        "range_c", // 2.6 - 4 Juta
        "range_d", // 4 - 5 Juta
        "range_e"  // > 5 Juta
    ]).optional(),

    // i. Kontak Ortu
    kontak_ortu: z.string()
        .min(10, "Nomor tidak valid")
        .regex(/^\d+$/, "Hanya angka"),

    // j. Jumlah Saudara
    jumlah_saudara: z.coerce.number().min(0),
}).superRefine((data, ctx) => {
    // Cek Kondisi Kedua Orang Tua
    const ayahTidakKerja = data.kondisi_ayah === "Tidak Bekerja" || data.kondisi_ayah === "Wafat";
    const ibuTidakKerja = data.kondisi_ibu === "Tidak Bekerja" || data.kondisi_ibu === "Wafat";
    const keduaOrtuTidakKerja = ayahTidakKerja && ibuTidakKerja;

    // Pekerjaan wajib diisi jika kondisi = Bekerja
    if (data.kondisi_ayah === "Bekerja" && !data.pekerjaan_ayah?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["pekerjaan_ayah"],
            message: "Keterangan pekerjaan ayah wajib diisi",
        });
    }
    if (data.kondisi_ibu === "Bekerja" && !data.pekerjaan_ibu?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["pekerjaan_ibu"],
            message: "Keterangan pekerjaan ibu wajib diisi",
        });
    }

    // Jika SALAH SATU masih bekerja (atau tidak memenuhi syarat keduanya tidak kerja), maka Penghasilan Wajib
    if (!keduaOrtuTidakKerja) {
        if (!data.penghasilan_ortu) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["penghasilan_ortu"],
                message: "Pilih rentang penghasilan",
            });
        }
    }

});

export type KeluargaSchemaType = z.infer<typeof keluargaSchema>;