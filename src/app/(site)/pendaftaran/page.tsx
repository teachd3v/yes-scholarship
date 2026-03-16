"use client";

import SectionBiodata from "@/components/SectionBiodata";
import SectionKeluarga from "@/components/SectionKeluarga";
import SectionSeleksi from "@/components/SectionSeleksi";
import { useForm, FormProvider, useWatch, Control, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { masterSchema, MasterSchemaType } from "@/lib/schema-master";
import { checkPreScreening, calculateScore } from "@/lib/scoring";
import { Save, Loader2, User, Users, GraduationCap, CheckCircle, Mail, X, Check, AlertTriangle, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { compressImage } from "@/lib/image-compression";

// Mapping field key → [Label, sectionId]
const FIELD_LABELS: Record<string, [string, string]> = {
  // Biodata
  foto_diri: ["Foto Diri", "biodata"],
  nama: ["Nama Lengkap", "biodata"],
  nik: ["NIK (No KTP)", "biodata"],
  no_kk: ["No KK", "biodata"],
  jenis_kelamin: ["Jenis Kelamin", "biodata"],
  agama: ["Agama", "biodata"],
  tempat_lahir: ["Tempat Lahir", "biodata"],
  tanggal_lahir: ["Tanggal Lahir", "biodata"],
  email: ["Email", "biodata"],
  whatsapp: ["No Whatsapp", "biodata"],
  provinsi: ["Provinsi", "biodata"],
  kabupaten: ["Kabupaten/Kota", "biodata"],
  kecamatan: ["Kecamatan", "biodata"],
  kelurahan: ["Kelurahan", "biodata"],
  alamat_detail: ["Alamat Detail", "biodata"],
  // Keluarga
  file_kk: ["File Kartu Keluarga", "keluarga"],
  file_sktm: ["File SKTM", "keluarga"],
  file_skb: ["File Surat Kelakuan Baik", "keluarga"],
  nama_ayah: ["Nama Ayah", "keluarga"],
  nama_ibu: ["Nama Ibu", "keluarga"],
  kondisi_ayah: ["Kondisi Ayah", "keluarga"],
  kondisi_ibu: ["Kondisi Ibu", "keluarga"],
  penghasilan_ortu: ["Penghasilan Orang Tua", "keluarga"],
  kontak_ortu: ["Kontak Orang Tua", "keluarga"],
  jumlah_saudara: ["Jumlah Saudara", "keluarga"],
  // Seleksi
  asal_sekolah: ["Asal Sekolah", "seleksi"],
  jenjang_pendidikan: ["Jenjang Pendidikan", "seleksi"],
  foto_raport_1: ["Foto Raport Semester 1", "seleksi"],
  foto_raport_2: ["Foto Raport Semester 2", "seleksi"],
  foto_raport_3: ["Foto Raport Semester 3", "seleksi"],
  nilai_raport_1: ["Nilai Raport Semester 1", "seleksi"],
  nilai_raport_2: ["Nilai Raport Semester 2", "seleksi"],
  nilai_raport_3: ["Nilai Raport Semester 3", "seleksi"],
  status_beasiswa: ["Status Beasiswa", "seleksi"],
  keterangan_beasiswa: ["Keterangan Beasiswa", "seleksi"],
  list_organisasi: ["Daftar Organisasi", "seleksi"],
  list_prestasi: ["Daftar Prestasi", "seleksi"],
  kategori_hafalan: ["Kategori Hafalan", "seleksi"],
  motivasi: ["Motivasi", "seleksi"],
  sumber_info: ["Sumber Informasi", "seleksi"],
};

const SECTION_LABELS: Record<string, string> = {
  biodata: "Biodata Diri",
  keluarga: "Data Keluarga",
  seleksi: "Data Seleksi",
};

type ValidationErrorGroup = {
  sectionId: string;
  sectionLabel: string;
  items: { field: string; message: string }[];
};

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
  const [submitError, setSubmitError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrorGroup[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStep, setSubmitStep] = useState("");
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isSubmitting } = methods.formState;
  const errorBannerRef = useRef<HTMLDivElement>(null);

  // Auto-save & Restore Draft Logic
  const DRAFT_KEY = "yes-scholarship-draft";

  // Watch all values to save them
  const allValues = useWatch({ control: methods.control });

  // 1. Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Do not restore files, as FileList/File objects can't be serialized simply
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          file_kk, file_sktm, file_skb, foto_diri,
          foto_raport_1, foto_raport_2, foto_raport_3,
          ...safeData
        } = parsed;
        
        methods.reset((prev) => ({ ...prev, ...safeData }));
      }
    } catch (error) {
      console.error("Failed to restore draft:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // 2. Save to localStorage when values change
  useEffect(() => {
    // Debounce saving slightly to avoid thrashing
    const timeoutId = setTimeout(() => {
        try {
            // Remove file references before saving, as they cause errors/huge sizes
             // eslint-disable-next-line @typescript-eslint/no-unused-vars
             const {
                file_kk, file_sktm, file_skb, foto_diri,
                foto_raport_1, foto_raport_2, foto_raport_3,
                ...dataToSave
             } = allValues;
            localStorage.setItem(DRAFT_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Failed to save draft:", error);
        }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [allValues]);

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

  // Collect & group Zod validation errors by section
  const onError = useCallback((errors: FieldErrors<MasterSchemaType>) => {
    setSubmitError("");
    const grouped: Record<string, ValidationErrorGroup> = {};

    function addError(fieldKey: string, message: string) {
      const meta = FIELD_LABELS[fieldKey];
      const label = meta?.[0] ?? fieldKey;
      const sectionId = meta?.[1] ?? "lainnya";
      const sectionLabel = SECTION_LABELS[sectionId] ?? "Lainnya";
      if (!grouped[sectionId]) {
        grouped[sectionId] = { sectionId, sectionLabel, items: [] };
      }
      grouped[sectionId].items.push({ field: label, message });
    }

    Object.entries(errors).forEach(([key, error]) => {
      if (!error) return;

      // Array fields (list_organisasi, list_prestasi)
      if (Array.isArray(error)) {
        error.forEach((itemError, idx) => {
          if (!itemError) return;
          Object.values(itemError).forEach((subErr: any) => {
            if (subErr?.message) {
              addError(key, `Item ${idx + 1}: ${subErr.message}`);
            }
          });
        });
      } else if (error.root?.message) {
        // superRefine array-level errors
        addError(key, String(error.root.message));
      } else if (error.message) {
        addError(key, String(error.message));
      }
    });

    // Sort sections in order: biodata → keluarga → seleksi
    const order = ["biodata", "keluarga", "seleksi"];
    const sorted = order
      .filter((id) => grouped[id])
      .map((id) => grouped[id]);

    setValidationErrors(sorted);
    // Scroll to error banner after render
    setTimeout(() => {
      errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);

  const onSubmit = async (data: MasterSchemaType) => {
    // Clear any previous validation errors since Zod passed
    setValidationErrors([]);

    // -- Progress: Step 1 --
    setSubmitProgress(5);
    setSubmitStep("Memvalidasi data...");

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

    // -- Progress: Step 2 --
    setSubmitProgress(12);
    setSubmitStep("Mengompresi gambar...");

    // Compress and Construct FormData
    const formData = new FormData();

    // Helper to process and append
    const processAndAppend = async (key: string, value: any) => {
      if (value instanceof FileList && value.length > 0) {
        const file = value[0];
        const compressed = await compressImage(file);
        formData.append(key, compressed);
      } else if (value instanceof File) {
        const compressed = await compressImage(value);
        formData.append(key, compressed);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === 'object') {
            Object.entries(item).forEach(([k, v]) => {
              formData.append(`${key}[${index}][${k}]`, String(v));
            });
          } else {
             formData.append(`${key}[]`, String(item));
          }
        });
        if (value.length === 0) formData.append(key, "[]");
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    };

    // Need to use Promise.all to handle await inside loop safely
    const entries = Object.entries(data);
    await Promise.all(entries.map(([key, value]) => processAndAppend(key, value)));

    // -- Progress: Step 3 — slow crawl during upload --
    setSubmitProgress(25);
    setSubmitStep("Mengunggah berkas ke server...");

    // Crawl from 25 → 78 slowly while waiting for the API
    progressIntervalRef.current = setInterval(() => {
      setSubmitProgress(prev => {
        if (prev >= 78) {
          clearInterval(progressIntervalRef.current!);
          return 78;
        }
        return prev + 0.6;
      });
    }, 250);

    try {
      setSubmitError("");
      const response = await fetch('/api/application/submit', {
        method: 'POST',
        body: formData,
      });

      // -- Progress: Step 4 --
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setSubmitProgress(90);
      setSubmitStep("Memproses pendaftaran...");

      const result = await response.json();

      if (!response.ok) {
        setSubmitProgress(0);
        if (result.code === "DUPLICATE_ENTRY") {
          setSubmitError(result.message);
          setTimeout(() => {
            errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
          return;
        }
        if (result.code === "FILE_ERROR") {
          setSubmitError(result.message);
          setTimeout(() => {
            errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
          return;
        }
        throw new Error(result.message || "Gagal mengirim data");
      }

      // -- Progress: Step 5 — done --
      setSubmitProgress(100);
      setSubmitStep("Selesai!");

      setSuccessEmail(data.email);
      setShowSuccess(true);
    } catch (error) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setSubmitProgress(0);
      console.error("Submission error:", error);
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim pendaftaran.";
      setSubmitError(`${msg} Silakan coba lagi atau hubungi panitia jika masalah berlanjut.`);
      setTimeout(() => {
        errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
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

        {/* Validation Errors (Zod) */}
        {validationErrors.length > 0 && (
          <div ref={errorBannerRef} className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">
                  Pendaftaran Gagal — {validationErrors.reduce((s, g) => s + g.items.length, 0)} data belum lengkap/valid
                </p>
                <p className="text-xs text-red-500 mt-1">Perbaiki data berikut lalu kirim ulang:</p>
              </div>
              <button type="button" onClick={() => setValidationErrors([])} className="text-red-400 hover:text-red-600">
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {validationErrors.map((group) => (
                <div key={group.sectionId}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(group.sectionId)}
                    className="flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 hover:underline mb-1"
                  >
                    <ChevronRight size={14} />
                    Bagian {group.sectionLabel} ({group.items.length} error)
                  </button>
                  <ul className="ml-5 space-y-0.5">
                    {group.items.map((item, i) => (
                      <li key={i} className="text-xs text-red-600">
                        <span className="font-medium">{item.field}</span>: {item.message}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API / Server Errors */}
        {submitError && (
          <div ref={validationErrors.length === 0 ? errorBannerRef : undefined} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">Pendaftaran Gagal</p>
              <p className="text-sm text-red-600 mt-1">{submitError}</p>
            </div>
            <button type="button" onClick={() => setSubmitError("")} className="text-red-400 hover:text-red-600">
              <X size={16} />
            </button>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit, onError)} className="space-y-6 md:space-y-10">
            <div id="biodata"><SectionBiodata /></div>
            <div id="keluarga"><SectionKeluarga /></div>
            <div id="seleksi"><SectionSeleksi /></div>

            <div className="max-w-4xl mx-auto px-1 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full overflow-hidden bg-blue-600 text-white font-bold py-3 md:py-4 rounded-xl hover:bg-blue-700 transition text-base md:text-lg shadow-lg disabled:cursor-not-allowed"
              >
                {/* Progress fill */}
                {isSubmitting && (
                  <div
                    className="absolute inset-0 bg-blue-800 transition-all duration-500 ease-out"
                    style={{ width: `${submitProgress}%` }}
                  />
                )}
                {/* Content */}
                <div className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin shrink-0" />
                      <span className="truncate">{submitStep}</span>
                      <span className="tabular-nums text-blue-200 font-mono text-sm">{submitProgress}%</span>
                    </>
                  ) : (
                    <><Save size={20} /> KIRIM PENDAFTARAN LENGKAP</>
                  )}
                </div>
              </button>
              {/* Progress bar below button */}
              {isSubmitting && (
                <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${submitProgress}%` }}
                  />
                </div>
              )}
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
