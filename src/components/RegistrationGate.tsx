"use client";

import { useState, useEffect } from "react";
import { Clock, Instagram, CalendarDays, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// WIB = UTC+7 → 15:00 WIB = 08:00 UTC
export const OPEN_DATE = new Date("2026-04-10T08:00:00.000Z");
export const CLOSE_DATE = new Date("2026-04-30T16:59:00.000Z");
export const EXTENDED_CLOSE_DATE = new Date("2026-05-08T10:00:00.000Z"); // 8 Mei 2026 17:00 WIB


function formatWIB(date: Date) {
    return date.toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
        timeZone: "Asia/Jakarta",
    }) + " pukul " + date.toLocaleTimeString("id-ID", {
        hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta",
    }) + " WIB";
}

export function pad(n: number) { return String(n).padStart(2, "0"); }

export function useCountdown(target: Date) {
    const [diff, setDiff] = useState(() => Math.max(0, target.getTime() - Date.now()));

    useEffect(() => {
        const id = setInterval(() => {
            setDiff(Math.max(0, target.getTime() - Date.now()));
        }, 1000);
        return () => clearInterval(id);
    }, [target]);

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds, done: diff === 0 };
}

function CountdownBox({ value, label }: { value: string; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shadow-lg">
                <span className="text-3xl md:text-4xl font-black text-white tabular-nums leading-none">{value}</span>
            </div>
            <span className="mt-2 text-xs md:text-sm text-blue-100 font-medium uppercase tracking-widest">{label}</span>
        </div>
    );
}

// ─── Belum Buka: Countdown ────────────────────────────────────────────────────
function CountdownScreen() {
    const { days, hours, minutes, seconds } = useCountdown(OPEN_DATE);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-4 py-12">
            <div className="text-center max-w-2xl w-full">
                {/* Logo / Badge */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-5 py-2 flex items-center gap-2">
                        <span className="bg-white text-blue-700 font-black text-sm px-2 py-0.5 rounded-lg">YES</span>
                        <span className="text-white font-semibold text-sm">Scholarship 2026</span>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
                    Pendaftaran<br className="hidden md:block" /> Segera Dibuka
                </h1>
                <p className="text-blue-100 text-base md:text-lg mb-10">
                    Bersiaplah! Formulir seleksi akan aktif dalam:
                </p>

                {/* Countdown */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 max-w-[240px] mx-auto md:flex md:max-w-none md:justify-center md:gap-5 mb-10 justify-items-center">
                    <CountdownBox value={String(days)} label="Hari" />
                    <div className="text-white/60 text-4xl font-bold self-start mt-6 hidden md:block">:</div>
                    <CountdownBox value={pad(hours)} label="Jam" />
                    <div className="text-white/60 text-4xl font-bold self-start mt-6 hidden md:block">:</div>
                    <CountdownBox value={pad(minutes)} label="Menit" />
                    <div className="text-white/60 text-4xl font-bold self-start mt-6 hidden md:block">:</div>
                    <CountdownBox value={pad(seconds)} label="Detik" />
                </div>

                {/* Info card */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 mb-8 text-left space-y-3">
                    <div className="flex items-start gap-3">
                        <CalendarDays className="text-blue-200 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-white font-semibold text-sm">Pendaftaran Dibuka</p>
                            <p className="text-blue-100 text-sm">{formatWIB(OPEN_DATE)}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock className="text-blue-200 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-white font-semibold text-sm">Pendaftaran Ditutup</p>
                            <p className="text-blue-100 text-sm">{formatWIB(CLOSE_DATE)}</p>
                        </div>
                    </div>
                </div>

                {/* Instagram CTA */}
                <a
                    href="https://instagram.com/youthekselensia.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition shadow-lg"
                >
                    <Instagram size={18} />
                    @youthekselensia.id
                </a>
                <p className="text-blue-200 text-xs mt-3">Pantau info terbaru di Instagram kami</p>
            </div>
        </main>
    );
}

// ─── Sudah Tutup ──────────────────────────────────────────────────────────────
function ClosedScreen() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 px-4 py-12">
            <div className="text-center max-w-xl w-full">
                {/* Badge */}
                <div className="flex justify-center mb-6">
                    <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-2 flex items-center gap-2">
                        <span className="bg-white text-slate-700 font-black text-sm px-2 py-0.5 rounded-lg">YES</span>
                        <span className="text-white font-semibold text-sm">Scholarship 2026</span>
                    </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-5">
                    <div className="bg-white/10 border border-white/20 rounded-full p-5">
                        <Lock className="text-slate-200" size={44} />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
                    Pendaftaran Telah Ditutup
                </h1>
                <p className="text-slate-300 text-base md:text-lg mb-8">
                    Masa pendaftaran YES Scholarship 2026 sudah berakhir.
                    Terima kasih atas antusiasme kalian!
                </p>

                {/* Info card */}
                <div className="bg-white/10 border border-white/20 rounded-2xl p-5 mb-8 text-left space-y-3">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-white font-semibold text-sm">Pendaftaran Dibuka</p>
                            <p className="text-slate-300 text-sm">{formatWIB(OPEN_DATE)}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Clock className="text-red-400 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-white font-semibold text-sm">Pendaftaran Ditutup</p>
                            <p className="text-slate-300 text-sm">{formatWIB(CLOSE_DATE)}</p>
                        </div>
                    </div>
                </div>

                <p className="text-slate-300 text-sm mb-5">
                    Pantau pengumuman hasil seleksi di Instagram resmi kami:
                </p>
                <a
                    href="https://instagram.com/youthekselensia.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-slate-700 font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition shadow-lg"
                >
                    <Instagram size={18} />
                    @youthekselensia.id
                </a>

                <div className="mt-8">
                    <Link href="/" className="text-slate-400 hover:text-slate-200 text-sm underline transition">
                        ← Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </main>
    );
}

