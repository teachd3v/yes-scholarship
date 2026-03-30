import { defineField, defineType } from 'sanity'

export const aboutType = defineType({
    name: 'about',
    title: 'Tentang Kami',
    type: 'document',
    fields: [
        defineField({
            name: 'headerSubtitle',
            title: 'Header Subtitle',
            type: 'string',
            initialValue: 'Profil Program',
        }),
        defineField({
            name: 'headerTitle',
            title: 'Header Title',
            type: 'string',
            initialValue: 'Mengenal Lebih Dekat Youth Ekselensia Scholarship',
        }),
        defineField({
            name: 'historyImage',
            title: 'Gambar Sejarah',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'historyTitle',
            title: 'Judul Sejarah',
            type: 'string',
            initialValue: 'Sejarah & Latar Belakang',
        }),
        defineField({
            name: 'historyContent',
            title: 'Konten Sejarah',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'visionTitle',
            title: 'Judul Visi',
            type: 'string',
            initialValue: 'Visi',
        }),
        defineField({
            name: 'visionText',
            title: 'Teks Visi',
            type: 'text',
        }),
        defineField({
            name: 'missionTitle',
            title: 'Judul Misi',
            type: 'string',
            initialValue: 'Misi',
        }),
        defineField({
            name: 'missions',
            title: 'Daftar Misi',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'goalsTitle',
            title: 'Judul Tujuan Program',
            type: 'string',
            initialValue: 'Tujuan Program',
        }),
        defineField({
            name: 'goalsList',
            title: 'Daftar Tujuan Program',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', title: 'Judul', type: 'string' },
                        { name: 'desc', title: 'Deskripsi', type: 'text' },
                        { name: 'icon', title: 'Icon (Emoji)', type: 'string' },
                    ]
                }
            ],
        }),
        defineField({
            name: 'criteriaSubtitle',
            title: 'Kriteria Subtitle',
            type: 'string',
            initialValue: 'Kriteria Penerima',
        }),
        defineField({
            name: 'criteriaTitle',
            title: 'Judul Kriteria Program',
            type: 'string',
            initialValue: 'Sasaran Program',
        }),
        defineField({
            name: 'criteriaDesc',
            title: 'Deskripsi Kriteria',
            type: 'text',
        }),
        defineField({
            name: 'criteriaItems',
            title: 'Daftar Kriteria Penerima',
            type: 'array',
            of: [{ type: 'string' }],
        }),
        defineField({
            name: 'durationSubtitle',
            title: 'Durasi Subtitle',
            type: 'string',
            initialValue: 'Timeline',
        }),
        defineField({
            name: 'durationTitle',
            title: 'Judul Durasi',
            type: 'string',
            initialValue: 'Durasi Program',
        }),
        defineField({
            name: 'durationValue',
            title: 'Angka Durasi',
            type: 'number',
            initialValue: 1,
        }),
        defineField({
            name: 'durationUnit',
            title: 'Satuan Durasi',
            type: 'string',
            initialValue: 'Tahun',
        }),
        defineField({
            name: 'durationDesc',
            title: 'Deskripsi Tambahan Durasi',
            type: 'text',
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Data Halaman Tentang Kami',
            }
        },
    },
})
