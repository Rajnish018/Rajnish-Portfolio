import { useState } from "react";
import { Quote } from "lucide-react";

export default function InteractiveQuote() {
  const [pos, setPos] = useState({ x: 50, y: 50, active: false });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    requestAnimationFrame(() => {
      setPos({ x, y, active: true });
    });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setPos((p) => ({ ...p, active: false }))}
      className="relative group glass-card p-8 overflow-hidden rounded-2xl"
    >
      {/* 🔥 Cursor Glow Layer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"
        style={{
          background: pos.active
            ? `radial-gradient(
                250px circle at ${pos.x}% ${pos.y}%,
                rgba(139,92,246,0.25),
                transparent 60%
              )`
            : "transparent",
        }}
      />

      {/* Quote Icon */}
     <Quote
  className="absolute top-4 right-4 text-white/5 
             group-hover:text-accent 
             group-hover:scale-110 
             group-hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]
             transition-all duration-300 
             z-10"
  size={64}
/>
      {/* Text */}
      <p className="text-lg italic text-white/80 leading-relaxed relative z-10">
        &quot;Great design is not just what you see, but how you navigate the invisible paths between structure and emotion.&quot;
      </p>
    </div>
  );
}