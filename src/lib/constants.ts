/**
 * Wilayah yang diizinkan (Provinsi -> Daftar Kabupaten/Kota)
 * Jika daftar kabupaten kosong [], berarti seluruh kabupaten di provinsi tersebut diizinkan.
 */
export const WILAYAH_VALID: Record<string, string[]> = {
    "SUMATERA UTARA": ["KABUPATEN LANGKAT"],
    "SUMATERA BARAT": ["KOTA PADANG"],
    "SUMATERA SELATAN": ["KOTA PALEMBANG"],
    "RIAU": ["KOTA DUMAI", "KOTA PEKANBARU"],
    "JAWA BARAT": ["KABUPATEN BOGOR", "KOTA BOGOR", "KOTA DEPOK"],
    "DI YOGYAKARTA": [], // Semua kabupaten/kota di DIY diizinkan
    "JAWA TIMUR": ["KOTA SURABAYA"],
    "SULAWESI SELATAN": ["KABUPATEN SINJAI"],
    "ACEH": ["KABUPATEN PIDIE JAYA", "KABUPATEN ACEH UTARA"],
};

export const WILAYAH_EXTENDED: Record<string, string[]> = {
    "DI YOGYAKARTA": [], 
    "JAWA TIMUR": ["KOTA SURABAYA"],
    "ACEH": ["KABUPATEN PIDIE JAYA", "KABUPATEN ACEH UTARA"],
};
