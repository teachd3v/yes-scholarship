module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/sanity/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "client",
    ()=>client,
    "safeFetch",
    ()=>safeFetch,
    "writeClient",
    ()=>writeClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@sanity/client/dist/index.browser.js [app-route] (ecmascript) <locals>");
;
const projectId = ("TURBOPACK compile-time value", "lxtfznya");
const dataset = ("TURBOPACK compile-time value", "production") || 'production';
const apiVersion = '2024-02-03';
const client = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])({
    projectId,
    dataset,
    apiVersion,
    useCdn: true
}) : "TURBOPACK unreachable";
const writeClient = ("TURBOPACK compile-time truthy", 1) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sanity$2f$client$2f$dist$2f$index$2e$browser$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])({
    projectId,
    dataset,
    apiVersion,
    token: process.env.SANITY_API_TOKEN,
    useCdn: false
}) : "TURBOPACK unreachable";
async function safeFetch(query, params) {
    if (!client) {
        console.warn('[Sanity] Client not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
        return [];
    }
    try {
        return await client.fetch(query, params);
    } catch (error) {
        console.error('[Sanity] Fetch error:', error);
        return [];
    }
}
}),
"[project]/src/lib/scoring.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateScore",
    ()=>calculateScore,
    "checkPreScreening",
    ()=>checkPreScreening
]);
// ===================== PRE-SCREENING =====================
// 9 Provinsi yang diizinkan (dari kota: Medan, Palembang, Padang, Bogor, Depok, Yogyakarta, Surabaya, Sinjai, Pekanbaru)
const PROVINSI_VALID = [
    "SUMATERA UTARA",
    "SUMATERA SELATAN",
    "SUMATERA BARAT",
    "JAWA BARAT",
    "DI YOGYAKARTA",
    "JAWA TIMUR",
    "SULAWESI SELATAN",
    "RIAU"
];
function checkPreScreening(data) {
    const alasan = [];
    // 1. Agama harus Islam
    if (data.agama !== "Islam") {
        alasan.push(`Agama harus Islam (terisi: ${data.agama})`);
    }
    // 2. Status beasiswa harus "Tidak" atau "Ya_PIP"
    if (data.status_beasiswa !== "Tidak" && data.status_beasiswa !== "Ya_PIP") {
        alasan.push(`Status beasiswa harus "Tidak Menerima" atau "Hanya PIP" (terisi: ${data.status_beasiswa})`);
    }
    // 3. Domisili harus dari provinsi yang diizinkan (exact match)
    const namaProv = (data.provinsi_nama ?? "").toUpperCase().trim();
    const cocok = PROVINSI_VALID.some((p)=>p === namaProv);
    if (!cocok) {
        alasan.push(`Domisili harus dari provinsi: ${PROVINSI_VALID.join(", ")} (terisi: ${data.provinsi_nama || "-"})`);
    }
    return {
        lolos: alasan.length === 0,
        alasan
    };
}
// ===================== SCORING (Normalized 0-100 per kategori) =====================
//
// Setiap kategori dinormalisasi ke skala 0-100, lalu diberi bobot:
//   - Penghasilan Ortu : 15%  (indikator kebutuhan ekonomi)
//   - Jumlah Saudara   : 15%  (tanggungan keluarga — disamakan karena penghasilan berpengaruh pada jumlah tanggungan)
//   - Rata-rata Raport  : 30%  (prestasi akademik)
//   - Organisasi         : 15%  (leadership & keaktifan)
//   - Prestasi           : 15%  (pencapaian non-akademik)
//   - Hafalan Quran      : 10%  (komitmen keagamaan)
//
// Total maksimum = 100
const BOBOT = {
    penghasilan_ortu: 0.15,
    jumlah_saudara: 0.15,
    rata_rata_raport: 0.30,
    organisasi: 0.15,
    prestasi: 0.15,
    hafalan: 0.10
};
// 1. Penghasilan Orangtua (0-100, makin rendah makin tinggi skor)
function skorPenghasilan(val) {
    switch(val){
        case "range_a":
            return 100; // 0 - <1 Juta
        case "range_b":
            return 80; // 1 - 2.5 Juta
        case "range_c":
            return 50; // 2.6 - 4 Juta
        case "range_d":
            return 30; // 4 - 5 Juta
        case "range_e":
            return 0; // > 5 Juta
        default:
            return 100; // Ortu tidak bekerja/wafat → skor maks
    }
}
// 2. Jumlah Saudara (0-100, makin banyak makin tinggi)
function skorSaudara(n) {
    if (n >= 5) return 100;
    if (n === 4) return 80;
    if (n === 3) return 50;
    if (n === 2) return 30;
    if (n === 1) return 20;
    return 0;
}
// 3. Rata-rata Raport (0-100, langsung dari rata-rata nilai)
function skorRaport(r1, r2, r3) {
    const avg = (r1 + r2 + r3) / 3;
    return Math.min(100, Math.max(0, avg));
}
// 4. Organisasi — skor per jabatan, max 3 item, dinormalisasi ke 0-100
// Max raw = 3 * 10 (3x Ketua) = 30 → normalize /30 * 100
function skorOrganisasi(list) {
    if (!list || list.length === 0) return 0;
    const raw = list.reduce((sum, item)=>{
        switch(item.jabatan){
            case "Ketua":
                return sum + 10;
            case "Pengurus":
                return sum + 8;
            case "Anggota":
                return sum + 5;
            default:
                return sum;
        }
    }, 0);
    const maxRaw = 30; // 3 × Ketua
    return Math.min(100, Math.round(raw / maxRaw * 100));
}
// 5. Prestasi — tingkat + juara (additive, not multiplicative), max 3 item
// Per item max = 10 (tingkat) + 10 (juara) = 20, max 3 items = 60
function skorTingkat(tingkat) {
    switch(tingkat){
        case "Internasional":
            return 10;
        case "Nasional":
            return 9;
        case "Provinsi":
            return 8;
        case "Kab/Kota":
            return 7;
        case "Kecamatan":
            return 6;
        case "Sekolah":
            return 5;
        default:
            return 0;
    }
}
function skorJuara(juara) {
    switch(juara){
        case "Juara 1":
            return 10;
        case "Juara 2":
            return 8;
        case "Juara 3":
            return 6;
        case "Juara Favorit":
            return 4;
        case "Finalis":
            return 2;
        default:
            return 0;
    }
}
function skorPrestasi(list) {
    if (!list || list.length === 0) return 0;
    const raw = list.reduce((sum, item)=>sum + skorTingkat(item.tingkat) + skorJuara(item.juara), 0);
    const maxRaw = 60; // 3 × (10 + 10)
    return Math.min(100, Math.round(raw / maxRaw * 100));
}
// 6. Hafalan Quran (0-100)
function skorHafalan(kategori) {
    switch(kategori){
        case "Surat Pendek":
            return 50;
        case "Juz 30":
            return 70;
        case "3 Juz":
            return 85;
        case ">3 Juz":
            return 100;
        default:
            return 0;
    }
}
function calculateScore(data) {
    const detail = {
        penghasilan_ortu: skorPenghasilan(data.penghasilan_ortu),
        jumlah_saudara: skorSaudara(Number(data.jumlah_saudara) || 0),
        rata_rata_raport: skorRaport(Number(data.nilai_raport_1) || 0, Number(data.nilai_raport_2) || 0, Number(data.nilai_raport_3) || 0),
        organisasi: skorOrganisasi(data.list_organisasi),
        prestasi: skorPrestasi(data.list_prestasi),
        hafalan: skorHafalan(data.kategori_hafalan)
    };
    // Weighted total (0-100)
    const total = Math.round(detail.penghasilan_ortu * BOBOT.penghasilan_ortu + detail.jumlah_saudara * BOBOT.jumlah_saudara + detail.rata_rata_raport * BOBOT.rata_rata_raport + detail.organisasi * BOBOT.organisasi + detail.prestasi * BOBOT.prestasi + detail.hafalan * BOBOT.hafalan);
    return {
        detail,
        total
    };
}
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/lib/mail.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sendConfirmationEmail",
    ()=>sendConfirmationEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/resend/dist/index.mjs [app-route] (ecmascript)");
