import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Changed to framer-motion for consistency
import { Lock, Mail, ArrowRight, Home, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { forgotPasswordApi } from '../../services/apiService';
import { LoadingScreen } from '@/src/components/UI';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // New state for post-login transition
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email, password });

      // Show toast first
      showToast("Login successful!", "success");

      // Stop button spinner
      setLoading(false);

      // Let user see toast
      await new Promise(resolve => setTimeout(resolve, 700));

      // Show loading screen
      setIsRedirecting(true);

      // Navigate
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);

    } catch (err: any) {
      setLoading(false);
      showToast(err.message || "Login failed. Please check your credentials.", "error");
    }
  };

  const handleSendResetLink = async () => {
    if (!resetEmail.trim()) {
      showToast("Please enter your admin email.", "error");
      return;
    }

    setResetLoading(true);

    try {
      const response = await forgotPasswordApi(resetEmail.trim());

      showToast(response.message || "Reset link has been sent successfully.", "success");
      setResetEmail("");
      setShowForgot(false);
    } catch (error: any) {

      const backendErrorMessage = error?.message || (typeof error === 'string' ? error : "Failed to send reset link.");

      showToast(backendErrorMessage, "error");
    } finally {
      setResetLoading(false);
    }
  };

  // If we are in the redirecting phase, show the high-end loading screen
  if (isRedirecting) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent/10 blur-[120px] rounded-full" />

      <div className="absolute top-8 left-8 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-bold group"
        >
          <Home size={16} className="mr-2 group-hover:-translate-y-0.5 transition-transform" />
          Return to Home
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md glass-card p-10 md:p-16 text-center relative z-10"
      >
        <h1 className="text-4xl font-display font-bold mb-4 tracking-tighter">Admin Login</h1>
        <p className="text-white/40 text-sm mb-12 uppercase tracking-widest font-medium">Welcome back, Architect.</p>

        <form onSubmit={handleLogin} className="space-y-8 text-left">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Email Access</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@labs.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-4 focus:border-accent focus:bg-white/[0.08] focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Security Key</label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-[10px] uppercase tracking-widest text-accent font-bold hover:text-white transition-colors"
              >
                Forgot?
              </button>
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 focus:border-accent focus:bg-white/[0.08] focus:outline-none transition-all placeholder:text-white/10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="group w-full py-5 bg-accent text-white rounded-xl font-bold uppercase tracking-[0.2em] flex items-center justify-center hover:bg-accent/80 active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(124,58,237,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/10 font-bold italic">Secure Encrypted Session</p>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgot && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgot(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm relative z-[110] shadow-2xl"
            >
              <h2 className="text-xl font-display font-bold mb-2">Reset Password</h2>
              <p className="text-sm text-white/40 mb-8 leading-relaxed">
                Instructions will be sent to your registered administrative email.
              </p>

              <div className="relative mb-8">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-accent outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSendResetLink}
                  disabled={resetLoading}
                  className="w-full py-3 rounded-xl bg-accent text-white text-sm font-bold uppercase tracking-widest hover:bg-accent/80 transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </button>
                <button
                  onClick={() => setShowForgot(false)}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs uppercase tracking-widest font-bold transition-all text-white/40"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};