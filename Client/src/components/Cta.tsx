import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
  const section = sectionRef.current;

  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
    },
  });

  if (headingRef.current) {
    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }

  if (textRef.current) {
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.5"
    );
  }

  if (buttonRef.current) {
    tl.fromTo(
      buttonRef.current,
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8 },
      "-=0.4"
    );
  }

  // ✅ FIX: Only run if exists
  if (glowRef.current) {
    gsap.to(glowRef.current, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        scrub: true,
      },
    });
  }
}, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 py-32 text-center max-w-4xl mx-auto overflow-hidden"
    >
      {/* 🔥 Background Glow (Depth Layer) */}
      {/* <div
        ref={glowRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full" />
      </div> */}

      {/* Content */}
      <div className="relative z-10">
        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight"
        >
          Ready to Build the Next Reality?
        </h2>

        {/* Text */}
        <p
          ref={textRef}
          className="text-white/60 text-lg mb-12"
        >
          Whether it&apos;s a high-end portfolio, a complex SaaS platform, or an AI experiment—let&apos;s make it luminous.
        </p>

        {/* Button */}
        <div ref={buttonRef}>
          <Link to="/contact">
            <motion.div
              whileHover={{
                scale: 1.08,
                y: -3,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 250, damping: 15 }}
              className="inline-flex items-center px-10 py-5 bg-white text-black rounded-full font-bold transition-all hover:bg-accent hover:text-white"
            >
              Get In Touch

              <motion.span
                className="ml-3"
                initial={{ x: 0 }}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ArrowRight size={20} />
              </motion.span>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}