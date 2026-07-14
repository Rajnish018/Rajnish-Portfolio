import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  FolderKanban,
  MessageSquare,
  Eye,
  ChevronRight,
} from 'lucide-react';

import { Stats, Project, Message } from '../../types';
import { getStatsApi, getProjectsApi, getMessagesApi } from '../../services/apiService';
import Loader from '../../components/Loader'; 
import ProjectSlideshow from '../../components/ProjectSlideshow';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, projectsData, messagesData] = await Promise.all([
          getStatsApi(),
          getProjectsApi(),
          getMessagesApi(),
        ]);

        setStats(statsData);
        
        const extractedProjects = Array.isArray(projectsData) ? projectsData : projectsData?.data || [];
        const extractedMessages = Array.isArray(messagesData) ? messagesData : messagesData?.data || [];

        setRecentProjects(extractedProjects.slice(0, 2));
        setRecentMessages(extractedMessages.slice(0, 5));
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err?.message || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader message="Synchronizing Workspace..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card border-red-500/20 p-6 text-center max-w-md mx-auto my-12">
        <p className="text-red-400 font-medium mb-2">System Error</p>
        <p className="text-white/60 text-sm mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-xs font-semibold transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const safeStats = {
    totalProjects: stats?.totalProjects ?? 0,
    messageCount: stats?.messageCount ?? 0,
    totalViews: stats?.totalViews ?? 0,
    monthlyProjectGrowth: stats?.monthlyProjectGrowth ?? 0,
    pendingMessages: stats?.pendingMessages ?? 0,
    traffic: Array.isArray(stats?.traffic) ? stats.traffic : [],
    storage: {
      used: stats?.storage?.used ?? 0,
      total: stats?.storage?.total ?? 1,
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="glass-card p-8 flex items-center justify-between group hover:border-accent/50 transition-all duration-300"
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

            <div className="p-4 rounded-2xl bg-white/5 text-white/20 group-hover:text-accent group-hover:bg-accent/5 transition-all duration-300">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Traffic Analytics */}
        <div className="lg:col-span-2 glass-card p-8 flex flex-col justify-between">
          <h3 className="text-xl font-display font-bold mb-10">
            Traffic Analytics
          </h3>

          <div className="h-64 flex items-end justify-between gap-2 border-b border-white/5 pb-2">
            {safeStats.traffic.length > 0 ? (
              safeStats.traffic.map((h: number, i: number) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.min(Math.max(h, 5), 100)}%` }}
                  transition={{ duration: 0.8, delay: i * 0.03 }}
                  className="flex-1 bg-accent/20 rounded-t-lg hover:bg-accent/40 transition-colors relative group"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black font-sans font-bold text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-10 whitespace-nowrap">
                    {h} views
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 text-sm italic">
                No traffic metrics captured for this window.
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages & Storage Column */}
        <div className="glass-card p-8 flex flex-col justify-between gap-8">
          <div>
            <h3 className="text-xl font-display font-bold mb-8">
              Recent Messages
            </h3>

            <div className="space-y-6">
              {recentMessages.length > 0 ? (
                recentMessages.map((msg, i) => (
                  <div key={msg._id || i} className="flex gap-4 items-start group">
                    <img
                      src={msg.avatar || `https://i.pravatar.cc/100?u=${msg.email}`}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                      alt={msg.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://i.pravatar.cc/100?u=${msg.email}`;
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-xs font-bold text-white truncate">{msg.name}</p>
                        <span className="text-[9px] text-white/30 whitespace-nowrap">
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </span>
                      </div>

                      <p className="text-[10px] text-white/40 truncate mt-0.5">
                        {msg.message || 'No message content'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center text-white/30 text-sm italic py-4">
                  Inbox is empty.
                </div>
              )}
            </div>
          </div>

          {/* Cloud Storage Track */}
          <div className="border-t border-white/5 pt-6">
            <div className="flex justify-between text-xs text-white/40 mb-2">
              <span>Cloud Storage</span>
              <span className="font-semibold text-white/60">
                {safeStats.storage.used}GB / {safeStats.storage.total}GB
              </span>
            </div>

            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{
                  width: `${Math.min(((safeStats.storage.used / safeStats.storage.total) * 100), 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* UPDATED PROJECTS GRID CONTAINER */}
      <div>
        <h3 className="text-xl font-display font-bold mb-6">Recent Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recentProjects.length > 0 ? (
            recentProjects.map((project) => (
              <div
                key={project._id}
                className="project-card group relative overflow-hidden rounded-3xl aspect-video glass-card border-white/5 cursor-pointer flex flex-col justify-between"
              >
                {/* Viewport Frame with Slideshow */}
                <div className="absolute inset-0 w-full h-full bg-white/5">
                  {project.image && (Array.isArray(project.image) ? project.image.length > 0 : project.image) ? (
                    <ProjectSlideshow
                      images={project.image}
                      alt={project.title}
                      className="opacity-60 group-hover:opacity-30 group-hover:scale-[1.02] transition-all duration-1000 ease-in-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs">
                      No image asset available
                    </div>
                  )}
                </div>

                {/* Ambient Bottom shadow - fades in on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Absolute overlay panel - revealed only on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center z-10 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
                  <div>
                    <span className="text-accent text-[9px] uppercase tracking-[0.2em] font-bold mb-1.5 block">
                      {project.category || 'Web / Custom'}
                    </span>
                    <h4 className="font-bold text-lg text-white font-display tracking-tight">
                      {project.title}
                    </h4>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                    <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 glass-card text-white/30 text-sm italic">
              No portfolio projects found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};