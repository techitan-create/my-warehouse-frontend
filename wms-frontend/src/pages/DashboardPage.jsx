import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function DashboardPage() {
  const { user } = useAuth();
  const [health, setHealth] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    api.get("/api/v1/inventory/health")
      .then(r => setHealth(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formatter.format(new Date()));
  }, []);

  const scoreColor = !health ? "#64748b"
    : health.healthScore >= 80 ? "#22c55e" 
    : health.healthScore >= 50 ? "#f59e0b" : "#ef4444";
  const healthScorePercent = health ? Math.min(Math.max(health.healthScore, 0), 100) : 0;
  const scoreStatus = !health ? "กำลังโหลด" : health.healthScore >= 80 ? "แข็งแรง" : health.healthScore >= 50 ? "ต้องระวัง" : "วิกฤติ";
  const scoreCircleStyle = {
    width: 150,
    height: 150,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: `conic-gradient(${scoreColor} 0% ${healthScorePercent}%, #e2e8f0 ${healthScorePercent}% 100%)`,
    boxShadow: "inset 0 0 0 18px rgba(255,255,255,0.85), 0 20px 40px rgba(15, 23, 42, 0.08)",
  };

  const alertItems = health?.items?.filter(i => i.status !== "HEALTHY") || [];
  const totalLowStock = health?.lowStockCount ?? 0;
  const totalCritical = health?.criticalCount ?? 0;

  return (
    <div style={s.layout} className="responsive-page-layout page-layout">
      <Sidebar />
      <div style={s.main} className="responsive-main page-main">
        <div style={s.headerRow}>
          <div>
            <h1 style={s.heading}>ยินดีต้อนรับ, {user?.username} ({user?.role}) 👋</h1>
            <p style={s.subSmall}>ภาพรวมการบริหารจัดการคลังสินค้า</p>
          </div>
          <div style={s.topControls} className="responsive-top-controls">
            <div style={s.dateChip} className="responsive-date-chip">{currentDate || "กำลังโหลดวันที่..."}</div>
          </div>
        </div>

        {health && (
          <>
            <div style={s.cards}>
              <StatCard label="สินค้าทั้งหมด" value={health.totalProducts} color="#4338ca" icon="📦" />
              <StatCard label="ปกติ" value={health.healthyCount} color="#16a34a" icon="✅" />
              <StatCard label="สต็อกต่ำ" value={totalLowStock} color="#d97706" icon="⚠️" />
              <StatCard label="สินค้าหมด" value={totalCritical} color="#b91c1c" icon="⛔" />
            </div>
            <div style={s.pageCard}>
              <div style={s.topGrid}>
                <div style={s.healthCard}>
                  <div style={s.healthCardLabel}>Health Score</div>
                  <div style={s.healthScoreRow}>
                    <div style={scoreCircleStyle}>
                      <div style={s.scoreLabel}>{healthScorePercent}%</div>
                    </div>
                    <div style={s.healthMeta}>
                      <div style={s.healthMetaLabel}>คะแนนรวมคลัง</div>
                      <div style={s.healthMetaValue}>{health.items?.length ?? 0} สินค้า</div>
                      <div style={s.healthStatus}>{scoreStatus}</div>
                      <div style={s.healthTrendBar}>
                        <div style={{...s.healthTrendFill, width: `${healthScorePercent}%`, background: scoreColor}} />
                      </div>
                    </div>
                  </div>
                </div>
                <div style={s.overviewGrid}>
                  <OverviewCard label="สินค้าทั้งหมด" value={health.totalProducts} icon="📦" color="#6366f1" />
                  <OverviewCard label="ปกติ" value={health.healthyCount} icon="✅" color="#22c55e" />
                  <OverviewCard label="สต็อกต่ำ" value={totalLowStock} icon="⚠️" color="#f59e0b" />
                  <OverviewCard label="สินค้าหมด" value={totalCritical} icon="⛔" color="#ef4444" />
                </div>
              </div>
            </div>

            <div style={s.bottomGrid} className="responsive-bottom-grid">
              <div style={s.tablePanel}>
                <div style={s.sectionHeader}>
                  <div>
                    <div style={s.sectionTitle}>รายการที่ต้องระวัง</div>
                    <div style={s.sectionSubtitle}>แสดงสินค้าที่มีสต็อกต่ำหรือหมด</div>
                  </div>
                  <button style={s.linkButton}>ดูทั้งหมด</button>
                </div>
                <div style={s.tableContainer} className="responsive-table-wrapper">
                  <table style={s.table}>
                    <thead>
                      <tr style={s.th}>
                        <td style={s.tdth}>สินค้า</td>
                        <td style={s.tdth}>SKU</td>
                        <td style={s.tdth}>คลัง</td>
                        <td style={s.tdth}>สต็อก</td>
                        <td style={s.tdth}>สถานะ</td>
                      </tr>
                    </thead>
                    <tbody>
                      {alertItems.map((i, idx) => (
                        <tr key={idx} style={s.tr}>
                          <td style={s.td}>{i.productName}</td>
                          <td style={s.td}>{i.productSku}</td>
                          <td style={s.td}>{i.warehouseName}</td>
                          <td style={s.td}>{i.quantity}</td>
                          <td style={s.td}>
                            <span style={s.badge(i.status)}>{i.message}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={s.sidePanel}>
                <div style={s.miniCard}>
                  <div style={s.miniCardTitle}>สินค้าแบ่งตามสถานะ</div>
                  <div style={s.statusRow}>
                    <div style={s.statusItem}>
                      <div style={s.statusDot("#22c55e")}/>
                      <div>
                        <div style={s.statusLabel}>ปกติ</div>
                        <div style={s.statusValue}>{health.healthyCount}</div>
                      </div>
                    </div>
                    <div style={s.statusItem}>
                      <div style={s.statusDot("#f59e0b")}/>
                      <div>
                        <div style={s.statusLabel}>สต็อกต่ำ</div>
                        <div style={s.statusValue}>{totalLowStock}</div>
                      </div>
                    </div>
                    <div style={s.statusItem}>
                      <div style={s.statusDot("#ef4444")}/>
                      <div>
                        <div style={s.statusLabel}>หมด</div>
                        <div style={s.statusValue}>{totalCritical}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={s.miniCard}>
                  <div style={s.miniCardTitle}>เคลื่อนไหวล่าสุด</div>
                  <div style={s.recentList}>
                    {alertItems.slice(0, 4).map((i, idx) => (
                      <div key={idx} style={s.recentItem}>
                        <div style={s.recentDot} />
                        <div>
                          <div style={s.recentName}>{i.productName}</div>
                          <div style={s.recentMeta}>{i.warehouseName} · {i.quantity} ชิ้น</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// คอมโพเนนต์การ์ดแบบขาวคลีนตัดขอบเทาบางๆ มีมิติเงาซอฟท์ๆ
function OverviewCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
      border: "1px solid #eef2ff"
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#475569", marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>{value}</div>
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(99, 102, 241, 0.08)", display: "grid", placeItems: "center", color, fontSize: 18 }}>
        {icon}
      </div>
    </div>
  );
}

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

// 🎨 ปรับเปลี่ยนชุดสีของสไตล์ชีททั้งหมดให้เป็นคลีนโทนระบบ Dashboard แบบใหม่
const s = {
  layout: { display: "flex", minHeight: "100vh", background: "#eef3fb", color: "#334155", fontFamily: "'Inter', sans-serif" },
  main: { flex: 1, padding: 32, overflowY: "auto", minHeight: "100vh" },
  headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 28 },
  heading: { fontSize: 28, fontWeight: 800, margin: 0, color: "#0f172a" },
  subSmall: { color: "#64748b", margin: "8px 0 0", fontSize: 14 },
  topControls: { display: "flex", alignItems: "center", gap: 12 },
  dateChip: { padding: "10px 18px", borderRadius: 999, background: "#ffffff", border: "1px solid #dbeafe", color: "#1d4ed8", fontWeight: 600, fontSize: 14, boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)" },
  alertRow: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18, marginBottom: 28 },
  alertCard: { background: "#ffffff", borderRadius: 20, padding: 24, border: "1px solid #e2e8f0", boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)", minHeight: 140 },
  alertTitle: { fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" },
  alertNumber: { fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8 },
  alertCaption: { fontSize: 13, color: "#475569" },
  pageCard: { background: "#ffffff", borderRadius: 28, padding: 28, border: "1px solid #eef2ff", boxShadow: "0 26px 60px rgba(15, 23, 42, 0.08)", marginBottom: 28 },
  topGrid: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18, marginBottom: 28 },
  overviewGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 },
  watchlistHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 20, flexWrap: "wrap" },
  watchlistTitle: { fontSize: 18, fontWeight: 700, color: "#0f172a" },
  watchlistSubtitle: { fontSize: 13, color: "#64748b" },
  viewAllButton: { padding: "10px 16px", borderRadius: 999, border: "1px solid #dbeafe", background: "#ffffff", color: "#2563eb", fontWeight: 700, cursor: "pointer" },
  summaryGrid: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 18, marginBottom: 28 },
  healthCard: { background: "#ffffff", borderRadius: 24, padding: 28, border: "1px solid #e2e8f0", boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)" },
  healthCardLabel: { fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" },
  healthScoreRow: { display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" },
  score: { fontSize: 72, fontWeight: 800, lineHeight: 1, minWidth: 96 },
  scoreLabel: { fontSize: 32, fontWeight: 800, color: "#0f172a" },
  healthMeta: { display: "grid", gap: 10 },
  healthMetaLabel: { fontSize: 13, color: "#64748b" },
  healthMetaValue: { fontSize: 18, fontWeight: 700, color: "#0f172a" },
  healthStatus: { fontSize: 13, fontWeight: 700, color: "#475569", marginTop: 10 },
  healthTrendBar: { width: 220, height: 10, borderRadius: 999, background: "#e2e8f0", marginTop: 12, overflow: "hidden" },
  healthTrendFill: { height: "100%", borderRadius: 999 },
  cards: { display: "flex", gap: 16, flexWrap: "wrap" },
  bottomGrid: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 },
  tablePanel: { background: "#ffffff", borderRadius: 24, padding: 24, boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)", border: "1px solid #e2e8f0" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 700, margin: 0, color: "#0f172a" },
  sectionSubtitle: { fontSize: 13, color: "#64748b", marginTop: 4 },
  linkButton: { padding: "10px 16px", borderRadius: 999, border: "1px solid #c7d2fe", background: "#eef2ff", color: "#3730a3", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  tableContainer: { overflow: "hidden", borderRadius: 18, border: "1px solid #e2e8f0" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#f8fafc", color: "#475569", fontWeight: 700 },
  tdth: { padding: "14px 18px", fontSize: 13, textAlign: "left" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "16px 18px", fontSize: 14, color: "#334155" },
  badge: status => ({
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background: status === "CRITICAL" ? "#fee2e2" : status === "LOW" ? "#fef3c7" : "#dcfce7",
    color: status === "CRITICAL" ? "#b91c1c" : status === "LOW" ? "#92400e" : "#166534"
  }),
  sidePanel: { display: "grid", gap: 18 },
  miniCard: { background: "#ffffff", borderRadius: 24, padding: 24, boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)", border: "1px solid #e2e8f0" },
  miniCardTitle: { fontSize: 15, fontWeight: 700, marginBottom: 18, color: "#0f172a" },
  statusRow: { display: "grid", gap: 12 },
  statusItem: { display: "flex", alignItems: "center", gap: 12 },
  statusDot: color => ({ width: 12, height: 12, borderRadius: "50%", background: color, flexShrink: 0 }),
  statusLabel: { fontSize: 13, color: "#64748b", marginBottom: 2 },
  statusValue: { fontSize: 18, fontWeight: 700, color: "#0f172a" },
  recentList: { display: "grid", gap: 14 },
  recentItem: { display: "flex", alignItems: "flex-start", gap: 12 },
  recentDot: { width: 10, height: 10, borderRadius: "50%", background: "#2563eb", marginTop: 6, flexShrink: 0 },
  recentName: { fontSize: 14, fontWeight: 700, margin: 0, color: "#0f172a" },
  recentMeta: { fontSize: 13, color: "#64748b", marginTop: 2 },
  popup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    maxWidth: 520,
    marginBottom: 28,
    padding: "16px 20px",
    borderRadius: 18,
    background: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.25)",
    color: "#0f172a",
    transition: "opacity 0.25s ease, transform 0.25s ease",
    boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)",
  },
  popupContent: { display: "grid", gap: 4 },
  popupTitle: { fontSize: 14, fontWeight: 700, color: "#1d4ed8" },
  popupText: { fontSize: 13, color: "#475569" },
  popupClose: {
    background: "transparent",
    border: "none",
    color: "#2563eb",
    fontWeight: 700,
    cursor: "pointer",
    padding: "8px 10px",
    borderRadius: 999,
    transition: "background 0.2s ease",
  }
};