import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      const saved = localStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    }
  }, []);

  const login = (tokenVal, username, role) => {
    localStorage.setItem("token", tokenVal);
    localStorage.setItem("user", JSON.stringify({ username, role }));
    setToken(tokenVal);
    setUser({ username, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);