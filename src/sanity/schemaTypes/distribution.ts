export default {
    name: 'distribution',
    title: 'Sebaran Penerima',
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
            description: 'Opsional: untuk pengelompokan atau display extra',
        },
        {
            name: 'count',
            title: 'Jumlah Penerima',
            type: 'number',
            validation: (Rule: any) => Rule.required().min(0),
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
            description: 'Apakah data ini ingin ditampilkan?',
        }
    ]
}
