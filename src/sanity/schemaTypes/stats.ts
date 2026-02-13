import { defineType, defineField } from 'sanity'

export const statsType = defineType({
    name: 'stats',
    title: 'Stats Section',
    type: 'document',
    fields: [
        defineField({
            name: 'stats_list',
            title: 'Stats List',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'number', type: 'string' },
                        { name: 'label', type: 'string' },
                    ],
                },
            ],
        }),
    ],
})
