package main

import (
	"log"
	"net/http"
)

func main() {
	connectDB() // Pastikan fungsi di db.go sudah benar koneksinya

	// Routing Inventaris
	http.HandleFunc("/inventaris", func(w http.ResponseWriter, r *http.Request) {
		// Handle CORS Preflight
		if r.Method == "OPTIONS" {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == "GET" {
			getInventaris(w, r)
		} else if r.Method == "POST" {
			createInventaris(w, r)
		}
	})

	// Routing Delete (menggunakan suffix path)
	http.HandleFunc("/inventaris/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "DELETE" {
			deleteInventaris(w, r)
		}
	})

	// Routing Transaksi
	http.HandleFunc("/transaksi", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "GET" {
			getTransaksi(w, r)
		}
	})

	log.Println("🚀 Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}