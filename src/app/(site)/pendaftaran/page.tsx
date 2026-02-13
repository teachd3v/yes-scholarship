"use client";

import SectionBiodata from "@/components/SectionBiodata";
import SectionKeluarga from "@/components/SectionKeluarga";
import SectionSeleksi from "@/components/SectionSeleksi";
import { useForm, FormProvider, useWatch, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { masterSchema, MasterSchemaType } from "@/lib/schema-master";
import { checkPreScreening, calculateScore } from "@/lib/scoring";
import { Save, Loader2, User, Users, GraduationCap, CheckCircle, Mail, X, Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const SECTIONS = [
  { id: "biodata", label: "Biodata", icon: User },
  { id: "keluarga", label: "Keluarga", icon: Users },
  { id: "seleksi", label: "Seleksi", icon: GraduationCap },
] as const;

// Fields per section for completion tracking
const BIODATA_FIELDS: (keyof MasterSchemaType)[] = [
  "nama", "nik", "no_kk", "jenis_kelamin", "agama",
  "tempat_lahir", "tanggal_lahir", "email", "whatsapp",
  "provinsi", "kabupaten", "kecamatan", "kelurahan", "alamat_detail",
];

const KELUARGA_FIELDS: (keyof MasterSchemaType)[] = [
  "nama_ayah", "nama_ibu", "kondisi_ayah", "kondisi_ibu",
  "kontak_ortu",
];

const SELEKSI_FIELDS: (keyof MasterSchemaType)[] = [
  "asal_sekolah", "jenjang_pendidikan",
  "nilai_raport_1", "nilai_raport_2", "nilai_raport_3",
  "status_beasiswa", "motivasi", "sumber_info",
];

function isFilled(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return false;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function StickyStepperContent({
  control,
  activeSection,
  onScrollTo,
}: {
  control: Control<MasterSchemaType>;
  activeSection: number;
  onScrollTo: (id: string) => void;
}) {
  const values = useWatch({ control });

  const getCompletion = (fields: (keyof MasterSchemaType)[]) => {
    const filled = fields.filter((f) => isFilled(values[f])).length;
    return { filled, total: fields.length };
  };

  const sectionFields = [BIODATA_FIELDS, KELUARGA_FIELDS, SELEKSI_FIELDS];
  const completions = sectionFields.map((f) => getCompletion(f));
  const totalFilled = completions.reduce((s, c) => s + c.filled, 0);
  const totalFields = completions.reduce((s, c) => s + c.total, 0);
  const overallProgress = totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0;

  return (
    <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-3 py-3">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-500 tabular-nums w-10 text-right">
            {overallProgress}%
          </span>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between gap-1">
          {SECTIONS.map((s, i) => {
            const comp = completions[i];
            const isComplete = comp.filled === comp.total;
            const isActive = i === activeSection;
            const isPast = i < activeSection;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onScrollTo(s.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                  isComplete
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : isPast
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-slate-50 text-slate-400 border border-slate-200"
                }`}
              >
                <span
                  className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold shrink-0 ${
                    isComplete
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-white text-blue-600"
                      : isPast
                      ? "bg-blue-200 text-blue-700"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {isComplete ? <Check size={12} /> : i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden text-[10px]">{s.label}</span>
                {!isComplete && (
                  <span
                    className={`text-[10px] md:text-xs tabular-nums ${
                      isActive ? "text-blue-200" : "text-slate-400"
                    }`}
                  >
                    {comp.filled}/{comp.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PendaftaranPage() {
  const methods = useForm<MasterSchemaType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(masterSchema) as any,
    defaultValues: {
      // Biodata
      nama: "", nik: "", no_kk: "", jenis_kelamin: undefined, agama: undefined,
      tempat_lahir: "", tanggal_lahir: "", email: "", whatsapp: "", provinsi: "",
      kabupaten: "", kabupaten_nama: "", provinsi_nama: "", kecamatan: "",
      kelurahan: "", alamat_detail: "",
      // Keluarga
      nama_ayah: "", nama_ibu: "", kondisi_ayah: undefined, kondisi_ibu: undefined,
      penghasilan_ortu: undefined, kontak_ortu: "", jumlah_saudara: 0,
      // Seleksi
      asal_sekolah: "", jenjang_pendidikan: undefined, nilai_raport_1: 0,
      nilai_raport_2: 0, nilai_raport_3: 0, status_beasiswa: undefined,
      keterangan_beasiswa: "", toggle_organisasi: false, list_organisasi: [],
      toggle_prestasi: false, list_prestasi: [], toggle_hafalan: false,
      kategori_hafalan: "", motivasi: "", sumber_info: undefined,
    }
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");
  const [activeSection, setActiveSection] = useState(0);
  const { isSubmitting } = methods.formState;

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) setActiveSection(index);
          }
        });
      },
      { rootMargin: "-140px 0px -60% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const onSubmit = async (data: MasterSchemaType) => {
    console.log("DATA PENDAFTARAN LENGKAP:", data);

    const screening = checkPreScreening(data);
    console.log("\n========== PRE-SCREENING ==========");
    if (screening.lolos) {
      console.log("STATUS: LOLOS PRE-SCREENING");
    } else {
      console.log("STATUS: TIDAK LOLOS PRE-SCREENING");
      console.log("Alasan:");
      screening.alasan.forEach((a, i) => console.log(`  ${i + 1}. ${a}`));
    }

    const score = calculateScore(data);
    console.log("\n========== SCORING ==========");
    console.table(score.detail);
    console.log("TOTAL SKOR:", score.total);

    if (!screening.lolos) {
      alert("Tidak Lolos Pre-Screening. Cek Console untuk detail.");
      return;
    }

    // Simulasi pengiriman data
    await new Promise((resolve) => setTimeout(resolve, 5000));

    setSuccessEmail(data.email);
    setShowSuccess(true);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Sticky Stepper */}
      <StickyStepperContent
        control={methods.control}
        activeSection={activeSection}
        onScrollTo={scrollToSection}
      />

      <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 px-3 py-6 md:px-4 md:py-10">
        <header className="text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Formulir Seleksi YES 2026</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Mohon isi data secara berurutan dan teliti.</p>
        </header>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6 md:space-y-10">
            <div id="biodata"><SectionBiodata /></div>
            <div id="keluarga"><SectionKeluarga /></div>
            <div id="seleksi"><SectionSeleksi /></div>

            <div className="max-w-4xl mx-auto px-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-bold py-3 md:py-4 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 text-base md:text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 size={20} className="animate-spin" /> MENGIRIM...</>
                ) : (
                  <><Save size={20} /> KIRIM PENDAFTARAN LENGKAP</>
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 md:p-8 text-center relative">
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">Data Berhasil Disimpan!</h3>
            <p className="text-gray-500 mb-4">Pendaftaran Anda telah kami terima.</p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-center gap-3">
              <Mail className="text-blue-500 shrink-0" size={20} />
              <p className="text-sm text-gray-700 text-left">
                Silakan cek kotak masuk email <span className="font-bold text-blue-600">{successEmail}</span> untuk informasi selanjutnya.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
