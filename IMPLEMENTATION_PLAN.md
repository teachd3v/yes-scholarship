# Rencana Implementasi - Backend & Dashboard Admin

Tujuannya adalah menyimpan data pendaftaran beasiswa ke backend Sanity yang sudah ada dan menyediakan dashboard khusus admin untuk proses validasi.

## Perlu Review Pengguna

> [!IMPORTANT]
> **Dashboard Admin Kustom**: Sesuai permintaan, dashboard admin akan dibuat terpisah di `/admin` (bukan menggunakan Sanity Studio).
>
> - **Login**: Menggunakan username `admin` dan password `1234`.
> - **Fitur**: Melihat daftar pendaftar, detail pendaftar (termasuk foto/dokumen), dan mengubah status (Lolos/Tidak Lolos).

## Perubahan yang Diusulkan

### Skema Sanity (Database)

#### [BARU] [application.ts](file:///c:/Users/Asus%20VivoBook/Desktop/yes-scholarship/src/sanity/schemaTypes/application.ts)

- Membuat tipe dokumen baru `application` untuk menyimpan data pendaftar.
- **Field**:
  - `biodata` (Object): Nama, NIK, KK, Kontak, dll.
  - `keluarga` (Object): Info orang tua, penghasilan, dokumen (KK, SKTM, SKB).
  - `seleksi` (Object): Info sekolah, nilai raport, prestasi, dokumen (Raport).
  - `scoring` (Object): Hasil perhitungan skor & pre-screening otomatis.
  - `status` (String): 'pending', 'approved', 'rejected'. Default 'pending'.
  - `adminNotes` (Text): Catatan tambahan dari admin.

#### [UBAH] [index.ts](file:///c:/Users/Asus%20VivoBook/Desktop/yes-scholarship/src/sanity/schemaTypes/index.ts)

- Mendaftarkan skema `application` baru agar terbaca oleh sistem.

### API Route (Simpan Data)

#### [BARU] [route.ts](file:///c:/Users/Asus%20VivoBook/Desktop/yes-scholarship/src/app/api/application/submit/route.ts)

- Menangani request `POST` dari formulir pendaftaran.
- Memvalidasi data menggunakan `masterSchema`.
- Mengupload file (foto/dokumen) ke Sanity Assets.
- Menghitung Skor & Pre-screening otomatis.
- Menyimpan data sebagai dokumen baru di Sanity.

### Dashboard Admin Kustom

#### [BARU] [middleware.ts](file:///c:/Users/Asus%20VivoBook/Desktop/yes-scholarship/src/middleware.ts)

- Memproteksi rute `/admin` agar hanya bisa diakses setelah login.
- Menggunakan cookie sederhana untuk sesi admin.

#### [BARU] [login/page.tsx](file:///c:/Users/Asus%20VivoBook/Desktop/yes-scholarship/src/app/admin/login/page.tsx)

- Halaman login sederhana.
- Memverifikasi username `admin` dan password `1234`.

#### [BARU] [page.tsx](file:///c:/Users/Asus%20VivoBook/Desktop/yes-scholarship/src/app/admin/page.tsx)

- **Tabel Pendaftar**: Menampilkan Nama, Status Pre-Screening, Total Skor, dan Status Validasi.
- **Detail & Validasi**: Tombol untuk melihat detail lengkap dan mengubah status menjadi "Approved" (Lolos) atau "Rejected" (Tidak Lolos).

#### [BARU] [actions.ts](file:///c:/Users/Asus%20VivoBook/Desktop/yes-scholarship/src/app/admin/actions.ts)

- Server Actions untuk mengubah status aplikasi di database Sanity.

### Integrasi Frontend (Formulir)

#### [UBAH] [page.tsx](<file:///c:/Users/Asus%20VivoBook/Desktop/yes-scholarship/src/app/(site)/pendaftaran/page.tsx>)

- Mengupdate fungsi `onSubmit` untuk mengirim data ke API route yang baru dibuat.
- Menangani loading state (karena upload file butuh waktu) dan pesan sukses/gagal.

## Rencana Verifikasi

### Verifikasi Manual

1.  **Pengiriman Formulir**:
    - Isi formulir di `/pendaftaran` dengan data dummy & upload file.
    - Kirim dan pastikan muncul pesan sukses.
2.  **Login Admin**:
    - Buka `/admin`, pastikan diarahkan ke login.
    - Login dengan `admin` / `1234`.
3.  **Fungsi Dashboard**:
    - Cek apakah data pendaftar muncul di tabel.
    - Klik "Approve" dan pastikan status berubah (tersimpan di database).
