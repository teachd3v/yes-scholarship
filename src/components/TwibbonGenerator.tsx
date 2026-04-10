"use client";

import React, { useState, useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { UploadCloud, Download, Image as ImageIcon, Loader2 } from "lucide-react";

const TARGET_WIDTH = 1080;
const TARGET_HEIGHT = 1440;

export default function TwibbonGenerator() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [frameImage, setFrameImage] = useState<string>("/images/twibbon-frame.png");
  const [isGenerating, setIsGenerating] = useState(false);
  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const userImgRef = useRef<HTMLImageElement>(null);
  const frameImgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserImage(url);
    }
  };

  const handleDownload = async () => {
    if (!userImage || !transformComponentRef.current || !containerRef.current || !userImgRef.current || !frameImgRef.current) {
      return;
    }

    setIsGenerating(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not get canvas context");

      const previewW = containerRef.current.clientWidth;
      const previewH = containerRef.current.clientHeight;

      // Ensure images are fully loaded
      const loadImg = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      const [loadedUserImg, loadedFrameImg] = await Promise.all([
        loadImg(userImage),
        loadImg(frameImage),
      ]);

      const refCurrent = transformComponentRef.current as any;
      const state = refCurrent?.instance?.transformState || refCurrent?.state;

      if (!state) {
        throw new Error("Could not find transform state");
      }

      // Calculate scaling factor from Preview UI to High-Res Target 
      const factor = TARGET_WIDTH / previewW;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);

      // Save state before changing transforms
      ctx.save();

      // Scale canvas context to match preview coordinate scale
      ctx.scale(factor, factor);

      // React zoom-pan-pinch typically uses transform-origin: 0 0. 
      // We apply the exact transforms from its state:
      ctx.translate(state.positionX, state.positionY);
      ctx.scale(state.scale, state.scale);

      // Calculate width/height of the img inside the preview. 
      // It uses userImgRef.current.clientWidth / clientHeight.
      // We need to draw it at the exact preview size.
      const baseImgW = userImgRef.current.clientWidth;
      const baseImgH = userImgRef.current.clientHeight;

      // Because the image is centered using flexbox (flex items-center justify-center)
      // inside the content container (!w-full !h-full), its starting position
      // from the top-left of the content container is not (0,0).
      const dx = (previewW - baseImgW) / 2;
      const dy = (previewH - baseImgH) / 2;

      ctx.drawImage(loadedUserImg, dx, dy, baseImgW, baseImgH);

      // Restore transform so the frame can be drawn exactly at 1080x1440
      ctx.restore();

      // Draw the frame on top
      ctx.drawImage(loadedFrameImg, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

      // Export
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

      // Trigger download
      const link = document.createElement("a");
      link.download = "twibbon-export.jpg";
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error("Error generating twibbon:", error);
      alert("Gagal men-generate Twibbon. Pastikan frame tersedia.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-xl p-6 md:p-8">
      {/* LEFT: Preview Area */}
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden bg-gray-100 rounded-lg shadow-inner ring-1 ring-gray-200"
          style={{ aspectRatio: "3/4" }}
        >
          {!userImage ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg m-4">
              <ImageIcon className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-sm">Upload foto kamu terlebih dahulu untuk melihat preview twibbon.</p>
            </div>
          ) : (
            <div className="absolute inset-0 z-0">
              <TransformWrapper
                ref={transformComponentRef}
                initialScale={1}
                minScale={0.1}
                maxScale={5}
                centerOnInit
                limitToBounds={false}
              >
                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                  <img
                    ref={userImgRef}
                    src={userImage}
                    alt="User"
                    className="max-w-none pointer-events-none"
                    style={{
                      maxHeight: "100%", // This gives a good starting size without overflowing container immediately
                      width: "auto"
                    }}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          )}

          {/* FRAME OVERLAY */}
          {/* We always render the frame so user sees it empty or over their photo */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={frameImgRef}
              src={frameImage}
              alt="Twibbon Frame"
              className="w-full h-full object-cover"
              onError={(e) => {
                // If frame fails to load, hide it to avoid broken image icon 
                (e.target as HTMLImageElement).style.opacity = '0';
              }}
              onLoad={(e) => {
                (e.target as HTMLImageElement).style.opacity = '1';
              }}
            />
          </div>
        </div>

        {userImage && (
          <p className="text-sm text-gray-500 mt-4 bg-gray-50 px-4 py-2 rounded-full ring-1 ring-gray-200">
            💡 <i>Gunakan dua jari atau mouse scroll untuk zoom, dan geser foto agar pas di dalam frame.</i>
          </p>
        )}
      </div>

      {/* RIGHT: Controls */}
      <div className="w-full md:w-1/2 flex flex-col gap-6 pt-4 md:pt-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Buat Twibbon Kamu!</h2>
          <p className="text-gray-600">
            Upload foto terbaik kamu. Sesuaikan letak dan ukurannya, lalu simpan untuk dibagikan di Instagram (Feed: 3:4).
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#ff6b00]/50 hover:border-[#ff6b00] bg-[#ff6b00]/5 hover:bg-[#ff6b00]/10 rounded-xl cursor-pointer transition-colors group">
            <UploadCloud className="w-8 h-8 text-[#ff6b00] mb-2 group-hover:-translate-y-1 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Pilih / Upload Foto</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>

          <button
            onClick={handleDownload}
            disabled={!userImage || isGenerating}
            className="flex items-center justify-center w-full py-4 px-6 bg-[#ff6b00] hover:bg-[#ff6b00]/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-[#ff6b00]/20 transition-all focus:ring-4 focus:ring-[#ff6b00]/30 outline-none"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Download Twibbon (.jpg)
              </>
            )}
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Panduan:</h3>
          <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li>Klik tombol upload untuk memilih foto dari galeri/komputer.</li>
            <li>Sesuaikan posisi foto di dalam area frame.</li>
            <li>Klik download untuk menyimpan hasil.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
