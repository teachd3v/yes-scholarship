const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN, // Needs a token with write access
    apiVersion: '2024-02-03',
    useCdn: false,
});

// Example Data (Replace this with your JSON or CSV parse logic)
const dataToImport = [
    { region: 'Jakarta Selatan', province: 'DKI Jakarta', count: 150 },
    { region: 'Bandung', province: 'Jawa Barat', count: 120 },
    { region: 'Yogyakarta', province: 'DIY', count: 80 },
];

async function importData() {
    console.log('🚀 Starting import...');

    // Create a transaction to ensure atomic updates
    const transaction = client.transaction();

    dataToImport.forEach((item) => {
        transaction.create({
            _type: 'distribution', // The schema type name
            region: item.region,
            province: item.province,
            count: item.count,
            isActive: true, // Default value
            // Note: Geopoint needs explicit lat/lng if you have it
        });
    });

    try {
        const result = await transaction.commit();
        console.log(`✅ Success! Imported ${result.results.length} documents.`);
    } catch (error) {
        console.error('❌ Import failed:', error.message);
    }
}

importData();
