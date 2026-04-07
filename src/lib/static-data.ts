
export const STATIC_STATS = [
  { number: "75", label: "Awardee Aktif" },
  { number: "9", label: "Sebaran Wilayah" },
  { number: "200+", label: "Alumni Program" },
];

export const STATIC_PARTNERS = [
  { name: "YES_Partnership", logo: "/images/logo-partners.jpg" },
];

export const STATIC_PROGRAMS = [
  {
    _id: "1",
    title: "Leadership Booster",
    desc: "Pelatihan kepemimpinan untuk mencetak pemimpin masa depan yang tangguh.",
    icon: "🚀",
    image: "/images/programs-1.jpg",
    features: ["Ekselensia Leadership Camp","YES Day Out","Young Leadership Festival"],
  },
  {
    _id: "2",
    title: "Fund Support",
    desc: "Pemberian bantuan materi sebagai bekal pembinaan selama masa program.",
    icon: "💰",
    image: "/images/header-2.jpg",
    features: ["Uang Saku 300K/bulan","Support Persiapan UTBK PTN","Support Prestasi"],
  },
  {
    _id: "3",
    title: "Pembinaan Tematik",
    desc: "Belajar berbasis tema berkala wujudkan pemahaman holistik bermakna.",
    icon: "📚",
    image: "/images/programs-3.jpg",
    features: ["Home Visit / 3 bulan","Outing Class / 2 bulan","Journal Ekselensia / day by day"],
  },
  {
    _id: "4",
    title: "Campus Preparation",
    desc: "Bimbingan intensif persiapan UTBK-SNBT dan ujian mandiri PTN dengan mentor ahli",
    icon: "🎓",
    image: "/images/programs-4.jpg",
    features: ["Tryout Berkala","Konsultasi Jurusan","Bedah Soal UTBK"],
  },
  {
    _id: "5",
    title: "Quranic Mentorship",
    desc: "Pembinaan tahsin dan tahfidz untuk membentuk karakter Qurani yang kokoh.",
    icon: "☪️",
    image: "/images/tentang-kami.jpg",
    features: ["Setoran Hafalan","Kajian Rutin","Dauroh Quran"],
  },
  {
    _id: "6",
    title: "TalentHub Class",
    desc: "Kelas pengembangan minat dan bakat untuk bekal skill di dunia pasca kampus.",
    icon: "🎙️",
    image: "/images/tentang-kami.jpg",
    features: ["Photography","Graphic Design","Public Speaking","Writing"],
  },
];

export const STATIC_ABOUT = {
  headerTitle: "Mengenal Lebih Dekat Youth Ekselensia Scholarship",
  headerSubtitle: "Profil Program",
  historyTitle: "Sejarah & Latar Belakang",
  historyImageSrc: "/images/tentang-kami.jpg",
  historyContent: [
    {
        _type: 'block',
        children: [
            {
                _type: 'span',
                text: "Youth Ekselensia Scholarship (YES) lahir dari kepedulian terhadap potensi siswa berprestasi dari kalangan dhuafa yang seringkali terhambat biaya untuk melanjutkan pendidikan tinggi. Diinisiasi oleh GREAT Edunesia dan Dompet Dhuafa, program ini tidak hanya fokus pada akademik, tetapi juga pembentukan karakter kepemimpinan yang tangguh (#ExcellentLeader) untuk menyongsong Indonesia Emas 2045."
            }
        ],
        markDefs: [],
        style: 'normal'
    }
  ],
  visionTitle: "Visi",
  visionText: "Menjadi inkubator pemimpin masa depan yang berdaya, berkarakter, dan berdampak luas, yang lahir dari ketangguhan keluarga rentan untuk mewujudkan keadilan sosial.",
  missionTitle: "Misi",
  missions: [
    "Membuka Akses Pendidikan Tinggi.",
    "Membangun Fondasi Spiritual dan Karakter.",
    "Menanamkan Kepemimpinan Sosial.",
    "Mengembangkan Kapasitas Holistik."
  ],
  goalsTitle: "Tujuan Program",
  goalsList: [
    { title: "Sukses PTN", desc: "Mempersiapkan pelajar masuk Perguruan Tinggi Negeri (PTN)", icon: "🎓" },
    { title: "Akhlak Mulia", desc: "Membentuk pelajar yang berakhlak mulia", icon: "✨" },
    { title: "Cinta Al-Qur'an", desc: "Membina bacaan dan hafalan Al-Qur’an", icon: "📖" },
    { title: "Jiwa Pemimpin", desc: "Mengembangkan jiwa kepemimpinan pelajar", icon: "🚀" },
  ],
  criteriaSubtitle: "Kriteria Penerima",
  criteriaTitle: "Sasaran Program",
  criteriaDesc: "Sasaran program Youth Ekselensia Scholarship (YES) adalah siswa yatim tingkat SMA/MA/SMK yang berasal dari keluarga dhuafa atau yatim.",
  criteriaItems: [
    "Muslim/Muslimah",
    "Anak yatim dhuafa/ yatim muallaf/ anak keluarga dhuafa",
    "Bisa membaca Al-Qur’an, atau memiliki komitmen belajar AlQur’an",
    "Pelajar kelas XI semester 2 SMA/MA/SMK non boarding school (Rata-rata rapor min 60)",
    "Menggunakan pakaian sesuai syariat dan tidak merokok",
    "Tidak sedang menerima beasiswa dari program non pemerintah",
    "Memiliki komitmen untuk maju dengan mengikuti pembinaan"
  ],
  durationSubtitle: "Timeline",
  durationTitle: "Durasi Program",
  durationValue: 1,
  durationUnit: "Tahun",
  durationDesc: "(12 Bulan)\nProgram akan dimulai sejak awardee menginjak kelas 12 SMA.",
};

export const STATIC_TEAM = {
  management_pusat: [
    { nama: "Bayu Candra Winata", jabatan: "Ketua Departemen Beastudi Indonesia", foto: null },
    { nama: "Sri Mulyani", jabatan: "Pengelola Program YES", foto: null },
    { nama: "Yulianti", jabatan: "Pengelola Program YES", foto: null },
  ],
  management_wilayah: [
    { nama: "Charles Desiva", jabatan: "Mentor Wilayah", wilayah: "Jawa Barat", foto: null },
    { nama: "Kiki Dwi Setiabudi", jabatan: "Mentor Wilayah", wilayah: "DI Yogyakarta", foto: null },
    { nama: "Yunida Mustarini", jabatan: "Mentor Wilayah", wilayah: "Jawa Timur", foto: "/images/Yunida - JATIM.jpg" },
    { nama: "—", jabatan: "Mentor Wilayah", wilayah: "Sulawesi Selatan", foto: null },
    { nama: "—", jabatan: "Mentor Wilayah", wilayah: "Sumatera Utara", foto: null },
    { nama: "—", jabatan: "Mentor Wilayah", wilayah: "Sumatera Barat", foto: null },
    { nama: "Indri Yani", jabatan: "Mentor Wilayah", wilayah: "Riau", foto: "/images/Indri - RIAU.jpg" },
    { nama: "Tarisa", jabatan: "Mentor Wilayah", wilayah: "Sumatera Selatan", foto: "/images/Tarisa - SUMSEL.jpg" },
  ],
};
