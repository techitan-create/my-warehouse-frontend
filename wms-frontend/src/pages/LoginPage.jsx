import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { API_URL } from "../api/axios";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/v1/auth/login", form);
      login(res.data.token, res.data.username, res.data.role);
      navigate("/dashboard");
    } catch {
      setError("Username หรือ Password ไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🏭</div>
        <h1 style={s.title}>WMS Login</h1>
        <p style={s.sub}>Warehouse Management System</p>
        
        {/* กล่องแจ้งเตือน Error แบบ Light Mode คลีนๆ */}
        {error && <div style={s.error}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <input style={s.input} placeholder="Username"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})} required />
          <input style={s.input} type="password" placeholder="Password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} required />
          
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? "กำลังเข้าสู่ระบบ..." : "🔐 เข้าสู่ระบบ"}
          </button>
        </form>
        
        <div style={s.divider}>
          <span style={s.dividerLine}></span>
          <span style={{ padding: "0 10px" }}>หรือ</span>
          <span style={s.dividerLine}></span>
        </div>
        
        {/* ปุ่มล็อกอิน Google สไตล์โมเดิร์นคลีน */}
        <button style={s.googleBtn}
          onClick={() => window.location.href = `${API_URL}/oauth2/authorization/google`}>
          <span style={s.googleIcon}>G</span>
          เข้าสู่ระบบด้วย Google
        </button>
        
        <p style={s.note}>* Login ด้วย Google จะได้สิทธิ์ STAFF</p>
      </div>
    </div>
  );
}

// 🎨 ชุดแต่งสไตล์แบบสว่างระดับ Premium SaaS Product
const s = {
  page: { 
    minHeight: "100vh", 
    display: "flex", 
    alignItems: "center",
    justifyContent: "center", 
    background: "#f8fafc", 
    backgroundImage: "url('../assets/whbg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fontFamily: "'Inter', sans-serif",
    position: "relative"
  },
  card: { 
    background: "rgba(255,255,255,0.92)", 
    padding: "40px 32px", 
    borderRadius: 16, 
    width: 360,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)", 
    border: "1px solid rgba(226, 232, 240, 0.9)",
    textAlign: "center",
    position: "relative",
    zIndex: 1
  },
  logo: { fontSize: 44, marginBottom: 12 },
  title: { color: "#0f172a", margin: "0 0 6px", fontSize: 24, fontWeight: 700 },
  sub: { color: "#64748b", margin: "0 0 28px", fontSize: 14, fontWeight: 500 },
  
  error: { 
    background: "#fee2e2", 
    border: "1px solid #fecaca", 
    color: "#ef4444",
    padding: "10px 14px", 
    borderRadius: 8, 
    marginBottom: 16, 
    fontSize: 13,
    fontWeight: 500 
  },
  input: { 
    width: "100%", 
    padding: "12px 14px", 
    marginBottom: 14, 
    borderRadius: 8,
    border: "1px solid #cbd5e1", 
    background: "#ffffff", 
    color: "#1e293b",
    fontSize: 14, 
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s"
  },
  btn: { 
    width: "100%", 
    padding: 12, 
    borderRadius: 8, 
    border: "none",
    background: "#6366f1", // สีม่วงอินดิโก้ สวยเด่นกระแทกตา
    color: "#fff", 
    fontSize: 15, 
    fontWeight: 600,
    cursor: "pointer", 
    marginBottom: 8,
    boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.2)"
  },
  
  // เส้นคั่นกลางสวยๆ สไตล์เว็บสากลนิยม
  divider: { 
    color: "#94a3b8", 
    margin: "20px 0", 
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e2e8f0"
  },
  
  googleBtn: { 
    width: "100%", 
    padding: 12, 
    borderRadius: 8, 
    border: "1px solid #e2e8f0",
    background: "#ffffff", 
    color: "#334155", 
    fontSize: 14, 
    fontWeight: 600,
    cursor: "pointer",
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
  },
  googleIcon: {
    fontWeight: 800,
    color: "#ea4335", // เปลี่ยนเป็นสีแดง Google ให้สะดุดตาเล็กน้อย
    marginRight: 8,
    fontSize: 16
  },
  note: { color: "#94a3b8", fontSize: 12, marginTop: 20, fontWeight: 500 }
};