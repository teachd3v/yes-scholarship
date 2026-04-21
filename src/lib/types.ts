// ==================== Application Types ====================

export interface RekomendasiBukti {
    _key: string;
    keterangan?: string;
    file_url?: string;
}

export interface Rekomendasi {
    tipe: 'rekomendasikan_lolos' | 'rekomendasikan_gagal';
    catatan: string;
    bukti_pendukung?: RekomendasiBukti[];
    dibuat_oleh?: string;
    tanggal?: string;
}

export interface ApplicationListItem {
    _id: string;
    _createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
    nama: string;
    email: string;
    whatsapp: string;
    provinsi_nama: string;
    penghasilan_ortu: string;
    nilai_raport_1: number;
    nilai_raport_2: number;
    nilai_raport_3: number;
    total_skor: number;
    lolos_screening: boolean;
    detail_skor: string;
    has_rekomendasi?: boolean;
    rekomendasi_tipe?: 'rekomendasikan_lolos' | 'rekomendasikan_gagal' | null;
}

export interface ApplicationDetail {
    _id: string;
    _createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
    biodata: {
        nama: string;
        nik: string;
        no_kk: string;
        email: string;
        whatsapp: string;
        jenis_kelamin: string;
        agama: string;
        tempat_lahir: string;
        tanggal_lahir: string;
        provinsi: string;
        provinsi_nama: string;
        kabupaten: string;
        kabupaten_nama: string;
        kecamatan: string;
        kecamatan_nama: string;
        kelurahan: string;
        kelurahan_nama: string;
        alamat_detail: string;
        foto_diri_url?: string;
    };
    keluarga: {
        nama_ayah: string;
        nama_ibu: string;
        kondisi_ayah: string;
        kondisi_ibu: string;
        penghasilan_ortu: string;
        kontak_ortu: string;
        jumlah_saudara: number;
        file_kk_url?: string;
        file_sktm_url?: string;
        file_skb_url?: string;
    };
    seleksi: {
        asal_sekolah: string;
        jenjang_pendidikan: string;
        nilai_raport_1: number;
        nilai_raport_2: number;
        nilai_raport_3: number;
        status_beasiswa: string;
        keterangan_beasiswa?: string;
        motivasi: string;
        sumber_info: string;
        social_media?: string;
        kategori_hafalan?: string;
        list_organisasi?: { jenis: string; jabatan: string; ket_lainnya?: string }[];
        list_prestasi?: { tingkat: string; juara: string; keterangan: string }[];
        foto_raport_1_url?: string;
        foto_raport_2_url?: string;
        foto_raport_3_url?: string;
    };
    scoring?: {
        total_skor: number;
        lolos_screening: boolean;
        alasan_gagal: string[];
        detail_skor: string;
    };
    rejectedReason?: string;
    rekomendasi?: Rekomendasi | null;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    stats?: {
        approved: number;
        pending: number;
        rejected: number;
        lolos?: number;
        gagal?: number;
    };
}

// ==================== Helpers ====================

export function formatIncome(value: string | undefined | null): string {
    switch (value) {
        case "range_a": return "0 - < 1 Juta";
        case "range_b": return "1 - 2.5 Juta";
        case "range_c": return "2.6 - 4 Juta";
        case "range_d": return "4 - 5 Juta";
        case "range_e": return "> 5 Juta";
        default: return value || "-";
    }
}

// ==================== Mentor Types ====================

export interface MentorListItem {
    _id: string;
    _createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
    nama: string;
    email: string;
    whatsapp: string;
    provinsi_nama: string;
    jenjang: string;
}

export interface MentorDetail {
    _id: string;
    _createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
    biodata: {
        nama_lengkap: string;
        foto_profil_url?: string;
        jenis_kelamin: string;
        tempat_lahir: string;
        tanggal_lahir: string;
        whatsapp: string;
        email: string;
        status_pernikahan: string;
    };
    domisili: {
        provinsi: string;
        provinsi_nama: string;
        kabupaten: string;
        kabupaten_nama: string;
        kecamatan: string;
        kecamatan_nama: string;
        kelurahan: string;
        kelurahan_nama: string;
        alamat_detail: string;
    };
    pendidikan: {
        jenjang: string;
        jurusan: string;
    };
    tambahan: {
        social_media: string;
        lancar_quran: string;
        sumber_info: string;
        motivasi: string;
        cv_resume_url?: string;
        berakhlak_islam_tidak_merokok?: boolean;
        bersedia_rangkaian_program?: boolean;
        mampu_mengajar_ptn?: boolean;
        komunikatif_remaja?: boolean;
        hafalan_1_juz?: boolean;
        siap_komitmen?: boolean;
    };
    scoring?: {
        lolos_screening: boolean;
        alasan_gagal: string[];
    };
    rejectedReason?: string;
    adminNotes?: string;
}

