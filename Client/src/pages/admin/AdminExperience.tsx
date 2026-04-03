import React,{ useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import {
  createExperienceApi,
  deleteExperienceApi,
  getExperienceApi,
  updateExperienceApi
} from "@/src/services/apiService";

import { useToast } from "../../contexts/ToastContext";
import ConfirmModal from "@/src/components/ConfirmModal";

export const AdminExperience = () => {
  const [data, setData] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { showToast } = useToast();

  const fetchData = async () => {
    const res = await getExperienceApi();
    setData(Array.isArray(res) ? res : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SAVE
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let saved;

      if (editing._id) {
        saved = await updateExperienceApi(editing._id, editing);
        showToast("Updated successfully", "success");
      } else {
        saved = await createExperienceApi(editing);
        showToast("Added successfully", "success");
      }

      fetchData();
      setEditing(null);

    } catch {
      showToast("Operation failed", "error");
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteExperienceApi(deleteId);
      showToast("Deleted successfully", "success");
      setDeleteId(null);
      fetchData();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="space-y-12">

      {/* HEADER */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Experience Manager</h1>
          <p className="text-white/40 text-sm">Manage your career timeline.</p>
        </div>

        <button
          onClick={() =>
            setEditing({ role: "", company: "", period: "", description: "" })
          }
          className="flex items-center px-8 py-3 bg-accent text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition"
        >
          <Plus size={18} className="mr-2" /> New Experience
        </button>
      </header>

      {/* LIST */}
      <div className="glass-card overflow-hidden">
        <div className="divide-y divide-white/5">
          {data.map((exp) => (
            <div
              key={exp._id}
              className="flex justify-between items-center px-8 py-6 hover:bg-white/2"
            >
              <div>
                <h3 className="font-semibold">{exp.role}</h3>
                <p className="text-accent text-sm">{exp.company}</p>
                <p className="text-white/40 text-xs">{exp.period}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(exp)}
                  className="p-2 bg-white/5 rounded hover:bg-white/10"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => setDeleteId(exp._id)}
                  className="p-2 bg-white/5 rounded hover:bg-red-500/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- SLIDE PANEL ---------------- */}
      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-100 flex items-center justify-end">

            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
              className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
            />

            {/* PANEL */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl h-full bg-bg border-l border-white/10 p-12 overflow-y-auto"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h3 className="text-2xl font-display font-bold">
                    {editing._id ? "Edit Experience" : "New Experience"}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                    Timeline Entry
                  </p>
                </div>

                <button onClick={() => setEditing(null)}>
                  <X size={24} />
                </button>
              </div>

              {/* FORM */}
        <form onSubmit={handleSave} className="space-y-8">

  {/* ROLE */}
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
      Role
    </label>
    <input
      placeholder="Lead Product Designer"
      value={editing.role}
      onChange={(e) =>
        setEditing({ ...editing, role: e.target.value })
      }
      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent focus:outline-none transition-colors"
    />
  </div>

  {/* COMPANY */}
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
      Organization
    </label>
    <input
      placeholder="Lumina Noir Studio"
      value={editing.company}
      onChange={(e) =>
        setEditing({ ...editing, company: e.target.value })
      }
      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent focus:outline-none transition-colors"
    />
  </div>

  {/* PERIOD */}
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
      Period
    </label>
    <input
      placeholder="2021 — Present"
      value={editing.period}
      onChange={(e) =>
        setEditing({ ...editing, period: e.target.value })
      }
      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent focus:outline-none transition-colors"
    />
  </div>

  {/* DESCRIPTION */}
  <div className="space-y-2">
    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
      Description
    </label>
    <textarea
      placeholder="Led design systems and scaled product experience across global platforms..."
      value={editing.description}
      onChange={(e) =>
        setEditing({ ...editing, description: e.target.value })
      }
      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 h-32 focus:border-accent focus:outline-none transition-colors"
    />
  </div>

  {/* ACTIONS */}
  <div className="pt-12 flex gap-4">
    <button
      type="button"
      onClick={() => setEditing(null)}
      className="flex-1 py-4 bg-white/5 text-white/60 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition"
    >
      Discard
    </button>

    <button
      type="submit"
      className="flex-1 py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent/80 transition-all shadow-[0_10px_30px_rgba(124,58,237,0.3)]"
    >
      Save Changes
    </button>
  </div>

</form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
     <ConfirmModal
     open={!!deleteId}
     title="Are you sure you want to delete this experience?"
     description="This action cannot be undone."
     confirmText="Delete"
     cancelText="Cancel"
     onConfirm={handleDelete}
     onCancel={() => setDeleteId(null)}
   />

    </div>
  );
};