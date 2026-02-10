# Panduan Import Data Massal (Bulk Import) ke Sanity CMS

Panduan ini akan membantu Anda untuk memasukkan banyak data sekaligus (seperti data Sebaran Penerima) ke dalam Sanity CMS menggunakan script yang telah disiapkan.

## Prasyarat

Sebelum memulai, pastikan Anda memiliki:
1.  **Akses ke Project Sanity** Anda.
2.  **API Token Sanity** dengan izin "Editor" atau "Write".

### 1. Mendapatkan API Token Sanity

1.  Login ke [https://www.sanity.io/manage](https://www.sanity.io/manage).
2.  Pilih project Anda.
3.  Pergi ke tab **API**.
4.  Scroll ke bagian **Tokens** dan klik **Add API token**.
5.  Beri nama (contoh: "Bulk Import Script").
6.  Pilih **Editor** pada bagian Permissions.
7.  Klik **Save** dan **COPY** token yang muncul. Simpan baik-baik karena tidak akan muncul lagi.

### 2. Konfigurasi Environment Variable

1.  Buka file `.env.local` di root project Anda.
2.  Tambahkan baris berikut di paling bawah (jika belum ada):

```bash
SANITY_API_TOKEN="token_anda_disini"
```
*(Ganti `token_anda_disini` dengan token yang baru saja Anda copy)*

## Cara Menggunakan

### 1. Siapkan Data

File sample sudah disediakan di `scripts/sample-distribution.json`.

1.  Buka file `scripts/sample-distribution.json`.
2.  Edit isinya sesuai dengan data yang ingin Anda masukkan. Pastikan format JSON valid.
3.  Setiap item harus memiliki format berikut:

```json
{
    "_type": "distribution",
    "region": "Nama Kota/Daerah",
    "province": "Nama Provinsi",
    "count": 123,
    "coordinates": {
      "_type": "geopoint",
      "lat": -6.2088,
      "lng": 106.8456
    },
    "isActive": true
}
```

*Catatan: `_id` bersifat opsional. Jika dikosongkan, Sanity akan membuat ID unik otomatis. Jika diisi (seperti di sample), maka data dengan ID yang sama akan di-timpa (update).*

### 2. Jalankan Script

Buka terminal di folder project, lalu jalankan perintah berikut:

```bash
node scripts/import-distribution.mjs
```

### 3. Verifikasi

Jika berhasil, akan muncul pesan "Import successful!".
Silakan cek di Sanity Studio (http://localhost:3000/studio) untuk melihat data yang baru saja dimasukkan.

---

## 4. Import Data Lain (Program, Testimoni, dll)

Fitur ini **BISA UNTUK SEMUA TIPE DATA**. Kuncinya ada di field `_type` dalam JSON.

### Contoh untuk Program
Gunakan `_type: "program"`. File sample tersedia di `scripts/sample-program.json`.

```json
[
  {
    "_type": "program",
    "title": "Nama Program",
    "desc": "Deskripsi...",
    "icon": "🎓"
  }
]
```

### Contoh untuk Testimoni
Gunakan `_type: "testimonial"`. File sample tersedia di `scripts/sample-testimonial.json`.

```json
[
  {
    "_type": "testimonial",
    "name": "Nama Orang",
    "role": "Jabatan",
    "quote": "Isi testimoni..."
  }
]
```

**Tips:** Selalu pastikan format JSON sesuai dengan struktur data (schema) di Sanity Anda.
