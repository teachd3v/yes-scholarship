import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'mentor',
  title: 'Mentor YES',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'biodata',
      title: 'Biodata',
      type: 'object',
      fields: [
        defineField({ name: 'nama_lengkap', title: 'Nama Lengkap dan Gelar', type: 'string' }),
        defineField({ name: 'foto_profil', title: 'Foto Profil Terbaru', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'jenis_kelamin', title: 'Jenis Kelamin', type: 'string' }),
        defineField({ name: 'tempat_lahir', title: 'Tempat Lahir', type: 'string' }),
        defineField({ name: 'tanggal_lahir', title: 'Tanggal Lahir', type: 'string' }),
        defineField({ name: 'whatsapp', title: 'Kontak WA', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'status_pernikahan', title: 'Status Pernikahan', type: 'string' }),
      ],
    }),
    defineField({
      name: 'domisili',
      title: 'Alamat Domisili',
      type: 'object',
      fields: [
        defineField({ name: 'provinsi', title: 'Provinsi ID', type: 'string' }),
        defineField({ name: 'provinsi_nama', title: 'Provinsi', type: 'string' }),
        defineField({ name: 'kabupaten', title: 'Kabupaten ID', type: 'string' }),
        defineField({ name: 'kabupaten_nama', title: 'Kabupaten/Kota', type: 'string' }),
        defineField({ name: 'kecamatan', title: 'Kecamatan ID', type: 'string' }),
        defineField({ name: 'kecamatan_nama', title: 'Kecamatan', type: 'string' }),
        defineField({ name: 'kelurahan', title: 'Kelurahan ID', type: 'string' }),
        defineField({ name: 'kelurahan_nama', title: 'Kelurahan', type: 'string' }),
        defineField({ name: 'alamat_detail', title: 'Alamat Detail', type: 'text' }),
      ],
    }),
    defineField({
      name: 'pendidikan',
      title: 'Riwayat Pendidikan',
      type: 'object',
      fields: [
        defineField({ name: 'jenjang', title: 'Jenjang Terakhir', type: 'string' }),
        defineField({ name: 'jurusan', title: 'Jurusan', type: 'string' }),
      ],
    }),
    defineField({
      name: 'tambahan',
      title: 'Informasi Tambahan',
      type: 'object',
      fields: [
        defineField({ name: 'social_media', title: 'Link Sosial Media', type: 'url' }),
        defineField({ name: 'lancar_quran', title: 'Lancar Membaca Al-Qur\'an?', type: 'string' }),
        defineField({ name: 'sumber_info', title: 'Sumber Informasi Seleksi YES', type: 'string' }),
        defineField({ name: 'motivasi', title: 'Motivasi Bergabung', type: 'text' }),
        defineField({ name: 'cv_resume', title: 'Upload CV/Resume Terbaru', type: 'file' }),
        defineField({ name: 'berakhlak_islam_tidak_merokok', title: 'Berakhlak Islami & Tidak Merokok', type: 'boolean' }),
        defineField({ name: 'bersedia_rangkaian_program', title: 'Bersedia Rangkaian Program', type: 'boolean' }),
        defineField({ name: 'mampu_mengajar_ptn', title: 'Mampu Mengajar PTN', type: 'boolean' }),
        defineField({ name: 'komunikatif_remaja', title: 'Komunikatif & Suka Remaja', type: 'boolean' }),
        defineField({ name: 'hafalan_1_juz', title: 'Hafalan Minimal 1 Juz', type: 'boolean' }),
        defineField({ name: 'siap_komitmen', title: 'Siap Komitmen 1 Tahun', type: 'boolean' }),
      ],
    }),
    defineField({
      name: 'scoring',
      title: 'Auto Screening',
      type: 'object',
      fields: [
        defineField({ name: 'lolos_screening', title: 'Lolos Screening', type: 'boolean' }),
        defineField({ name: 'alasan_gagal', title: 'Alasan Gagal', type: 'array', of: [{ type: 'string' }] }),
      ]
    }),
    defineField({
      name: 'rejectedReason',
      title: 'Alasan Penolakan (Manual)',
      type: 'text',
    }),
    defineField({
      name: 'adminNotes',
      title: 'Catatan Admin',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'biodata.nama_lengkap',
      subtitle: 'status',
      media: 'biodata.foto_profil',
    },
  },
})
