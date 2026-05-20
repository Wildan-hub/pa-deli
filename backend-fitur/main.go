package main

import (
	"log"
	"net/http"
)

func main() {
	connectDB()

	// 1. RUTE UNTUK DAFTAR & TAMBAH (localhost:8080/inventaris)
	http.HandleFunc("/inventaris", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == "GET" {
			getInventaris(w, r)
		} else if r.Method == "POST" {
			createInventaris(w, r)
		}
	})

	// 2. RUTE KHUSUS HAPUS (localhost:8080/inventaris/ID)
	http.HandleFunc("/inventaris/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == "DELETE" {
			deleteInventaris(w, r)
		}
	})

	// 3. RUTE TRANSAKSI
	http.HandleFunc("/transaksi", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		if r.Method == "GET" {
			getTransaksi(w, r)
		}
	})

	log.Println("🚀 Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}