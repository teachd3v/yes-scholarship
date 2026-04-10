import { X, CheckCircle2, FileText, Info, AlertTriangle, MessageCircleQuestion } from "lucide-react";

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuidelinesModal({ isOpen, onClose }: GuidelinesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative animate-in fade-in zoom-in-95">

        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <Info className="text-blue-600" size={22} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Panduan & Dokumen</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6">

          {/* Section: Panduan Mengisi */}
          <section>
            <h4 className="flex items-center gap-2 text-md md:text-lg font-bold text-gray-800 mb-3">
              <CheckCircle2 className="text-green-500" size={20} />
              Panduan Mengisi Formulir
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 ml-6 md:ml-7 list-disc">
              <li>Isi data diri Anda dengan <b>lengkap dan jujur</b> sesuai dengan dokumen asli.</li>
              <li>Pastikan alamat Email dan nomor WhatsApp yang diisi <b>aktif dan dapat dihubungi</b>.</li>
              <li>Sistem akan <b>otomatis menyimpan draf</b> pengisian Anda. Jika halaman tidak sengaja dimuat ulang (refresh), data sebelumnya tidak akan hilang asalkan menggunakan perangkat yang sama.</li>
              <li>Periksa kembali setiap isian kolom. Formulir yang sudah dikirim (submit) tidak dapat diubah lagi.</li>
            </ul>
          </section>

          {/* Section: Dokumen */}
          <section>
            <h4 className="flex items-center gap-2 text-md md:text-lg font-bold text-gray-800 mb-3">
              <FileText className="text-blue-500" size={20} />
              Dokumen yang Perlu Disiapkan
            </h4>
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-800 mb-3">
                Siapkan dokumen berikut dalam format <b>Foto (JPG/PNG)</b>. Pastikan foto dokumen diambil dengan cahaya yang cukup agar teks terbaca jelas dan tidak buram/blur.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Pas Foto Diri Terbaru</p>
                    <p className="text-xs text-gray-500">Berpakaian rapi dan sopan (wajib)</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Kartu Keluarga (KK)</p>
                    <p className="text-xs text-gray-500">Dokumen asli atau fotokopi jelas (wajib)</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Foto Raport Semester 1, 2, dan 3</p>
                    <p className="text-xs text-gray-500">Foto seluruh halaman nilai raport masing-masing Semester (wajib)</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">SKTM / KIS / KIP / PKH</p>
                    <p className="text-xs text-gray-500">Surat Keterangan Tidak Mampu / Kartu Indonesia Pintar / Sejenisnya (wajib)</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Surat Kelakuan Baik dari Sekolah</p>
                    <p className="text-xs text-gray-500">Foto dokumen surat berserta stempel sekolah (wajib)</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Alert */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={20} />
            <p className="text-xs md:text-sm text-yellow-800">
              Sistem kami akan secara otomatis mengompresi/memperkecil ukuran foto yang diunggah untuk menghemat kuota internet Anda dan mempercepat proses pengiriman.
            </p>
          </div>

          {/* Bantuan */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <MessageCircleQuestion className="text-green-600 shrink-0 mt-0.5" size={20} />
            <p className="text-xs md:text-sm text-green-800">
              Jika mengalami kendala teknis saat mengisi formulir, silakan klik <b>Tombol WhatsApp Hijau</b> di pojok kanan bawah layar untuk bertanya/melaporkan kendala langsung ke Admin.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 md:p-5 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="w-full md:w-auto bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition shadow-md"
          >
            Saya Siap Mengisi
          </button>
        </div>

      </div>
    </div>
  );
}
