"use client";

import React, { useState, useRef } from "react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { Download, Loader2, Copy, Check, Instagram, Camera, X, Info } from "lucide-react";

const TARGET_WIDTH = 1080;
const TARGET_HEIGHT = 1440;

const TWIBBON_CAPTION = `Seleksi YES Angkatan 5 is ON !

Halo #ExcellentLeaders!🙌🏻
Perjalanan besar dimulai dari langkah kecil

Aku punya mimpi besar dan ingin berkembang, ini saatnya aku membuktikan !!!!
Yuk, bareng-bareng daftar dan jadi bagian dari generasi pemimpin masa depan!

ExcellentLeaders!
Generasi Sukses!
Generasi YES!
===============================================
@youthekselensia.id @greatedunesia

#youthekselensiascholarship
#seleksiYES5`;

export default function TwibbonGenerator() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [frameImage] = useState<string>("/images/twibbon-frame.png");
  const [isGenerating, setIsGenerating] = useState(false);
  const [captionCopied, setCaptionCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [showCaptionModal, setShowCaptionModal] = useState(false);

  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const userImgRef = useRef<HTMLImageElement>(null);
  const frameImgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserImage(URL.createObjectURL(file));
    }
  };

  const handleFrameClick = () => {
    if (!userImage) fileInputRef.current?.click();
  };

  const handleDownload = async () => {
    if (!userImage || !transformComponentRef.current || !containerRef.current || !userImgRef.current || !frameImgRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      const previewW = containerRef.current.clientWidth;
      const previewH = containerRef.current.clientHeight;

      const loadImg = (src: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      const [loadedUserImg, loadedFrameImg] = await Promise.all([
        loadImg(userImage),
        loadImg(frameImage),
      ]);

      const refCurrent = transformComponentRef.current as any;
      const state = refCurrent?.instance?.transformState || refCurrent?.state;
      if (!state) throw new Error("Could not find transform state");

      const factor = TARGET_WIDTH / previewW;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
      ctx.save();
      ctx.scale(factor, factor);
      ctx.translate(state.positionX, state.positionY);
      ctx.scale(state.scale, state.scale);

      const baseImgW = userImgRef.current.clientWidth;
      const baseImgH = userImgRef.current.clientHeight;
      const dx = (previewW - baseImgW) / 2;
      const dy = (previewH - baseImgH) / 2;

      ctx.drawImage(loadedUserImg, dx, dy, baseImgW, baseImgH);
      ctx.restore();
      ctx.drawImage(loadedFrameImg, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.download = "twibbon-seleksi-YES5.jpg";
      link.href = dataUrl;
      link.click();

      setShowCaptionModal(true);
    } catch (error) {
      console.error("Error generating twibbon:", error);
      alert("Gagal men-generate Twibbon. Pastikan frame tersedia.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCaption = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(TWIBBON_CAPTION);
      } else {
        // Fallback untuk HTTP / browser lama
        const textarea = document.createElement("textarea");
        textarea.value = TWIBBON_CAPTION;
        textarea.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2500);
    } catch {
      alert("Gagal menyalin caption. Silakan salin secara manual.");
    }
  };

  const handleOpenInstagram = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad/i.test(navigator.userAgent);

    if (isAndroid) {
      // Intent URL: buka app jika terinstall, Play Store jika tidak
      window.location.href =
        "intent://instagram.com/#Intent;scheme=https;package=com.instagram.android;end";
    } else if (isIOS) {
      // Batal buka browser jika app berhasil terbuka (halaman jadi hidden)
      const fallback = setTimeout(() => {
        window.open("https://www.instagram.com", "_blank");
      }, 1500);
      document.addEventListener(
        "visibilitychange",
        function onHide() {
          if (document.hidden) {
            clearTimeout(fallback);
            document.removeEventListener("visibilitychange", onHide);
          }
        }
      );
      window.location.href = "instagram://app";
    } else {
      window.open("https://www.instagram.com", "_blank");
    }
  };

  return (
    <>
      {/* Panduan Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <div className="bg-orange-100 rounded-full p-2">
                <Info className="text-[#ff6b00]" size={18} />
              </div>
              <h3 className="font-bold text-gray-800">Cara Membuat Twibbon</h3>
            </div>
            <div className="p-4 space-y-3">
              {[
                { n: "1", text: "Tap area frame kosong untuk pilih foto dari galerimu." },
                { n: "2", text: "Atur posisi & zoom foto hingga pas di dalam frame." },
                { n: "3", text: "Tap Download untuk menyimpan twibbon ke perangkatmu." },
                { n: "4", text: "Salin caption & unggah foto ke Instagram feed kamu!" },
              ].map(({ n, text }) => (
                <div key={n} className="flex items-start gap-3">
                  <span className="min-w-[22px] h-[22px] rounded-full bg-[#ff6b00] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {n}
                  </span>
                  <p className="text-sm text-gray-600 leading-snug">{text}</p>
                </div>
              ))}
            </div>
            <div className="p-4 pt-0">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-3 bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
              >
                Mulai Buat Twibbon!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Caption Modal */}
      {showCaptionModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full p-2">
                  <Check className="text-green-600" size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Twibbon Tersimpan!</h3>
                  <p className="text-xs text-gray-500">Salin caption, lalu posting ke Instagram.</p>
                </div>
              </div>
              <button
                onClick={() => setShowCaptionModal(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                  {TWIBBON_CAPTION}
                </p>
              </div>
              <button
                onClick={handleCopyCaption}
                className="flex items-center justify-center w-full py-3 bg-gray-900 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
              >
                {captionCopied ? (
                  <><Check className="w-4 h-4 mr-2" />Tersalin!</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2" />Salin Caption</>
                )}
              </button>
              <button
                onClick={handleOpenInstagram}
                className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Buka Instagram &amp; Posting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="w-full max-w-sm mx-auto flex flex-col gap-3">
        {/* Frame Area */}
        <div
          ref={containerRef}
          onClick={handleFrameClick}
          className={`relative w-full overflow-hidden bg-gray-100 rounded-2xl shadow-lg ring-1 ring-gray-200 ${!userImage ? "cursor-pointer active:scale-[0.99] transition-transform" : ""}`}
          style={{ aspectRatio: "3/4" }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Empty state */}
          {!userImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-white/90 shadow-md flex items-center justify-center">
                <Camera className="w-7 h-7 text-[#ff6b00]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Tap untuk pilih foto</p>
                <p className="text-xs text-gray-400 mt-0.5">Frame akan tampil di atas fotomu</p>
              </div>
            </div>
          )}

          {/* Photo layer */}
          {userImage && (
            <div className="absolute inset-0 z-0">
              <TransformWrapper
                ref={transformComponentRef}
                initialScale={1}
                minScale={0.1}
                maxScale={5}
                centerOnInit
                limitToBounds={false}
              >
                <TransformComponent
                  wrapperClass="!w-full !h-full"
                  contentClass="!w-full !h-full flex items-center justify-center"
                >
                  <img
                    ref={userImgRef}
                    src={userImage}
                    alt="User"
                    className="max-w-none pointer-events-none"
                    style={{ maxHeight: "100%", width: "auto" }}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          )}

          {/* Frame overlay — only visible after photo is selected */}
          <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${userImage ? "opacity-100" : "opacity-0"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={frameImgRef}
              src={frameImage}
              alt="Twibbon Frame"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
              onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = "1"; }}
            />
          </div>
        </div>

        {/* Contextual hints */}
        {userImage && (
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-gray-400">💡 Cubit/scroll untuk zoom, geser untuk posisi</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#ff6b00] font-medium underline underline-offset-2 shrink-0 ml-2"
            >
              Ganti foto
            </button>
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={!userImage || isGenerating}
          className={`flex items-center justify-center w-full py-4 px-6 font-bold rounded-2xl transition-all focus:ring-4 outline-none active:scale-[0.98] ${
            userImage
              ? "bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white shadow-lg shadow-[#ff6b00]/25 focus:ring-[#ff6b00]/30"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isGenerating ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Memproses...</>
          ) : (
            <><Download className="w-5 h-5 mr-2" />Download Twibbon</>
          )}
        </button>
      </div>
    </>
  );
}
