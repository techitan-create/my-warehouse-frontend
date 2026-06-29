import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function DashboardPage() {
  const { user } = useAuth();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.get("/api/v1/inventory/health")
      .then(r => setHealth(r.data))
      .catch(() => {});
  }, []);

  // ปรับเฉดสีตัวเลขตัวใหญ่ให้อ่านง่ายและโมเดิร์นขึ้นบนพื้นหลังขาว
  const scoreColor = !health ? "#64748b"
    : health.healthScore >= 80 ? "#22c55e" 
    : health.healthScore >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div style={s.layout}>
      <Sidebar />
      <div style={s.main}>
        <h1 style={s.heading}>📊 Dashboard</h1>
        <p style={s.sub}>ยินดีต้อนรับ {user?.username} ({user?.role})</p>

        {health && (
          <>
            {/* โซนคะแนน Health Score */}
            <div style={s.scoreBox}>
              <div style={{...s.score, color: scoreColor}}>
                {health.healthScore}
              </div>
              <div style={s.scoreLabel}>Health Score</div>
            </div>

            {/* โซนการ์ดสรุปจำนวน */}
            <div style={s.cards}>
              <StatCard label="สินค้าทั้งหมด" value={health.totalProducts} color="#6366f1" icon="📦" />
              <StatCard label="ปกติ" value={health.healthyCount} color="#22c55e" icon="✅" />
              <StatCard label="สต็อกต่ำ" value={health.lowStockCount} color="#f59e0b" icon="⚠️" />
              <StatCard label="สต็อกหมด" value={health.criticalCount} color="#ef4444" icon="⛔" />
            </div>

            {/* โซนตารางรายการสินค้าที่ต้องระวัง */}
            <h2 style={s.tableTitle}>🚨 รายการที่ต้องระวัง</h2>
            <div style={s.tableContainer}>
              <table style={s.table}>
                <thead>
                  <tr style={s.th}>
                    <td style={s.tdth}>สินค้า</td>
                    <td style={s.tdth}>SKU</td>
                    <td style={s.tdth}>คลัง</td>
                    <td style={s.tdth}>สต็อก</td>
                    <td style={s.tdth}>ขั้นต่ำ</td>
                    <td style={s.tdth}>สถานะ</td>
                  </tr>
                </thead>
                <tbody>
                  {health.items
                    .filter(i => i.status !== "HEALTHY")
                    .map((i, idx) => (
                    <tr key={idx} style={s.tr}>
                      <td style={s.td}>{i.productName}</td>
                      <td style={s.td}>{i.productSku}</td>
                      <td style={s.td}>{i.warehouseName}</td>
                      <td style={s.td}>{i.quantity}</td>
                      <td style={s.td}>{i.minStock}</td>
                      <td style={s.td}>
                        <span style={{
                          padding: "4px 12px", 
                          borderRadius: 20, 
                          fontSize: 12,
                          fontWeight: 500,
                          background: i.status === "CRITICAL" ? "#fee2e2" : i.status === "LOW" ? "#fef3c7" : "#dcfce7",
                          color: i.status === "CRITICAL" ? "#ef4444" : i.status === "LOW" ? "#b45309" : "#15803d"
                        }}>{i.message}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// คอมโพเนนต์การ์ดแบบขาวคลีนตัดขอบเทาบางๆ มีมิติเงาซอฟท์ๆ
function StatCard({ label, value, color, icon }) {
  return (
    <div style={{ 
      background: "#ffffff", 
      padding: 20, 
      borderRadius: 14,
      textAlign: "center", 
      minWidth: 130,
      flex: 1,
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)"
    }}>
      <div style={{fontSize: 28, marginBottom: 4}}>{icon}</div>
      <div style={{fontSize: 30, fontWeight: 700, color}}>{value}</div>
      <div style={{color: "#64748b", fontSize: 13, marginTop: 4, fontWeight: 500}}>{label}</div>
    </div>
  );
}

// 🎨 ปรับเปลี่ยนชุดสีของสไตล์ชีททั้งหมดให้เป็นคลีนโทนขาวสว่าง
const s = {
  layout: { display: "flex", minHeight: "100vh", background: "#f8fafc", color: "#334155", fontFamily: "'Inter', sans-serif" },
  main: { flex: 1, padding: 32, overflowY: "auto" },
  heading: { fontSize: 26, fontWeight: 700, margin: "0 0 4px", color: "#0f172a" },
  sub: { color: "#64748b", margin: "0 0 24px", fontSize: 14 },
  scoreBox: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center",    
    gap: "4px",              
    marginBottom: 24 
  },
  score: { 
    fontSize: 64, 
    fontWeight: 800, 
    lineHeight: 1            
  },
  scoreLabel: { color: "#64748b", fontSize: 13, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" },
  cards: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 },
  tableTitle: { fontSize: 18, fontWeight: 700, margin: "0 0 12px", color: "#0f172a" },
  
  // ครอบตารางให้มีขอบมนและเส้นขอบสวยงามแบบระเบียบระบบ SaaS 
  tableContainer: { background: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#f1f5f9", color: "#475569", fontWeight: 600 },
  tdth: { padding: "12px 16px", fontSize: 13, textAlign: "left" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "14px 16px", fontSize: 14, color: "#334155" }
};