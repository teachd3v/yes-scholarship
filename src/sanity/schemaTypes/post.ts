import { defineType, defineField } from 'sanity'

export const postType = defineType({
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: { source: 'title' },
        }),
        defineField({
            name: 'pubDate',
            title: 'Publication Date',
            type: 'datetime',
        }),
        defineField({
            name: 'description',
            type: 'text',
        }),
        defineField({
            name: 'author',
            type: 'string',
        }),
        defineField({
            name: 'image',
            type: 'image',
            options: { hotspot: true },
        }),
        defineField({
            name: 'body',
            type: 'array',
            of: [{ type: 'block' }],
        }),
        defineField({
            name: 'tags',
            type: 'array',
            of: [{ type: 'string' }],
        }),
    ],
})
