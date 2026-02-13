import { defineField, defineType } from 'sanity'

export const programType = defineType({
    name: 'program',
    title: 'Program',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
            },
        }),
        defineField({
            name: 'desc',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'icon',
            title: 'Icon (Emoji)',
            type: 'string',
            description: 'Copy paste an emoji here',
        }),
        defineField({
            name: 'image',
            title: 'Program Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                defineField({
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative text',
                }),
            ],
        }),
        defineField({
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [{ type: 'string' }],
        }),
    ],
})
