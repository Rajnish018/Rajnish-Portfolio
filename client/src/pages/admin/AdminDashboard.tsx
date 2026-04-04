import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  FolderKanban,
  MessageSquare,
  Eye,
  ChevronRight,
} from 'lucide-react';

import { Stats, Project, Message } from '../../types';
import apiClient from '../../services/apiClient';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes, messagesRes] = await Promise.all([
          apiClient.get('/stats'),
          apiClient.get('/projects'),
          apiClient.get('/messages'),
        ]);

        // console.log("API STATS:", statsRes.data); // debug

        setStats(statsRes.data);
        setRecentProjects(projectsRes.data?.slice(0, 2) || []);
        setRecentMessages(messagesRes.data?.slice(0, 5) || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  if (!stats) {
    return <div className="text-white/40">Loading dashboard...</div>;
  }

  const safeStats = {
    totalProjects: stats.totalProjects ?? 0,
    messageCount: stats.messageCount ?? 0,
    totalViews: stats.totalViews ?? 0,
    monthlyProjectGrowth: stats.monthlyProjectGrowth ?? 0,
    pendingMessages: stats.pendingMessages ?? 0,
    traffic: Array.isArray(stats.traffic) ? stats.traffic : [],
    storage: {
      used: stats.storage?.used ?? 0,
      total: stats.storage?.total ?? 1,
    },
  };

  const statCards = [
    {
      name: 'Total Projects',
      value: safeStats.totalProjects,
      change: `${safeStats.monthlyProjectGrowth} this month`,
      icon: <FolderKanban size={24} />,
    },
    {
      name: 'Message Count',
      value: safeStats.messageCount,
      change: `${safeStats.pendingMessages} pending`,
      icon: <MessageSquare size={24} />,
    },
    {
      name: 'Total Views',
      value: safeStats.totalViews,
      change: 'Live data',
      icon: <Eye size={24} />,
    }
  ];

  return (
    <div className="space-y-12">

      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">
            Workspace Overview
          </h1>
          <p className="text-white/40 text-sm">
            Real-time performance dashboard
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Live Data
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="glass-card p-8 flex items-center justify-between group hover:border-accent/50 transition-colors"
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">
                {stat.name}
              </p>
              <h3 className="text-4xl font-display font-bold mb-2">
                {stat.value}
              </h3>
              <p className="text-xs text-accent">
                {stat.change}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 text-white/20 group-hover:text-accent transition-colors">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Traffic Analytics */}
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-xl font-display font-bold mb-10">
            Traffic Analytics
          </h3>

          <div className="h-64 flex items-end justify-between gap-2">
            {(safeStats.traffic || []).length > 0 ? (
              safeStats.traffic.map((h: number, i: number) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  className="flex-1 bg-accent/20 rounded-t-lg hover:bg-accent/40 transition-colors relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                    {h}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-white/40 text-sm">
                No traffic data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-display font-bold mb-8">
            Recent Messages
          </h3>

          <div className="space-y-6">
            {(recentMessages || []).length > 0 ? (
              recentMessages.map((msg, i) => (
                <div key={i} className="flex gap-4">
                  <img
                    src={msg.avatar || `https://i.pravatar.cc/100?u=${msg.email}`}
                    className="w-10 h-10 rounded-xl"
                    alt={msg.name}
                  />

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-xs font-bold">{msg.name}</p>
                      <span className="text-[10px] text-white/30">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString()
                          : '—'}
                      </span>
                    </div>

                    <p className="text-[10px] text-white/40">
                      {msg.message || 'No message'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/40 text-sm">
                No messages available
              </div>
            )}
          </div>

          {/* Storage */}
          <div className="mt-10">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>Storage</span>
              <span>
                {safeStats.storage?.used ?? 0}GB / {safeStats.storage?.total ?? 1}GB
              </span>
            </div>

            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-secondary"
                style={{
                  width: `${
                    (safeStats.storage?.used ?? 0) /
                    (safeStats.storage?.total ?? 1) * 100
                  }%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {(recentProjects || []).length > 0 ? (
          recentProjects.map((project) => (
            <div key={project._id} className="glass-card overflow-hidden group">
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                  alt={project.title}
                />
              </div>

              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="text-xs text-white/40">
                    {project.category}
                  </p>
                </div>

                <ChevronRight />
              </div>
            </div>
          ))
        ) : (
          <div className="text-white/40 text-sm">
            No projects available
          </div>
        )}
      </div>

    </div>
  );
};
