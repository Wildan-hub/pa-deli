"use client";
import { useEffect, useState } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const C = {
  navy: "#0f172a",
  navyMid: "#1e293b",
  navyLight: "#334155",
  amber: "#f59e0b",
  amberLight: "#fef3c7",
  amberDim: "#fbbf24",
  slate: "#64748b",
  slateLight: "#94a3b8",
  surface: "#f8fafc",
  white: "#ffffff",
  border: "#e2e8f0",
  green: "#10b981",
  greenBg: "#d1fae5",
  greenText: "#065f46",
  yellow: "#f59e0b",
  yellowBg: "#fef3c7",
  yellowText: "#92400e",
  red: "#ef4444",
  redBg: "#fee2e2",
  redText: "#991b1b",
  purple: "#4f46e5",
};

export default function GudangPage() {
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("overview");
  
  // Modal & Form State - Barang
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nama_barang: "", stok: 0, harga: 0, kategori: "General" });
  const [formErrors, setFormErrors] = useState({});

  // Modal & Form State - Transaksi
  const [isTransModalOpen, setIsTransModalOpen] = useState(false);
  const [transFormData, setTransFormData] = useState({ barang_id: "", tipe_transaksi: "MASUK", jumlah: 1 });

  // Global Notification
  const [notification, setNotification] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resItems = await fetch("http://localhost:8080/inventaris");
      const dataItems = await resItems.json();
      setItems(dataItems || []);
      const resTrans = await fetch("http://localhost:8080/transaksi");
      const dataTrans = await resTrans.json();
      setTransactions(dataTrans || []);
    } catch (err) {
      console.error("Koneksi ke Backend Gagal:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => { fetchData(); }, []);

  // Validation - Tambah Barang
  const validateForm = () => {
    const errors = {};
    if (!formData.nama_barang.trim()) errors.nama_barang = "Nama barang tidak boleh kosong.";
    if (!formData.kategori.trim()) errors.kategori = "Kategori tidak boleh kosong.";
    if (formData.stok < 0) errors.stok = "Stok tidak boleh negatif.";
    if (formData.harga < 0) errors.harga = "Harga tidak boleh negatif.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Action - Save Barang
  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      const res = await fetch("http://localhost:8080/inventaris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ nama_barang: "", stok: 0, harga: 0, kategori: "General" });
        setFormErrors({});
        showToast("Barang berhasil disimpan!");
        fetchData();
      }
    } catch { showToast("Gagal menambah barang!", "error"); }
  };

  // Action - Save Transaksi Baru
  const handleSaveTransaction = async () => {
    if (!transFormData.barang_id || transFormData.jumlah <= 0) {
      showToast("Pilih barang dan masukkan jumlah yang valid!", "error");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...transFormData,
          jumlah: Number(transFormData.jumlah),
          tanggal: new Date().toISOString()
        }),
      });
      if (res.ok) {
        setIsTransModalOpen(false);
        setTransFormData({ barang_id: "", tipe_transaksi: "MASUK", jumlah: 1 });
        showToast("Transaksi berhasil dicatat!");
        fetchData();
      } else {
        showToast("Gagal mencatat transaksi!", "error");
      }
    } catch { showToast("Koneksi ke backend gagal!", "error"); }
  };

  // Action - Delete Barang
  const handleDelete = async (id) => {
    if (confirm("Hapus barang ini?")) {
      try {
        const res = await fetch(`http://localhost:8080/inventaris/${id}`, { method: "DELETE" });
        if (res.ok) { showToast("Barang dihapus."); fetchData(); }
      } catch { showToast("Gagal menghapus!", "error"); }
    }
  };

  // Calculations
  const totalNilai = items.reduce((sum, i) => sum + (i.harga || 0) * (i.stok || 0), 0);
  const stokHabis = items.filter(i => Number(i.stok) === 0).length;
  const stokRendah = items.filter(i => Number(i.stok) > 0 && Number(i.stok) <= 20).length;

  const menuItems = [
    { key: "overview", icon: "◈", label: "Overview" },
    { key: "stock", icon: "▦", label: "Stock Items" },
    { key: "transactions", icon: "↕", label: "Transaksi" },
    { key: "admin", icon: "⊙", label: "Pengaturan" },
  ];

  const pageTitle = {
    overview: "Ringkasan Inventaris",
    stock: "Manajemen Stok",
    transactions: "Riwayat Transaksi",
    admin: "Pengaturan Sistem",
  }[activeMenu];

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: C.surface, fontFamily: "'Inter', system-ui, sans-serif", color: C.navy }}>

      {/* ── SIDEBAR ─────────────────────────────────── */}
      <aside style={{
        width: 240,
        backgroundColor: C.navy,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>
        <div style={{ padding: "28px 24px 20px", borderBottom: `1px solid ${C.navyLight}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `linear-gradient(135deg, ${C.amber}, ${C.amberDim})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: "bold", color: C.navy,
            }}>I</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white, letterSpacing: "-0.3px" }}>Invento Lite</div>
              <div style={{ fontSize: 11, color: C.slateLight, marginTop: 1 }}>Warehouse Manager</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: "16px 12px", flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.08em", color: C.slateLight, padding: "0 12px", marginBottom: 8, fontWeight: 600, textTransform: "uppercase" }}>Menu</div>
          {menuItems.map(m => {
            const active = activeMenu === m.key;
            return (
              <div key={m.key} onClick={() => setActiveMenu(m.key)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 8, marginBottom: 2,
                cursor: "pointer", transition: "all 0.15s",
                backgroundColor: active ? C.navyMid : "transparent",
                color: active ? C.amber : C.slateLight,
                fontWeight: active ? 600 : 400,
                fontSize: 14,
                borderLeft: active ? `3px solid ${C.amber}` : "3px solid transparent",
              }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>{m.icon}</span>
                {m.label}
              </div>
            );
          })}
        </nav>

        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.navyLight}` }}>
          <div style={{ fontSize: 11, color: C.slateLight }}>v1.0.0 · Backend: localhost:8080</div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────── */}
      <main style={{ flex: 1, marginLeft: 240, padding: "32px 36px", minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.slate, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", color: C.navy }}>{pageTitle}</h1>
          </div>
          
          {activeMenu !== "admin" && (
            <button 
              onClick={() => activeMenu === "transactions" ? setIsTransModalOpen(true) : setIsModalOpen(true)} 
              style={{
                display: "flex", alignItems: "center", gap: 8,
                backgroundColor: activeMenu === "transactions" ? C.purple : C.amber, 
                color: activeMenu === "transactions" ? C.white : C.navy,
                padding: "10px 20px", borderRadius: 10, border: "none",
                cursor: "pointer", fontWeight: 700, fontSize: 14,
                boxShadow: activeMenu === "transactions" ? `0 4px 14px rgba(79,70,229,0.4)` : `0 4px 14px rgba(245,158,11,0.4)`,
                transition: "transform 0.1s",
              }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> 
              {activeMenu === "transactions" ? "Catat Transaksi" : "Tambah Barang"}
            </button>
          )}
        </div>

        {/* ── MENUS: OVERVIEW & STOCK ── */}
        {(activeMenu === "overview" || activeMenu === "stock") && (
          <>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Barang", value: items.length, unit: "item", color: C.purple, bg: "#ede9fe" },
                { label: "Nilai Stok", value: totalNilai >= 1e6 ? `Rp ${(totalNilai / 1e6).toFixed(1)}jt` : `Rp ${totalNilai.toLocaleString("id-ID")}`, unit: "estimasi", color: C.green, bg: C.greenBg },
                { label: "Stok Rendah", value: stokRendah, unit: "item ≤20", color: C.yellow, bg: C.yellowBg },
                { label: "Stok Habis", value: stokHabis, unit: "kosong", color: C.red, bg: C.redBg },
              ].map(s => (
                <div key={s.label} style={{
                  backgroundColor: C.white, borderRadius: 14,
                  padding: "20px 22px", position: "relative", overflow: "hidden",
                  border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}>
                  <div style={{
                    position: "absolute", right: -8, top: -4,
                    fontSize: 72, fontWeight: 900, color: s.bg,
                    lineHeight: 1, userSelect: "none", zIndex: 0, letterSpacing: "-3px",
                  }}>
                    {typeof s.value === "number" ? s.value : "—"}
                  </div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.slate, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>{s.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: C.slateLight, marginTop: 4 }}>{s.unit}</div>
                  </div>
                  <div style={{ width: 36, height: 4, backgroundColor: s.color, borderRadius: 2, marginTop: 16 }} />
                </div>
              ))}
            </div>

            {/* Table Barang */}
            <div style={{ backgroundColor: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>
              <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Daftar Barang</div>
                  <div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>{items.length} item terdaftar</div>
                </div>
                {activeMenu === "stock" && (
                  <div style={{ fontSize: 12, color: C.slate, backgroundColor: C.surface, padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}` }}>
                    Mode Edit Aktif
                  </div>
                )}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: C.surface }}>
                    {["#", "Nama Barang", "Kategori", "Stok", "Harga Satuan", "Status", activeMenu === "stock" && "Aksi"].filter(Boolean).map(h => (
                      <th key={h} style={{ padding: "11px 16px", fontSize: 12, fontWeight: 600, color: C.slate, textAlign: "left", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" style={{ textAlign: "center", padding: 48, color: C.slate }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>⌛</div>
                      <div style={{ fontSize: 14 }}>Mengambil data dari database…</div>
                    </td></tr>
                  ) : items.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: "center", padding: 48, color: C.slate }}>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Belum ada barang</div>
                      <div style={{ fontSize: 13 }}>Klik "+ Tambah Barang" untuk mulai mengisi inventaris.</div>
                    </td></tr>
                  ) : items.map((item, idx) => {
                    const stok = Number(item.stok) || 0;
                    const statusInfo = stok > 20
                      ? { label: "Aman", bg: C.greenBg, color: C.greenText }
                      : stok > 0
                        ? { label: "Rendah", bg: C.yellowBg, color: C.yellowText }
                        : { label: "Habis", bg: C.redBg, color: C.redText };
                    return (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${C.surface}`, transition: "background 0.1s" }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        <td style={{ padding: "13px 16px", fontSize: 12, color: C.slateLight, fontWeight: 600 }}>#{String(idx + 1).padStart(2, "0")}</td>
                        <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>{item.nama_barang}</td>
                        <td style={{ padding: "13px 16px" }}>
                          <span style={{ fontSize: 12, backgroundColor: C.surface, color: C.slate, padding: "3px 10px", borderRadius: 6, border: `1px solid ${C.border}` }}>{item.kategori}</span>
                        </td>
                        <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 700, color: stok === 0 ? C.red : stok <= 20 ? C.yellow : C.navy }}>{stok}</td>
                        <td style={{ padding: "13px 16px", fontSize: 14, color: C.navyLight }}>Rp {item.harga?.toLocaleString("id-ID")}</td>
                        <td style={{ padding: "13px 16px" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color, padding: "4px 10px", borderRadius: 20 }}>{statusInfo.label}</span>
                        </td>
                        {activeMenu === "stock" && (
                          <td style={{ padding: "13px 16px" }}>
                            <button onClick={() => handleDelete(item.id)} style={{
                              fontSize: 12, fontWeight: 600, color: C.red, backgroundColor: C.redBg, border: "none", cursor: "pointer",
                              padding: "5px 12px", borderRadius: 6, transition: "opacity 0.15s",
                            }}
                              onMouseOver={e => e.currentTarget.style.opacity = "0.7"}
                              onMouseOut={e => e.currentTarget.style.opacity = "1"}
                            >Hapus</button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── MENU: TRANSAKSI ── */}
        {activeMenu === "transactions" && (
          <div style={{ backgroundColor: C.white, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "18px 22px", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Riwayat Transaksi</div>
              <div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>{transactions.length} transaksi tercatat</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: C.surface }}>
                  {["Waktu", "Nama Barang", "Tipe", "Jumlah"].map(h => (
                    <th key={h} style={{ padding: "11px 16px", fontSize: 12, fontWeight: 600, color: C.slate, textAlign: "left", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: "center", padding: 48, color: C.slate }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
                    <div style={{ fontWeight: 600 }}>Belum ada transaksi resmi</div>
                  </td></tr>
                ) : transactions.map(t => (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${C.surface}` }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = C.surface}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "13px 16px", fontSize: 13, color: C.slate }}>{new Date(t.tanggal).toLocaleString("id-ID")}</td>
                    <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 600 }}>{t.nama_barang}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                        backgroundColor: t.tipe_transaksi === "MASUK" ? C.greenBg : C.redBg,
                        color: t.tipe_transaksi === "MASUK" ? C.greenText : C.redText,
                      }}>{t.tipe_transaksi}</span>
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 700 }}>{t.jumlah}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── MENU: ADMIN ── */}
        {activeMenu === "admin" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { title: "Koneksi Database", desc: "Backend berjalan di localhost:8080. Ubah endpoint di kode jika backend ada di server lain.", icon: "🔌" },
              { title: "Hak Akses", desc: "Sistem saat ini berjalan tanpa autentikasi. Tambahkan JWT untuk lingkungan produksi.", icon: "🔐" },
              { title: "Backup Data", desc: "Ekspor seluruh inventaris ke file JSON atau CSV langsung dari endpoint backend.", icon: "💾" },
              { title: "Notifikasi", desc: "Toast notifikasi aktif. Bisa dikonfigurasi untuk mengirim email saat stok habis.", icon: "🔔" },
            ].map(c => (
              <div key={c.title} style={{ backgroundColor: C.white, borderRadius: 14, padding: "22px 24px", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.6 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── MODAL: TAMBAH BARANG ───────────────────────────────────── */}
      {isModalOpen && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)",
        }}>
          <div style={{ backgroundColor: C.white, borderRadius: 16, width: 440, boxShadow: "0 24px 48px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            <div style={{ padding: "22px 26px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>Tambah Barang Baru</div>
                <div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>Isi detail barang yang akan ditambahkan</div>
              </div>
              <button onClick={() => { setIsModalOpen(false); setFormErrors({}); }} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.slate }}>×</button>
            </div>

            <div style={{ padding: "22px 26px" }}>
              {[
                { label: "Nama Barang", key: "nama_barang", type: "text", placeholder: "Cth: Lampu LED 10W" },
                { label: "Kategori", key: "kategori", type: "text", placeholder: "Cth: Elektronik" },
                { label: "Stok Awal", key: "stok", type: "number", placeholder: "0" },
                { label: "Harga Satuan (Rp)", key: "harga", type: "number", placeholder: "0" },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.navyLight, display: "block", marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={formData[f.key]}
                    onChange={e => setFormData({ ...formData, [f.key]: f.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value })}
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8,
                      border: `1.5px solid ${formErrors[f.key] ? C.red : C.border}`, fontSize: 14,
                      outline: "none", boxSizing: "border-box", color: C.navy, transition: "border-color 0.15s",
                    }}
                    onFocus={e => e.target.style.borderColor = formErrors[f.key] ? C.red : C.amber}
                    onBlur={e => e.target.style.borderColor = formErrors[f.key] ? C.red : C.border}
                  />
                  {formErrors[f.key] && (
                    <div style={{ fontSize: 12, color: C.red, marginTop: 4 }}>⚠ {formErrors[f.key]}</div>
                  )}
                </div>
              ))}

              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button onClick={() => { setIsModalOpen(false); setFormErrors({}); }} style={{ flex: 1, padding: "11px", borderRadius: 8, border: `1.5px solid ${C.border}`, background: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: C.slate }}>Batal</button>
                <button onClick={handleSave} style={{ flex: 2, padding: "11px", borderRadius: 8, border: "none", backgroundColor: C.amber, cursor: "pointer", fontSize: 14, fontWeight: 700, color: C.navy, boxShadow: `0 4px 12px rgba(245,158,11,0.35)` }}>Simpan ke Database</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CATAT TRANSAKSI BARU ───────────────────────────────── */}
      {isTransModalOpen && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, backdropFilter: "blur(4px)",
        }}>
          <div style={{ backgroundColor: C.white, borderRadius: 16, width: 440, boxShadow: "0 24px 48px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            <div style={{ padding: "22px 26px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>Catat Transaksi Barang</div>
                <div style={{ fontSize: 12, color: C.slate, marginTop: 2 }}>Perbarui stok barang masuk atau keluar</div>
              </div>
              <button onClick={() => setIsTransModalOpen(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.slate }}>×</button>
            </div>

            <div style={{ padding: "22px 26px" }}>
              {/* Dropdown Pilih Barang */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.navyLight, display: "block", marginBottom: 6 }}>Pilih Barang</label>
                <select
                  value={transFormData.barang_id}
                  onChange={e => setTransFormData({ ...transFormData, barang_id: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.navy, outline: "none" }}
                >
                  <option value="">-- Pilih Barang di Gudang --</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>{item.nama_barang} (Stok: {item.stok})</option>
                  ))}
                </select>
              </div>

              {/* Dropdown Tipe Transaksi */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.navyLight, display: "block", marginBottom: 6 }}>Tipe Transaksi</label>
                <select
                  value={transFormData.tipe_transaksi}
                  onChange={e => setTransFormData({ ...transFormData, tipe_transaksi: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.navy, outline: "none" }}
                >
                  <option value="MASUK">➡️ BARANG MASUK (Tambah Stok)</option>
                  <option value="KELUAR">⬅️ BARANG KELUAR (Kurangi Stok)</option>
                </select>
              </div>

              {/* Input Jumlah */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: C.navyLight, display: "block", marginBottom: 6 }}>Jumlah Barang</label>
                <input
                  type="number"
                  min="1"
                  value={transFormData.jumlah}
                  onChange={e => setTransFormData({ ...transFormData, jumlah: parseInt(e.target.value) || 1 })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.navy, outline: "none" }}
                />
              </div>

              {/* Tombol Aksi */}
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setIsTransModalOpen(false)} style={{ flex: 1, padding: "11px", borderRadius: 8, border: `1.5px solid ${C.border}`, background: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, color: C.slate }}>Batal</button>
                <button onClick={handleSaveTransaction} style={{ flex: 2, padding: "11px", borderRadius: 8, border: "none", backgroundColor: C.purple, cursor: "pointer", fontSize: 14, fontWeight: 700, color: C.white, boxShadow: `0 4px 12px rgba(79,70,229,0.35)` }}>Simpan Transaksi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ───────────────────────────────────── */}
      {notification && (
        <div style={{
          position: "fixed", bottom: 28, right: 28, backgroundColor: C.navy, color: C.white,
          padding: "14px 20px", borderRadius: 12, boxShadow: "0 12px 24px rgba(0,0,0,0.25)",
          zIndex: 9999, display: "flex", alignItems: "center", gap: 10,
          borderLeft: `4px solid ${notification.type === "error" ? C.red : C.amber}`,
          fontSize: 14, fontWeight: 600, minWidth: 260, animation: "slideIn 0.2s ease",
        }}>
          <span style={{ fontSize: 18 }}>{notification.type === "error" ? "✗" : "✓"}</span>
          {notification.message}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}