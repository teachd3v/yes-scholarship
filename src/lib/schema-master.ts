import { z } from "zod";
import { biodataSchema } from "./schema-biodata";
import { keluargaSchema } from "./schema-keluarga";
import { seleksiSchema } from "./schema-seleksi";

export const masterSchema = biodataSchema
    .merge(keluargaSchema)
    .merge(seleksiSchema);

export type MasterSchemaType = z.infer<typeof masterSchema>;
