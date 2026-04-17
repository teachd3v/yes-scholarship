"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { MentorSchemaType } from "@/lib/schema-mentor";
import { Link2, BookOpen, Search, Quote, FileText } from "lucide-react";

export default function SectionMentorTambahan() {
    const {
        register,
        formState: { errors },
    } = useFormContext<MentorSchemaType>();

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100 my-4 p-4 md:p-8 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Informasi Tambahan
            </h2>

            <div className="space-y-6">
                {/* i. Link Sosial Media */}
                <div>
                    <label className="label-text text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Link2 size={16} className="text-blue-500" />
                        Link Sosial Media <span className="text-red-500">*</span>
                    </label>
                    <input {...register("social_media")} className="input-field mt-1" placeholder="https://instagram.com/username" />
                    {errors.social_media && <p className="error-text text-red-500 text-xs mt-1">{errors.social_media.message}</p>}
                </div>

                {/* j. Lancar Membaca Al-Qur'an? */}
                <div>
                    <label className="label-text text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <BookOpen size={16} className="text-green-500" />
                        Lancar Membaca Al-Qur'an? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="Lancar" {...register("lancar_quran")} className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">Ya, Lancar</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="Belum Lancar" {...register("lancar_quran")} className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">Belum Lancar</span>
                        </label>
                    </div>
                    {errors.lancar_quran && <p className="error-text text-red-500 text-xs mt-1">{errors.lancar_quran.message}</p>}
                </div>

                {/* k. Sumber informasi seleksi YES */}
                <div>
                    <label className="label-text text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Search size={16} className="text-orange-500" />
                        Sumber Informasi Seleksi YES <span className="text-red-500">*</span>
                    </label>
                    <select {...register("sumber_info")} className="input-field mt-1">
                        <option value="">Pilih...</option>
                        <option value="IG">Instagram</option>
                        <option value="Website">Website</option>
                        <option value="Whatsapp">Whatsapp</option>
                    </select>
                    {errors.sumber_info && <p className="error-text text-red-500 text-xs mt-1">{errors.sumber_info.message}</p>}
                </div>

                {/* l. Motivasi Bergabung */}
                <div>
                    <label className="label-text text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Quote size={16} className="text-blue-500" />
                        Motivasi Bergabung Menjadi Mentor YES? <span className="text-red-500">*</span>
                    </label>
                    <textarea {...register("motivasi")} className="input-field mt-1 h-32" placeholder="Tuliskan motivasi Anda..." />
                    {errors.motivasi && <p className="error-text text-red-500 text-xs mt-1">{errors.motivasi.message}</p>}
                </div>

                {/* m. Upload CV/Resume */}
                <div className="border-b pb-6">
                    <label className="label-text text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <FileText size={16} className="text-slate-500" />
                        Upload CV/Resume Terbaru <span className="text-red-500">*</span>
                    </label>
                    <div className={`mt-2 border-2 border-dashed rounded-xl p-6 hover:bg-slate-50 transition cursor-pointer text-center ${errors.cv_resume ? "border-red-400 bg-red-50" : "border-slate-200"}`}>
                        <input
                            type="file"
                            {...register("cv_resume")}
                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-slate-400 mt-2">Format: PDF, Word, atau Gambar (Max 20MB)</p>
                    </div>
                    {errors.cv_resume && <p className="error-text text-red-500 text-xs mt-1">{errors.cv_resume.message as string}</p>}
                </div>

                {/* n. Kriteria & Komitmen */}
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 space-y-4">
                    <h3 className="font-bold text-blue-800 text-sm uppercase tracking-wider mb-2">Kriteria & Komitmen Mentor</h3>
                    
                    <div className="space-y-3">
                        <CheckboxItem 
                            label="Saya Berakhlak Islami dan tidak merokok" 
                            name="berakhlak_islam_tidak_merokok"
                            register={register}
                            error={errors.berakhlak_islam_tidak_merokok?.message}
                        />
                        <CheckboxItem 
                            label="Saya Bersedia mengikuti seluruh rangkaian program" 
                            name="bersedia_rangkaian_program"
                            register={register}
                            error={errors.bersedia_rangkaian_program?.message}
                        />
                        <CheckboxItem 
                            label="Saya Mampu mengajar persiapan masuk PTN" 
                            name="mampu_mengajar_ptn"
                            register={register}
                            error={errors.mampu_mengajar_ptn?.message}
                        />
                        <CheckboxItem 
                            label="Saya Komunikatif dan menyukai dunia remaja" 
                            name="komunikatif_remaja"
                            register={register}
                            error={errors.komunikatif_remaja?.message}
                        />
                        <CheckboxItem 
                            label="Saya memiliki hafalan Al-Qur'an minimal 1 juz" 
                            name="hafalan_1_juz"
                            register={register}
                            error={errors.hafalan_1_juz?.message}
                        />
                        <CheckboxItem 
                            label="Saya Siap berkomitmen minimal kontrak 1 tahun" 
                            name="siap_komitmen"
                            register={register}
                            error={errors.siap_komitmen?.message}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckboxItem({ label, name, register, error }: any) {
    return (
        <div className="flex flex-col">
            <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                    type="checkbox" 
                    {...register(name)} 
                    className="mt-1 w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 transition cursor-pointer" 
                />
                <span className="text-sm text-slate-700 group-hover:text-blue-700 transition font-medium">
                    {label} <span className="text-red-500">*</span>
                </span>
            </label>
            {error && <p className="text-red-500 text-[10px] ml-8 mt-1 font-bold italic">{error}</p>}
        </div>
    );
}
