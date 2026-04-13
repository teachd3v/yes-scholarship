import React from "react";
import TwibbonGenerator from "@/components/TwibbonGenerator";

export const metadata = {
  title: "Twibbon Generator | Muda Berkarya Nusantara",
  description: "Buat lalu bagikan! Twibbon resmi Muda Berkarya Nusantara.",
};

export default function TwibbonPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      {/* Decorative background blob */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-[#ff6b00]/10 to-transparent -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
        <header className="text-center space-y-2 sm:space-y-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Twibbon <span className="text-[#ff6b00]">Campaign</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base text-gray-500 sm:text-xl">
            Dukung gerakan kami dengan memasang twibbon ini di media sosial kamu. Upload foto terbaikmu!
          </p>
        </header>

        <TwibbonGenerator />
      </div>
    </div>
  );
}
