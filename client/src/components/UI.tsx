import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current && followerRef.current) {
        const { clientX: x, clientY: y } = e;
        cursorRef.current.style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
        followerRef.current.style.transform = `translate3d(${x - 24}px, ${y - 24}px, 0)`;
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={followerRef} className="custom-cursor-follower" />
    </>
  );
};

export const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-10000 bg-bg flex items-center justify-center"
    >
      <div className="relative flex items-center justify-center">
        
        {/* Outer Circle (Anticlockwise) */}
        <motion.div
          animate={{
            rotate: [0, -360], // 🔥 anticlockwise
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-20 h-20 border-2 border-accent border-t-transparent rounded-full"
        />

        {/* Inner Circle (Clockwise for contrast) */}
        <motion.div
          animate={{
            rotate: [0, 360], // clockwise
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-12 h-12 border-2 border-white/40 border-b-transparent rounded-full"
        />

        {/* Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-30 text-center font-display text-xl tracking-widest uppercase"
        >
          R & R Labs
        </motion.div>
      </div>
    </motion.div>
  );
};