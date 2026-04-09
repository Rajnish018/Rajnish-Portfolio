import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  X,
  ChevronRight,
  Filter,
  Upload,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { useToast } from '@/src/contexts/ToastContext';
import { Project } from '../../types';
import { 
  createProjectApi, 
  deleteProjectApi, 
  getProjectsApi, 
  updateProjectApi,
} from '../../services/apiService';
import ConfirmModal from '@/src/components/ConfirmModal';

const EMPTY_PROJECT: Project = {
  title: '',
  description: '',
  category: 'Web',
  image: '',
  tags: [],
  status: 'DRAFT',
  githubLink: '',
  previewLink: '',
};

export const AdminProjects: React.FC = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

 // ---------------- FETCH PROJECTS ----------------
const fetchProjects = async () => {
  try {
    const data = await getProjectsApi();
    setProjects(data);
  } catch (err) {
    showToast("Fetch projects error", "error");
  }
};

useEffect(() => {
  fetchProjects();
}, []);

// ---------------- CLEANUP PREVIEW URL ----------------
useEffect(() => {
  const previewUrl = isEditing?.image;

  return () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
  };
}, [isEditing?.image]);

// ---------------- FILE HANDLING ----------------
const processFile = (file: File) => {
  if (!file.type.startsWith("image/")) {
    showToast("Only image files allowed", "error");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showToast("Image must be < 2MB", "error");
    return;
  }

  setSelectedFile(file);

  setIsEditing(prev =>
    prev ? { ...prev, image: URL.createObjectURL(file) } : null
  );
};

const handleUploadClick = () => fileInputRef.current?.click();

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) processFile(file);
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
};

// ---------------- DELETE ----------------
const handleDelete = async () => {
  if (!deleteId) return;

  try {
    await deleteProjectApi(deleteId);
    setProjects(prev => prev.filter(p => p._id !== deleteId));
    showToast("Project deleted successfully", "success");
  } catch {
    showToast("Failed to delete", "error");
  } finally {
    setDeleteId(null);
  }
};

// ---------------- SAVE (CREATE + UPDATE) ----------------
const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isEditing || loading) return;

  // -------- VALIDATION --------
  const trimmedTitle = isEditing.title.trim();
  const trimmedDescription = isEditing.description.trim();

  if (!trimmedTitle || !trimmedDescription) {
    showToast("Title and description are required", "error");
    return;
  }

  // -------- FORM DATA --------
  const formData = new FormData();

  formData.append("title", trimmedTitle);
  formData.append("description", trimmedDescription);
  formData.append("category", isEditing.category || "Web");
  formData.append("status", isEditing.status || "DRAFT");

  if (isEditing.githubLink?.trim()) {
    formData.append("githubLink", isEditing.githubLink.trim());
  }

  if (isEditing.previewLink?.trim()) {
    formData.append("previewLink", isEditing.previewLink.trim());
  }

  formData.append(
    "tags",
    JSON.stringify(
      Array.isArray(isEditing.tags)
        ? isEditing.tags.filter(Boolean)
        : []
    )
  );

  // -------- IMAGE HANDLING --------
  if (selectedFile) {
    formData.append("image", selectedFile);
  } else if (isEditing.image && !isEditing.image.startsWith("blob:")) {
    formData.append("existingImage", isEditing.image);
  }

  // -------- API CALL --------
  setLoading(true);

  try {
    if (isEditing._id) {
      // UPDATE
      const updated = await updateProjectApi(isEditing._id, formData);

      setProjects(prev =>
        prev.map(p => (p._id === updated._id ? updated : p))
      );

      showToast("Project updated successfully", "success");
    } else {
      // CREATE
      const created = await createProjectApi(formData);

      setProjects(prev => [...prev, created]);

      showToast("Project created successfully", "success");
    }

    // -------- RESET --------
    setIsEditing(null);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  } catch (err: any) {
    showToast(
      err?.response?.data?.message || "Failed to save project",
      "error"
    );
  } finally {
    setLoading(false);
  }
};

