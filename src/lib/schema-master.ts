import { z } from "zod";
import { biodataSchema } from "./schema-biodata";
import { keluargaSchema } from "./schema-keluarga";
import { seleksiSchema } from "./schema-seleksi";

export const masterSchema = biodataSchema
    .merge(keluargaSchema)
    .merge(seleksiSchema)
    .superRefine((data, ctx) => {
        // Conditional Beasiswa
        if (data.status_beasiswa === "Ya_Lainnya" && !data.keterangan_beasiswa) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["keterangan_beasiswa"], message: "Sebutkan nama beasiswa lainnya" });
        }

        // Conditional Organisasi
        if (data.toggle_organisasi) {
            if (!data.list_organisasi || data.list_organisasi.length === 0) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["list_organisasi"], message: "Minimal isi 1 organisasi jika diaktifkan" });
            }
            data.list_organisasi?.forEach((item, index) => {
                if (item.jenis === "Lainnya" && !item.ket_lainnya) {
                    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["list_organisasi", index, "ket_lainnya"], message: "Sebutkan organisasi lainnya" });
                }
            });
            // Duplikat organisasi
            if (data.list_organisasi && data.list_organisasi.length > 1) {
                const seen = new Set<string>();
                data.list_organisasi.forEach((item, index) => {
                    const key = item.jenis === "Lainnya"
                        ? `${item.jenis}|${item.jabatan}|${item.ket_lainnya || ""}`
                        : `${item.jenis}|${item.jabatan}`;
                    if (seen.has(key)) {
                        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["list_organisasi", index, "jenis"], message: "Organisasi ini sudah ditambahkan sebelumnya" });
                    } else {
                        seen.add(key);
                    }
                });
            }
        }

        // Conditional Prestasi
        if (data.toggle_prestasi && (!data.list_prestasi || data.list_prestasi.length === 0)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["list_prestasi"], message: "Minimal isi 1 prestasi jika diaktifkan" });
        }

        // Conditional Hafalan
        if (data.toggle_hafalan && !data.kategori_hafalan) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["kategori_hafalan"], message: "Pilih jumlah hafalan" });
        }
    });

export type MasterSchemaType = z.infer<typeof masterSchema>;
