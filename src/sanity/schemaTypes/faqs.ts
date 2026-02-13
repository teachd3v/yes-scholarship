import { defineType, defineField } from 'sanity'

export const faqsType = defineType({
    name: 'faqs',
    title: 'FAQs Section',
    type: 'document',
    fields: [
        defineField({
            name: 'faqs_list',
            title: 'FAQs List',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'question', type: 'string' },
                        { name: 'answer', type: 'text' },
                    ],
                },
            ],
        }),
    ],
})
