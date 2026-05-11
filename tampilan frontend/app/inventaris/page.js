"use client";
import { useEffect, useState } from "react";

export default function GudangPage() {
  // --- 1. STATES ---
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State untuk form input barang baru
  const [formData, setFormData] = useState({
    nama_barang: "",
    stok: 0,
    harga: 0,
    kategori: "General"
  });

  // --- 2. FETCH DATA DARI BACKEND GOLANG ---
  const fetchData = async () => {
    try {
      setLoading(true);
      // Ganti IP jika kamu menjalankan backend di komputer yang berbeda, 
      // atau gunakan localhost:8080 jika di satu komputer yang sama.
      const resItems = await fetch("http://10.11.5.12:8080/inventaris");
      const dataItems = await resItems.json();
      setItems(dataItems || []);

      const resTrans = await fetch("http://10.11.5.12:8080/transaksi");
      const dataTrans = await resTrans.json();
      setTransactions(dataTrans || []);
    } catch (err) {
      console.error("Koneksi ke Backend Gagal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 3. FUNGSI AKSI (CREATE & DELETE) ---
  
  const handleSave = async () => {
    try {
      const res = await fetch("http://10.11.5.12:8080/inventaris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ nama_barang: "", stok: 0, harga: 0, kategori: "General" });
        fetchData(); // Refresh data
      }
    } catch (err) {
      alert("Gagal menambah barang!");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah anda yakin ingin menghapus barang ini?")) {
      try {
        const res = await fetch(`http://10.11.5.12:8080/inventaris/${id}`, {
          method: "DELETE",
        });
        if (res.ok) fetchData(); 
      } catch (err) {
        alert("Gagal menghapus barang!");
      }
    }
  };

  // --- 4. STYLE HELPER ---
  const getStatusStyle = (stok) => {
    const s = Number(stok) || 0;
    const base = { padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" };
    if (s > 20) return { ...base, backgroundColor: "#dcfce7", color: "#166534" };
    if (s > 0) return { ...base, backgroundColor: "#fef9c3", color: "#854d0e" };
    return { ...base, backgroundColor: "#fee2e2", color: "#991b1b" };
  };

  return (
    <div style={dashboardLayout}>
      
      {/* SIDEBAR */}
      <aside style={sidebar}>
        <div style={logoSection}>
          <span style={{fontSize: "24px"}}>🟦</span>
          <h2 style={{fontSize: "20px", fontWeight: "bold", margin: 0}}>Invento Lite</h2>
        </div>
        <nav>
          <div onClick={() => setActiveMenu("overview")} style={activeMenu === "overview" ? menuActive : menuItem}>🏠 Overview</div>
          <div onClick={() => setActiveMenu("stock")} style={activeMenu === "stock" ? menuActive : menuItem}>📦 Stock Items</div>
          <div onClick={() => setActiveMenu("transactions")} style={activeMenu === "transactions" ? menuActive : menuItem}>📄 Transactions</div>
          <div onClick={() => setActiveMenu("admin")} style={activeMenu === "admin" ? menuActive : menuItem}>⚙️ Admin Settings</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main style={mainContent}>
        
        {/* HEADER */}
        <div style={topHeader}>
          <h1 style={{fontSize: "24px", fontWeight: "bold", margin: 0}}>
            {activeMenu === "overview" ? "Current Inventory" : activeMenu === "stock" ? "Stock Management" : "Transactions History"}
          </h1>
          <div style={{display: "flex", gap: "10px"}}>
            <button style={addButton} onClick={() => setIsModalOpen(true)}>+ Add Item</button>
          </div>
        </div>

        {/* KONTEN MENU: OVERVIEW & STOCK */}
        {(activeMenu === "overview" || activeMenu === "stock") && (
          <>
            <div style={statsGrid}>
              <div style={statCard}><span style={statLabel}>Total Items</span><h3 style={statValue}>{items.length}</h3></div>
              <div style={statCard}><span style={statLabel}>Stok Habis</span><h3 style={statValue}>{items.filter(i => i.stok === 0).length}</h3></div>
              <div style={statCard}><span style={statLabel}>Kategori</span><h3 style={statValue}>3</h3></div>
            </div>

            <div style={tableContainer}>
              <table style={table}>
                <thead>
                  <tr style={theadRow}>
                    <th style={th}>ID</th>
                    <th style={th}>Name</th>
                    <th style={th}>Category</th>
                    <th style={th}>Stock</th>
                    <th style={th}>Price</th>
                    <th style={th}>Status</th>
                    {activeMenu === "stock" && <th style={th}>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" style={{textAlign: "center", padding: "40px"}}>Loading data dari database...</td></tr>
                  ) : items.length === 0 ? (
                    <tr><td colSpan="7" style={{textAlign: "center", padding: "40px"}}>Tidak ada data.</td></tr>
                  ) : items.map((item, index) => (
                    <tr key={item.id} style={trBody}>
                      <td style={td}>#{index + 1}</td>
                      <td style={{...td, fontWeight: "600"}}>{item.nama_barang}</td>
                      <td style={td}>{item.kategori}</td>
                      <td style={td}>{item.stok}</td>
                      <td style={td}>Rp {item.harga?.toLocaleString()}</td>
                      <td style={td}>
                        <span style={getStatusStyle(item.stok)}>
                          {item.stok > 20 ? "Safe" : item.stok > 0 ? "Low" : "Empty"}
                        </span>
                      </td>
                      {activeMenu === "stock" && (
                        <td style={td}>
                          <button onClick={() => handleDelete(item.id, index)} style={{color: "#ef4444", background: "none", border: "none", cursor: "pointer"}}>🗑️ Delete</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* KONTEN MENU: TRANSAKSI */}
        {activeMenu === "transactions" && (
          <div style={tableContainer}>
            <table style={table}>
              <thead>
                <tr style={theadRow}>
                  <th style={th}>Waktu</th>
                  <th style={th}>Nama Barang</th>
                  <th style={th}>Tipe</th>
                  <th style={th}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign: "center", padding: "40px"}}>Belum ada riwayat transaksi.</td></tr>
                ) : transactions.map((t) => (
                  <tr key={t.id} style={trBody}>
                    <td style={td}>{new Date(t.tanggal).toLocaleString()}</td>
                    <td style={td}>{t.nama_barang}</td>
                    <td style={{...td, color: t.tipe_transaksi === 'MASUK' ? '#166534' : '#991b1b', fontWeight: 'bold'}}>
                      {t.tipe_transaksi}
                    </td>
                    <td style={td}>{t.jumlah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MENU ADMIN (Placeholder) */}
        {activeMenu === "admin" && (
          <div style={{padding: "40px", textAlign: "center", backgroundColor: "white", borderRadius: "12px"}}>
            <h3>⚙️ Settings</h3>
            <p>Konfigurasi database dan hak akses ada di sini.</p>
          </div>
        )}
      </main>

      {/* MODAL TAMBAH BARANG */}
      {isModalOpen && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h3 style={{marginTop: 0}}>Tambah Barang Baru</h3>
            <label style={label}>Nama Barang</label>
            <input type="text" style={formInput} onChange={(e) => setFormData({...formData, nama_barang: e.target.value})} />
            
            <label style={label}>Kategori</label>
            <input type="text" style={formInput} onChange={(e) => setFormData({...formData, kategori: e.target.value})} />
            
            <label style={label}>Stok Awal</label>
            <input type="number" style={formInput} onChange={(e) => setFormData({...formData, stok: parseInt(e.target.value)})} />
            
            <label style={label}>Harga Satuan</label>
            <input type="number" style={formInput} onChange={(e) => setFormData({...formData, harga: parseFloat(e.target.value)})} />
            
            <div style={{display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px"}}>
              <button style={{padding: "10px 20px", border: "none", cursor: "pointer", borderRadius: "6px"}} onClick={() => setIsModalOpen(false)}>Batal</button>
              <button style={addButton} onClick={handleSave}>Simpan ke DB</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- CSS STYLES ---
const dashboardLayout = { display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", color: "#1e293b", fontFamily: "sans-serif" };
const sidebar = { width: "250px", backgroundColor: "#fff", borderRight: "1px solid #e2e8f0", padding: "20px 0" };
const logoSection = { display: "flex", alignItems: "center", gap: "10px", padding: "0 20px", marginBottom: "30px" };
const menuItem = { padding: "12px 20px", color: "#64748b", cursor: "pointer", fontSize: "14px" };
const menuActive = { ...menuItem, backgroundColor: "#f1f5f9", color: "#4f46e5", borderRight: "4px solid #4f46e5", fontWeight: "bold" };
const mainContent = { flex: 1, padding: "30px" };
const topHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
const addButton = { backgroundColor: "#0f172a", color: "#fff", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600" };
const statsGrid = { display: "flex", gap: "15px", marginBottom: "25px" };
const statCard = { backgroundColor: "#fff", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", flex: 1 };
const statLabel = { fontSize: "12px", color: "#64748b" };
const statValue = { fontSize: "24px", fontWeight: "bold", margin: "5px 0 0 0" };
const tableContainer = { backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden" };
const table = { width: "100%", borderCollapse: "collapse" };
const theadRow = { backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", textAlign: "left" };
const th = { padding: "12px 15px", fontSize: "13px", color: "#64748b" };
const td = { padding: "12px 15px", fontSize: "14px", borderBottom: "1px solid #f1f5f9" };
const trBody = { backgroundColor: "#fff" };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 };
const modalContent = { backgroundColor: "#fff", padding: "25px", borderRadius: "12px", width: "400px" };
const formInput = { width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "6px", border: "1px solid #ddd", boxSizing: "border-box" };
const label = { fontSize: "13px", fontWeight: "bold", display: "block", marginBottom: "5px" };