// ─── Gate Wrapper ─────────────────────────────────────────────────────────────
type Status = "loading" | "countdown" | "open" | "extended" | "closed";

export default function RegistrationGate({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const disableIpCheck = pathname === "/pendaftaran-extend";
    const [status, setStatus] = useState<Status>("loading");
    const [ipChecked, setIpChecked] = useState(disableIpCheck);
    const [isRegionAllowed, setIsRegionAllowed] = useState(disableIpCheck);

    useEffect(() => {
        const update = () => {
            const now = Date.now();
            if (now < OPEN_DATE.getTime()) setStatus("countdown");
            else if (now < CLOSE_DATE.getTime()) setStatus("open");
            else if (now < EXTENDED_CLOSE_DATE.getTime()) setStatus("extended");
            else setStatus("closed");
        };
        update();
        // Re-check every second saat dekat batas waktu
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (status === "extended" && !ipChecked) {
            // Lakukan pengecekan IP untuk 3 wilayah (Jatim, DIY, Aceh)
            fetch("https://ipapi.co/json/")
                .then(r => r.ok ? r.json() : null)
                .then(geo => {
                    if (geo?.region) {
                        const regionLower = geo.region.toLowerCase();
                        // Mapping region name yang mungkin muncul dari IP
                        const allowed = ["jawa timur", "east java", "di yogyakarta", "yogyakarta", "daerah istimewa yogyakarta", "aceh"];
                        if (allowed.some(a => regionLower.includes(a) || a.includes(regionLower))) {
                            setIsRegionAllowed(true);
                        }
                    }
                })
                .catch((e) => console.error("IP Check Failed:", e))
                .finally(() => setIpChecked(true));
        }
    }, [status, ipChecked]);

    if (status === "loading" || (status === "extended" && !ipChecked)) {
        // Hindari flash: tampilkan minimal sampai status diketahui atau IP selesai dicek
        return (
            <main className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </main>
        );
    }
    
    if (status === "countdown") return <CountdownScreen />;
    if (status === "closed" || (status === "extended" && !isRegionAllowed)) return <ClosedScreen />;
    
    // Form bisa diakses saat: status === "open" atau (status === "extended" && isRegionAllowed)
    return <>{children}</>;
}

