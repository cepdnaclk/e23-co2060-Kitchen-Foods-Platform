import { Outlet } from "react-router-dom";
import { Header } from "./Header.tsx";
import { Sidebar } from "./Sidebar.tsx";

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
