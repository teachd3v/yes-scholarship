import { defineField, defineType } from 'sanity'

export const teamType = defineType({
    name: 'team',
    title: 'Tim & Struktur Organisasi',
    type: 'document',
    fields: [
        defineField({
            name: 'management_pusat',
            title: 'Manajemen Pusat',
            type: 'array',
            description: 'Ketua Departemen dan Pengelola Program YES',
            of: [
                {
                    type: 'object',
                    name: 'memberPusat',
                    fields: [
                        defineField({ name: 'nama', title: 'Nama Lengkap', type: 'string', validation: (Rule) => Rule.required() }),
                        defineField({ name: 'jabatan', title: 'Jabatan', type: 'string', validation: (Rule) => Rule.required() }),
                        defineField({ name: 'foto', title: 'Foto', type: 'image', options: { hotspot: true } }),
                    ],
                    preview: {
                        select: { title: 'nama', subtitle: 'jabatan', media: 'foto' },
                    },
                },
            ],
        }),
        defineField({
            name: 'management_wilayah',
            title: 'Manajemen Wilayah',
            type: 'array',
            description: 'Mentor Wilayah Program YES',
            of: [
                {
                    type: 'object',
                    name: 'memberWilayah',
                    fields: [
                        defineField({ name: 'nama', title: 'Nama Lengkap', type: 'string', validation: (Rule) => Rule.required() }),
                        defineField({ name: 'jabatan', title: 'Jabatan', type: 'string', initialValue: 'Mentor Wilayah', validation: (Rule) => Rule.required() }),
                        defineField({ name: 'wilayah', title: 'Wilayah', type: 'string', description: 'Contoh: Wilayah Jawa Barat, Wilayah Sulawesi Selatan' }),
                        defineField({ name: 'foto', title: 'Foto', type: 'image', options: { hotspot: true } }),
                    ],
                    preview: {
                        select: { title: 'nama', subtitle: 'wilayah', media: 'foto' },
                    },
                },
            ],
        }),
    ],
    preview: {
        prepare() {
            return { title: 'Tim Organisasi YES' };
        },
    },
})
