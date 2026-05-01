import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiLogOut,
  FiPackage,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.tsx";

const navItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: FiGrid },
  { label: "Users", to: "/admin/users", icon: FiUsers },
  { label: "Orders", to: "/admin/orders", icon: FiShoppingCart },
  { label: "Food Catalog", to: "/admin/food", icon: FiPackage },
];

export const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-64 border-r border-slate-200 bg-white/95 px-4 py-6 shadow-sm backdrop-blur">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
          KF
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Super Admin</h1>
          <p className="text-xs text-slate-500">Kitchen Foods Platform</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon className="text-base" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-8 flex w-full items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
      >
        <FiLogOut className="text-base" />
        Logout
      </button>
    </aside>
  );
};
