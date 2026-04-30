import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'announcement',
  title: 'Pengumuman',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Pengumuman',
      type: 'string',
      initialValue: 'Pengumuman Hasil Seleksi Administrasi YES 2026',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi / Kata Pengantar',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'pdfFile',
      title: 'File PDF Hasil Seleksi',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'publishDate',
      title: 'Tanggal Publikasi',
      type: 'datetime',
      initialValue: '2026-05-02T00:00:00Z',
    }),
    defineField({
      name: 'isActive',
      title: 'Status Aktif',
      type: 'boolean',
      description: 'Aktifkan untuk menampilkan halaman pengumuman di website.',
      initialValue: false,
    }),
  ],
});
