package main

// Struktur untuk tabel inventaris
type Inventaris struct {
	ID         int     `json:"id"`
	NamaBarang string  `json:"nama_barang"`
	Stok       int     `json:"stok"`
	Harga      float64 `json:"harga"`
	Kategori   string  `json:"kategori"`
}

// Struktur untuk riwayat transaksi (JOIN)
type Transaksi struct {
	ID            int    `json:"id"`
	NamaBarang    string `json:"nama_barang"`
	TipeTransaksi string `json:"tipe_transaksi"`
	Jumlah        int    `json:"jumlah"`
	Tanggal       string `json:"tanggal"`
}