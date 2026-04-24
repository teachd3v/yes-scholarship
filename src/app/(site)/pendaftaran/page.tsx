"use client";

import SectionBiodata from "@/components/SectionBiodata";
import SectionKeluarga from "@/components/SectionKeluarga";
import SectionSeleksi from "@/components/SectionSeleksi";
import SummaryModal from "@/components/SummaryModal";
import GuidelinesModal from "@/components/GuidelinesModal";
import RegistrationGate from "@/components/RegistrationGate";
import { useForm, FormProvider, useWatch, Control, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { masterSchema, MasterSchemaType } from "@/lib/schema-master";
import { checkPreScreening, calculateScore } from "@/lib/scoring";
import { Save, Loader2, User, Users, GraduationCap, CheckCircle, Mail, X, Check, AlertTriangle, ChevronRight, Image, BookOpen } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { compressImage } from "@/lib/image-compression";
import { CLOSE_DATE, useCountdown, pad } from "@/components/RegistrationGate";
import { Clock } from "lucide-react";
import Link from "next/link";

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
  jenjang_pendidikan: ["Jenis Pendidikan", "seleksi"],
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
  social_media: ["Link Social Media", "seleksi"],
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
  "foto_diri", "nama", "nik", "no_kk", "jenis_kelamin", "agama",
  "tempat_lahir", "tanggal_lahir", "email", "whatsapp",
  "provinsi", "kabupaten", "kecamatan", "kelurahan", "alamat_detail",
];

const KELUARGA_FIELDS: (keyof MasterSchemaType)[] = [
  "file_kk", "file_sktm", "file_skb", "nama_ayah", "nama_ibu", "kondisi_ayah", "kondisi_ibu",
  "kontak_ortu", "jumlah_saudara",
];

const SELEKSI_FIELDS: (keyof MasterSchemaType)[] = [
  "asal_sekolah", "jenjang_pendidikan", "foto_raport_1", "foto_raport_2", "foto_raport_3",
  "nilai_raport_1", "nilai_raport_2", "nilai_raport_3",
  "status_beasiswa", "motivasi", "sumber_info", "social_media",
];

function isFilled(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return false;
  if (typeof value === "number") return value >= 0; // 0 for number is fine usually (like jumlah_saudara)
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  // Handle FileList (browser only)
  if (typeof value === "object" && "length" in (value as any)) return (value as any).length > 0;
  return true;
}

