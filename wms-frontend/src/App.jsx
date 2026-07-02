import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import InventoryPage from "./pages/InventoryPage";
import WarehousesPage from "./pages/WarehousesPage";
import UsersPage from "./pages/UsersPage";
import OAuth2Callback from "./pages/OAuth2Callback";
import { Pointer } from "./components/ui/pointer";

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
          <ProtectedRoute><Pointer><DashboardPage /></Pointer></ProtectedRoute>} />
        <Route path="/products" element={
          <ProtectedRoute><Pointer><ProductsPage /></Pointer></ProtectedRoute>} />
        <Route path="/inventory" element={
          <ProtectedRoute><Pointer><InventoryPage /></Pointer></ProtectedRoute>} />
        <Route path="/warehouses" element={
          <ProtectedRoute><Pointer><WarehousesPage /></Pointer></ProtectedRoute>} />
        <Route path="/users" element={
          <ProtectedRoute roles={["ADMIN"]}>
            <Pointer><UsersPage /></Pointer>
          </ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function Root() {
  return <AuthProvider><App /></AuthProvider>;
}
