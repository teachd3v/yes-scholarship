# Matriks Pre-Screening & Skoring YES Scholarship

> Dokumen ini menjelaskan sistem penilaian otomatis pada pendaftaran beasiswa YES.
> Source: [`src/lib/scoring.ts`](src/lib/scoring.ts)

---

## A. Pre-Screening (Hard Requirements)

Semua kriteria **wajib lolos**. Jika satu saja gagal, pendaftar otomatis **TIDAK LOLOS**.

| # | Kriteria | Syarat Lolos | Gagal Jika |
|---|----------|--------------|------------|
| 1 | Agama | Islam | Selain Islam |
| 2 | Status Beasiswa | "Tidak Menerima" atau "Hanya PIP" | Menerima beasiswa lainnya (Ya_Lainnya) |
| 3 | Domisili Provinsi | Salah satu dari 8 provinsi di bawah | Di luar 8 provinsi tersebut |

### Provinsi yang Diizinkan

| Provinsi | Kota Cakupan |
|----------|--------------|
| Sumatera Utara | Medan |
| Sumatera Selatan | Palembang |
| Sumatera Barat | Padang |
| Jawa Barat | Bogor, Depok |
| DI Yogyakarta | Yogyakarta |
| Jawa Timur | Surabaya |
| Sulawesi Selatan | Sinjai |
| Riau | Pekanbaru |

---

## B. Skoring (Skala 0–100)

Setiap kategori dinormalisasi ke skala 0–100, lalu dikalikan bobot masing-masing.

| Kategori | Bobot | Deskripsi |
|----------|-------|-----------|
| Penghasilan Orang Tua | 20% | Indikator kebutuhan ekonomi |
| Jumlah Saudara | 10% | Tanggungan keluarga |
| Rata-rata Raport | 30% | Prestasi akademik |
| Organisasi | 15% | Leadership & keaktifan |
| Prestasi | 15% | Pencapaian non-akademik |
| Hafalan Quran | 10% | Komitmen keagamaan |
| **Total** | **100%** | |

---

### 1. Penghasilan Orang Tua (Bobot 20%)

Semakin rendah penghasilan, semakin tinggi skor (prioritas kebutuhan).

| Rentang Penghasilan | Kode | Skor |
|---------------------|------|------|
| Rp 0 – < 1 Juta | range_a | 100 |
| Rp 1 – 2,5 Juta | range_b | 80 |
| Rp 2,6 – 4 Juta | range_c | 50 |
| Rp 4 – 5 Juta | range_d | 30 |
| > Rp 5 Juta | range_e | 0 |
| Ortu tidak bekerja / wafat | — | 100 |

---

### 2. Jumlah Saudara (Bobot 10%)

Semakin banyak saudara, semakin tinggi skor (tanggungan besar).

| Jumlah Saudara | Skor |
|----------------|------|
| >= 5 | 100 |
| 4 | 80 |
| 3 | 50 |
| 2 | 30 |
| 1 | 20 |
| 0 (anak tunggal) | 0 |

---

### 3. Rata-rata Raport — 3 Semester (Bobot 30%)

Nilai rata-rata 3 semester langsung menjadi skor.

| Rumus | Rentang Skor |
|-------|--------------|
| (Semester 1 + Semester 2 + Semester 3) / 3 | 0 – 100 |

---

### 4. Organisasi — Maks 3 Item (Bobot 15%)

Skor berdasarkan jabatan di organisasi. Maks 3 organisasi.

| Jabatan | Poin per Item |
|---------|---------------|
| Ketua / Wakil Ketua | 10 |
| Pengurus Inti | 8 |
| Anggota | 5 |

- **Maks raw** = 3 x 10 = 30
- **Normalisasi** = (total poin / 30) x 100
- **Tidak ada organisasi** = skor 0

#### Contoh Perhitungan

| Kombinasi | Raw | Skor |
|-----------|-----|------|
| 3x Ketua | 30 | 100 |
| 1 Ketua + 1 Pengurus + 1 Anggota | 23 | 77 |
| 2x Pengurus | 16 | 53 |
| 1x Anggota | 5 | 17 |

---

### 5. Prestasi — Maks 3 Item (Bobot 15%)

Skor per item = poin tingkat + poin juara (aditif).

#### Poin Tingkat Prestasi

| Tingkat | Poin |
|---------|------|
| Internasional | 10 |
| Nasional | 9 |
| Provinsi | 8 |
| Kab/Kota | 7 |
| Kecamatan | 6 |
| Sekolah | 5 |

#### Poin Tingkat Kejuaraan

