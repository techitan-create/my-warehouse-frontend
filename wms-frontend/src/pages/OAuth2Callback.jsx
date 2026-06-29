import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuth2Callback() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");
    const username = params.get("username");

if (token && role) {
  login(token, username || "Google User", role);
  navigate("/dashboard", { replace: true });
}
  }, []);

  return (
    <div style={{
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      minHeight:"100vh", background:"#0f0f1a", color:"#fff"
    }}>
      <div style={{ fontSize:48, marginBottom:16 }}>⏳</div>
      <div style={{ fontSize:18 }}>กำลังเข้าสู่ระบบ...</div>
    </div>
  );
}