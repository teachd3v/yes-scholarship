import { z } from "zod";

const MAX_FILE_SIZE = 20_000_000; // 20MB (client disesuaikan, akan dicompress sebelum upload)
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const validateFile = (label: string) =>
    z.any()
        .refine((files) => files?.length === 1, `Wajib unggah ${label}.`)
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Ukuran maksimal 20MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Format wajib .jpg, .png, atau .webp"
        );
