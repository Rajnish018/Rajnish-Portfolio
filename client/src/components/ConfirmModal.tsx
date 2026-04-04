import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={onCancel}
          // The "ml-72" offsets the modal so it centers in the main content area
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 ml-72"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="
              relative aspect-square w-full max-w-[360px] 
              bg-[#0a0a0a] border border-white/20
              p-10 flex flex-col justify-between
              shadow-[0_0_50px_rgba(0,0,0,1)]
            "
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />

            {/* Content */}
            <div className="space-y-4">
              <h3 className="text-2xl font-light tracking-[0.15em] text-white uppercase leading-tight">
                {title}
              </h3>
              <div className="w-10 h-[2px] bg-red-600" />
              {description && (
                <p className="text-sm leading-relaxed text-zinc-500 font-medium tracking-wide">
                  {description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className="
                  w-full py-4 
                  bg-white text-black font-black text-[10px] tracking-[0.3em]
                  hover:bg-red-600 hover:text-white
                  transition-all duration-300 active:scale-[0.98]
                "
              >
                {confirmText.toUpperCase()}
              </button>
              
              <button
                onClick={onCancel}
                className="
                  w-full py-4 
                  text-zinc-500 font-bold text-[10px] tracking-[0.3em]
                  border border-white/5 hover:border-white/20 hover:text-white
                  transition-all duration-300 active:scale-[0.98]
                "
              >
                {cancelText.toUpperCase()}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;