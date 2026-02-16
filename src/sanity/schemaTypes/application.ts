import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'application',
  title: 'Application',
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
        defineField({ name: 'nama', title: 'Nama Lengkap', type: 'string' }),
        defineField({ name: 'nik', title: 'NIK', type: 'string' }),
        defineField({ name: 'no_kk', title: 'No KK', type: 'string' }),
        defineField({ name: 'email', title: 'Email', type: 'string' }),
        defineField({ name: 'whatsapp', title: 'WhatsApp', type: 'string' }),
        defineField({ name: 'foto_diri', title: 'Foto Diri', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'jenis_kelamin', title: 'Jenis Kelamin', type: 'string' }),
        defineField({ name: 'agama', title: 'Agama', type: 'string' }),
        defineField({ name: 'tempat_lahir', title: 'Tempat Lahir', type: 'string' }),
        defineField({ name: 'tanggal_lahir', title: 'Tanggal Lahir', type: 'string' }),
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
      name: 'keluarga',
      title: 'Keluarga',
      type: 'object',
      fields: [
        defineField({ name: 'nama_ayah', title: 'Nama Ayah', type: 'string' }),
        defineField({ name: 'nama_ibu', title: 'Nama Ibu', type: 'string' }),
        defineField({ name: 'kondisi_ayah', title: 'Kondisi Ayah', type: 'string' }),
        defineField({ name: 'kondisi_ibu', title: 'Kondisi Ibu', type: 'string' }),
        defineField({ name: 'penghasilan_ortu', title: 'Penghasilan Ortu', type: 'string' }),
        defineField({ name: 'kontak_ortu', title: 'Kontak Ortu', type: 'string' }),
        defineField({ name: 'jumlah_saudara', title: 'Jumlah Saudara', type: 'number' }),
        defineField({ name: 'file_kk', title: 'Kartu Keluarga (Foto)', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'file_sktm', title: 'SKTM (Foto)', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'file_skb', title: 'Surat Kelakuan Baik (Foto)', type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'seleksi',
      title: 'Seleksi',
      type: 'object',
      fields: [
        defineField({ name: 'asal_sekolah', title: 'Asal Sekolah', type: 'string' }),
        defineField({ name: 'jenjang_pendidikan', title: 'Jenjang Pendidikan', type: 'string' }),
        defineField({ name: 'nilai_raport_1', title: 'Nilai Raport Sem 1', type: 'number' }),
        defineField({ name: 'nilai_raport_2', title: 'Nilai Raport Sem 2', type: 'number' }),
        defineField({ name: 'nilai_raport_3', title: 'Nilai Raport Sem 3', type: 'number' }),
        defineField({ name: 'foto_raport_1', title: 'Foto Raport Sem 1', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'foto_raport_2', title: 'Foto Raport Sem 2', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'foto_raport_3', title: 'Foto Raport Sem 3', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'status_beasiswa', title: 'Status Beasiswa', type: 'string' }),
        defineField({ name: 'keterangan_beasiswa', title: 'Keterangan Beasiswa', type: 'string' }),
        defineField({ name: 'motivasi', title: 'Motivasi', type: 'text' }),
        // Organisasi & Prestasi stored as JSON string or arrays simplifies implementation for now
        // But better to use array of objects if we want to query deep, 
        // for simplicity in viewing, we can use array of objects
        defineField({
          name: 'list_organisasi',
          title: 'Organisasi',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'jenis', type: 'string' },
                { name: 'jabatan', type: 'string' },
                { name: 'ket_lainnya', type: 'string' },
              ],
            },
          ],
        }),
        defineField({
          name: 'list_prestasi',
          title: 'Prestasi',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'tingkat', type: 'string' },
                { name: 'juara', type: 'string' },
                { name: 'keterangan', type: 'string' },
              ],
            },
          ],
        }),
        defineField({ name: 'kategori_hafalan', title: 'Hafalan', type: 'string' }),
        defineField({ name: 'sumber_info', title: 'Sumber Info', type: 'string' }),
      ],
    }),
    defineField({
      name: 'scoring',
      title: 'Scoring & Screening',
      type: 'object',
      fields: [
        defineField({ name: 'total_skor', title: 'Total Skor', type: 'number' }),
        defineField({ name: 'lolos_screening', title: 'Lolos Pre-Screening', type: 'boolean' }),
        defineField({
          name: 'alasan_gagal',
          title: 'Alasan Gagal',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'detail_skor',
          title: 'Detail Skor',
          type: 'text',
          description: 'JSON String of score details',
        }),
      ],
    }),
    defineField({
      name: 'adminNotes',
      title: 'Admin Notes',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'biodata.nama',
      subtitle: 'status',
      media: 'biodata.foto_diri',
    },
  },
})
