import { type SchemaTypeDefinition } from 'sanity'
import { postType } from './post'
import { heroType } from './hero'
import { statsType } from './stats'
import { partnersType } from './partners'

import { faqsType } from './faqs'
import { testimonialType } from './testimonial'
import { programType } from './program'
import distribution from './distribution'
import ptn from './ptn'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [
        postType,
        programType,
        heroType,
        statsType,
        partnersType,
        faqsType,
        testimonialType,
        distribution,
        ptn
    ],
}

// Singleton types that should not have "Create New" option in the main list if desired
export const singletonTypes = new Set(['hero', 'stats', 'partners', 'faqs'])
