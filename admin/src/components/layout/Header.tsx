import { useLocation } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext.tsx";

const titleMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard Overview",
  "/admin/users": "User Management",
  "/admin/orders": "Order Management",
  "/admin/food": "Food Catalog Management",
};

export const Header = () => {
  const location = useLocation();
  const { user } = useAuth();

  const title = titleMap[location.pathname] ?? "Super Admin";
  const initials = (user?.email?.slice(0, 2) ?? "AD").toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/85 px-6 py-4 backdrop-blur">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">
          Manage platform operations in one place.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-100"
        >
          <FiBell className="text-lg" />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">Admin</p>
            <p className="text-xs text-slate-500">
              {user?.email ?? "admin@local"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
