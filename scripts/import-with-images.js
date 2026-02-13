const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// 1. Setup Client
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN, // Wajib token "Editor" atau "Admin"
    apiVersion: '2024-02-03',
    useCdn: false,
});

// 2. Contoh Data (JSON)
// Anggap "imagePath" adalah lokasi file di laptop kamu (misal di public/images)
const dataToImport = [
    {
        title: "Kegiatan Sosial di Bandung",
        imagePath: "public/images/bandung.jpg",
        description: "Dokumentasi kegiatan..."
    },
    {
        title: "Workshop di Jakarta",
        imagePath: "public/images/jakarta.jpg",
        description: "Pelatihan skill..."
    }
];

async function uploadImage(filePath) {
    try {
        // Baca file gambar dari folder lokal komputer
        const fullPath = path.join(process.cwd(), filePath);

        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ Gambar tidak ditemukan: ${filePath}`);
            return null;
        }

        const fileStream = fs.createReadStream(fullPath);

        // Upload ke Sanity Asset Store
        console.log(`⬆️ Uploading ${filePath}...`);
        const asset = await client.assets.upload('image', fileStream, {
            filename: path.basename(filePath)
        });

        return asset._id; // Kita butuh ID ini (contoh: "image-123xyz...")
    } catch (error) {
        console.error('❌ Gagal upload gambar:', error.message);
        return null;
    }
}

async function startImport() {
    console.log('🚀 Mulai Import dengan Gambar...');

    const transaction = client.transaction();

    for (const item of dataToImport) {
        // A. Upload gambar dulu (step tambahan yg penting)
        let imageAssetId = null;
        if (item.imagePath) {
            imageAssetId = await uploadImage(item.imagePath);
        }

        // B. Buat Dokumen & Hubungkan Gambar
        transaction.create({
            _type: 'post', // Sesuaikan dengan schema (misal: 'post' atau 'distribution')
            title: item.title,
            description: item.description,

            // Ini cara menghubungkan gambar di Sanity
            image: imageAssetId ? {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: imageAssetId // <--- Kuncinya di sini!
                }
            } : undefined
        });
    }

    // C. Commit (Simpan Semua)
    try {
        const result = await transaction.commit();
        console.log(`✅ Sukses! ${result.results.length} data + gambar berhasil masuk.`);
    } catch (error) {
        console.error('❌ Terjadi kesalahan saat commit:', error.message);
    }
}

startImport();