;
const resend = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Resend"](process.env.RESEND_API_KEY);
const INCOME_LABELS = {
    range_a: "0 - < 1 Juta",
    range_b: "1 - 2.5 Juta",
    range_c: "2.6 - 4 Juta",
    range_d: "4 - 5 Juta",
    range_e: "> 5 Juta"
};
/** Konversi Sanity asset _id ke CDN image URL (resize ke lebar tertentu) */ function assetIdToUrl(assetId, projectId, dataset, width = 400) {
    if (!assetId) return null;
    // assetId: "image-abc123-1200x800-jpg" → CDN: abc123-1200x800.jpg
    const stripped = assetId.replace(/^image-/, '');
    const lastDash = stripped.lastIndexOf('-');
    if (lastDash === -1) return null;
    const filename = stripped.substring(0, lastDash) + '.' + stripped.substring(lastDash + 1);
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${filename}?w=${width}&auto=format`;
}
function row(label, value) {
    const v = value !== undefined && value !== null && value !== '' ? String(value) : '—';
    return `
    <tr>
      <td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; width:160px; vertical-align:top;">${label}</td>
      <td style="padding:6px 0; color:#1e293b; font-size:13px; font-weight:500;">${v}</td>
    </tr>`;
}
function sectionHeader(title) {
    return `<tr><td colspan="2" style="padding:16px 0 6px; font-size:14px; font-weight:700; color:#1e40af; border-bottom:2px solid #dbeafe;">${title}</td></tr>`;
}
function photoBlock(label, url) {
    if (!url) return '';
    return `
    <div style="display:inline-block; margin:6px 8px 6px 0; text-align:center; vertical-align:top;">
      <img src="${url}" alt="${label}" width="140" style="width:140px; height:105px; object-fit:cover; border-radius:8px; border:1px solid #e2e8f0; display:block;" />
      <p style="margin:4px 0 0; font-size:11px; color:#64748b;">${label}</p>
    </div>`;
}
async function sendConfirmationEmail(to, name, docData) {
    const projectId = ("TURBOPACK compile-time value", "lxtfznya") || '';
    const dataset = ("TURBOPACK compile-time value", "production") || 'production';
    // Build summary HTML if data provided
    let summaryHtml = '';
    if (docData) {
        const { biodata, keluarga, seleksi } = docData;
        const fotoDiriUrl = assetIdToUrl(biodata.foto_diri_assetId, projectId, dataset, 160);
        const kkUrl = assetIdToUrl(keluarga.file_kk_assetId, projectId, dataset, 400);
        const sktmUrl = assetIdToUrl(keluarga.file_sktm_assetId, projectId, dataset, 400);
        const skbUrl = assetIdToUrl(keluarga.file_skb_assetId, projectId, dataset, 400);
        const r1Url = assetIdToUrl(seleksi.foto_raport_1_assetId, projectId, dataset, 400);
        const r2Url = assetIdToUrl(seleksi.foto_raport_2_assetId, projectId, dataset, 400);
        const r3Url = assetIdToUrl(seleksi.foto_raport_3_assetId, projectId, dataset, 400);
        const alamatLengkap = [
            biodata.alamat_detail,
            biodata.kelurahan_nama,
            biodata.kecamatan_nama,
            biodata.kabupaten_nama,
            biodata.provinsi_nama
        ].filter(Boolean).join(', ');
        const avgNilai = ((seleksi.nilai_raport_1 + seleksi.nilai_raport_2 + seleksi.nilai_raport_3) / 3).toFixed(2);
        const orgList = seleksi.list_organisasi?.length ? seleksi.list_organisasi.map((o, i)=>`${i + 1}. ${o.jenis === 'Lainnya' ? o.ket_lainnya : o.jenis} — ${o.jabatan}`).join('<br/>') : '—';
        const presList = seleksi.list_prestasi?.length ? seleksi.list_prestasi.map((p, i)=>`${i + 1}. ${p.keterangan} (${p.juara} Tk. ${p.tingkat})`).join('<br/>') : '—';
        summaryHtml = `
      <div style="margin-top:24px; border-top:2px solid #e2e8f0; padding-top:20px;">
        <h2 style="font-size:16px; font-weight:700; color:#1e293b; margin:0 0 16px;">Ringkasan Data Pendaftaran Kamu</h2>
        <p style="font-size:13px; color:#64748b; margin:0 0 16px;">Simpan email ini sebagai bukti bahwa data kamu telah berhasil tercatat. Pastikan semua data berikut sudah sesuai.</p>

        ${fotoDiriUrl ? `<div style="text-align:center; margin-bottom:16px;"><img src="${fotoDiriUrl}" width="100" style="width:100px; height:100px; object-fit:cover; border-radius:50%; border:3px solid #2563eb;" /><p style="font-size:12px; color:#64748b; margin:6px 0 0;">Foto Diri</p></div>` : ''}

        <table style="width:100%; border-collapse:collapse; font-family:Arial,sans-serif;">
          ${sectionHeader('📋 Biodata Diri')}
          ${row('Nama Lengkap', biodata.nama)}
          ${row('NIK', biodata.nik)}
          ${row('No KK', biodata.no_kk)}
          ${row('Jenis Kelamin', biodata.jenis_kelamin)}
          ${row('Agama', biodata.agama)}
          ${row('Tempat Lahir', biodata.tempat_lahir)}
          ${row('Tanggal Lahir', biodata.tanggal_lahir)}
          ${row('Email', biodata.email)}
          ${row('WhatsApp', '+62' + biodata.whatsapp)}
          ${row('Alamat Domisili', alamatLengkap)}

          ${sectionHeader('👨‍👩‍👧 Data Keluarga')}
          ${row('Nama Ayah', keluarga.nama_ayah)}
          ${row('Kondisi Ayah', keluarga.kondisi_ayah)}
          ${keluarga.pekerjaan_ayah ? row('Pekerjaan Ayah', keluarga.pekerjaan_ayah) : ''}
          ${row('Nama Ibu', keluarga.nama_ibu)}
          ${row('Kondisi Ibu', keluarga.kondisi_ibu)}
          ${keluarga.pekerjaan_ibu ? row('Pekerjaan Ibu', keluarga.pekerjaan_ibu) : ''}
          ${row('Penghasilan Ortu', INCOME_LABELS[keluarga.penghasilan_ortu] || keluarga.penghasilan_ortu || '—')}
          ${row('Kontak Ortu/Wali', keluarga.kontak_ortu)}
          ${row('Jumlah Saudara', keluarga.jumlah_saudara)}

          ${sectionHeader('🎓 Data Seleksi & Prestasi')}
          ${row('Asal Sekolah', seleksi.asal_sekolah)}
          ${row('Jenis Pendidikan', seleksi.jenjang_pendidikan)}
          ${row('Nilai Raport Sem 1', seleksi.nilai_raport_1)}
          ${row('Nilai Raport Sem 2', seleksi.nilai_raport_2)}
          ${row('Nilai Raport Sem 3', seleksi.nilai_raport_3)}
          ${row('Rata-rata Nilai', avgNilai)}
          ${row('Status Beasiswa', seleksi.status_beasiswa)}
          ${seleksi.keterangan_beasiswa ? row('Keterangan Beasiswa', seleksi.keterangan_beasiswa) : ''}
          ${seleksi.kategori_hafalan ? row('Hafalan Quran', seleksi.kategori_hafalan) : ''}
          <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; vertical-align:top;">Organisasi</td><td style="padding:6px 0; color:#1e293b; font-size:13px;">${orgList}</td></tr>
          <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; vertical-align:top;">Prestasi</td><td style="padding:6px 0; color:#1e293b; font-size:13px;">${presList}</td></tr>
          ${row('Sumber Info', seleksi.sumber_info)}
          ${seleksi.social_media ? row('Social Media', seleksi.social_media) : ''}
          <tr><td style="padding:6px 12px 6px 0; color:#64748b; font-size:13px; vertical-align:top;">Motivasi</td><td style="padding:6px 0; color:#1e293b; font-size:13px; line-height:1.5;">${seleksi.motivasi || '—'}</td></tr>
        </table>

        ${kkUrl || sktmUrl || skbUrl || r1Url || r2Url || r3Url ? `
        <div style="margin-top:20px; border-top:1px solid #e2e8f0; padding-top:16px;">
          <p style="font-size:14px; font-weight:700; color:#1e40af; margin:0 0 12px;">📎 Dokumen yang Diunggah</p>
          <div style="line-height:0;">
            ${photoBlock('Kartu Keluarga', kkUrl)}
            ${photoBlock('SKTM/KIP/PKH/KIS', sktmUrl)}
            ${photoBlock('SKB', skbUrl)}
            ${photoBlock('Raport Sem 1', r1Url)}
            ${photoBlock('Raport Sem 2', r2Url)}
            ${photoBlock('Raport Sem 3', r3Url)}
          </div>
        </div>` : ''}
      </div>`;
    }
    try {
        const { data, error } = await resend.emails.send({
            from: 'YES Scholarship <admin@youthekselensia.id>',
            to: [
                to
            ],
            subject: 'Pendaftaran Berhasil - YES Scholarship 2026',
            html: `
        <div style="font-family:Arial,sans-serif; max-width:620px; margin:0 auto; border:1px solid #e2e8f0; border-radius:12px; overflow:hidden;">
          <div style="background-color:#2563eb; padding:24px; text-align:center;">
            <h1 style="color:white; margin:0; font-size:22px;">Pendaftaran Berhasil!</h1>
            <p style="color:#bfdbfe; margin:6px 0 0; font-size:14px;">YES Scholarship 2026</p>
          </div>
          <div style="padding:32px; background-color:#ffffff;">
            <p style="font-size:16px; color:#334155; margin-bottom:16px;">Hai <strong>${name}</strong>,</p>
            <p style="font-size:15px; color:#334155; line-height:1.6; margin-bottom:16px;">
              Terima kasih telah mendaftar di program <strong>Youth Ekselensia Scholarship (YES) 2026</strong>.
              Data pendaftaranmu telah kami terima dan sedang dalam proses verifikasi.
            </p>
            <div style="background-color:#f0fdf4; border-left:4px solid #22c55e; padding:14px 16px; margin-bottom:20px; border-radius:4px;">
              <p style="margin:0; color:#166534; font-size:14px; font-weight:600;">✅ Data kamu tersimpan permanen di sistem kami.</p>
            </div>
            <div style="background-color:#eff6ff; border-radius:8px; padding:14px 16px; margin-bottom:20px;">
              <p style="margin:0; color:#1e40af; font-size:14px;">
                📣 Pantau pengumuman seleksi di Instagram resmi kami:
                <a href="https://instagram.com/youthekselensia.id" style="color:#2563eb; font-weight:bold;">@youthekselensia.id</a>
              </p>
            </div>
            ${summaryHtml}
            <hr style="border:none; border-top:1px solid #e2e8f0; margin:28px 0 16px;" />
            <p style="font-size:12px; color:#94a3b8; text-align:center; margin:0;">
              Email ini dikirim otomatis. Mohon tidak membalas email ini.<br/>
              Jika ada pertanyaan, hubungi panitia melalui Instagram atau WhatsApp resmi YES.
            </p>
          </div>
        </div>
      `
        });
        if (error) {
            console.error("Error sending email:", error);
            return {
                success: false,
                error
            };
        }
        console.log("Email confirmation sent:", data?.id);
        return {
            success: true,
            messageId: data?.id
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            success: false,
            error
        };
    }
}
}),
"[project]/src/app/api/application/submit/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sanity$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/sanity/client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$scoring$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/scoring.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mail$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mail.ts [app-route] (ecmascript)");
;
;
;
;
if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sanity$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeClient"]) throw new Error("Sanity writeClient not configured");
const client = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$sanity$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["writeClient"];
// Simple in-memory rate limiter: max 3 submissions per IP per hour
const rateLimitMap = new Map();
function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, {
            count: 1,
            resetAt: now + 60 * 60 * 1000
        });
        return true;
    }
    if (entry.count >= 3) return false;
    entry.count++;
    return true;
}
const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB for photos
// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for documents - NOT USED ANYMORE
const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];
// const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, "application/pdf"]; - REMOVED
const PRIORITY_PROVINCES = [
    "Jawa Barat",
    "DI Yogyakarta",
    "Jawa Timur",
    "Sulawesi Selatan",
    "Riau",
    "Sumatera Selatan",
    "Sumatera Utara",
    "Sumatera Barat"
];
function validateFile(file, fieldName) {
    // All files are now treated as photos/images
    const maxSize = MAX_IMAGE_SIZE;
    const allowedTypes = ALLOWED_IMAGE_TYPES;
    if (file.size > maxSize) {
        return `File ${fieldName} terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal ${maxSize / 1024 / 1024}MB.`;
    }
    if (!allowedTypes.includes(file.type)) {
        return `File ${fieldName} bertipe ${file.type || 'unknown'}. Hanya ${allowedTypes.join(', ')} yang diizinkan.`;
    }
    return null;
}
async function uploadImageToSanity(file) {
    const buffer = await file.arrayBuffer();
    const asset = await client.assets.upload("image", Buffer.from(buffer), {
        filename: file.name
    });
    return asset._id;
}
function safeParseJSON(value) {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch (e) {
            return [];
        }
    }
    return value || [];
}
async function POST(req) {
    // Rate limit: max 3 percobaan per IP per jam
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Terlalu banyak percobaan. Silakan coba lagi dalam 1 jam.",
            code: "RATE_LIMITED"
        }, {
            status: 429
        });
    }
    try {
        const formData = await req.formData();
        const rawData = {};
        // Helper to parse FormData into object
        formData.forEach((value, key)=>{
            // Handle arrays (e.g. list_organisasi[0][jenis])
            if (key.includes("[")) {
                const matches = key.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
                if (matches) {
                    const [_, parent, indexStr, field] = matches;
                    const index = parseInt(indexStr);
                    if (!rawData[parent]) rawData[parent] = [];
                    if (!rawData[parent][index]) rawData[parent][index] = {};
                    rawData[parent][index][field] = value;
                    return;
                }
            }
            // Handle boolean conversions
            if (value === "true") {
                rawData[key] = true;
            } else if (value === "false") {
                rawData[key] = false;
            } else if (key === "jumlah_saudara" || key.startsWith("nilai_raport")) {
                rawData[key] = Number(value);
            } else {
                rawData[key] = value;
            }
        });
        console.log("Raw Data Received:", JSON.stringify(rawData, null, 2));
        // Duplicate check: reject if NIK or email already exists
        const nik = rawData.nik;
        const email = rawData.email;
        const existing = await client.fetch(`*[_type == "application" && (biodata.nik == $nik || biodata.email == $email)][0]{
        biodata { nik, email }
      }`, {
            nik,
            email
        });
        if (existing) {
            const reasons = [];
            if (existing.biodata?.nik === nik) reasons.push("NIK");
            if (existing.biodata?.email === email) reasons.push("Email");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: `Data dengan ${reasons.join(" dan ")} yang sama sudah terdaftar. Setiap pendaftar hanya dapat mengirim satu kali.`,
                code: "DUPLICATE_ENTRY"
            }, {
                status: 409
            });
        }
        // 1. Upload Files
        // 1. Upload Files - Optimized with Promise.all for parallelism
        const fileKeys = [
            "foto_diri",
            "file_kk",
            "file_sktm",
            "file_skb",
            "foto_raport_1",
            "foto_raport_2",
            "foto_raport_3"
        ];
        // Validate all files before uploading
        const fileErrors = [];
        for (const key of fileKeys){
            const file = formData.get(key);
            if (file && file.size > 0) {
                const error = validateFile(file, key);
                if (error) fileErrors.push(error);
            }
        }
        if (fileErrors.length > 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: fileErrors.join(" | "),
                code: "FILE_ERROR"
            }, {
                status: 400
            });
        }
        // Upload files sequentially to avoid Sanity rate limits
        const fileUploads = {};
        for (const key of fileKeys){
            const file = formData.get(key);
            if (file && file.size > 0) {
                fileUploads[key] = await uploadImageToSanity(file);
            }
        }
        // 2. Prepare Data for Sanity
        const biodata = {
            nama: rawData.nama,
            nik: rawData.nik,
            no_kk: rawData.no_kk,
            email: rawData.email,
            whatsapp: rawData.whatsapp?.startsWith('62') ? rawData.whatsapp : `62${rawData.whatsapp}`,
            jenis_kelamin: rawData.jenis_kelamin,
            agama: rawData.agama,
            tempat_lahir: rawData.tempat_lahir,
            tanggal_lahir: rawData.tanggal_lahir,
            provinsi: rawData.provinsi,
            provinsi_nama: rawData.provinsi_nama,
            kabupaten: rawData.kabupaten,
            kabupaten_nama: rawData.kabupaten_nama,
            kecamatan: rawData.kecamatan,
            kecamatan_nama: rawData.kecamatan_nama,
            kelurahan: rawData.kelurahan,
            kelurahan_nama: rawData.kelurahan_nama,
            alamat_detail: rawData.alamat_detail,
            foto_diri: fileUploads.foto_diri ? {
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: fileUploads.foto_diri
                }
            } : undefined
        };
        const keluarga = {
            nama_ayah: rawData.nama_ayah,
            nama_ibu: rawData.nama_ibu,
            kondisi_ayah: rawData.kondisi_ayah,
            kondisi_ibu: rawData.kondisi_ibu,
            pekerjaan_ayah: rawData.pekerjaan_ayah,
            pekerjaan_ibu: rawData.pekerjaan_ibu,
            penghasilan_ortu: rawData.penghasilan_ortu,
            kontak_ortu: rawData.kontak_ortu,
            jumlah_saudara: Number(rawData.jumlah_saudara),
            // Changed to _type: 'image' to match new schema
            file_kk: fileUploads.file_kk ? {
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: fileUploads.file_kk
                }
            } : undefined,
            file_sktm: fileUploads.file_sktm ? {
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: fileUploads.file_sktm
                }
            } : undefined,
            file_skb: fileUploads.file_skb ? {
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: fileUploads.file_skb
                }
            } : undefined
        };
        const seleksi = {
            asal_sekolah: rawData.asal_sekolah,
            jenjang_pendidikan: rawData.jenjang_pendidikan,
            nilai_raport_1: Number(rawData.nilai_raport_1),
            nilai_raport_2: Number(rawData.nilai_raport_2),
            nilai_raport_3: Number(rawData.nilai_raport_3),
            // Changed to _type: 'image' to match new schema
            foto_raport_1: fileUploads.foto_raport_1 ? {
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: fileUploads.foto_raport_1
                }
            } : undefined,
            foto_raport_2: fileUploads.foto_raport_2 ? {
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: fileUploads.foto_raport_2
                }
            } : undefined,
            foto_raport_3: fileUploads.foto_raport_3 ? {
                _type: 'image',
                asset: {
                    _type: "reference",
                    _ref: fileUploads.foto_raport_3
                }
            } : undefined,
            status_beasiswa: rawData.status_beasiswa,
            keterangan_beasiswa: rawData.keterangan_beasiswa,
            motivasi: rawData.motivasi,
            // Parse JSON strings if necessary
            list_organisasi: safeParseJSON(rawData.list_organisasi),
            list_prestasi: safeParseJSON(rawData.list_prestasi),
            kategori_hafalan: rawData.kategori_hafalan,
            sumber_info: rawData.sumber_info,
            social_media: rawData.social_media
        };
        // 3. Scoring Calculation
        // Reconstruct flat data object for scoring function compatibility
        // IMPORTANT: Spread rawData FIRST so that processed fields (like list_organisasi) overwrite it correctly
        const flatData = {
            ...rawData,
            ...biodata,
            ...keluarga,
            ...seleksi
        };
        const screening = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$scoring$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkPreScreening"])(flatData);
        const score = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$scoring$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateScore"])(flatData);
        const scoring = {
            total_skor: score.total,
            lolos_screening: screening.lolos,
            alasan_gagal: screening.alasan,
            detail_skor: JSON.stringify(score.detail)
        };
        // 4. Final Status Logic
        // Logic: Status is 'rejected' if:
        // a) Screening failed (lolos_screening == false)
        let finalStatus = "pending";
        if (!screening.lolos) {
            finalStatus = "rejected";
        }
        // 5. Create Document
        const doc = {
            _type: "application",
            status: finalStatus,
            biodata,
            keluarga,
            seleksi,
            scoring,
            submittedAt: new Date().toISOString()
        };
        await client.create(doc);
        // Build email doc data with asset IDs for photo URLs
        const emailData = {
            biodata: {
                nama: rawData.nama,
                nik: rawData.nik,
                no_kk: rawData.no_kk,
                email: rawData.email,
                whatsapp: rawData.whatsapp,
                jenis_kelamin: rawData.jenis_kelamin,
                agama: rawData.agama,
                tempat_lahir: rawData.tempat_lahir,
                tanggal_lahir: rawData.tanggal_lahir,
                provinsi_nama: rawData.provinsi_nama,
                kabupaten_nama: rawData.kabupaten_nama,
                kecamatan_nama: rawData.kecamatan_nama,
                kelurahan_nama: rawData.kelurahan_nama,
                alamat_detail: rawData.alamat_detail,
                foto_diri_assetId: fileUploads.foto_diri
            },
            keluarga: {
                nama_ayah: rawData.nama_ayah,
                kondisi_ayah: rawData.kondisi_ayah,
                pekerjaan_ayah: rawData.pekerjaan_ayah,
                nama_ibu: rawData.nama_ibu,
                kondisi_ibu: rawData.kondisi_ibu,
                pekerjaan_ibu: rawData.pekerjaan_ibu,
                penghasilan_ortu: rawData.penghasilan_ortu,
                kontak_ortu: rawData.kontak_ortu,
                jumlah_saudara: Number(rawData.jumlah_saudara),
                file_kk_assetId: fileUploads.file_kk,
                file_sktm_assetId: fileUploads.file_sktm,
                file_skb_assetId: fileUploads.file_skb
            },
            seleksi: {
                asal_sekolah: rawData.asal_sekolah,
                jenjang_pendidikan: rawData.jenjang_pendidikan,
                nilai_raport_1: Number(rawData.nilai_raport_1),
                nilai_raport_2: Number(rawData.nilai_raport_2),
                nilai_raport_3: Number(rawData.nilai_raport_3),
                foto_raport_1_assetId: fileUploads.foto_raport_1,
                foto_raport_2_assetId: fileUploads.foto_raport_2,
                foto_raport_3_assetId: fileUploads.foto_raport_3,
                status_beasiswa: rawData.status_beasiswa,
                keterangan_beasiswa: rawData.keterangan_beasiswa,
                kategori_hafalan: rawData.kategori_hafalan,
                motivasi: rawData.motivasi,
                sumber_info: rawData.sumber_info,
                social_media: rawData.social_media,
                list_organisasi: safeParseJSON(rawData.list_organisasi),
                list_prestasi: safeParseJSON(rawData.list_prestasi)
            }
        };
        // Send Confirmation Email (don't await to avoid blocking response)
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mail$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendConfirmationEmail"])(doc.biodata.email, doc.biodata.nama, emailData);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Application submitted successfully"
        });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error("Submission Error:", errMsg);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Internal Server Error: " + errMsg
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8e44284b._.js.map