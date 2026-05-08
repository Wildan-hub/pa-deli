package main

import (
	"encoding/json"
	"net/http"
	"strings"
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
	var i Inventaris
	json.NewDecoder(r.Body).Decode(&i)

	err := db.QueryRow(
		`INSERT INTO inventaris (nama_barang, stok, harga, kategori)
		 VALUES ($1, $2, $3, $4) RETURNING id`,
		i.NamaBarang, i.Stok, i.Harga, i.Kategori,
	).Scan(&i.ID)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(i)
}

func deleteInventaris(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	// Mengambil ID dari URL path /inventaris/1
	id := strings.TrimPrefix(r.URL.Path, "/inventaris/")
	
	_, err := db.Exec("DELETE FROM inventaris WHERE id = $1", id)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Berhasil dihapus"})
}

// --- HANDLER TRANSAKSI ---

func getTransaksi(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	query := `
		SELECT t.id, i.nama_barang, t.tipe_transaksi, t.jumlah, t.tanggal 
		FROM transaksi t
		JOIN inventaris i ON t.barang_id = i.id
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