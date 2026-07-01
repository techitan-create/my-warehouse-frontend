import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name:"", sku:"", price:"", description:"", minStock:0, maxStock:9999 });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const canEdit = ["ADMIN","MANAGER"].includes(user?.role);
  const canDelete = user?.role === "ADMIN";

  const fetch = () => api.get(`/api/v1/products?search=${search}&size=50`)
    .then(r => setProducts(r.data.content));

  useEffect(() => { fetch(); }, [search]);

  const submit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/api/v1/products/${editId}`, form);
    else await api.post("/api/v1/products", form);
    setForm({ name:"", sku:"", price:"", description:"", minStock:0, maxStock:9999 });
    setEditId(null);
    fetch();
  };

  const del = async (id) => {
    if (!confirm("ยืนยันลบ?")) return;
    await api.delete(`/api/v1/products/${id}`);
    fetch();
  };

  return (
    <div style={s.layout} className="responsive-page-layout page-layout">
      <Sidebar />
      <div style={s.main} className="responsive-main page-main">
        <h1 style={s.heading}>📦 จัดการสินค้า</h1>

        {/* แผงฟอร์ม เพิ่ม/แก้ไข สินค้า */}
        {canEdit && (
          <form onSubmit={submit} style={s.form}>
            <h3 style={{ color: "#0f172a", margin: "0 0 16px", fontWeight: 700, fontSize: 16 }}>
              {editId ? "✏️ แก้ไขข้อมูลสินค้า" : "➕ เพิ่มสินค้าใหม่"}
            </h3>
            <div style={s.formRow}>
              <input style={s.input} placeholder="ชื่อสินค้า*" required
                value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              <input style={s.input} placeholder="SKU*" required
                value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})}
                disabled={!!editId} />
              <input style={s.input} placeholder="ราคา*" type="number" required
                value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
              <input style={s.input} placeholder="สต็อกขั้นต่ำ (minStock)" type="number"
                value={form.minStock} onChange={e=>setForm({...form,minStock:e.target.value})} />
            </div>
            <input style={{...s.input, width:"100%", boxSizing:"border-box", marginBottom: 16}}
              placeholder="คำอธิบายรายละเอียดสินค้า"
              value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
            
            <div style={{display:"flex", gap:10}}>
              <button style={s.btn} type="submit">
                {editId ? "💾 บันทึกการเปลี่ยนแปลง" : "➕ เพิ่มสินค้าเข้าสู่ระบบ"}
              </button>
              {editId && (
                <button style={s.btnGray} type="button"
                  onClick={() => { setEditId(null); setForm({ name:"", sku:"", price:"", description:"", minStock:0, maxStock:9999 }); }}>
                  ❌ Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* ช่องค้นหาสินค้าดีไซน์พรีเมียมกว้างเต็มจอ */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <input style={s.searchInput}
            placeholder="🔍 ค้นหาด้วยชื่อสินค้า หรือ SKU..."
            value={search} onChange={e=>setSearch(e.target.value)} />
        </div>

        {/* ตารางข้อมูลสินค้าแบบตีกรอบล้อมรอบมน */}
        <div style={s.tableContainer} className="responsive-table-wrapper">
          <table style={s.table} className="responsive-table">
            <thead>
              <tr style={s.thRow}>
                <th style={s.tdth}>ID</th>
                <th style={s.tdth}>SKU</th>
                <th style={s.tdth}>ชื่อสินค้า</th>
                <th style={s.tdth}>ราคา</th>
                <th style={s.tdth}>สถานะ</th>
                {canEdit && <th style={{...s.tdth, textAlign: "center"}}>จัดการ</th>}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={s.trRow}>
                  <td style={s.td}>{p.id}</td>
                  <td style={{...s.td, fontWeight: 600, color: "#475569"}}>{p.sku}</td>
                  <td style={s.td}><b>{p.name}</b></td>
                  <td style={{...s.td, fontWeight: 600, color: "#0f172a"}}>{p.price.toLocaleString()} ฿</td>
                  <td style={s.td}>
                    <span style={{
                      padding: "4px 12px", 
                      borderRadius: 20, 
                      fontSize: 12,
                      fontWeight: 600,
                      background: p.status === "ACTIVE" ? "#dcfce7" : "#fee2e2",
                      color: p.status === "ACTIVE" ? "#15803d" : "#ef4444"
                    }}>
                      {p.status}
                    </span>
                  </td>
                  {canEdit && (
                    <td style={{...s.td, textAlign: "center"}}>
                      <button style={s.btnActionEdit} title="แก้ไข" onClick={() => {
                        setEditId(p.id);
                        setForm({ name:p.name, sku:p.sku, price:p.price,
                          description:p.description||"", minStock:p.minStock||0, maxStock:p.maxStock||9999 });
                      }}>✏️ แก้ไข</button>
                      
                      {canDelete && (
                        <button style={s.btnActionDelete} title="ลบ"
                          onClick={() => del(p.id)}>🗑️ ลบ</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 🎨 ชุดแต่งสไตล์สว่าง (Light UI Blueprint) เข้าเซ็ตกับหน้าอื่นๆ
const s = {
  layout: { display:"flex", minHeight:"100vh", background:"#f8fafc", color:"#334155", fontFamily:"'Inter', sans-serif" },
  main: { flex:1, padding:32, overflowY:"auto" },
  heading: { fontSize:26, fontWeight: 700, margin:"0 0 24px", color: "#0f172a" },
  
  // กล่องฟอร์มขาวมน เงาซอฟต์
  form: { background:"#ffffff", padding:24, borderRadius:14, marginBottom:24, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
  formRow: { display:"flex", gap:12, flexWrap:"wrap", marginBottom:12 },
  
  // อินพุตกรอกข้อมูลสีขาวขอบเทา
  input: { padding:"10px 14px", borderRadius:8, border:"1px solid #cbd5e1", background:"#ffffff", color:"#1e293b", fontSize:14, minWidth:150, flex:1, outline: "none" },
  
  // ช่องค้นหาขนาดใหญ่แบบโดดเด่น
  searchInput: { width:"100%", padding:"12px 16px", borderRadius:10, border:"1px solid #cbd5e1", background:"#ffffff", color:"#1e293b", fontSize:14, boxSizing:"border-box", outline: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  
  // ปุ่มหลักสีกรมท่า/ม่วงอินดิโก้สุดพรีเมียม
  btn: { padding:"11px 24px", borderRadius:8, border:"none", background:"#6366f1", color:"#fff", cursor:"pointer", fontSize:14, fontWeight:600, boxShadow: "0 2px 4px rgba(99, 102, 241, 0.2)" },
  btnGray: { padding:"11px 20px", borderRadius:8, border:"1px solid #cbd5e1", background:"#f1f5f9", color:"#475569", cursor:"pointer", fontSize:14, fontWeight: 500 },
  
  // ปุ่มแอ็กชันในตาราง (แก้ไข / ลบ) แบบเป็นระเบียบเรียบร้อย ไม่ฉูดฉาดเกินไป
  btnActionEdit: { padding:"5px 12px", borderRadius:6, border:"1px solid #e0e7ff", background:"#f5f3ff", color:"#6366f1", cursor:"pointer", marginRight:8, fontSize:13, fontWeight: 500 },
  btnActionDelete: { padding:"5px 12px", borderRadius:6, border:"1px solid #fee2e2", background:"#fff5f5", color:"#ef4444", cursor:"pointer", fontSize:13, fontWeight: 500 },
  
  // ตารางควบคุมกรอบมนระเบียบ SaaS Enterprise
  tableContainer: { background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
  table: { width:"100%", borderCollapse:"collapse" },
  thRow: { background: "#f1f5f9" },
  tdth: { padding: "14px 16px", color: "#475569", fontSize: 13, textAlign: "left", fontWeight: 600 },
  trRow: { borderBottom:"1px solid #f1f5f9" },
  td: { padding:"14px 16px", fontSize:14, color:"#334155" }
};