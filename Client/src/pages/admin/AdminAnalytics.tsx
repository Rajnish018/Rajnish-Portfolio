import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BarChart3, Layers, TrendingUp } from "lucide-react";
import { getAnalyticsApi } from "../../services/apiService";

// -----------------------------
// TYPES
// -----------------------------
interface AnalyticsData {
  totalProjects: number;
  totalMessages: number;
  categoryStats: { _id: string; count: number }[];
  monthlyMessages: { _id: number; count: number }[];
}

export const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------
  // FETCH ANALYTICS
  // -----------------------------
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAnalyticsApi();
      setData(res);
    } catch (err: any) {
      console.error("Analytics error:", err);
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // -----------------------------
  // STATES
  // -----------------------------
  if (loading) {
    return (
      <div className="text-center text-white py-20">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-accent text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  // -----------------------------
  // CALCULATIONS
  // -----------------------------
  const maxValue = Math.max(...data.monthlyMessages.map(m => m.count), 1);

  // Better growth logic (month-over-month)
  const last = data.monthlyMessages.at(-1)?.count || 0;
  const prev = data.monthlyMessages.at(-2)?.count || 1;
  const growth = Math.round(((last - prev) / prev) * 100);

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="space-y-12">
      {/* HEADER */}
      <header>
        <h1 className="text-4xl font-display font-bold mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-white/40 text-sm">
          Track performance, growth, and insights
        </p>
      </header>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-8">
        <StatCard
          title="Total Projects"
          value={data.totalProjects}
          icon={<Layers />}
        />
        <StatCard
          title="Total Messages"
          value={data.totalMessages}
          icon={<BarChart3 />}
        />
        <StatCard
          title="Growth"
          value={`${growth}%`}
          icon={<TrendingUp />}
        />
      </div>

      {/* MONTHLY GRAPH */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold mb-6">Monthly Messages</h3>

        {data.monthlyMessages.length === 0 ? (
          <p className="text-white/40 text-sm">No data available</p>
        ) : (
          <div className="h-64 flex items-end gap-3">
            {data.monthlyMessages.map((item, i) => {
              const height = (item.count / maxValue) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    className="w-full bg-accent rounded-t-lg relative group"
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                      {item.count}
                    </div>
                  </motion.div>

                  {/* Month label */}
                  <span className="text-[10px] text-white/40 mt-2">
                    {monthNames[item._id - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CATEGORY BREAKDOWN */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold mb-6">Projects by Category</h3>

        {data.categoryStats.length === 0 ? (
          <p className="text-white/40 text-sm">No category data</p>
        ) : (
          <div className="space-y-4">
            {data.categoryStats.map((cat, i) => (
              <div key={i} className="flex justify-between">
                <span>{cat._id || "Unknown"}</span>
                <span className="text-accent font-bold">{cat.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// -----------------------------
// STAT CARD
// -----------------------------
const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) => (
  <div className="glass-card p-8 flex justify-between items-center">
    <div>
      <p className="text-xs text-white/40">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
    <div className="text-accent">{icon}</div>
  </div>
);