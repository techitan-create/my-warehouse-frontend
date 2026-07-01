import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  const fetch = () => api.get("/api/v1/auth/users").then(r => setUsers(r.data));
  useEffect(() => { fetch(); }, []);

  const changeRole = async (username, role) => {
    await api.put(`/api/v1/auth/users/${username}/role?role=${role}`);
    fetch();
  };

  // 🎨 กำหนดเฉดสีระดับความสำคัญของสิทธิ์ (Role) ให้ชัดเจนอ่านง่ายบนพื้นหลังสว่าง
  const roleStyle = { 
    ADMIN: { bg: "#fee2e2", text: "#ef4444" },     // สีแดงสดใส
    MANAGER: { bg: "#fef3c7", text: "#b45309" },   // สีส้ม/เหลืองอำพัน
    STAFF: { bg: "#dcfce7", text: "#15803d" }      // สีเขียว
  };

  return (
    <div style={s.layout} className="responsive-page-layout page-layout">
      <Sidebar />
      <div style={s.main} className="responsive-main page-main">
        <h1 style={s.heading}>👥 จัดการบัญชีผู้ใช้</h1>
        
        {/* กล่องครอบตารางสไตล์ Enterprise ซอฟต์แวร์ */}
        <div style={s.tableContainer}>
          <table style={s.table}>
            <thead>
              <tr style={s.th}>
                <td style={s.tdth}>ID</td>
                <td style={s.tdth}>Username</td>
                <td style={s.tdth}>Email</td>
                <td style={s.tdth}>Role ปัจจุบัน</td>
                <td style={s.tdth}>ปรับเปลี่ยนสิทธิ์</td>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={s.tr}>
                  <td style={s.td}>{u.id}</td>
                  <td style={{...s.td, fontWeight: 600, color: "#0f172a"}}>{u.username}</td>
                  <td style={s.td}>{u.email}</td>
                  <td style={s.td}>
                    <span style={{
                      padding: "4px 12px", 
                      borderRadius: 20, 
                      fontSize: 12,
                      fontWeight: 600,
                      background: roleStyle[u.role]?.bg || "#f1f5f9", 
                      color: roleStyle[u.role]?.text || "#475569"
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={s.td}>
                    <select
                      value={u.role}
                      onChange={e => changeRole(u.username, e.target.value)}
                      style={s.select}>
                      <option value="ADMIN">👑 ADMIN</option>
                      <option value="MANAGER">💼 MANAGER</option>
                      <option value="STAFF">🛠️ STAFF</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 🎨 ชุดแต่งสไตล์คลีน (Light UI Design System)
const s = {
  layout: { display: "flex", minHeight: "100vh", background: "#f8fafc", color: "#334155", fontFamily: "'Inter', sans-serif" },
  main: { flex: 1, padding: 32, overflowY: "auto" },
  heading: { fontSize: 26, fontWeight: 700, margin: "0 0 24px", color: "#0f172a" },
  
  // ตีกรอบมนให้ตารางดูแยกเป็นสัดส่วน ลอยขึ้นมาจากพื้นหลังเล็กน้อยด้วย Shadow
  tableContainer: { background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#f1f5f9" },
  tdth: { padding: "14px 16px", color: "#475569", fontSize: 13, textAlign: "left", fontWeight: 600 },
  tr: { borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" },
  td: { padding: "14px 16px", fontSize: 14, color: "#334155" },
  
  // ตกแต่ง Dropdown เลือกสิทธิ์ให้ออกมินิมอล มีไอคอนอีโมจินำหน้าใน Option
  select: { 
    padding: "6px 12px", 
    borderRadius: 8, 
    border: "1px solid #cbd5e1",
    background: "#ffffff", 
    color: "#1e293b", 
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    outline: "none",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    transition: "border-color 0.2s"
  }
};