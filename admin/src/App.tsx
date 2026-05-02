import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.tsx";
import { AdminLayout } from "./components/layout/AdminLayout.tsx";
import { AdminLogin } from "./pages/AdminLogin.tsx";
import { DashboardOverview } from "./pages/DashboardOverview.tsx";
import { UserManagement } from "./pages/UserManagement.tsx";
import { OrderManagement } from "./pages/OrderManagement.tsx";
import { FoodCatalogManagement } from "./pages/FoodCatalogManagement.tsx";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="food" element={<FoodCatalogManagement />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

export default App;
