import { defineType, defineField } from 'sanity'

export const partnersType = defineType({
    name: 'partners',
    title: 'Partners Section',
    type: 'document',
    fields: [
        defineField({
            name: 'partners_list',
            title: 'Partners List',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'name', type: 'string' },
                        { name: 'logo', type: 'image' },
                    ],
                },
            ],
        }),
    ],
})
