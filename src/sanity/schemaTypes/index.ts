import { type SchemaTypeDefinition } from 'sanity'
import { postType } from './post'
import { heroType } from './hero'
import { faqsType } from './faqs'
import { testimonialType } from './testimonial'
import distribution from './distribution'
import ptn from './ptn'
import mentor from './mentor'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [
        postType,
        heroType,
        faqsType,
        testimonialType,
        distribution,
        ptn,
        mentor,
    ],
}

export const singletonTypes = new Set(['hero', 'faqs'])
