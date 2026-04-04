import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/src/contexts/ToastContext';
import {
  Plus, Save, Trash2, Layout, Database, X, Edit2, Check,
  FolderPlus, Loader2, Palette, Code, Smartphone, Cloud, HelpCircle
} from 'lucide-react';
import {
  addCategoryApi,
  addSkillToCategoryApi,
  deleteCategoryApi,
  deleteSkillApi,
  getSkillsApi,
  updateSkillInCategoryApi,
  updateSkillsApi
} from '@/src/services/apiService';
import ConfirmModal from '../../components/ConfirmModal';

const ICON_OPTIONS = [
  { id: 'layout', icon: Layout },
  { id: 'database', icon: Database },
  { id: 'palette', icon: Palette },
  { id: 'code', icon: Code },
  { id: 'smartphone', icon: Smartphone },
  { id: 'cloud', icon: Cloud },
];

const COLOR_OPTIONS = [
  { id: 'emerald', hex: '#10b981', border: 'border-emerald-500/30', hoverBorder: 'hover:border-emerald-400', accent: 'text-accent', bg: 'bg-accent/10', glow: 'hover:shadow-[0_0_30px_-5px_rgba(var(--accent-rgb),0.15)]' },
  { id: 'blue', hex: '#3b82f6', border: 'border-blue-500/30', hoverBorder: 'hover:border-blue-400', accent: 'text-blue-500', bg: 'bg-blue-500/10', glow: 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]' },
  { id: 'purple', hex: '#a855f7', border: 'border-purple-500/30', hoverBorder: 'hover:border-purple-400', accent: 'text-purple-500', bg: 'bg-purple-500/10', glow: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)]' },
  { id: 'rose', hex: '#f43f5e', border: 'border-rose-500/30', hoverBorder: 'hover:border-rose-400', accent: 'text-rose-500', bg: 'bg-rose-500/10', glow: 'hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.15)]' },
  { id: 'amber', hex: '#f59e0b', border: 'border-amber-500/30', hoverBorder: 'hover:border-amber-400', accent: 'text-amber-500', bg: 'bg-amber-500/10', glow: 'hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)]' },
];

