export default {
    name: 'distribution',
    title: 'Sebaran Awardee',
    type: 'document',
    fields: [
        {
            name: 'region',
            title: 'Nama Daerah/Kota',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'province',
            title: 'Provinsi',
            type: 'string',
        },
        {
            name: 'angkatan',
            title: 'Data per Angkatan',
            type: 'array',
            description: 'Tambahkan jumlah awardee per angkatan untuk daerah ini.',
            of: [
                {
                    type: 'object',
                    name: 'angkatanItem',
                    title: 'Angkatan',
                    fields: [
                        {
                            name: 'batch',
                            title: 'Nama Angkatan',
                            type: 'string',
                            description: 'Contoh: Angkatan 1, Angkatan 2, dst.',
                            validation: (Rule: any) => Rule.required(),
                        },
                        {
                            name: 'count',
                            title: 'Jumlah Awardee',
                            type: 'number',
                            validation: (Rule: any) => Rule.required().min(0),
                        },
                    ],
                    preview: {
                        select: { title: 'batch', subtitle: 'count' },
                        prepare({ title, subtitle }: any) {
                            return { title, subtitle: `${subtitle} awardee` };
                        },
                    },
                },
            ],
        },
        {
            name: 'coordinates',
            title: 'Lokasi di Peta',
            type: 'geopoint',
            description: 'Pilih lokasi daerah ini di peta untuk visualisasi.',
        },
        {
            name: 'isActive',
            title: 'Aktif?',
            type: 'boolean',
            initialValue: true,
            description: 'Apakah data ini ingin ditampilkan di website?',
        }
    ],
    preview: {
        select: {
            title: 'region',
            subtitle: 'province',
        },
    },
}
