import { MasterSchemaType } from "./schema-master";

// ===================== PRE-SCREENING =====================

// 9 Provinsi yang diizinkan (dari kota: Medan, Palembang, Padang, Bogor, Depok, Yogyakarta, Surabaya, Sinjai, Pekanbaru)
const PROVINSI_VALID = [
    "SUMATERA UTARA",      // Medan
    "SUMATERA SELATAN",    // Palembang
    "SUMATERA BARAT",      // Padang
    "JAWA BARAT",          // Bogor, Depok
    "DAERAH ISTIMEWA YOGYAKARTA", // Yogyakarta
    "JAWA TIMUR",          // Surabaya
    "SULAWESI SELATAN",    // Sinjai
    "RIAU",                // Pekanbaru
];

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

    // 3. Domisili harus dari provinsi yang diizinkan
    const namaProv = (data.provinsi_nama ?? "").toUpperCase();
    const cocok = PROVINSI_VALID.some((p) => namaProv.includes(p) || p.includes(namaProv));
    if (!cocok) {
        alasan.push(`Domisili harus dari provinsi: ${PROVINSI_VALID.join(", ")} (terisi: ${data.provinsi_nama || "-"})`);
    }

    return { lolos: alasan.length === 0, alasan };
}

// ===================== SCORING =====================

// 1. Penghasilan Orangtua
function skorPenghasilan(val?: string): number {
    switch (val) {
        case "range_a": return 10; // 0 - <1 Juta
        case "range_b": return 8;  // 1 - 2.5 Juta
        case "range_c": return 5;  // 2.6 - 4 Juta
        case "range_d": return 3;  // 4 - 5 Juta
        case "range_e": return 0;  // > 5 Juta
        default: return 10; // Ortu tidak bekerja/wafat → skor maks
    }
}

// 2. Jumlah Saudara
function skorSaudara(n: number): number {
    if (n > 5) return 10;
    if (n === 5) return 10;
    if (n === 4) return 8;
    if (n === 3) return 5;
    if (n === 2) return 3;
    if (n === 1) return 2;
    return 0;
}

// 3. Rata-rata Raport (3 semester)
function skorRaport(r1: number, r2: number, r3: number): number {
    const avg = (r1 + r2 + r3) / 3;
    if (avg >= 81) return 100;
    if (avg >= 71) return 80;
    if (avg >= 61) return 50;
    return 0;
}

// 4. Organisasi — skor per jabatan, sum max 3
function skorOrganisasi(list?: { jabatan: string }[]): number {
    if (!list || list.length === 0) return 0;
    return list.reduce((sum, item) => {
        switch (item.jabatan) {
            case "Ketua": return sum + 10;
            case "Pengurus": return sum + 8;
            case "Anggota": return sum + 5;
            default: return sum;
        }
    }, 0);
}

// 5. Prestasi — tingkat × juara, sum max 3
function skorTingkat(tingkat: string): number {
    switch (tingkat) {
        case "Internasional": return 10;
        case "Nasional": return 9;
        case "Provinsi": return 8;
        case "Kota/Kabupaten": return 7;
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
        case "Harapan": return 4;
        case "Finalis": return 2;
        default: return 0;
    }
}

function skorPrestasi(list?: { tingkat: string; juara: string }[]): number {
    if (!list || list.length === 0) return 0;
    return list.reduce((sum, item) => sum + skorTingkat(item.tingkat) * skorJuara(item.juara), 0);
}

// 6. Hafalan Quran
function skorHafalan(kategori?: string): number {
    switch (kategori) {
        case "Surat Pendek": return 5;
        case "Juz 30": return 7;
        case "3 Juz": return 8;
        case ">3 Juz": return 10;
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

    const total = Object.values(detail).reduce((a, b) => a + b, 0);

    return { detail, total };
}
