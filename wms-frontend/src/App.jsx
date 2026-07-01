import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import InventoryPage from "./pages/InventoryPage";
import WarehousesPage from "./pages/WarehousesPage";
import UsersPage from "./pages/UsersPage";
import OAuth2Callback from "./pages/OAuth2Callback";

function ProtectedRoute({ children, roles }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role))
    return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth2/callback" element={<OAuth2Callback />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/products" element={
          <ProtectedRoute><ProductsPage /></ProtectedRoute>} />
        <Route path="/inventory" element={
          <ProtectedRoute><InventoryPage /></ProtectedRoute>} />
        <Route path="/warehouses" element={
          <ProtectedRoute><WarehousesPage /></ProtectedRoute>} />
        <Route path="/users" element={
          <ProtectedRoute roles={["ADMIN"]}>
            <UsersPage />
          </ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function Root() {
  return <AuthProvider><App /></AuthProvider>;
}