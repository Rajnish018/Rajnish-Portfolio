import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, X, Mail } from "lucide-react";

import {
  getMessagesApi,
  deleteMessageApi,
} from "@/src/services/apiService";

import { useToast } from "../../contexts/ToastContext";
import ConfirmModal from "@/src/components/ConfirmModal";

export const AdminMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [viewing, setViewing] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { showToast } = useToast();

  // FETCH
  const fetchMessages = async () => {
    try {
      const res = await getMessagesApi();
      setMessages(Array.isArray(res) ? res : []);
    } catch {
      showToast("Failed to load messages", "error");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // DELETE
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMessageApi(deleteId);
      showToast("Message deleted", "success");
      setDeleteId(null);
      fetchMessages();
    } catch {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="space-y-12">

      {/* HEADER */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Messages</h1>
          <p className="text-white/40 text-sm">
            Manage contact form submissions.
          </p>
        </div>
      </header>

      {/* LIST */}
     {/* LIST */}
<div className="glass-card overflow-hidden">

  {messages.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5">
        <Mail size={28} className="text-white/40" />
      </div>

      <h3 className="text-lg font-semibold">No Messages Yet</h3>

      <p className="text-white/40 text-sm max-w-sm">
        You haven’t received any contact messages. Once users submit the form,
        they will appear here.
      </p>

    </div>
  ) : (
    <div className="divide-y divide-white/5">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className="flex justify-between items-center px-8 py-6 hover:bg-white/[0.02]"
        >
          <div>
            <h3 className="font-semibold">{msg.name}</h3>
            <p className="text-accent text-sm">{msg.email}</p>
            <p className="text-white/40 text-xs line-clamp-1">
              {msg.message}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewing(msg)}
              className="p-2 bg-white/5 rounded hover:bg-white/10"
            >
              <Mail size={16} />
            </button>

            <button
              onClick={() => setDeleteId(msg._id)}
              className="p-2 bg-white/5 rounded hover:bg-red-500/20"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )}

</div>
      {/* ---------------- VIEW PANEL ---------------- */}
      <AnimatePresence>
        {viewing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">

            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewing(null)}
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
                    Message Details
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                    Contact Submission
                  </p>
                </div>

                <button onClick={() => setViewing(null)}>
                  <X size={24} />
                </button>
              </div>

              {/* CONTENT */}
              <div className="space-y-8">

                {/* NAME */}
                <div>
                  <label className="text-[10px] uppercase text-white/40 font-bold">
                    Name
                  </label>
                  <p className="mt-2 text-lg">{viewing.name}</p>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-[10px] uppercase text-white/40 font-bold">
                    Email
                  </label>
                  <p className="mt-2 text-lg">{viewing.email}</p>
                </div>

                {/* SUBJECT */}
                <div>
                  <label className="text-[10px] uppercase text-white/40 font-bold">
                    Subject
                  </label>
                  <p className="mt-2 text-lg">{viewing.subject || "-"}</p>
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="text-[10px] uppercase text-white/40 font-bold">
                    Message
                  </label>
                  <div className="mt-2 p-4 bg-white/5 border border-white/10 rounded-xl whitespace-pre-wrap">
                    {viewing.message}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRM */}
      <ConfirmModal
        open={!!deleteId}
        title="Delete this message?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

    </div>
  );
};