function StickyStepperContent({
  activeSection,
  onScrollTo,
  completions,
  overallProgress,
  countdown,
}: {
  activeSection: number;
  onScrollTo: (id: string) => void;
  completions: { filled: number; total: number }[];
  overallProgress: number;
  countdown?: { days: number; hours: number; minutes: number; seconds: number; show: boolean };
}) {

  return (
    <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-3 py-3">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-2">
          {countdown?.show && (
            <div className="sm:hidden flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 tabular-nums shrink-0">
              <Clock size={10} className="animate-pulse" />
              {countdown.days > 0 && `${countdown.days}d `}
              {pad(countdown.hours)}:{pad(countdown.minutes)}
            </div>
          )}
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
      kategori_hafalan: "", motivasi: "", sumber_info: undefined, social_media: "",
    }
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showTwibbon, setShowTwibbon] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrorGroup[]>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStep, setSubmitStep] = useState("");
  const [isActualSubmitting, setIsActualSubmitting] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);
  // Summary modal state
  const [showSummary, setShowSummary] = useState(false);
  const [pendingData, setPendingData] = useState<MasterSchemaType | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isSubmitting } = methods.formState;
  const errorBannerRef = useRef<HTMLDivElement>(null);

  // Countdown logic
  const countdown = useCountdown(CLOSE_DATE);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    // Show countdown starting from April 24, 2026 00:00 WIB (TEMPORARY FOR TESTING)
    const threshold = new Date("2026-04-24T00:00:00+07:00").getTime();
    const check = () => setShowCountdown(Date.now() >= threshold);
    check();
    const id = setInterval(check, 60000); // Check every minute
    return () => clearInterval(id);
  }, []);

  // Auto-save & Restore Draft Logic
  const DRAFT_KEY = "yes-scholarship-draft";

  // Watch all values to save them and calculate progress
  const allValues = useWatch({ control: methods.control });

  const getCompletion = (fields: (keyof MasterSchemaType)[]) => {
    const filled = fields.filter((f) => isFilled(allValues[f])).length;
    return { filled, total: fields.length };
  };

  const sectionFields = [BIODATA_FIELDS, KELUARGA_FIELDS, SELEKSI_FIELDS];
  const completions = sectionFields.map((f) => getCompletion(f));
  const totalFilled = completions.reduce((s, c) => s + c.filled, 0);
  const totalFields = completions.reduce((s, c) => s + c.total, 0);
  const overallProgress = totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0;
  const isProgressComplete = overallProgress === 100;

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

  const DRAFT_CLEAR_KEY = "yes-scholarship-draft";

  // onSubmit: hanya simpan data dan tampilkan summary modal
  const onSubmit = useCallback(async (data: MasterSchemaType) => {
    setValidationErrors([]);
    setPendingData(data);
    setShowSummary(true);
  }, []);

  // doActualSubmit: dipanggil saat user konfirmasi di summary modal
  const doActualSubmit = useCallback(async (data: MasterSchemaType) => {
    setIsActualSubmitting(true);

    // Check network connectivity first
    if (!navigator.onLine) {
      setSubmitError("Anda tidak terhubung ke internet. Periksa koneksi Anda dan coba lagi.");
      setTimeout(() => {
        errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      setIsActualSubmitting(false);
      return;
    }

    // -- Progress: Step 1 --
    setSubmitProgress(5);
    setSubmitStep("Memvalidasi data...");

    const screening = checkPreScreening(data);
    const score = calculateScore(data);
    console.log("PRE-SCREENING:", screening.lolos ? "LOLOS" : "TIDAK LOLOS");
    console.log("TOTAL SKOR:", score.total);

    // -- Progress: Step 2 --
    setSubmitProgress(12);
    setSubmitStep("Mengompresi gambar...");

    const formData = new FormData();

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

    const entries = Object.entries(data);
    const EXCLUDED_UPPERCASE = [
      "email", "social_media", "penghasilan_ortu", "jenis_kelamin",
      "agama", "kondisi_ayah", "kondisi_ibu", "jenjang_pendidikan",
      "status_beasiswa", "sumber_info", "provinsi", "kabupaten",
      "kecamatan", "kelurahan", "kategori_hafalan", "motivasi"
    ];

    await Promise.all(entries.map(([key, value]) => {
      // Data Normalization: Uppercase everything except email/links and enums
      let val = value;
      if (typeof value === "string") {
        if (!EXCLUDED_UPPERCASE.includes(key)) {
          val = value.toUpperCase();
        } else if (key === "email") {
          val = value.toLowerCase();
        }
      }
      return processAndAppend(key, val);
    }));

    // -- Progress: Step 3 --
    setSubmitProgress(25);
    setSubmitStep("Mengunggah berkas ke server...");

    // Cek total ukuran payload sebelum kirim (batas aman 3.5MB)
    let totalSize = 0;
    formData.forEach((value) => {
      if (value instanceof File) totalSize += value.size;
    });
    if (totalSize > 3.5 * 1024 * 1024) {
      setSubmitProgress(0);
      setShowSummary(false);
      setSubmitError(`Total ukuran file terlalu besar (${(totalSize / 1024 / 1024).toFixed(1)}MB). Pastikan foto dokumen tidak melebihi 1MB per file, lalu coba lagi.`);
      setIsActualSubmitting(false);
      setTimeout(() => {
        errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      setSubmitProgress(prev => {
        if (prev >= 78) { clearInterval(progressIntervalRef.current!); return 78; }
        return prev + 0.6;
      });
    }, 250);

    // Retry logic with exponential backoff
    const MAX_RETRIES = 3;
    const INITIAL_DELAY = 1000; // 1 second
    const FETCH_TIMEOUT = 120000; // 120 seconds = 2 minutes

    async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number }) {
      const { timeout = FETCH_TIMEOUT, ...fetchOptions } = options;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        return await fetch(url, { ...fetchOptions, signal: controller.signal });
      } finally {
        clearTimeout(timeoutId);
      }
    }

    async function submitWithRetry(): Promise<Response> {
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          // Update progress message to indicate retry attempt
          if (attempt > 1) {
            setSubmitStep(`Mengunggah berkas ke server... (percobaan ${attempt}/${MAX_RETRIES})`);
          }

          console.log(`[Attempt ${attempt}/${MAX_RETRIES}] Submitting form...`);

          const response = await fetchWithTimeout('/api/application/submit', {
            method: 'POST',
            body: formData,
            timeout: FETCH_TIMEOUT
          });

          return response;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          // Check if this is a timeout error
          if (lastError.name === 'AbortError') {
            lastError = new Error('Timeout: Server membutuhkan waktu lebih lama untuk memproses. Silakan coba lagi.');
          }

          console.error(`[Attempt ${attempt}/${MAX_RETRIES}] Error:`, lastError.message);

          // If this was the last attempt, throw the error
          if (attempt === MAX_RETRIES) {
            throw lastError;
          }

          // Calculate delay with exponential backoff: 1s, 2s, 4s
          const delay = INITIAL_DELAY * Math.pow(2, attempt - 1);
          console.log(`Waiting ${delay}ms before retry...`);

          // Update UI to show waiting for retry
          setSubmitStep(`Menunggu ${delay / 1000} detik sebelum mencoba ulang...`);

          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      throw lastError || new Error('Submission failed after all retries');
    }

    try {
      setSubmitError("");
      const response = await submitWithRetry();

      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setSubmitProgress(90);
      setSubmitStep("Memproses pendaftaran...");

      // Handle specific HTTP error codes with better messages
      if (response.status === 413) {
        throw new Error("Ukuran file terlalu besar untuk dikirim. Coba perkecil ukuran foto dokumen lalu kirim ulang.");
      }

      if (response.status === 429) {
        throw new Error("Terlalu banyak percobaan. Silakan coba lagi dalam 1 jam.");
      }

      let result: any;
      try {
        result = await response.json();
      } catch (parseError) {
        // If we can't parse JSON, it might be a server error
        if (!response.ok) {
          throw new Error(`Server error (${response.status}): ${response.statusText}`);
        }
        throw new Error("Gagal memproses respons dari server. Silakan coba lagi.");
      }

      if (!response.ok) {
        setSubmitProgress(0);
        setShowSummary(false);

        // Handle specific error codes with better messages
        if (result.code === "DUPLICATE_ENTRY") {
          setSubmitError(result.message || "Data Anda sudah terdaftar sebelumnya.");
        } else if (result.code === "FILE_ERROR") {
          setSubmitError(result.message || "Ada masalah dengan file yang Anda upload. Coba gunakan file yang lebih kecil.");
        } else if (result.code === "RATE_LIMITED") {
          setSubmitError("Terlalu banyak percobaan. Silakan coba lagi nanti.");
        } else {
          throw new Error(result.message || "Gagal mengirim data ke server");
        }

        setTimeout(() => {
          errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        return;
      }

      setSubmitProgress(100);
      setSubmitStep("Selesai!");

      // Reset form dan clear draft
      methods.reset();
      localStorage.removeItem(DRAFT_CLEAR_KEY);

      setSuccessEmail(data.email);
      setShowSummary(false);
      setPendingData(null);
      setShowSuccess(true);
    } catch (error) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setSubmitProgress(0);
      setShowSummary(false);

      let errorMessage = "Terjadi kesalahan saat mengirim pendaftaran.";

      if (error instanceof Error) {
        const msg = error.message;

        // Categorize errors based on error message
        if (msg.includes('Failed to fetch')) {
          errorMessage = "Koneksi ke server gagal. Periksa internet Anda dan coba lagi.";
        } else if (msg.includes('Timeout') || msg.includes('AbortError')) {
          errorMessage = "Proses pengiriman memakan waktu terlalu lama. Server sedang sibuk. Coba lagi dalam beberapa menit.";
        } else if (msg.includes('NetworkError') || !navigator.onLine) {
          errorMessage = "Koneksi internet Anda terputus. Pastikan Anda terhubung ke internet dan coba lagi.";
        } else if (msg.includes('file')) {
          errorMessage = `File Error: ${msg}`;
        } else if (msg.includes('duplicate') || msg.includes('terdaftar')) {
          errorMessage = msg;
        } else {
          errorMessage = msg;
        }
      }

      console.error("Submission error:", error);
      setSubmitError(`${errorMessage} Jika masalah berlanjut, hubungi panitia atau coba lagi nanti.`);

      setTimeout(() => {
        errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } finally {
      setIsActualSubmitting(false);
    }
  }, [methods]);

  return (
    <RegistrationGate>
    <main className="min-h-screen bg-slate-50">
      {/* Sticky Stepper */}
      <StickyStepperContent
        activeSection={activeSection}
        onScrollTo={scrollToSection}
        completions={completions}
        overallProgress={overallProgress}
        countdown={{ ...countdown, show: showCountdown }}
      />

      <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 px-3 py-6 md:px-4 md:py-10">
        <header className="text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Formulir Seleksi YES 2026</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base mb-4">Mohon isi data secara berurutan dan teliti.</p>
          {showCountdown ? (
            <div className="inline-flex mt-1 items-center gap-2.5 bg-red-50 text-red-700 font-black py-2.5 px-5 rounded-2xl border-2 border-red-100 shadow-sm animate-pulse text-sm md:text-base tabular-nums">
              <Clock size={20} className="text-red-500" />
              <span>Sisa Waktu: {countdown.days} hari {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowGuidelines(true)}
              className="inline-flex mt-1 flex-row items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold py-2 px-5 rounded-xl transition text-sm md:text-base border border-blue-100 shadow-sm"
            >
              <BookOpen size={18} />
              Panduan Mengisi & Syarat Dokumen
            </button>
          )}
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

            <div className="max-w-4xl mx-auto px-1">
              <button
                type="submit"
                disabled={isSubmitting || isActualSubmitting || !isProgressComplete}
                className="w-full bg-blue-600 text-white font-bold py-3 md:py-4 rounded-xl hover:bg-blue-700 transition text-base md:text-lg shadow-lg disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Memvalidasi...</>
                ) : !isProgressComplete ? (
                  <><AlertTriangle size={20} /> LENGKAPI DATA ({overallProgress}%)</>
                ) : (
                  <><Save size={20} /> KIRIM PENDAFTARAN LENGKAP</>
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Summary Modal */}
      <SummaryModal
        isOpen={showSummary}
        data={pendingData}
        onClose={() => { if (!isActualSubmitting) { setShowSummary(false); setPendingData(null); } }}
        onConfirm={() => { if (pendingData) doActualSubmit(pendingData); }}
        isLoading={isActualSubmitting}
      />

      <GuidelinesModal
        isOpen={showGuidelines}
        onClose={() => setShowGuidelines(false)}
      />

      {/* Progress overlay saat actual submit */}
      {isActualSubmitting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm w-full mx-4">
            <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
            <p className="font-bold text-slate-800 mb-1">{submitStep}</p>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${submitProgress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 tabular-nums">{Math.round(submitProgress)}%</p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 md:p-8 text-center relative">
            <button
              type="button"
              onClick={() => { setShowSuccess(false); setShowTwibbon(true); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Berhasil!</h3>
            <p className="text-gray-500 mb-4">Data kamu telah kami terima dan tercatat di sistem kami.</p>

            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-3 text-left">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Bukti Pendaftaran</p>
              <p className="text-sm text-gray-700">
                Pendaftaran kamu sudah <span className="font-bold text-green-600">tersimpan permanen</span> di database kami meskipun email belum diterima.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Mail className="text-blue-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-gray-700 text-left">
                Email konfirmasi sedang dikirim ke <span className="font-bold text-blue-600">{successEmail}</span>. Jika tidak masuk dalam 10 menit, cek folder <span className="font-semibold">Spam/Promosi</span>.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-6 text-left">
              <p className="text-xs text-yellow-800">
                Pantau pengumuman seleksi di Instagram resmi kami: <span className="font-bold">@youthekselensia.id</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => { setShowSuccess(false); setShowTwibbon(true); }}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Twibbon Invitation Modal */}
      {showTwibbon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-6 text-center relative">
            <button
              type="button"
              onClick={() => setShowTwibbon(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 rounded-full p-4">
                <Image className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">Buat Twibbon YES 2026!</h3>
            <p className="text-gray-500 text-sm mb-6">
              Sebarkan semangat beasiswamu! Buat twibbon keren dan bagikan ke media sosial kamu.
            </p>

            <div className="space-y-3">
              <Link
                href="/twibbon"
                className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Buat Twibbon Sekarang
              </Link>
              <button
                type="button"
                onClick={() => setShowTwibbon(false)}
                className="w-full text-sm text-slate-400 hover:text-slate-600 transition"
              >
                Lewati
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
    </RegistrationGate>
  );
}
