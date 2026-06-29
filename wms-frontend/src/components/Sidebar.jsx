import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate("/login"); };

  const roleColor = { ADMIN: "#ff4444", MANAGER: "#f0a500", STAFF: "#4caf50" };

  const menus = [
    { path: "/dashboard", icon: "📊", label: "Dashboard", roles: ["ADMIN","MANAGER","STAFF"] },
    { path: "/products",  icon: "📦", label: "สินค้า",    roles: ["ADMIN","MANAGER","STAFF"] },
    { path: "/inventory", icon: "🏪", label: "สต็อก",     roles: ["ADMIN","MANAGER","STAFF"] },
    { path: "/warehouses",icon: "🏗",  label: "คลังสินค้า",roles: ["ADMIN","MANAGER","STAFF"] },
    { path: "/users",     icon: "👥", label: "จัดการ User",roles: ["ADMIN"] },
  ];

  return (
    <div style={styles.sidebar}>
      <div>
        <h2 style={styles.logo}>🏭 WMS</h2>
        <nav>
          {menus
            .filter(m => m.roles.includes(user?.role))
            .map(m => (
              <div key={m.path}
                onClick={() => navigate(m.path)}
                style={{
                  ...styles.navItem,
                  background: location.pathname === m.path ? "#6c63ff" : "transparent",
                  color: location.pathname === m.path ? "#fff" : "#ccc"
                }}>
                {m.icon} {m.label}
              </div>
            ))}
        </nav>
      </div>
      <div style={styles.userBox}>
        <span style={{ ...styles.badge, background: roleColor[user?.role] }}>
          {user?.role}
        </span>
        <div style={styles.username}>{user?.username}</div>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 ออกจากระบบ
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 220, 
    // 💡 ตั้งค่าภาพพื้นหลังพร้อมทำเอฟเฟกต์สีเข้มทับให้รูปดูจางลง
    // หากต้องการให้รูปชัดขึ้น ให้ลดเลข 0.92 และ 0.95 ลง (เช่น 0.85)
    backgroundImage: `
      linear-gradient(rgba(30, 30, 46, 0.92), rgba(30, 30, 46, 0.95)), 
      url('/warehouse-bg.jpg')
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    
    padding: 20,
    display: "flex", flexDirection: "column",
    justifyContent: "space-between", minHeight: "100vh"
  },
  logo: { color: "#6c63ff", marginBottom: 24, fontSize: 22 },
  navItem: {
    padding: "10px 14px", borderRadius: 8, cursor: "pointer",
    marginBottom: 4, fontSize: 14, transition: "all 0.2s"
  },
  userBox: { borderTop: "1px solid #333", paddingTop: 16 },
  badge: {
    display: "inline-block", padding: "3px 10px",
    borderRadius: 20, fontSize: 11, fontWeight: 600, marginBottom: 6
  },
  username: { color: "#aaa", fontSize: 13, marginBottom: 10 },
  logoutBtn: {
    width: "100%", padding: 8, borderRadius: 8,
    border: "1px solid #555", background: "transparent",
    color: "#ff6b6b", cursor: "pointer", fontSize: 13, transition: "all 0.2s"
  }
};