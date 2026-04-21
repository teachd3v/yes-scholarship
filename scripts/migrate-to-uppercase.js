/**
 * Migration Script: Convert existing application and mentor data to UPPERCASE
 * 
 * Usage:
 * 1. Make sure .env.local has SANITY_API_TOKEN with write access.
 * 2. Run: node scripts/migrate-to-uppercase.js
 */

const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-02-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const EXCLUDE_FIELDS = [
    '_id', '_type', '_key', '_createdAt', '_updatedAt', '_rev', 
    'email', 'social_media', 'whatsapp', 'nik', 'no_kk', 'tanggal_lahir',
    'penghasilan_ortu', 'jenis_kelamin', 'agama', 'kondisi_ayah', 'kondisi_ibu',
    'jenjang_pendidikan', 'status_beasiswa', 'sumber_info', 'provinsi', 
    'kabupaten', 'kecamatan', 'kelurahan', 'kategori_hafalan'
];

function isAsset(val) {
    return val && typeof val === 'object' && val._type === 'reference' && val._ref?.includes('image-');
}

function uppercaseDeep(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    const newObj = Array.isArray(obj) ? [] : {};
    
    for (const [key, value] of Object.entries(obj)) {
        if (EXCLUDE_FIELDS.includes(key)) {
            newObj[key] = value;
            continue;
        }

        if (typeof value === 'string') {
            newObj[key] = value.toUpperCase();
        } else if (Array.isArray(value)) {
            newObj[key] = value.map(item => uppercaseDeep(item));
        } else if (typeof value === 'object' && value !== null) {
            // Don't uppercase asset references
            if (value._type === 'image' || value._type === 'file' || value.asset) {
                newObj[key] = value;
            } else {
                newObj[key] = uppercaseDeep(value);
            }
        } else {
            newObj[key] = value;
        }
    }
    return newObj;
}

async function migrate() {
    console.log('🚀 Starting Migration to UPPERCASE...');
    
    try {
        // 1. Applications
        console.log('\n--- Processing Applications ---');
        const apps = await client.fetch('*[_type == "application"]');
        console.log(`Found ${apps.length} applications.`);

        for (const app of apps) {
            const patchedData = {};
            
            // Biodata
            if (app.biodata) {
                patchedData.biodata = uppercaseDeep(app.biodata);
            }
            // Keluarga
            if (app.keluarga) {
                patchedData.keluarga = uppercaseDeep(app.keluarga);
            }
            // Seleksi
            if (app.seleksi) {
                patchedData.seleksi = uppercaseDeep(app.seleksi);
            }
            // Rekomendasi
            if (app.rekomendasi) {
                patchedData.rekomendasi = uppercaseDeep(app.rekomendasi);
            }

            console.log(`Patching Application: ${app._id} (${app.biodata?.nama || 'N/A'})`);
            await client.patch(app._id).set(patchedData).commit();
        }

        // 2. Mentors
        console.log('\n--- Processing Mentors ---');
        const mentors = await client.fetch('*[_type == "mentor"]');
        console.log(`Found ${mentors.length} mentors.`);

        for (const mentor of mentors) {
            const patchedData = {};
            
            if (mentor.biodata) patchedData.biodata = uppercaseDeep(mentor.biodata);
            if (mentor.domisili) patchedData.domisili = uppercaseDeep(mentor.domisili);
            if (mentor.pendidikan) patchedData.pendidikan = uppercaseDeep(mentor.pendidikan);
            if (mentor.tambahan) patchedData.tambahan = uppercaseDeep(mentor.tambahan);
            if (mentor.rekomendasi) patchedData.rekomendasi = uppercaseDeep(mentor.rekomendasi);

            console.log(`Patching Mentor: ${mentor._id} (${mentor.biodata?.nama_lengkap || 'N/A'})`);
            await client.patch(mentor._id).set(patchedData).commit();
        }

        console.log('\n✅ Migration Completed Successfully!');
    } catch (error) {
        console.error('\n❌ Migration Failed:', error.message);
    }
}

migrate();
