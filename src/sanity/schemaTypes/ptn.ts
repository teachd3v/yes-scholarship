import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'ptn',
    title: 'Data PTN & Alumni',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nama Perguruan Tinggi',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'logo',
            title: 'Logo Kampus',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'region',
            title: 'Wilayah / Kota',
            type: 'string',
        }),
        defineField({
            name: 'alumni',
            title: 'Daftar Alumni',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', title: 'Nama Alumni', type: 'string' },
                        { name: 'major', title: 'Jurusan', type: 'string' },
                        { name: 'batch', title: 'Angkatan', type: 'string' },
                    ],
                    preview: {
                        select: {
                            title: 'name',
                            subtitle: 'major'
                        }
                    }
                }
            ]
        }),
        defineField({
            name: 'totalAlumni',
            title: 'Total Alumni (untuk sorting)',
            type: 'number',
            description: 'Isi manual atau biarkan kosong (nanti bisa dihitung frontend, tapi untuk sorting mudah di Sanity Studio sorting by Total mungkin butuh field ini)',
            initialValue: 0
        })
    ],
    preview: {
        select: {
            title: 'name',
            media: 'logo'
        }
    }
})