// ---------------- FILTER ----------------
const filteredProjects = projects.filter(p =>
  p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  p.category.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="space-y-12">
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Project Manager</h1>
          <p className="text-white/40 text-sm">Manage architectural case studies and studio archives.</p>
        </div>
        <button 
          onClick={() => setIsEditing({ ...EMPTY_PROJECT })}
          className="flex items-center px-8 py-3 bg-accent text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent/80 transition-all hover:scale-105 shadow-[0_10px_30px_rgba(124,58,237,0.3)]"
        >
          <Plus size={18} className="mr-2" /> New Project
        </button>
      </header>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">Total Projects</p>
          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-display font-bold">{projects.length}</h3>
            <span className="text-xs text-accent font-bold">+3 this month</span>
          </div>
        </div>
        <div className="glass-card p-8">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">In Studio</p>
          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-display font-bold">12</h3>
            <div className="h-2 w-24 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[40%]" />
            </div>
          </div>
        </div>
        <div className="glass-card p-8">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-4">Archive Rate</p>
          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-display font-bold">84%</h3>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Optimized storage</span>
          </div>
        </div>
      </div>

      {/* Search & Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-8 border-b border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input 
              type="text"
              placeholder="Filter projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 focus:border-accent focus:outline-none transition-colors text-sm"
            />
          </div>
          <div className="flex gap-4">
            <button className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
              <Filter size={18} />
            </button>
            <button className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
              <MoreVertical size={18} />
            </button> 
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                <th className="px-8 py-6">Project Overview</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.map((project) => (
                <tr key={project._id} className="group hover:bg-white/2 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5 border border-white/10">
                        {project.image ? (
                          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-accent transition-colors">{project.title}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{project.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                      project.status === 'LIVE' || project.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 
                      project.status === 'DRAFT' ? 'bg-white/10 text-white/40' : 'bg-accent/10 text-accent'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setIsEditing(project)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => setDeleteId(project._id ?? null)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-100 flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsEditing(null)}
              className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl h-full bg-bg border-l border-white/10 p-12 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h3 className="text-2xl font-display font-bold">{isEditing._id ? 'Edit Project' : 'New Project'}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Project Configuration</p>
                </div>
                <button onClick={() => setIsEditing(null)} className="p-2 text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Project Title</label>
                  <input 
                    required
                    value={isEditing.title}
                    onChange={(e) => setIsEditing({ ...isEditing, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent focus:outline-none transition-colors placeholder:text-white/20"
                    placeholder="Enter project name..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Featured Preview</label>
                  <div 
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="aspect-video rounded-2xl overflow-hidden relative group bg-white/5 border border-dashed border-white/10 hover:border-accent transition-colors"
                  >


                    {isEditing.image ? (
                      <img src={isEditing.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                        <ImageIcon size={40} className="mb-2" />
                        <span className="text-[10px] uppercase tracking-widest">No Image Selected</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-bg/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button" 
                        onClick={handleUploadClick}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-bg rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
                      >
                        <Upload size={14} /> {isEditing.image ? 'Replace Image' : 'Upload Image'}
                      </button>
                      <p className="mt-2 text-[8px] text-white/40 uppercase tracking-widest">Drag & Drop or Click (Max 2MB)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Description</label>
                  <textarea
                    required
                    value={isEditing.description}
                    onChange={(e) => setIsEditing({ ...isEditing, description: e.target.value })}
                    rows={5}
                    className="w-full resize-none bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent focus:outline-none transition-colors placeholder:text-white/20"
                    placeholder="Describe the project, stack, and impact..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Category</label>
                    <select 
                      value={isEditing.category}
                      onChange={(e) => setIsEditing({ ...isEditing, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent focus:outline-none transition-colors appearance-none"
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Residential">Residential</option>
                      <option value="AI / ML">AI / ML</option>
                      <option value="Web">Web</option>
                      <option value="Mobile">Mobile</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">GitHub Link</label>
                    <input
                      value={isEditing.githubLink}
                      onChange={(e) => setIsEditing({ ...isEditing, githubLink: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent focus:outline-none transition-colors placeholder:text-white/20"
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Preview Link</label>
                  <input
                    value={isEditing.previewLink}
                    onChange={(e) => setIsEditing({ ...isEditing, previewLink: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent focus:outline-none transition-colors placeholder:text-white/20"
                    placeholder="https://your-project-demo.vercel.app"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Tags</label>
                  <input
                    value={isEditing.tags.join(', ')}
                    onChange={(e) =>
                      setIsEditing({
                        ...isEditing,
                        tags: e.target.value
                          .split(',')
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent focus:outline-none transition-colors placeholder:text-white/20"
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Visibility State</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsEditing({ ...isEditing, status: 'PUBLISHED' })}
                      className={`flex items-center justify-center gap-2 py-4 rounded-xl border transition-all ${
                        isEditing.status === 'PUBLISHED' ? 'bg-accent/10 border-accent text-accent' : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      <Eye size={16} /> Published
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsEditing({ ...isEditing, status: 'DRAFT' })}
                      className={`flex items-center justify-center gap-2 py-4 rounded-xl border transition-all ${
                        isEditing.status === 'DRAFT' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      <EyeOff size={16} /> Draft
                    </button>
                  </div>
                </div>

                <div className="pt-12 flex gap-4">
                  <button 
                    type="button"
                    disabled={loading}
                    onClick={() => setIsEditing(null)}
                    className="flex-1 py-4 bg-white/5 text-white/60 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all disabled:opacity-50"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    disabled={loading }
                    className="flex-1 py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent/80 transition-all shadow-[0_10px_30px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : (isEditing._id ? 'Update Project' : 'Create Project')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Project"
        description="This action is permanent and cannot be undone."
        confirmText="Delete Project"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
