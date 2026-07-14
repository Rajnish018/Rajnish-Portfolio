import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { resetPasswordApi } from '../../services/apiService';
import { useToast } from '../../contexts/ToastContext';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [isSuccessRedirect, setIsSuccessRedirect] = useState(false); // New state to control exit animation safely
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showToast("Invalid or missing reset token.", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setLoading(true);

    try {
      await resetPasswordApi(token, password);
      
      showToast("Password updated successfully!", "success");
      
      // Stop button spinner, trigger the exit transition layout phase
      setLoading(false);
      setIsSuccessRedirect(true);
      
      // Delay navigation just enough to clear standard framer unmount trees cleanly
      setTimeout(() => {
        navigate('/admin/login');
      }, 1000);

    } catch (error: any) {
      setLoading(false); // Stop loading spinner if database query crashes
      const backendErrorMessage = error?.message || (typeof error === 'string' ? error : "Failed to reset password.");
      showToast(backendErrorMessage, "error");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6 text-center">
        <div className="glass-card p-8 max-w-sm border border-red-500/20">
          <p className="text-red-400 font-bold mb-4">Access Denied</p>
          <p className="text-white/40 text-sm mb-6">This password reset link is invalid or has expired.</p>
          <button onClick={() => navigate('/admin/login')} className="text-xs text-accent uppercase font-bold tracking-widest">Return to Terminal</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isSuccessRedirect ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }} // Smooth fade away on successful redirect
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md glass-card p-10 md:p-16 text-center relative z-10"
      >
        {isSuccessRedirect ? (
          // Custom success transition sequence to prevent default app freezes
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-white/40 text-xs uppercase tracking-widest font-bold">Redirecting to Terminal...</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center mx-auto mb-6 text-accent">
              <ShieldCheck size={24} />
            </div>

            <h1 className="text-3xl font-display font-bold mb-3 tracking-tighter">Forge New Key</h1>
            <p className="text-white/40 text-xs mb-10 uppercase tracking-widest font-medium">Update your administrative access credentials.</p>

            <form onSubmit={handleResetPassword} className="space-y-6 text-left">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">New Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 focus:border-accent focus:bg-white/[0.08] focus:outline-none transition-all"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold ml-1">Confirm New Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-4 focus:border-accent focus:bg-white/[0.08] focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                    Updating Database...
                  </span>
                ) : (
                  <>
                    Update Password 
                    <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};