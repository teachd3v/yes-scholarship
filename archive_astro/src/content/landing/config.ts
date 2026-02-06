import { defineCollection, z } from 'astro:content';

// 1. Skema Landing Page (Home)
const landingCollection = defineCollection({
  type: 'content',
  schema: z.object({
    hero_slider: z.array(z.object({
      headline: z.string(),
      subheadline: z.string(),
      image: z.string(),
      cta_text: z.string(),
      cta_link: z.string(),
    })),
    stats: z.array(z.object({
      number: z.string(),
      label: z.string(),
    })),
    partners: z.array(z.object({
      name: z.string(),
      logo: z.string(),
    })),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })),
  }),
});

// 2. Skema Blog Post
const blogCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        author: z.string(),
        image: z.string(),
        tags: z.array(z.string()).optional(),
    })
})

export const collections = {
  'landing': landingCollection,
  'blog': blogCollection, // Daftarkan koleksi blog
};