export const AdminSkills: React.FC = () => {
  const { showToast } = useToast();
  const [skills, setSkills] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ name: '', icon: 'layout', color: 'emerald' });
  const [editingPos, setEditingPos] = useState<{ catId: string; idx: number } | null>(null);
  const [deleteCatTarget, setDeleteCatTarget] = useState<{ id: string, name: string } | null>(null);
  const [newSkillData, setNewSkillData] = useState({ name: "", level: 50 });

  useEffect(() => {
    let isMounted = true;
    const fetchSkills = async () => {
      try {
        const res = await getSkillsApi();
        if (isMounted) setSkills(res.categories);
      } catch {
        showToast("Failed to fetch skills", "error");
      }
    };
    fetchSkills();
    return () => { isMounted = false; };
  }, [showToast]);

  // Updated to handle both name and level updates
  const syncSkillUpdate = async (categoryId: string, skill: any) => {
    if (!skill._id) return;
    try {
      const res = await updateSkillInCategoryApi(categoryId, skill._id, { 
        name: skill.name, 
        level: skill.level 
      });
      if (res.categories) setSkills(res.categories);
      showToast("Skill updated", "success");
    } catch {
      showToast("Sync failed", "error");
    }
  };

  const handleBulkSave = async () => {
    if (!skills) return;
    setIsSaving(true);
    try {
      const updated = await updateSkillsApi({ categories: skills });
      setSkills(updated.categories);
      showToast("All changes saved", "success");
      setEditingPos(null);
    } catch {
      showToast("Bulk save failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateSkill = async (categoryId: string) => {
    if (!newSkillData.name.trim()) return showToast("Name required", "error");
    try {
      const updated = await addSkillToCategoryApi(categoryId, newSkillData);
      setSkills(updated.categories);
      setEditingPos(null);
      setNewSkillData({ name: "", level: 50 });
      showToast("Skill added", "success");
    } catch { showToast("Failed to add", "error"); }
  };

  const handleteleteSkill = async (categoryId: string, skillId: string) => {
    try {
      const updated = await deleteSkillApi(categoryId, skillId);
      setSkills(updated.categories);
      showToast("Skill removed", "success");
    } catch { showToast("Failed to remove", "error"); }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCatTarget) return;
    setIsSaving(true);
    try {
      const updated = await deleteCategoryApi(deleteCatTarget.id);
      setSkills(updated.categories);
      showToast("Category removed", "success");
    } catch { showToast("Failed to remove", "error"); }
    finally { setIsSaving(false); setDeleteCatTarget(null); }
  };

  const addNewCategory = async () => {
    const { name, icon, color } = modalData;
    if (!name.trim()) return showToast("Name required", "error");
    try {
      setIsSaving(true);
      const updated = await addCategoryApi(name, { icon, color });
      setSkills(updated.categories);
      setShowModal(false);
      setModalData({ name: "", icon: "layout", color: "emerald" });
      showToast("Category added", "success");
    } catch { showToast("Failed to add category", "error"); }
    finally { setIsSaving(false); }
  };

  if (!skills) return <div className="p-20 text-center text-white/10 animate-pulse font-display">Initializing Interface...</div>;

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-3xl gap-6">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-2">Skill Management Interface</h2>
          <h1 className="text-4xl font-display font-bold mb-4 tracking-tight">Update Expert Skills</h1>
          <p className="text-white/40 text-sm max-w-2xl leading-relaxed">Manage technical proficiency levels via secure ID-based mapping.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={() => setShowModal(true)} className="flex-1 md:flex-none flex items-center justify-center px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
            <FolderPlus size={16} className="mr-2" /> New Category
          </button>
          <button onClick={handleBulkSave} disabled={isSaving} className="flex-1 md:flex-none flex items-center justify-center px-8 py-4 bg-accent text-white rounded-2xl font-bold uppercase tracking-[0.15em] text-[10px] hover:opacity-90 transition-all hover:scale-[1.02] shadow-[0_10px_40px_-10px_rgba(var(--accent-rgb),0.5)]">
            {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />} Save Changes
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch w-full">
        {skills.map((category, index) => (
          <CategoryBlock key={category._id || index} category={category} isFirst={index === 0} />
        ))}
      </div>

      {/* New Category Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-display font-bold">New Category</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={20} className="text-white/20 hover:text-white" />
                </button>
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/30 ml-2">Display Name</label>
                  <input autoFocus className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-colors text-sm" placeholder="e.g., Frontend Development" value={modalData.name} onChange={(e) => setModalData({ ...modalData, name: e.target.value })} />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-white/30 ml-2">Visual Icon</label>
                  <div className="grid grid-cols-6 gap-3">
                    {ICON_OPTIONS.map((opt) => (
                      <button key={opt.id} onClick={() => setModalData({ ...modalData, icon: opt.id })} className={`p-4 rounded-2xl border transition-all flex items-center justify-center ${modalData.icon === opt.id ? 'bg-accent border-accent text-white' : 'bg-white/5 border-white/5 text-white/20 hover:text-white hover:border-white/20'}`}>
                        <opt.icon size={18} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-white/30 ml-2">Theme Color</label>
                  <div className="flex gap-4">
                    {COLOR_OPTIONS.map((col) => (
                      <button key={col.id} onClick={() => setModalData({ ...modalData, color: col.id })} className={`w-10 h-10 rounded-full border-4 transition-all ${modalData.color === col.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`} style={{ backgroundColor: col.hex }} />
                    ))}
                  </div>
                </div>

                <button onClick={addNewCategory} className="w-full py-5 bg-accent hover:opacity-90 text-white rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] shadow-xl transition-all">Create Category</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!deleteCatTarget}
        title="Remove Category"
        description={`This will permanently delete ${deleteCatTarget?.name} and all associated skills.`}
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteCatTarget(null)}
      />
    </div>
  );

  function CategoryBlock({ category, isFirst }: any) {
    const { _id: catId, categoryName, items, config } = category;
    const theme = COLOR_OPTIONS.find(c => c.id === config.color) || COLOR_OPTIONS[0];
    const IconTag = ICON_OPTIONS.find(i => i.id === config.icon)?.icon || HelpCircle;

    return (
      <div className={`glass-card border border-white/5 border-l-4 ${theme.border} ${theme.hoverBorder} ${theme.glow} group/card transition-all duration-500 rounded-[2.5rem] bg-white/[0.01] w-full h-full flex flex-col ${isFirst ? 'p-10 shadow-[0_20px_60px_-20px_rgba(var(--accent-rgb),0.2)]' : 'p-8'}`}>
        
        <div className={`flex justify-between items-center ${isFirst ? 'mb-10' : 'mb-8'}`}>
          <div className="flex items-center gap-5">
            <div className={`rounded-2xl ${theme.bg} ${theme.accent} ${isFirst ? 'p-5' : 'p-4'}`}>
              <IconTag size={isFirst ? 24 : 18} />
            </div>
            <h3 className={`font-display font-bold capitalize tracking-tight ${isFirst ? 'text-2xl' : 'text-lg'}`}>{categoryName}</h3>
          </div>
          <button onClick={() => setDeleteCatTarget({ id: catId, name: categoryName })} className="p-2 text-white/5 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-all">
            <Trash2 size={18} />
          </button>
        </div>

        <div className="space-y-4 flex-grow">
          {items.map((skill: any, i: number) => {
            const isEditing = editingPos?.catId === catId && editingPos?.idx === i;
            
            return (
              <div key={skill._id || i} className={`p-6 rounded-[1.5rem] bg-white/[0.03] border transition-all group ${isEditing ? `border-accent/40 bg-white/10 shadow-lg` : 'border-white/5'}`}>
                <div className="flex justify-between items-center mb-5">
                  <div className="flex-1">
                    {isEditing ? (
                      <input 
                        className="bg-transparent border-b border-accent outline-none text-sm font-bold w-full py-1 text-white" 
                        value={skill.name} 
                        autoFocus 
                        onKeyDown={(e) => { if (e.key === 'Enter') { syncSkillUpdate(catId, skill); setEditingPos(null); } }} 
                        onChange={(e) => {
                          const val = e.target.value;
                          setSkills(prev => prev.map(c => {
                            if (c._id === catId) {
                              const newItems = [...c.items];
                              newItems[i] = { ...newItems[i], name: val };
                              return { ...c, items: newItems };
                            }
                            return c;
                          }));
                        }} 
                      />
                    ) : (
                      <h4 className="text-sm font-bold opacity-90 text-white tracking-tight">{skill.name}</h4>
                    )}
                  </div>

                  <div className="flex gap-3 ml-4">
                    {isEditing ? (
                      <button onClick={() => { syncSkillUpdate(catId, skill); setEditingPos(null); }} className="p-1 hover:bg-emerald-500/20 rounded-lg text-emerald-500 transition-colors">
                        <Check size={18} />
                      </button>
                    ) : (
                      <button onClick={() => setEditingPos({ catId, idx: i })} className="p-1 text-white/10 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                        <Edit2 size={14} />
                      </button>
                    )}
                    <button onClick={() => handleteleteSkill(catId, skill._id)} className="p-1 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] text-white/20 font-black">
                    <span>Proficiency</span>
                    <span className={isEditing ? "text-accent" : "text-white/40"}>{skill.level}%</span>
                  </div>
                  
                  {isEditing ? (
                    <input 
                      type="range" min="0" max="100" 
                      value={skill.level} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSkills(prev => prev.map(c => {
                          if (c._id === catId) {
                            const newItems = [...c.items];
                            newItems[i] = { ...newItems[i], level: val };
                            return { ...c, items: newItems };
                          }
                          return c;
                        }));
                      }} 
                      className="w-full h-1 bg-white/20 rounded-full appearance-none accent-accent cursor-pointer" 
                    />
                  ) : (
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent/40 transition-all duration-500" style={{ width: `${skill.level}%` }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
            
          <div className="mt-6">
            {editingPos?.catId === catId && editingPos?.idx === -1 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-[1.5rem] bg-white/[0.05] border border-accent/30">
                <input autoFocus className="w-full bg-transparent border-b border-white/20 outline-none text-sm font-bold mb-5 py-2 text-white" placeholder="Skill Name" value={newSkillData.name} onChange={(e) => setNewSkillData({ ...newSkillData, name: e.target.value })} />
                <div className="flex justify-between text-[9px] uppercase font-black text-white/20 mb-3 tracking-widest">
                  <span>Initial Level</span>
                  <span className="text-accent">{newSkillData.level}%</span>
                </div>
                <input type="range" min="0" max="100" value={newSkillData.level} onChange={(e) => setNewSkillData({ ...newSkillData, level: parseInt(e.target.value) })} className="w-full h-1 bg-white/10 appearance-none accent-accent cursor-pointer" />
                <div className="flex justify-end gap-4 mt-6">
                  <button onClick={() => setEditingPos(null)} className="text-[10px] text-white/30 uppercase font-bold hover:text-white transition-colors">Cancel</button>
                  <button onClick={() => handleCreateSkill(catId)} className="text-[10px] text-accent uppercase font-bold hover:opacity-70 transition-all">Add Skill</button>
                </div>
              </motion.div>
            ) : (
              <button onClick={() => setEditingPos({ catId, idx: -1 })} className="w-full p-5 rounded-[1.5rem] border border-dashed border-white/5 text-white/10 hover:border-accent/30 hover:text-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-3 group">
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">New Skill</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
};