/**
 * Fix Script: Revert enum-like fields from UPPERCASE back to their original casing.
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

const PASCAL_MAP = {
    'LAKI-LAKI': 'Laki-Laki',
    'PEREMPUAN': 'Perempuan',
    'ISLAM': 'Islam',
    'KRISTEN': 'Kristen',
    'KATOLIK': 'Katolik',
    'HINDU': 'Hindu',
    'BUDDHA': 'Buddha',
    'KONGHUCU': 'Konghucu',
    'WAFAT': 'Wafat',
    'BEKERJA': 'Bekerja',
    'TIDAK BEKERJA': 'Tidak Bekerja',
    'TIDAK': 'Tidak',
    'YA_PIP': 'Ya_PIP',
    'YA_LAINNYA': 'Ya_Lainnya',
    'IG': 'IG',
    'WEBSITE': 'Website',
    'WHATSAPP': 'Whatsapp',
    'SMA': 'SMA',
    'MA': 'MA',
    'SMK': 'SMK'
};

async function fixData() {
    console.log('🏁 Starting Casing Fix Migration...');
    
    try {
        // 1. Applications
        const apps = await client.fetch('*[_type == "application"]');
        console.log(`Processing ${apps.length} applications...`);

        for (const app of apps) {
            const patch = {};

            // Penghasilan Ortu (must be lowercase)
            if (app.keluarga?.penghasilan_ortu) {
                patch['keluarga.penghasilan_ortu'] = app.keluarga.penghasilan_ortu.toLowerCase();
            }

            // Enum helpers
            const fixEnum = (val) => PASCAL_MAP[val] || val;

            if (app.biodata?.jenis_kelamin) patch['biodata.jenis_kelamin'] = fixEnum(app.biodata.jenis_kelamin);
            if (app.biodata?.agama) patch['biodata.agama'] = fixEnum(app.biodata.agama);
            if (app.keluarga?.kondisi_ayah) patch['keluarga.kondisi_ayah'] = fixEnum(app.keluarga.kondisi_ayah);
            if (app.keluarga?.kondisi_ibu) patch['keluarga.kondisi_ibu'] = fixEnum(app.keluarga.kondisi_ibu);
            if (app.seleksi?.jenjang_pendidikan) patch['seleksi.jenjang_pendidikan'] = fixEnum(app.seleksi.jenjang_pendidikan);
            if (app.seleksi?.status_beasiswa) patch['seleksi.status_beasiswa'] = fixEnum(app.seleksi.status_beasiswa);
            if (app.seleksi?.sumber_info) patch['seleksi.sumber_info'] = fixEnum(app.seleksi.sumber_info);

            if (Object.keys(patch).length > 0) {
                console.log(`Fixing casing for Application: ${app._id}`);
                await client.patch(app._id).set(patch).commit();
            }
        }

        // 2. Mentors
        const mentors = await client.fetch('*[_type == "mentor"]');
        console.log(`Processing ${mentors.length} mentors...`);

        for (const m of mentors) {
            const patch = {};
            const fixEnum = (val) => PASCAL_MAP[val] || val;

            if (m.biodata?.jenis_kelamin) patch['biodata.jenis_kelamin'] = fixEnum(m.biodata.jenis_kelamin);
            if (m.pendidikan?.jenjang) patch['pendidikan.jenjang'] = fixEnum(m.pendidikan.jenjang);
            
            if (Object.keys(patch).length > 0) {
                console.log(`Fixing casing for Mentor: ${m._id}`);
                await client.patch(m._id).set(patch).commit();
            }
        }

        console.log('✅ Fix Completed!');
    } catch (error) {
        console.error('❌ Fix Failed:', error.message);
    }
}

fixData();
