"use client";

import { useFormContext } from "react-hook-form";
import { MentorSchemaType } from "@/lib/schema-mentor";
import { GraduationCap } from "lucide-react";

export default function SectionMentorPendidikan() {
    const {
        register,
        formState: { errors },
    } = useFormContext<MentorSchemaType>();

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100 my-4 p-4 md:p-8 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Riwayat Pendidikan
            </h2>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* h. JENJANG PENDIDIKAN */}
                    <div>
                        <label className="label-text text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <GraduationCap size={16} className="text-blue-500" />
                            Jenjang Terakhir <span className="text-red-500">*</span>
                        </label>
                        <select {...register("jenjang_pendidikan")} className="input-field mt-1">
                            <option value="">Pilih Jenjang...</option>
                            <option value="S1">S1 (Sarjana / Mahasiswa)</option>
                            <option value="S2">S2 (Magister)</option>
                            <option value="S3">S3 (Doktor)</option>
                        </select>
                        {errors.jenjang_pendidikan && <p className="error-text text-red-500 text-xs mt-1">{errors.jenjang_pendidikan.message}</p>}
                    </div>

                    {/* h. JURUSAN */}
                    <div>
                        <label className="label-text text-sm font-semibold text-slate-700">Jurusan <span className="text-red-500">*</span></label>
                        <input {...register("jurusan")} className="input-field mt-1" placeholder="Contoh: Pendidikan Fisika" />
                        {errors.jurusan && <p className="error-text text-red-500 text-xs mt-1">{errors.jurusan.message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
