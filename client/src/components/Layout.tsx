import React, { useState,useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Menu, X  ,Twitter, Linkedin, Instagram,Github} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  const isAdmin = location.pathname.startsWith('/admin');

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Mobile Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  if (isAdmin) return null;

  const navLinks = [
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const containerVars = {
    initial: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const linkVars = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 10, opacity: 0 }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 transition-all duration-500 ease-in-out flex items-center justify-between ${
        scrolled 
          ? 'py-4 backdrop-blur-xl bg-black/40 border-b border-white/10' 
          : 'py-7 bg-transparent border-b border-transparent'
      }`}
    >
      {/* Logo - Higher Z-Index */}
      <Link 
        to="/" 
        className="text-xl md:text-2xl font-display font-bold accent-gradient z-70 relative"
      >
        R & R Labs
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-10">
        {navLinks.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-all hover:text-accent ${
              location.pathname === item.path ? 'text-accent' : 'text-white/40'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Right Side Actions - Higher Z-Index */}
      <div className="flex items-center gap-3 md:gap-5 z-70 relative">
        <Link 
          to={user ? "/admin/dashboard" : "/admin/login"} 
          className="flex items-center gap-2 p-1 pl-3 rounded-full border border-white/10 hover:border-accent/50 bg-white/5 transition-all group"
        >
          {user && (
            <span className="hidden sm:block text-[9px] font-bold uppercase tracking-widest text-accent">
              {user.name.split(' ')[0]}
            </span>
          )}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            user ? 'bg-accent text-white' : 'bg-white/10 text-white/60 group-hover:text-white'
          }`}>
            <User size={16} />
          </div>
        </Link>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white hover:text-accent transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 h-dvh w-full bg-black/95 backdrop-blur-2xl z-60 flex flex-col p-8 md:hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
            
            <motion.div 
              variants={containerVars}
              initial="initial"
              animate="animate"
              exit="initial"
              className="flex flex-col h-full pt-24 relative z-10"
            >
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-10">Navigation</p>
                
                <div className="flex flex-col space-y-8">
                  {navLinks.map((item) => (
                    <motion.div key={item.name} variants={linkVars}>
                      <Link
                        to={item.path}
                        className={`text-5xl font-display font-bold block transition-all ${
                          location.pathname === item.path ? 'text-accent translate-x-2' : 'text-white hover:text-accent'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div variants={linkVars} className="border-t border-white/10 pt-8 pb-4">
                 <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-6">Socials</p>
                 <div className="flex gap-8">
                    <Twitter size={22} className="text-white/40 hover:text-accent transition-colors" />
                    <Linkedin size={22} className="text-white/40 hover:text-accent transition-colors" />
                    <Instagram size={22} className="text-white/40 hover:text-accent transition-colors" />
                 </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};



export const Footer: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <footer className="px-6 py-10 md:py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8">
        
        {/* Left - Copyright */}
        <div className="text-white/20 text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-center md:text-left leading-loose">
          © 2026 R & R Labs <span className="hidden md:inline">|</span> <br className="md:hidden" /> 
          Built for Creatives & Designers
        </div>

        {/* Right - Socials */}
        <div className="flex items-center gap-8">
          {[
            { icon: <Twitter size={18} />, link: "#" },
            { icon: <Linkedin size={18} />, link: "#" },
            { icon: <Instagram size={18} />, link: "#" },
            { icon: <Github size={18} />, link: "https://github.com/Rajnish018" } // Added GitHub here
          ].map((social, i) => (
            <a
              key={i}
              href={social.link}
              className="text-white/30 hover:text-accent transition-all duration-300 hover:scale-110 relative group"
            >
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">{social.icon}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};