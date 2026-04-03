import { useState, useRef, useEffect } from "react";
import { Box, Cpu, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// =======================
// Feature Card
// =======================
const FeatureCard = ({ icon, title, desc, index }) => {
  const [pos, setPos] = useState({ x: 50, y: 50, active: false });
  const cardRef = useRef(null);

  // 🔥 GSAP Scroll Animation
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 80, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        delay: index * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      }
    );
  }, [index]);

  // 🎯 Cursor Glow
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    requestAnimationFrame(() => {
      setPos({ x, y, active: true });
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos((p) => ({ ...p, active: false }))}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative group rounded-2xl p-[1px] overflow-hidden h-full"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"
        style={{
          background: pos.active
            ? `radial-gradient(220px circle at ${pos.x}% ${pos.y}%, rgba(139,92,246,0.6), transparent 60%)`
            : "transparent",
        }}
      />

      {/* Card */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 rounded-2xl bg-black backdrop-blur-xl border border-white/5 transition-all duration-300 group-hover:border-white/10">
        
        <div>
          {/* ✅ FIXED ICON BOX */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-6 transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>

          <h3 className="text-xl font-display font-bold mb-4 text-white">
            {title}
          </h3>

          <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
            {desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// =======================
// Features Section
// =======================
export default function Features() {
  const sectionRef = useRef(null);

  // 🔥 Heading Animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const heading = el.querySelector(".features-heading");
    if (!heading) return;

    gsap.fromTo(
      heading,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
      }
    );
  }, []);

  const data = [
    {
      icon: <Box size={20} />,
      title: "Architectural Precision",
      desc: "Every pixel is placed with structural intent, ensuring layouts are as robust as they are beautiful.",
    },
    {
      icon: <Cpu size={20} />,
      title: "Modern Stack",
      desc: "Leveraging React, Next.js, and AI-driven workflows to build fast, scalable applications.",
    },
    {
      icon: <Sparkles size={20} />,
      title: "Kinetic Experiences",
      desc: "Motion guides user focus through narrative flow and interaction.",
    },
  ];

  return (
    <section ref={sectionRef} className="px-6 py-20 max-w-7xl mx-auto">
      
      {/* Heading */}
      <div className="mb-12 features-heading">
        <h2 className="text-3xl font-display font-bold uppercase tracking-tight">
          Capabilities
        </h2>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-2">
          Design × Code × Intelligence
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
        {data.map((item, i) => (
          <FeatureCard key={i} index={i} {...item} />
        ))}
      </div>
    </section>
  );
}