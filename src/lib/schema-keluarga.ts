import { z } from "zod";
import { validateFile } from "./validate-file";

export const keluargaSchema = z.object({
    // a. Kartu Keluarga
    file_kk: validateFile("Kartu Keluarga"),

    // b. SKTM
    file_sktm: validateFile("Surat Keterangan Tidak Mampu"),

    // c. Surat Kelakuan Baik
    file_skb: validateFile("Surat Kelakuan Baik"),

    // d & e. Nama Orang Tua
    nama_ayah: z.string().min(1, "Nama Ayah wajib diisi"),
    nama_ibu: z.string().min(1, "Nama Ibu wajib diisi"),

    // f & g. Kondisi Orang Tua
    kondisi_ayah: z.enum(["Wafat", "Bekerja", "Tidak Bekerja"]),
    kondisi_ibu: z.enum(["Wafat", "Bekerja", "Tidak Bekerja"]),

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