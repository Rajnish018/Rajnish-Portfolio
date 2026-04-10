import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Upload, Link as LinkIcon, 
  Image as ImageIcon, Save, Loader2, Sparkles,
  GripVertical, CheckCircle2, AlertCircle,
  ChevronDown, Check
} from 'lucide-react';
import { useToast } from '@/src/contexts/ToastContext';
import { deleteLinkApi, getSettingsApi, updateSettingsApi } from '../../services/apiService';

interface SocialLink {
  _id?: string; 
  platform: string;
  url: string;
}

// --- FLOATING DROPDOWN COMPONENT ---
const PlatformDropdown = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Input Trigger */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full border-b border-white/10 py-3 text-sm cursor-pointer flex justify-between items-center group transition-all hover:border-accent/50"
      >
        <span className={`transition-colors font-medium ${value ? "text-white" : "text-white/20"}`}>
          {value || "Select Platform"}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          className="text-white/20 group-hover:text-accent"
        >
          <ChevronDown size={14} />
        </motion.div>
      </div>

      {/* Floating Menu - Only scrolls internally */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute left-0 top-full mt-2 w-full bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_25px_50px_rgba(0,0,0,0.8)] z-[999] backdrop-blur-xl overflow-hidden"
          >
            <div className="max-h-56 overflow-y-auto custom-scrollbar py-2">
              {options.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-all flex justify-between items-center
                    ${value === opt 
                      ? "bg-accent text-white" 
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  {opt}
                  {value === opt && <Check size={12} strokeWidth={3} />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PLATFORM_OPTIONS = [
  "GitHub", "LinkedIn", "Twitter", "Instagram", "Facebook",
  "YouTube", "Portfolio", "LeetCode", "Dribbble", "Custom"
];

export const AdminLinks: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadIdentity = async () => {
      try {
        const data = await getSettingsApi();
        setLinks(data.links || []);
        setProfilePhoto(data.profilePhoto?.url || null);
      } catch (err) {
        showToast("Database connection error", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadIdentity();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 2 * 1024 * 1024) return showToast("File too large (>2MB)", "error");
    setSelectedFile(file);
    setProfilePhoto(URL.createObjectURL(file));
  };

  const addLink = () => setLinks([...links, { platform: '', url: '' }]);
  
  const removeLink = async (index: number, linkId?: string) => {
    if (!linkId) {
      setLinks(links.filter((_, i) => i !== index));
      return;
    }
    try {
      const res = await deleteLinkApi(linkId);
      setLinks(res.links);
      showToast("Link deleted", "success");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("links", JSON.stringify(links));
    if (selectedFile) formData.append("image", selectedFile);

    try {
      await updateSettingsApi(formData);
      showToast("Identity updated successfully", "success");
      setSelectedFile(null);
    } catch (err) {
      showToast("Update failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-accent" size={32} />
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">Establishing Secure Link...</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 glass-card border-none bg-white/5">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2">Social Identity</h1>
          <p className="text-white/40 text-sm">Update your brand mark and global social endpoints.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save All Changes
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Profile Image Section */}
        <section className="lg:col-span-4 space-y-6">
          <div className="glass-card p-8 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-8 text-left">Brand Mark</p>
            <div className="relative inline-block">
              <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 relative z-10">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon size={40} className="text-white/5" /></div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-3 -right-3 z-20 p-4 bg-white text-bg rounded-2xl shadow-2xl hover:bg-accent hover:text-white transition-all scale-90 hover:scale-100"
              >
                <Upload size={18} />
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
            <div className="mt-8">
              <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                <CheckCircle2 size={12} className="text-green-500" /> Cloud Optimized
              </div>
            </div>
          </div>
        </section>

        {/* Links Management Section */}
        <section className="lg:col-span-8">
          <div className="glass-card flex flex-col h-full overflow-visible">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Active Routers</h2>
              </div>
              <button 
                onClick={addLink}
                className="text-[10px] font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                + New Endpoint
              </button>
            </div>

            {/* overflow-x-visible ensures the dropdown can extend beyond the card border */}
            <div className="p-8 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar !overflow-x-visible">
              <AnimatePresence mode='popLayout'>
                {links.map((link, i) => (
                  <motion.div 
                    key={link._id || `new-${i}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-4 items-center group bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-accent/30 transition-all shadow-sm relative z-[unset]"
                  >
                    <div className="p-2 text-white/5 group-hover:text-white/20 cursor-grab">
                      <GripVertical size={18} />
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <PlatformDropdown
                        value={link.platform}
                        options={PLATFORM_OPTIONS}
                        onChange={(val) => updateLink(i, "platform", val)}
                      />
                      <div className="relative">
                        <input 
                          value={link.url}
                          onChange={(e) => updateLink(i, 'url', e.target.value)}
                          className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-sm focus:border-accent outline-none transition-colors placeholder:text-white/10"
                          placeholder="Destination URL (https://...)"
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => removeLink(i, link._id)}
                      className="p-4 text-white/10 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {links.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl text-white/20 text-[10px] uppercase tracking-widest font-bold">
                  No active social endpoints
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};