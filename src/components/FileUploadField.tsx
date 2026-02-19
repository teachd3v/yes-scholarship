"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { MasterSchemaType } from "@/lib/schema-master";
import { FileText, Upload, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface FileUploadFieldProps {
    label: string;
    name: keyof MasterSchemaType;
    placeholder?: string;
    preview: string | null;
    fileData?: FileList | File[];
    compact?: boolean;
}

export default function FileUploadField({ label, name, placeholder, preview, fileData, compact = false }: FileUploadFieldProps) {
    const { register, formState: { errors }, setValue, trigger } = useFormContext<MasterSchemaType>();
    const [instantError, setInstantError] = useState<string | null>(null);

    const { onChange: rhfOnChange, ...restRegister } = register(name);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setInstantError(null);

        if (file) {
            const issues: string[] = [];

            if (!ACCEPTED_TYPES.includes(file.type)) {
                issues.push("Format file harus JPG, PNG, atau WebP");
            }
            if (file.size > MAX_FILE_SIZE) {
                const sizeMB = (file.size / 1024 / 1024).toFixed(1);
                issues.push(`Ukuran file ${sizeMB}MB melebihi batas maksimal 1MB`);
            }

            if (issues.length > 0) {
                setInstantError(issues.join(". "));
                // Reset file input
                e.target.value = "";
                setValue(name, undefined as any, { shouldValidate: false });
                return;
            }
        }

        // Pass to react-hook-form
        rhfOnChange(e);
    }, [rhfOnChange, name, setValue]);

    const file = fileData?.[0] as File | undefined;
    const isImage = file && file.type?.startsWith("image/");
    const errorMsg = instantError || (errors[name] ? String(errors[name]?.message) : null);

    if (compact) {
        return (
            <div>
                <label className="label-text">{label} <span className="text-red-500">*</span></label>
                <div className={`border border-dashed rounded p-3 bg-gray-50 text-center cursor-pointer relative hover:bg-gray-100 ${errorMsg ? "border-red-400 bg-red-50" : "border-gray-300"}`}>
                    <input type="file" accept="image/*" {...restRegister} onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    {file ? (
                        <div className="flex flex-col items-center gap-1 pointer-events-none">
                            {isImage && preview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded border" />
                            ) : (
                                <FileText size={32} className="text-blue-500" />
                            )}
                            <span className="text-xs text-green-600 font-medium truncate max-w-full">{file.name}</span>
                            <span className="text-xs text-blue-500">Klik untuk ganti</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-1 text-gray-500 pointer-events-none">
                            <div className="flex items-center gap-2">
                                <Upload size={16} /> <span className="text-xs font-medium">{placeholder || "Klik untuk unggah"}</span>
                            </div>
                            <span className="text-[10px] text-gray-400">Format JPG/PNG/WebP (Max 1MB, Hanya 1 file)</span>
                        </div>
                    )}
                </div>
                {errorMsg && (
                    <p className="error-text flex items-center gap-1">
                        <AlertCircle size={12} className="shrink-0" />
                        {errorMsg}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="label-text">{label} <span className="text-red-500">*</span></label>
            <div className={`border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition cursor-pointer text-center relative ${errorMsg ? "border-red-400 bg-red-50" : "border-gray-300"}`}>
                <input
                    type="file"
                    accept="image/*"
                    {...restRegister}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id={`upload-${name}`}
                />
                {file ? (
                    <div className="flex flex-col items-center pointer-events-none">
                        {isImage && preview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border mb-2" />
                        ) : (
                            <FileText className="w-8 h-8 text-blue-500 mb-2" />
                        )}
                        <span className="text-xs text-green-600 font-medium truncate max-w-full">{file.name}</span>
                        <span className="text-xs text-blue-500 mt-1">Klik untuk ganti</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center pointer-events-none">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">{placeholder || "Klik untuk unggah"}</span>
                        <span className="text-xs text-gray-400 mt-1">Format JPG/PNG/WebP (Max 1MB, Hanya 1 file)</span>
                    </div>
                )}
            </div>
            {errorMsg && (
                <p className="error-text flex items-center gap-1">
                    <AlertCircle size={12} className="shrink-0" />
                    {errorMsg}
                </p>
            )}
        </div>
    );
}
