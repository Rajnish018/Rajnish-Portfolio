import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-xl"
      >
        <h1 className="text-8xl font-bold mb-6 accent-gradient">404</h1>

        <p className="text-white/60 mb-8 text-lg">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block px-8 py-4 rounded-xl bg-accent text-white font-bold uppercase tracking-widest hover:scale-[1.05] transition"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};