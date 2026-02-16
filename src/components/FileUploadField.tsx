"use client";

import { useFormContext } from "react-hook-form";
import { MasterSchemaType } from "@/lib/schema-master";
import { FileText, Upload } from "lucide-react";

interface FileUploadFieldProps {
    label: string;
    name: keyof MasterSchemaType;
    placeholder?: string;
    preview: string | null;
    fileData?: FileList | File[];
    compact?: boolean;
}

export default function FileUploadField({ label, name, placeholder, preview, fileData, compact = false }: FileUploadFieldProps) {
    const { register, formState: { errors } } = useFormContext<MasterSchemaType>();

    const file = fileData?.[0] as File | undefined;
    const isImage = file && file.type?.startsWith("image/");

    if (compact) {
        return (
            <div>
                <label className="label-text">{label} <span className="text-red-500">*</span></label>
                <div className="border border-dashed border-gray-300 rounded p-3 bg-gray-50 text-center cursor-pointer relative hover:bg-gray-100">
                    <input type="file" accept="image/*" {...register(name)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
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
                        <div className="flex items-center justify-center gap-2 text-gray-500 pointer-events-none">
                            <Upload size={16} /> <span className="text-xs">Upload (Max 10MB)</span>
                        </div>
                    )}
                </div>
                {errors[name] && <p className="error-text">{String(errors[name]?.message)}</p>}
            </div>
        );
    }

    return (
        <div className="mb-4">
            <label className="label-text">{label} <span className="text-red-500">*</span></label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition cursor-pointer text-center relative">
                <input
                    type="file"
                    accept="image/*"
                    {...register(name)}
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
                        <span className="text-xs text-gray-400 mt-1">File size &lt;10MB, Format JPG/PNG/WebP (Hanya 1 file)</span>
                    </div>
                )}
            </div>
            {errors[name] && <p className="error-text">{String(errors[name]?.message)}</p>}
        </div>
    );
}
