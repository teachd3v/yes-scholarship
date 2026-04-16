import { MasterSchemaType } from "./schema-master";

// ===================== PRE-SCREENING =====================

// Wilayah yang diizinkan (Provinsi -> Daftar Kabupaten/Kota)
// Jika daftar kabupaten kosong, berarti seluruh kabupaten di provinsi tersebut diizinkan.
const WILAYAH_VALID: Record<string, string[]> = {
    "SUMATERA UTARA": ["KABUPATEN LANGKAT"],
    "SUMATERA BARAT": ["KOTA PADANG"],
    "SUMATERA SELATAN": ["KOTA PALEMBANG"],
    "RIAU": ["KABUPATEN DUMAI"],
    "JAWA BARAT": ["KABUPATEN BOGOR", "KOTA BOGOR", "KOTA DEPOK"],
    "DI YOGYAKARTA": [], // Semua kabupaten/kota di DIY diizinkan
    "JAWA TIMUR": ["KOTA SURABAYA"],
    "SULAWESI SELATAN": ["KABUPATEN SINJAI"],
    "ACEH": ["KABUPATEN PIDIE JAYA", "KABUPATEN ACEH UTARA"],
};

export function checkPreScreening(data: MasterSchemaType) {
    const alasan: string[] = [];

    // 1. Agama harus Islam
    if (data.agama !== "Islam") {
        alasan.push(`Agama harus Islam (terisi: ${data.agama})`);
    }

    // 2. Status beasiswa harus "Tidak" atau "Ya_PIP"
    if (data.status_beasiswa !== "Tidak" && data.status_beasiswa !== "Ya_PIP") {
        alasan.push(`Status beasiswa harus "Tidak Menerima" atau "Hanya PIP" (terisi: ${data.status_beasiswa})`);
    }

    // 3. Domisili (Provinsi & Kabupaten)
    const namaProv = (data.provinsi_nama ?? "").toUpperCase().trim();
    const namaKab = (data.kabupaten_nama ?? "").toUpperCase().trim();

    const allowedRegencies = WILAYAH_VALID[namaProv];

    if (!allowedRegencies) {
        // Provinsi tidak ada dalam daftar
        alasan.push(`Domisili provinsi ${namaProv || "-"} tidak masuk dalam skema seleksi`);
    } else if (allowedRegencies.length > 0) {
        // Provinsi ada, tapi dibatasi ke kabupaten tertentu
        const cocokKab = allowedRegencies.some((k) => k === namaKab);
        if (!cocokKab) {
            alasan.push(`Wilayah ${namaKab || "-"} (${namaProv}) tidak masuk dalam skema seleksi. Yang diizinkan: ${allowedRegencies.join(", ")}`);
        }
    }
    // Jika allowedRegencies.length === 0, berarti semua kabupaten di provinsi tersebut lolos

    return { lolos: alasan.length === 0, alasan };
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
    hafalan: 0.10,
};

// 1. Penghasilan Orangtua (0-100, makin rendah makin tinggi skor)
function skorPenghasilan(val?: string): number {
    switch (val) {
        case "range_a": return 100; // 0 - <1 Juta
        case "range_b": return 80;  // 1 - 2.5 Juta
        case "range_c": return 50;  // 2.6 - 4 Juta
        case "range_d": return 30;  // 4 - 5 Juta
        case "range_e": return 0;   // > 5 Juta
        default: return 100; // Ortu tidak bekerja/wafat → skor maks
    }
}

// 2. Jumlah Saudara (0-100, makin banyak makin tinggi)
function skorSaudara(n: number): number {
    if (n >= 5) return 100;
    if (n === 4) return 80;
    if (n === 3) return 50;
    if (n === 2) return 30;
    if (n === 1) return 20;
    return 0;
}

// 3. Rata-rata Raport (0-100, langsung dari rata-rata nilai)
function skorRaport(r1: number, r2: number, r3: number): number {
    const avg = (r1 + r2 + r3) / 3;
    return Math.min(100, Math.max(0, avg));
}

// 4. Organisasi — skor per jabatan, max 3 item, dinormalisasi ke 0-100
// Max raw = 3 * 10 (3x Ketua) = 30 → normalize /30 * 100
function skorOrganisasi(list?: { jabatan: string }[]): number {
    if (!list || list.length === 0) return 0;
    const raw = list.reduce((sum, item) => {
        switch (item.jabatan) {
            case "Ketua": return sum + 10;
            case "Pengurus": return sum + 8;
            case "Anggota": return sum + 5;
            default: return sum;
        }
    }, 0);
    const maxRaw = 30; // 3 × Ketua
    return Math.min(100, Math.round((raw / maxRaw) * 100));
}

// 5. Prestasi — tingkat + juara (additive, not multiplicative), max 3 item
// Per item max = 10 (tingkat) + 10 (juara) = 20, max 3 items = 60
function skorTingkat(tingkat: string): number {
    switch (tingkat) {
        case "Internasional": return 10;
        case "Nasional": return 9;
        case "Provinsi": return 8;
        case "Kab/Kota": return 7;
        case "Kecamatan": return 6;
        case "Sekolah": return 5;
        default: return 0;
    }
}

function skorJuara(juara: string): number {
    switch (juara) {
        case "Juara 1": return 10;
        case "Juara 2": return 8;
        case "Juara 3": return 6;
        case "Juara Favorit": return 4;
        case "Finalis": return 2;
        default: return 0;
    }
}

function skorPrestasi(list?: { tingkat: string; juara: string }[]): number {
    if (!list || list.length === 0) return 0;
    const raw = list.reduce((sum, item) => sum + skorTingkat(item.tingkat) + skorJuara(item.juara), 0);
    const maxRaw = 60; // 3 × (10 + 10)
    return Math.min(100, Math.round((raw / maxRaw) * 100));
}

// 6. Hafalan Quran (0-100)
function skorHafalan(kategori?: string): number {
    switch (kategori) {
        case "Surat Pendek": return 50;
        case "Juz 30": return 70;
        case "3 Juz": return 85;
        case ">3 Juz": return 100;
        default: return 0;
    }
}

// ===================== CALCULATE TOTAL =====================

export function calculateScore(data: MasterSchemaType) {
    const detail = {
        penghasilan_ortu: skorPenghasilan(data.penghasilan_ortu),
        jumlah_saudara: skorSaudara(Number(data.jumlah_saudara) || 0),
        rata_rata_raport: skorRaport(
            Number(data.nilai_raport_1) || 0,
            Number(data.nilai_raport_2) || 0,
            Number(data.nilai_raport_3) || 0
        ),
        organisasi: skorOrganisasi(data.list_organisasi),
        prestasi: skorPrestasi(data.list_prestasi),
        hafalan: skorHafalan(data.kategori_hafalan),
    };

    // Weighted total (0-100)
    const total = Math.round(
        detail.penghasilan_ortu * BOBOT.penghasilan_ortu +
        detail.jumlah_saudara * BOBOT.jumlah_saudara +
        detail.rata_rata_raport * BOBOT.rata_rata_raport +
        detail.organisasi * BOBOT.organisasi +
        detail.prestasi * BOBOT.prestasi +
        detail.hafalan * BOBOT.hafalan
    );

    return { detail, total };
}
