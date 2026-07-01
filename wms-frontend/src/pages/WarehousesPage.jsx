import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function WarehousesPage() {
  const { user } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({ name:"", location:"", capacity:"" });
  const [msg, setMsg] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseItems, setWarehouseItems] = useState([]);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const canEdit = ["ADMIN", "MANAGER"].includes(user?.role);
  const canDelete = user?.role === "ADMIN";

  const fetch = () =>
    api.get("/api/v1/warehouses").then(r => setWarehouses(r.data));

  useEffect(() => { fetch(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post(
        `/api/v1/warehouses?name=${form.name}&location=${form.location}&capacity=${form.capacity}`
      );
      setMsg("✅ เพิ่มคลังสำเร็จ!");
      setForm({ name:"", location:"", capacity:"" });
      fetch();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "เกิดข้อผิดพลาด"));
    }
  };

  const del = async (id) => {
    if (!confirm("ยืนยันลบคลังสินค้านี้?")) return;
    try {
      await api.delete(`/api/v1/warehouses/${id}`);
      fetch();
      if (selectedWarehouse?.id === id) {
        setSelectedWarehouse(null);
        setWarehouseItems([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "ลบไม่สำเร็จ");
    }
  };

  const openWarehouse = async (warehouse) => {
    setSelectedWarehouse(warehouse);
    setWarehouseLoading(true);
    try {
      const res = await api.get("/api/v1/inventory");
      setWarehouseItems(res.data.filter(item => item.warehouseName === warehouse.name));
    } catch {
      setWarehouseItems([]);
    } finally {
      setWarehouseLoading(false);
    }
  };

  return (
    <div style={s.layout} className="responsive-page-layout page-layout">
      <Sidebar />
      <div style={s.main} className="responsive-main page-main">
        <h1 style={s.heading}>🏗 คลังสินค้า</h1>

        {/* ฟอร์มเพิ่มคลังสินค้าใหม่ */}
        {canEdit && (
          <form onSubmit={submit} style={s.form}>
            <h3 style={{ color: "#0f172a", margin: "0 0 16px", fontWeight: 700, fontSize: 16 }}>
              ➕ เพิ่มคลังสินค้าใหม่
            </h3>
            
            {/* กล่องข้อความแจ้งเตือนสถานะสำเร็จ/ผิดพลาด */}
            {msg && (
              <div style={{
                padding: "10px 14px", 
                borderRadius: 8, 
                marginBottom: 16,
                fontSize: 14,
                fontWeight: 500,
                background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2",
                color: msg.startsWith("✅") ? "#15803d" : "#ef4444",
                border: `1px solid ${msg.startsWith("✅") ? "#bbf7d0" : "#fecaca"}`
              }}>{msg}</div>
            )}
            
            <div style={s.formRow}>
              <input style={s.input} placeholder="ชื่อคลังสินค้า*" required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} />
              <input style={s.input} placeholder="ที่ตั้ง / ที่อยู่คลัง"
                value={form.location}
                onChange={e => setForm({...form, location: e.target.value})} />
              <input style={s.input} placeholder="ความจุสูงสุด (ชิ้น)" type="number"
                value={form.capacity}
                onChange={e => setForm({...form, capacity: e.target.value})} />
            </div>
            <button style={s.btn} type="submit">➕ บันทึกข้อมูลคลัง</button>
          </form>
        )}

        {/* รายการคลังสินค้าในรูปแบบ Grid Cards มินิมอล */}
        <div style={s.grid}>
          {warehouses.map(w => (
            <div key={w.id} style={{...s.card, cursor: "pointer"}} onClick={() => openWarehouse(w)}>
              <div style={s.cardIcon}>🏗</div>
              <div style={s.cardName}>{w.name}</div>
              <div style={s.cardInfo}>📍 {w.location || "ไม่ระบุที่ตั้ง"}</div>
              <div style={s.cardInfo}>📦 ความจุ: {w.capacity ? `${Number(w.capacity).toLocaleString()} ชิ้น` : "ไม่จำกัดความจุ"}</div>
              <div style={s.cardId}>Warehouse ID: {w.id}</div>
              <button style={s.detailBtn} type="button" onClick={(e) => { e.stopPropagation(); openWarehouse(w); }}>
                ดูสินค้าภายในคลัง
              </button>
              {canDelete && (
                <button style={s.delBtn} onClick={(e) => { e.stopPropagation(); del(w.id); }}>
                  🗑️ ลบคลังนี้
                </button>
              )}
            </div>
          ))}
        </div>

        {selectedWarehouse && (
          <div style={s.detailPanel}>
            <div style={s.detailHeader}>
              <div>
                <h2 style={s.detailTitle}>คลัง: {selectedWarehouse.name}</h2>
                <p style={s.detailSubtitle}>{selectedWarehouse.location || "ไม่ระบุที่ตั้ง"} • ความจุ {selectedWarehouse.capacity ? `${Number(selectedWarehouse.capacity).toLocaleString()} ชิ้น` : "ไม่จำกัด"}</p>
              </div>
              <button style={s.closeBtn} type="button" onClick={() => setSelectedWarehouse(null)}>✕ ปิด</button>
            </div>
            {warehouseLoading ? (
              <div style={s.loadingText}>กำลังโหลดรายการสินค้าภายในคลัง...</div>
            ) : (
              <div style={s.detailTableWrapper}>
                {warehouseItems.length > 0 ? (
                  <table style={s.table}>
                    <thead>
                      <tr style={s.th}>
                        <td style={s.tdth}>สินค้า</td>
                        <td style={s.tdth}>SKU</td>
                        <td style={s.tdth}>สต็อก</td>
                        <td style={s.tdth}>ขั้นต่ำ</td>
                        <td style={s.tdth}>สูงสุด</td>
                        <td style={s.tdth}>สถานะ</td>
                      </tr>
                    </thead>
                    <tbody>
                      {warehouseItems.map(item => (
                        <tr key={item.id} style={s.tr}>
                          <td style={s.td}>{item.productName}</td>
                          <td style={s.td}>{item.productSku}</td>
                          <td style={s.td}>{item.quantity}</td>
                          <td style={s.td}>{item.minStock}</td>
                          <td style={s.td}>{item.maxStock}</td>
                          <td style={s.td}>
                            <span style={{
                              padding: "4px 12px",
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 600,
                              background: item.isLowStock ? "#fef3c7" : "#dcfce7",
                              color: item.isLowStock ? "#b45309" : "#15803d"
                            }}>
                              {item.isLowStock ? "LOW" : "HEALTHY"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={s.emptyText}>ยังไม่มีสินค้าตรงกับคลังนี้</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 จัดชุดสไตล์ Light Mode ระดับพรีเมียม (Premium SaaS System Layout)
const s = {
  layout: { display: "flex", minHeight: "100vh", background: "#f8fafc", color: "#334155", fontFamily: "'Inter', sans-serif" },
  main: { flex: 1, padding: 32, overflowY: "auto" },
  heading: { fontSize: 26, fontWeight: 700, margin: "0 0 24px", color: "#0f172a" },
  
  // กล่องฟอร์มขาวคลีน มีเงาจาง ๆ สบายตา
  form: { background: "#ffffff", padding: 24, borderRadius: 14, marginBottom: 32, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
  formRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 },
  
  // ช่องกรอกข้อมูลสไตล์มินิมอล
  input: { padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#ffffff", color: "#1e293b", fontSize: 14, flex: 1, minWidth: 140, outline: "none" },
  
  // ปุ่มบันทึกสีม่วงน้ำเงินอินดิโก้สุดหรู
  btn: { padding: "11px 24px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, boxShadow: "0 2px 4px rgba(99, 102, 241, 0.2)" },
  detailBtn: { marginTop: 12, padding: "10px 16px", borderRadius: 10, border: "none", background: "#eef2ff", color: "#3730a3", cursor: "pointer", fontSize: 14, fontWeight: 600, boxShadow: "0 2px 4px rgba(15, 23, 42, 0.08)" },
  
  // ระบบจัดวางการ์ดคลังสินค้า
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 },
  
  // การ์ดคลังสินค้าสีขาว ขอบมนพร้อมเงาฟุ้งมิติใหม่
  card: { background: "#ffffff", borderRadius: 14, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)", display: "flex", flexDirection: "column", gap: 8, position: "relative" },
  
  // ปรับแต่งไอคอนประจำการ์ดให้ฝังอยู่ในบล็อกสี่เหลี่ยมมนสีเทาจาง ๆ ดูแพงขึ้นมาก
  cardIcon: { fontSize: 28, background: "#f1f5f9", width: 50, height: 50, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 },
  
  cardName: { fontSize: 16, fontWeight: 700, color: "#0f172a" },
  cardInfo: { fontSize: 13, color: "#475569", fontWeight: 500 },
  cardId: { fontSize: 11, color: "#94a3b8", marginTop: 4, fontWeight: 500 },
  detailPanel: { marginTop: 32, background: "#ffffff", borderRadius: 20, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)" },
  detailHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" },
  detailTitle: { fontSize: 22, fontWeight: 700, margin: 0, color: "#0f172a" },
  detailSubtitle: { margin: 0, fontSize: 14, color: "#64748b" },
  closeBtn: { padding: "8px 14px", borderRadius: 999, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#475569", cursor: "pointer", fontSize: 14 },
  detailTableWrapper: { overflowX: "auto", borderRadius: 16, border: "1px solid #e2e8f0" },
  loadingText: { padding: 28, color: "#64748b", fontSize: 15, textAlign: "center" },
  emptyText: { padding: 28, color: "#64748b", fontSize: 15, textAlign: "center" },
  
  // ปุ่มลบคลังสินค้าพื้นหลังพาสเทลแดงอ่อน สวยงามไม่ฉูดฉาดทำลายสายตา
  delBtn: { marginTop: 12, padding: "8px 12px", borderRadius: 8, border: "1px solid #fee2e2", background: "#fff5f5", color: "#ef4444", fontWeight: 600, cursor: "pointer", fontSize: 13, transition: "background 0.2s" }
};