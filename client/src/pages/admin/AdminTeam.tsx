import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Trash2, Plus, Edit3, Search } from "lucide-react";

import {
  getTeamApi,
  createTeamApi,
  updateTeamApi,
  deleteTeamApi,
} from "../../services/apiService";
import ConfirmModal from "@/src/components/ConfirmModal";
import { useToast } from "@/src/contexts/ToastContext";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export const AdminTeam: React.FC = () => {
  const { showToast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [filtered, setFiltered] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "",
    image: "",
    bio: "",
  });

  // ---------------- FETCH ----------------
  const fetchTeam = async () => {
    const data = await getTeamApi();
    setTeam(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // ---------------- SEARCH ----------------
  useEffect(() => {
    const result = team.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, team]);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be < 2MB");
      return;
    }

    // cleanup old preview
    if (form.image?.startsWith("blob:")) {
      URL.revokeObjectURL(form.image);
    }

    setSelectedFile(file);

    const preview = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      image: preview,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    if (!form.name || !form.role) return;
    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("role", form.role);
      formData.append("bio", form.bio);

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (form.image && !form.image.startsWith("blob:")) {
        formData.append("existingImage", form.image);
      }

      if (editing && editing._id) {
        const updated = await updateTeamApi(editing._id, formData);

        setTeam((prev) =>
          prev.map((m) => (m._id === updated._id ? updated : m))
        );
      } else {
        const created = await createTeamApi(formData);
        showToast("Member saved successfully", "success");
        setTeam((prev) => [...prev, created]);
      }

      // RESET
      setEditing(null);
      setSelectedFile(null);
      setForm({ name: "", role: "", image: "", bio: "" });

    } catch (err) {
      console.error(err);
      showToast("Member saved failed", "error");
    } finally {
      setLoading(false); // 🔥 CRITICAL FIX
    }
  };

  useEffect(() => {
    return () => {
      if (form.image?.startsWith("blob:")) {
        URL.revokeObjectURL(form.image);
      }
    };
  }, [form.image]);

  // ---------------- DELETE ----------------
  const handleDelete = async (id: string) => {
    await deleteTeamApi(id);
    setTeam((prev) => prev.filter((m) => m._id !== id));
  };

  // ---------------- GROUP ----------------
  const grouped = filtered.reduce((acc: any, member) => {
    acc[member.role] = acc[member.role] || [];
    acc[member.role].push(member);
    return acc;
  }, {});

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-white/40 text-sm">
            Manage your team members and roles
          </p>
        </div>

        <button
          onClick={() => setEditing({} as any)}
          className="flex items-center px-8 py-3 bg-accent text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent/80 transition-all hover:scale-105 shadow-[0_10px_30px_rgba(124,58,237,0.3)]"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
        <input
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-accent outline-none"
        />
      </div>

      {/* TEAM */}
      {Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">

          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5">
            <Plus size={28} className="text-white/40" />
          </div>

          <h3 className="text-lg font-semibold">No Team Members Found</h3>

          <p className="text-white/40 text-sm max-w-sm">
            {search
              ? "No results match your search. Try a different keyword."
              : "Start building your team by adding members."}
          </p>

          {!search && (
            <button
              onClick={() => setEditing({} as any)}
              className="mt-4 px-6 py-2 bg-accent rounded-lg text-sm font-semibold hover:bg-accent/80 transition"
            >
              Add First Member
            </button>
          )}

        </div>
      ) : (
        Object.keys(grouped).map((role) => (
          <div key={role}>
            <h2 className="text-lg font-semibold mb-4 text-accent uppercase">
              {role}
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {grouped[role].map((member: TeamMember) => (
                <motion.div
                  key={member._id}
                  whileHover={{ y: -5 }}
                  className="relative bg-white/5 border border-white/5 rounded-2xl p-5 group"
                >
                  {/* EXISTING CARD */}
                  {/* IMAGE */}
                  {member.image ? (
                    <img
                      src={member.image}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                    />
                  ) : (
                    <div className="w-full h-40 rounded-xl bg-gradient-to-br from-accent to-accent-secondary flex items-center justify-center text-white text-xl font-bold mb-4">
                      {member.name?.charAt(0)}
                    </div>
                  )}

                  {/* INFO */}
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-white/40">{member.role}</p>
                  <p className="text-xs text-white/30 mt-2 line-clamp-2">
                    {member.bio}
                  </p>

                  {/* ACTIONS */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        setEditing(member);
                        setForm(member);
                      }}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      onClick={() => setDeleteId(member._id)}
                      className="p-2 bg-red-500/80 rounded-lg hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )))}

      {/* MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black border border-white/10 rounded-2xl p-6 w-[420px] space-y-5"
          >
            <h2 className="text-xl font-semibold">
              {editing._id ? "Edit Member" : "Add Member"}
            </h2>

            <div className="space-y-5">

              {/* NAME */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Name
                </label>
                <input
                  placeholder="Enter Full Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              {/* ROLE */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Role
                </label>
                <input
                  placeholder="Enter Role "
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              {/* IMAGE */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Profile Image
                </label>

                <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="text-xs text-white/40"
                  />
                </div>
              </div>

              {/* BIO */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Bio
                </label>
                <textarea
                  placeholder=""
                  value={form.bio}
                  onChange={(e) =>
                    setForm({ ...form, bio: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 h-24 focus:border-accent focus:outline-none transition-colors"
                />
              </div>

            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`flex items-center px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-[0_10px_30px_rgba(124,58,237,0.3)]
    ${loading
                    ? "bg-accent/50 cursor-not-allowed"
                    : "bg-accent hover:bg-accent/80 hover:scale-105"
                  }`}
              >
                {loading ? "Saving..." : "Save Member"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmModal
        open={!!deleteId}
        title="Delete this team member?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleteId) handleDelete(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};