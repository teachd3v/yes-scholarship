import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema, singletonTypes } from './src/sanity/schemaTypes'

export default defineConfig({
    name: 'default',
    title: 'YES Scholarship CMS',

    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

    basePath: '/studio',
    apiVersion: '2024-02-03',

    plugins: [
        structureTool({
            structure: (S: any) =>
                S.list()
                    .title('Content Content')
                    .items([
                        // Singleton for Hero
                        S.listItem()
                            .title('Hero Section')
                            .id('hero')
                            .child(
                                S.document()
                                    .schemaType('hero')
                                    .documentId('hero')
                            ),
                        // Singleton for Stats
                        S.listItem()
                            .title('Stats Section')
                            .id('stats')
                            .child(
                                S.document()
                                    .schemaType('stats')
                                    .documentId('stats')
                            ),
                        // Singleton for Partners
                        S.listItem()
                            .title('Partners Section')
                            .id('partners')
                            .child(
                                S.document()
                                    .schemaType('partners')
                                    .documentId('partners')
                            ),
                        // Singleton for FAQs
                        S.listItem()
                            .title('FAQs Section')
                            .id('faqs')
                            .child(
                                S.document()
                                    .schemaType('faqs')
                                    .documentId('faqs')
                            ),
                        S.divider(),
                        // Regular blog posts
                        S.documentTypeListItem('post').title('Blog Posts'),
                        S.documentTypeListItem('program').title('Programs'),
                        S.documentTypeListItem('testimonial').title('Testimonials'),
                        S.documentTypeListItem('distribution').title('Sebaran Penerima'),
                    ]),
        }),
        visionTool()
    ],

    schema: {
        types: schema.types,
        // Filter out singleton types from the global "New document" menu
        templates: (prev) =>
            prev.filter((template) => !singletonTypes.has(template.schemaType)),
    },

    document: {
        // For singleton types, filter out actions that are not allowed
        actions: (prev, { schemaType }) => {
            if (singletonTypes.has(schemaType)) {
                return prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish')
            }
            return prev
        },
    },
})
