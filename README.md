# 📦 Invento Lite - Stock Management System

Aplikasi manajemen inventaris berbasis web untuk mencatat stok barang, mengelompokkan kategori, dan memantau riwayat transaksi masuk/keluar gudang.

## 🛠️ Teknologi yang Digunakan
* **Frontend**: Next.js
* **Backend**: Go (Golang)
* **Database**: PostgreSQL (di kelola lewat DBeaver)

## 📂 Struktur Folder Utama
* `backend-fitur/` : Tempat kode program server Go (API)
* `tampilan-frontend/` : Tempat kode program tampilan web Next.js
* `database/` : Tempat menyimpan file backup database (.sql)

## 🚀 Cara Menjalankan di Komputer Lokal

### 1. Persiapan Database
1. Buka **DBeaver** dan buat database baru bernama `gudang`.
2. Masuk ke folder `database/` di proyek ini, lalu jalankan/eksekusi file `.sql` yang ada di dalamnya ke database baru tersebut.
3. Atur koneksi database Anda di file `backend-fitur/.env`.

### 2. Jalankan Backend (Go)
Buka terminal baru, lalu ketik perintah berikut:
```bash
cd backend-fitur
go mod tidy
go run .
```

### 3. Jalankan Frontend (Next.js)
Buka terminal satu lagi (buka terminal baru tanpa menutup terminal backend), lalu ketik:
```bash
cd tampilan-frontend
npm install
npm run dev
```
Setelah itu, buka browser Anda dan akses alamat `http://localhost:3000`.
