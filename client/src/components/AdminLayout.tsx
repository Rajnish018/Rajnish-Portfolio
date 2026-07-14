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
  Mail,
  Link2,
  Menu, // Mobile menu trigger
  X     // Mobile close trigger
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import ConfirmModal from './ConfirmModal';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); 
  const { user, loading, logout } = useAuth();

  // Close mobile sidebar automatically on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    setLogoutOpen(false);
    logout();
    navigate('/admin/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
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
    { name: 'Links', icon: <Link2 size={20} />, path: '/admin/links' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  // Flexbox container inside guarantees footers stay glued to the bottom layout boundary
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Top Header Row */}
      <div className="mb-12 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight accent-gradient">Architect Admin</h1>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">R & R Labs</p>
        </div>
        {/* Mobile close button inside the sidebar drawer */}
        <button 
          onClick={() => setMobileOpen(false)} 
          className="lg:hidden p-2 rounded-xl text-white/40 hover:text-white bg-white/5"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation - flex-1 and min-h-0 container handles all variable viewports safely */}
      <nav className="flex-1 space-y-2 overflow-y-auto pr-1 min-h-0">
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
            <span className={`mr-3 transition-colors ${
              location.pathname === item.path ? 'text-accent' : 'text-white/40 group-hover:text-accent'
            }`}>
              {item.icon}
            </span>
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions Area - Sealed to baseline with mt-auto & shrink-0 */}
      <div className="mt-auto pt-6 space-y-4 shrink-0 bg-[#050505]">
        {/* User Profile Card */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3">
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

          <button
            onClick={() => setLogoutOpen(true)}
            className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-accent/10 transition"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] flex text-white font-sans overflow-x-hidden">
      
      {/* Mobile Top Navbar Header (Visible only on screens below 'lg') */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-bold tracking-tight accent-gradient">Architect Admin</h1>
        </div>
        <button 
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-white/60 hover:text-white bg-white/5"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Sidebar Slide-out Drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop overlay */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={() => setMobileOpen(false)}
        />
        {/* Drawer container */}
        <aside className={`absolute top-0 bottom-0 left-0 w-72 max-w-[80vw] border-r border-white/5 flex flex-col p-8 bg-[#050505] transition-transform duration-300 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent />
        </aside>
      </div>

      {/* Desktop Sidebar Layout (Hidden on screens below 'lg') */}
      <aside className="hidden lg:flex w-72 border-r border-white/5 flex flex-col p-8 fixed h-full bg-[#050505]/50 backdrop-blur-xl z-30">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 p-6 md:p-12 pt-24 lg:pt-12 transition-all">
        <Outlet />
      </main>

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