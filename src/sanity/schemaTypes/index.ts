import { type SchemaTypeDefinition } from 'sanity'
import { postType } from './post'
import { heroType } from './hero'
import { statsType } from './stats'
import { partnersType } from './partners'

import { faqsType } from './faqs'
import { testimonialType } from './testimonial'
import { programType } from './program'
import distribution from './distribution'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [postType, heroType, statsType, partnersType, faqsType, testimonialType, programType, distribution],
}

// Helper to define which types should be singletons
export const singletonTypes = new Set(['hero', 'stats', 'partners', 'faqs'])
