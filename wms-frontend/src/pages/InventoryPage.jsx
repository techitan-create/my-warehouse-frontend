import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function InventoryPage() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    productId: "", warehouseId: "",
    type: "IN", quantity: "", note: ""
  });
  const [msg, setMsg] = useState("");
  const canEdit = ["ADMIN", "MANAGER"].includes(user?.role);

  const fetchInventory = () =>
    api.get("/api/v1/inventory").then(r => setInventory(r.data));

  useEffect(() => { fetchInventory(); }, []);

  const handleMove = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/api/v1/inventory/move", {
        productId: Number(form.productId),
        warehouseId: Number(form.warehouseId),
        type: form.type,
        quantity: Number(form.quantity),
        note: form.note
      });
      setMsg("✅ บันทึกสำเร็จ!");
      setForm({ productId:"", warehouseId:"", type:"IN", quantity:"", note:"" });
      fetchInventory();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "เกิดข้อผิดพลาด"));
    }
  };

  // 🎨 กำหนดชุดสีของแต่ละสถานะให้เข้ากับพื้นหลังสว่างแบบพรีเมียม
  const statusStyle = {
    HEALTHY: { bg: "#dcfce7", text: "#15803d" },   // สีเขียว
    LOW: { bg: "#fef3c7", text: "#b45309" },       // สีส้ม/เหลือง
    CRITICAL: { bg: "#fee2e2", text: "#ef4444" },  // สีแดง
    OVERSTOCK: { bg: "#e0e7ff", text: "#4338ca" }  // สีม่วง/น้ำเงินอินดิโก้
  };

  return (
    <div style={s.layout}>
      <Sidebar />
      <div style={s.main}>
        <h1 style={s.heading}>🏪 จัดการสต็อก</h1>

        {/* ฟอร์มทำรายการ รับ/จ่าย/โอน */}
        {canEdit && (
          <form onSubmit={handleMove} style={s.form}>
            <h3 style={{ color: "#0f172a", margin: "0 0 16px", fontWeight: 700, fontSize: 16 }}>
              📥 รับ / จ่าย / โอนสต็อก
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
              <input style={s.input} placeholder="Product ID*"
                type="number" required value={form.productId}
                onChange={e => setForm({...form, productId: e.target.value})} />
              <input style={s.input} placeholder="Warehouse ID*"
                type="number" required value={form.warehouseId}
                onChange={e => setForm({...form, warehouseId: e.target.value})} />
              <select style={s.select} value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}>
                <option value="IN">📥 IN — รับเข้า</option>
                <option value="OUT">📤 OUT — จ่ายออก</option>
                <option value="TRANSFER">🔄 TRANSFER — โอน</option>
              </select>
              <input style={s.input} placeholder="จำนวน*"
                type="number" required value={form.quantity}
                onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
            <input style={{...s.input, width: "100%", boxSizing: "border-box", marginBottom: 16}}
              placeholder="หมายเหตุเพิ่มเติม" value={form.note}
              onChange={e => setForm({...form, note: e.target.value})} />
            <button style={s.btn} type="submit">💾 บันทึกรายการ</button>
          </form>
        )}

        {/* ตารางข้อมูลสินค้าแบบตีกรอบมนล้อมรอบ */}
        <div style={s.tableContainer}>
          <table style={s.table}>
            <thead>
              <tr style={s.thRow}>
                <th style={s.th}>สินค้า</th>
                <th style={s.th}>SKU</th>
                <th style={s.th}>คลัง</th>
                <th style={s.th}>สต็อก</th>
                <th style={s.th}>ขั้นต่ำ</th>
                <th style={s.th}>สูงสุด</th>
                <th style={s.th}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(i => {
                const status = i.quantity === 0 ? "CRITICAL"
                  : i.isLowStock ? "LOW"
                  : i.quantity >= i.maxStock ? "OVERSTOCK" : "HEALTHY";
                
                return (
                  <tr key={i.id} style={s.trRow}>
                    <td style={s.td}><b>{i.productName}</b></td>
                    <td style={s.td}>{i.productSku}</td>
                    <td style={s.td}>{i.warehouseName}</td>
                    <td style={s.td}>{i.quantity}</td>
                    <td style={s.td}>{i.minStock}</td>
                    <td style={s.td}>{i.maxStock}</td>
                    <td style={s.td}>
                      <span style={{
                        padding: "4px 12px", 
                        borderRadius: 20, 
                        fontSize: 12,
                        fontWeight: 600,
                        background: statusStyle[status].bg,
                        color: statusStyle[status].text
                      }}>{status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 🎨 จัดชุดโครงสร้างธีม Light Mode พรีเมียมซอฟต์แวร์
const s = {
  layout: { display: "flex", minHeight: "100vh", background: "#f8fafc", color: "#334155", fontFamily: "'Inter', sans-serif" },
  main: { flex: 1, padding: 32, overflowY: "auto" },
  heading: { fontSize: 26, fontWeight: 700, margin: "0 0 24px", color: "#0f172a" },
  
  // ปรับฟอร์มเป็นกล่องขาวคลีน มีเงาจางๆ สไตล์โมเดิร์น
  form: { background: "#ffffff", padding: 24, borderRadius: 14, marginBottom: 32, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
  formRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 },
  
  // ปรับช่อง Input & Select เป็นสีขาวขอบเทา ตัวหนังสือเข้มอ่านง่าย
  input: { padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#ffffff", color: "#1e293b", fontSize: 14, flex: 1, minWidth: 140, outline: "none" },
  select: { padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#ffffff", color: "#1e293b", fontSize: 14, flex: 1, minWidth: 140, outline: "none", cursor: "pointer" },
  
  // ปุ่มบันทึกสีม่วงน้ำเงินสว่างสดใส (Premium Indigo)
  btn: { padding: "11px 24px", borderRadius: 8, border: "none", background: "#6366f1", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, boxShadow: "0 2px 4px rgba(99, 102, 241, 0.2)" },
  
  // ตารางแบบตีกรอบล้อมรอบมนสไตล์ Enterprise SaaS
  tableContainer: { background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { background: "#f1f5f9" },
  th: { padding: "14px 16px", color: "#475569", fontSize: 13, textAlign: "left", fontWeight: 600 },
  trRow: { borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" },
  td: { padding: "14px 16px", fontSize: 14, color: "#334155" }
};