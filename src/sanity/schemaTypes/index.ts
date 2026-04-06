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
import application from './application'
import { aboutType } from './about'
import { teamType } from './team'

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
        ptn,
        application,
        aboutType,
        teamType,
    ],
}

export const singletonTypes = new Set(['hero', 'stats', 'partners', 'faqs', 'about', 'team'])
