import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { API_URL } from "../api/axios";
import whbg from "../assets/whbg.jpg";

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
        <div style={s.grid}>
          <div style={s.leftPanel}>
            <div style={s.leftBrand}>
              <div style={s.leftBadge}>WMS</div>
              <h1 style={s.leftTitle}>Warehouse Management System</h1>
              <p style={s.leftTag}>ระบบบริหารจัดการคลังสินค้า</p>
              <p style={s.leftText}>จัดการคลังสินค้าอย่างมีประสิทธิภาพ แม่นยำ รวดเร็ว พร้อมเชื่อมต่อกับกระบวนการจัดส่ง</p>
            </div>
            <div style={s.features}>
              <div style={s.featureItem}>
                <div style={s.featureIcon}>📦</div>
                <div>
                  <div style={s.featureLabel}>จัดการสินค้า</div>
                  <div style={s.featureNote}>ติดตามสต็อกสินค้าได้ทันที</div>
                </div>
              </div>
              <div style={s.featureItem}>
                <div style={s.featureIcon}>📋</div>
                <div>
                  <div style={s.featureLabel}>รับ-จ่ายสินค้า</div>
                  <div style={s.featureNote}>ควบคุมการรับจ่ายอย่างแม่นยำ</div>
                </div>
              </div>
              <div style={s.featureItem}>
                <div style={s.featureIcon}>📈</div>
                <div>
                  <div style={s.featureLabel}>รายงาน</div>
                  <div style={s.featureNote}>วิเคราะห์ข้อมูลอย่างลึกซึ้ง</div>
                </div>
              </div>
            </div>
          </div>

          <div style={s.rightPanel}>
            <div style={s.formHeader}>
              <div style={s.formLogo}>🏭</div>
              <h2 style={s.formTitle}>เข้าสู่ระบบ</h2>
              <p style={s.formSub}>กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
            </div>

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

            <button style={s.googleBtn}
              onClick={() => window.location.href = `${API_URL}/oauth2/authorization/google`}>
              <span style={s.googleIcon}>G</span>
              เข้าสู่ระบบด้วย Google
            </button>

            <p style={s.note}>* Login ด้วย Google จะได้สิทธิ์ STAFF</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎨 ชุดแต่งสไตล์หน้า Login สองฝั่งตามภาพ
const s = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0b1224",
    backgroundImage: `linear-gradient(180deg, rgba(11, 18, 36, 0.86), rgba(11, 18, 36, 0.86)), url(${whbg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    fontFamily: "'Inter', sans-serif",
    padding: 24,
    boxSizing: "border-box"
  },
  card: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: 24,
    width: "100%",
    maxWidth: 1120,
    minHeight: 640,
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.25)",
    overflow: "hidden",
    display: "flex"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    width: "100%",
    minHeight: 640
  },
  leftPanel: {
    background: "linear-gradient(180deg, #12224d 0%, #0c1643 100%)",
    color: "#fff",
    padding: "48px 44px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  leftBrand: {
    maxWidth: 420
  },
  leftBadge: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    color: "#87a5ff",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 22
  },
  leftTitle: {
    fontSize: 42,
    lineHeight: 1.05,
    margin: 0,
    marginBottom: 18,
    letterSpacing: "-0.04em"
  },
  leftTag: {
    fontSize: 16,
    margin: 0,
    color: "#d7e0ff",
    marginBottom: 18
  },
  leftText: {
    fontSize: 15,
    lineHeight: 1.8,
    color: "#b8c4e8",
    margin: 0,
    maxWidth: 380
  },
  features: {
    display: "grid",
    gap: 16,
    marginTop: 28
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "18px 20px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.08)"
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    background: "rgba(255,255,255,0.14)",
    display: "grid",
    placeItems: "center",
    fontSize: 18
  },
  featureLabel: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 4
  },
  featureNote: {
    fontSize: 13,
    color: "#c6d1ff"
  },
  rightPanel: {
    background: "#ffffff",
    padding: "48px 44px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  formHeader: {
    textAlign: "center",
    marginBottom: 32
  },
  formLogo: {
    width: 84,
    height: 84,
    margin: "0 auto 18px",
    borderRadius: 28,
    display: "grid",
    placeItems: "center",
    background: "#eef2ff",
    fontSize: 30
  },
  formTitle: {
    margin: 0,
    marginBottom: 10,
    fontSize: 28,
    color: "#0f172a"
  },
  formSub: {
    margin: 0,
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.7
  },
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
    padding: "14px 16px",
    marginBottom: 14,
    borderRadius: 12,
    border: "1px solid #d1d5db",
    background: "#f8fafc",
    color: "#1e293b",
    fontSize: 15,
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s"
  },
  btn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 16,
    boxShadow: "0 12px 24px -12px rgba(37, 99, 235, 0.8)"
  },
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
    padding: 14,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    color: "#334155",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)"
  },
  googleIcon: {
    fontWeight: 800,
    color: "#2563eb",
    marginRight: 10,
    fontSize: 16
  },
  note: { color: "#94a3b8", fontSize: 13, marginTop: 18, fontWeight: 500 }
};