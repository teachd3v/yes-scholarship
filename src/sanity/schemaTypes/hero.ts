import { defineType, defineField } from 'sanity'

export const heroType = defineType({
    name: 'hero',
    title: 'Hero Section',
    type: 'document',
    fields: [
        defineField({
            name: 'hero_slider',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'headline', type: 'string' },
                        { name: 'subheadline', type: 'string' },
                        { name: 'image', type: 'image' },
                        { name: 'cta_text', type: 'string' },
                        { name: 'cta_link', type: 'string' },
                    ],
                },
            ],
        }),
    ],
})