| Juara | Poin |
|-------|------|
| Juara 1 | 10 |
| Juara 2 | 8 |
| Juara 3 | 6 |
| Juara Favorit | 4 |
| Finalis | 2 |

- **Maks raw** = 3 x (10 + 10) = 60
- **Normalisasi** = (total poin / 60) x 100
- **Tidak ada prestasi** = skor 0

#### Contoh Perhitungan

| Kombinasi | Raw | Skor |
|-----------|-----|------|
| 3x Internasional Juara 1 | 60 | 100 |
| 1 Nasional Juara 1 + 1 Provinsi Juara 2 | 35 | 58 |
| 1 Nasional Juara 2 + 1 Provinsi Juara 3 | 31 | 52 |
| 1 Sekolah Finalis | 7 | 12 |

---

### 6. Hafalan Quran (Bobot 10%)

| Kategori | Skor |
|----------|------|
| > 3 Juz | 100 |
| 3 Juz | 85 |
| Juz 30 | 70 |
| Surat Pendek (10 Surah) | 50 |
| Tidak ada hafalan | 0 |

---

## C. Formula Total

```
Total = round(
    Penghasilan  x 0.20  +
    Saudara      x 0.10  +
    Raport       x 0.30  +
    Organisasi   x 0.15  +
    Prestasi     x 0.15  +
    Hafalan      x 0.10
)
```

---

## D. Simulasi Profil

### Profil 1: Ideal (Skor Maksimum)

| Kategori | Kondisi | Skor | x Bobot |
|----------|---------|------|---------|
| Penghasilan | < 1 Juta | 100 | 20.0 |
| Saudara | >= 5 | 100 | 10.0 |
| Raport | Rata-rata 100 | 100 | 30.0 |
| Organisasi | 3x Ketua | 100 | 15.0 |
| Prestasi | 3x Internasional Juara 1 | 100 | 15.0 |
| Hafalan | > 3 Juz | 100 | 10.0 |
| | | **Total** | **100** |

### Profil 2: Tipikal Kuat

| Kategori | Kondisi | Skor | x Bobot |
|----------|---------|------|---------|
| Penghasilan | 1 – 2,5 Juta | 80 | 16.0 |
| Saudara | 3 saudara | 50 | 5.0 |
| Raport | Rata-rata 85 | 85 | 25.5 |
| Organisasi | 1 Ketua + 1 Pengurus + 1 Anggota | 77 | 11.6 |
| Prestasi | 1 Nasional Juara 2 + 1 Provinsi Juara 3 | 52 | 7.8 |
| Hafalan | Juz 30 | 70 | 7.0 |
| | | **Total** | **73** |

### Profil 3: Tanpa Organisasi, Prestasi & Hafalan

| Kategori | Kondisi | Skor | x Bobot |
|----------|---------|------|---------|
| Penghasilan | < 1 Juta | 100 | 20.0 |
| Saudara | 4 saudara | 80 | 8.0 |
| Raport | Rata-rata 90 | 90 | 27.0 |
| Organisasi | Tidak ada | 0 | 0.0 |
| Prestasi | Tidak ada | 0 | 0.0 |
| Hafalan | Tidak ada | 0 | 0.0 |
| | | **Total** | **55** |

### Profil 4: Minimal

| Kategori | Kondisi | Skor | x Bobot |
|----------|---------|------|---------|
| Penghasilan | > 5 Juta | 0 | 0.0 |
| Saudara | 0 (anak tunggal) | 0 | 0.0 |
| Raport | Rata-rata 50 | 50 | 15.0 |
| Organisasi | Tidak ada | 0 | 0.0 |
| Prestasi | Tidak ada | 0 | 0.0 |
| Hafalan | Tidak ada | 0 | 0.0 |
| | | **Total** | **15** |

---

## E. Validasi Schema

Validasi form menggunakan Zod. Berikut conditional validation yang diterapkan:

| Field | Kondisi | Validasi |
|-------|---------|----------|
| `penghasilan_ortu` | Salah satu ortu masih bekerja | Wajib pilih rentang |
| `penghasilan_ortu` | Kedua ortu wafat / tidak bekerja | Opsional (skor otomatis 100) |
| `keterangan_beasiswa` | `status_beasiswa = Ya_Lainnya` | Wajib isi nama beasiswa |
| `list_organisasi` | `toggle_organisasi = true` | Minimal 1 item, maks 3 |
| `jabatan` (organisasi) | — | Enum: Ketua, Pengurus, Anggota |
| `list_prestasi` | `toggle_prestasi = true` | Minimal 1 item, maks 3 |
| `kategori_hafalan` | `toggle_hafalan = true` | Wajib pilih kategori |
