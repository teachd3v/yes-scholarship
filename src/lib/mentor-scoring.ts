import { MentorSchemaType } from "./schema-mentor";

const MENTOR_WILAYAH_VALID = [
    "KABUPATEN PIDIE JAYA",
    "KABUPATEN ACEH UTARA",
    "KOTA DUMAI",
    "KOTA SURABAYA"
];

export function checkMentorScreening(data: MentorSchemaType & { kabupaten_nama?: string }) {
    const alasan: string[] = [];

    // 1. Wilayah
    const normalize = (s: string) => s.toUpperCase().replace(/[\s\.]/g, "");
    const namaKabClean = normalize(data.kabupaten_nama ?? "");
    
    const isAllowed = MENTOR_WILAYAH_VALID.some(w => normalize(w) === namaKabClean);

    if (!isAllowed) {
        alasan.push(`Wilayah ${data.kabupaten_nama || "-"} tidak masuk dalam area penempatan mentor. Yang diizinkan: ${MENTOR_WILAYAH_VALID.join(", ")}`);
    }

    // 2. Pendidikan
    const allowedJenjang = ["S1", "S2", "S3"];
    if (!allowedJenjang.includes(data.jenjang_pendidikan)) {
        alasan.push(`Pendidikan minimal S1 (terisi: ${data.jenjang_pendidikan})`);
    }

    // 3. Kriteria Khusus & Komitmen
    if (!data.berakhlak_islam_tidak_merokok) {
        alasan.push("Tidak menyetujui syarat Berakhlak Islami dan tidak merokok");
    }
    if (!data.bersedia_rangkaian_program) {
        alasan.push("Tidak menyetujui kesediaan mengikuti seluruh rangkaian program");
    }
    if (!data.mampu_mengajar_ptn) {
        alasan.push("Tidak menyatakan mampu mengajar persiapan masuk PTN");
    }
    if (!data.komunikatif_remaja) {
        alasan.push("Tidak menyatakan komunikatif dan menyukai dunia remaja");
    }
    if (!data.hafalan_1_juz) {
        alasan.push("Hafalan Al-Qur'an kurang dari 1 juz");
    }
    if (!data.siap_komitmen) {
        alasan.push("Tidak siap berkomitmen minimal kontrak 1 tahun");
    }

    return {
        lolos: alasan.length === 0,
        alasan
    };
}
