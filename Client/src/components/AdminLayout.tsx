import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  Plus,
  Expand,
  Mail
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
// Assuming ConfirmModal is imported from the updated file above
import ConfirmModal from './ConfirmModal';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    // Close the modal and perform logout
    setLogoutOpen(false);
    logout();
    navigate('/admin/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      {/* Dynamic Border Color */}
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/admin/analytics' },
    { name: 'Portfolio Manager', icon: <FolderKanban size={20} />, path: '/admin/projects' },
    { name: 'Team', icon: <Users size={20} />, path: '/admin/team' },
    { name: 'Skills', icon: <BarChart3 size={20} />, path: '/admin/skills' },
    { name: 'Experience', icon: <Expand size={20} />, path: '/admin/experience' },
    { name: 'Messages', icon: <Mail size={20} />, path: '/admin/messages' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex text-white font-sans overflow-x-hidden">
      
      {/* Fixed Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 fixed h-full bg-[#050505]/50 backdrop-blur-xl z-50">
        <div className="mb-12">
          {/* Accent Gradient Class */}
          <h1 className="text-xl font-bold tracking-tight accent-gradient">Architect Admin</h1>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1"> R & R Labs</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                location.pathname === item.path
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* Dynamic Icon Color (Normal and Hover) */}
              <span className={`mr-3 transition-colors ${
                location.pathname === item.path ? 'text-accent' : 'text-white/40 group-hover:text-accent'
              }`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto pt-6 space-y-4">
          <button className="w-full py-3 px-4 rounded-xl bg-white text-black text-sm font-bold flex items-center justify-center gap-2 hover:bg-accent hover:text-white transition-all">
            <Plus size={16} />
            New Project
          </button>

          {/* User Profile Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              {/* Avatar uses Accent BG */}
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-white truncate max-w-[100px]">
                  {user?.email?.split("@")[0] || "Admin"}
                </p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest">Admin</p>
              </div>
            </div>

            {/* Logout Trigger Button */}
            <button
              onClick={() => setLogoutOpen(true)}
              // Switched Red Hover to Accent Hover
              className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-accent/10 transition"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-12">
        <Outlet />
      </main>

      {/* Final Modal Call - Centers correctly due to ml-72 */}
      <ConfirmModal
        open={logoutOpen}
        title="Access Termination"
        description="Are you sure you wish to securely log out of the administrative system?"
        confirmText="Confirm Exit"
        cancelText="Return to Admin"
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </div>
  );
};