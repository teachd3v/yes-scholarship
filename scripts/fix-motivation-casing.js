/**
 * Fix Script: Convert "Motivasi" field from UPPERCASE to Sentence Case.
 * 
 * Usage: node scripts/fix-motivation-casing.js
 */

const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-02-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

/**
 * Converts a string to Sentence Case (Best Effort).
 * Capitalizes the first letter of each sentence.
 */
function toSentenceCase(text) {
    if (!text || typeof text !== 'string') return text;
    
    // If not all uppercase, don't touch it (to avoid ruining mixed case text)
    if (text !== text.toUpperCase()) return text;

    return text.toLowerCase().replace(/(^\w|\.\s+\w|!\s+\w|\?\s+\w)/g, (match) => match.toUpperCase());
}

async function fixMotivation() {
    console.log('📝 Starting Motivation Casing Fix...');
    
    try {
        // 1. Applications
        const apps = await client.fetch('*[_type == "application" && defined(seleksi.motivasi)]');
        console.log(`Processing ${apps.length} applications...`);

        for (const app of apps) {
            const original = app.seleksi.motivasi;
            const fixed = toSentenceCase(original);

            if (original !== fixed) {
                console.log(`Fixing Application: ${app._id}`);
                await client.patch(app._id).set({ 'seleksi.motivasi': fixed }).commit();
            }
        }

        // 2. Mentors
        const mentors = await client.fetch('*[_type == "mentor" && defined(tambahan.motivasi)]');
        console.log(`Processing ${mentors.length} mentors...`);

        for (const m of mentors) {
            const original = m.tambahan.motivasi;
            const fixed = toSentenceCase(original);

            if (original !== fixed) {
                console.log(`Fixing Mentor: ${m._id}`);
                await client.patch(m._id).set({ 'tambahan.motivasi': fixed }).commit();
            }
        }

        console.log('✅ Motivation Fix Completed!');
    } catch (error) {
        console.error('❌ Fix Failed:', error.message);
    }
}

fixMotivation();
