import { useEffect, useState } from "react";
import {
  FiPackage,
  FiShoppingCart,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { Table } from "../components/ui/Table.tsx";
import { adminApi } from "../services/adminApi.ts";
import type { ActivityEvent, DashboardStats } from "../types/index.ts";

const statCards = [
  { key: "totalUsers", label: "Total Users", icon: FiUsers },
  { key: "activeChefs", label: "Active Chefs", icon: FiTrendingUp },
  { key: "totalOrders", label: "Total Orders", icon: FiShoppingCart },
  { key: "totalFoodItems", label: "Total Food Items", icon: FiPackage },
] as const;

export const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeChefs: 0,
    totalOrders: 0,
    totalFoodItems: 0,
  });
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverview = async () => {
      setLoading(true);

      try {
        // TODO: Wire up Axios call here (dashboard overview fetch)
        const data = await adminApi.getDashboardOverview();
        setStats(data.stats);
        setActivities(data.activities.slice(0, 5));
      } catch {
        const fallback = adminApi.getMockDashboardData();
        setStats(fallback.stats);
        setActivities(fallback.activities.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    void loadOverview();
  }, []);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.key}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  {card.label}
                </span>
                <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <Icon />
                </span>
              </div>
              <p className="text-3xl font-semibold text-slate-900">
                {loading ? "..." : stats[card.key].toLocaleString()}
              </p>
            </article>
          );
        })}
      </div>

      <div>
        <h3 className="mb-3 text-lg font-semibold text-slate-900">
          Recent Activity
        </h3>
        <Table
          columns={[
            { key: "action", header: "Action", render: (row) => row.action },
            { key: "actor", header: "Actor", render: (row) => row.actor },
            { key: "target", header: "Target", render: (row) => row.target },
            {
              key: "time",
              header: "When",
              render: (row) => (
                <span className="text-slate-500">{row.timestamp}</span>
              ),
            },
          ]}
          rows={activities}
          rowKey={(row) => row.id}
          pageSize={5}
          emptyMessage="No recent activities found."
        />
      </div>
    </section>
  );
};
