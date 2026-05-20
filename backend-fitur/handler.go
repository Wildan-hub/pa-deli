package main

import (
	"encoding/json"
	"net/http"
	"strings"
	"log"
)

// --- HANDLER INVENTARIS ---

func getInventaris(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.Query("SELECT id, nama_barang, stok, harga, COALESCE(kategori, 'General') FROM inventaris ORDER BY id ASC")
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows.Close()

	data := []Inventaris{}
	for rows.Next() {
		var i Inventaris
		rows.Scan(&i.ID, &i.NamaBarang, &i.Stok, &i.Harga, &i.Kategori)
		data = append(data, i)
	}
	json.NewEncoder(w).Encode(data)
}

func createInventaris(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Tambahkan handle OPTIONS agar tidak error saat di browser
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var i Inventaris
	json.NewDecoder(r.Body).Decode(&i)

	// 1. Simpan ke tabel inventaris dan ambil ID-nya
	err := db.QueryRow(
		`INSERT INTO inventaris (nama_barang, stok, harga, kategori)
		 VALUES ($1, $2, $3, $4) RETURNING id`,
		i.NamaBarang, i.Stok, i.Harga, i.Kategori,
	).Scan(&i.ID)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	// 2. OTOMATIS: Catat riwayat ke tabel transaksi sebagai 'MASUK'
	_, err = db.Exec(
		`INSERT INTO transaksi (barang_id, tipe_transaksi, jumlah)
		 VALUES ($1, 'MASUK', $2)`,
		i.ID, i.Stok,
	)

	if err != nil {
		// Jika transaksi gagal dicatat, kita beri log di terminal backend
		log.Println("Gagal mencatat riwayat transaksi:", err)
	}

	json.NewEncoder(w).Encode(i)
}


func deleteInventaris(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// 1. Ambil ID dari URL path
	id := strings.TrimPrefix(r.URL.Path, "/inventaris/")

	// 2. Ambil stok terakhir sebelum dihapus untuk dicatat ke riwayat transaksi
	var stokTerakhir int
	err := db.QueryRow("SELECT stok FROM inventaris WHERE id = $1", id).Scan(&stokTerakhir)
	if err != nil {
		// Jika barang tidak ketemu, tidak perlu hapus
		http.Error(w, "Barang tidak ditemukan", 404)
		return
	}

	// 3. Catat ke tabel transaksi sebagai 'KELUAR'
	_, err = db.Exec(
		"INSERT INTO transaksi (barang_id, tipe_transaksi, jumlah) VALUES ($1, 'KELUAR', $2)",
		id, stokTerakhir,
	)
	if err != nil {
		log.Println("Gagal mencatat riwayat keluar:", err)
	}

	// 4. Baru benar-benar hapus dari tabel inventaris
	_, err = db.Exec("DELETE FROM inventaris WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Berhasil dihapus dan dicatat sebagai KELUAR"})
}


// --- HANDLER TRANSAKSI ---

func getTransaksi(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

		// Ganti query-nya jadi seperti ini:
    	query := `
    SELECT 
        t.id, 
        COALESCE(i.nama_barang, 'Barang Sudah Dihapus') as nama_barang, 
        t.tipe_transaksi, 
        t.jumlah, 
        t.tanggal 
    FROM transaksi t
    LEFT JOIN inventaris i ON t.barang_id = i.id
    ORDER BY t.tanggal DESC`



	rows, err := db.Query(query)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows.Close()

	data := []Transaksi{}
	for rows.Next() {
		var t Transaksi
		rows.Scan(&t.ID, &t.NamaBarang, &t.TipeTransaksi, &t.Jumlah, &t.Tanggal)
		data = append(data, t)
	}
	json.NewEncoder(w).Encode(data)
}