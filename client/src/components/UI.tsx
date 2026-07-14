import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
  const cursor = useRef<HTMLDivElement>(null);
  const follower = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    let followerX = 0;
    let followerY = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursor.current) {
        cursor.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px,0) translate(-50%,-50%)`;
      }
    };

    let animationFrameId = 0;

    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      if (follower.current) {
        follower.current.style.transform = `translate3d(${followerX}px, ${followerY}px,0) translate(-50%,-50%)`;
      }

      animationFrameId = requestAnimationFrame(animateFollower);
    };

    animateFollower();

    const interactiveSelector =
      "a,button,input,textarea,select,label,[role='button'],.cursor-hover";

    const textSelector =
      "p,h1,h2,h3,h4,h5,h6,span,strong,em,li";

    let activeTextElement: HTMLElement | null = null;

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const textElement = target.closest(textSelector) as HTMLElement | null;

      // Interactive elements
      if (target.closest(interactiveSelector)) {
        cursor.current?.classList.add("cursor-active");
        follower.current?.classList.add("cursor-active");
      } else {
        cursor.current?.classList.remove("cursor-active");
        follower.current?.classList.remove("cursor-active");
      }

      // Text elements
      if (textElement) {
        cursor.current?.classList.add("cursor-text");
        follower.current?.classList.add("cursor-text");

        if (activeTextElement !== textElement) {
          activeTextElement?.classList.remove("cursor-text-target");
          activeTextElement = textElement;
          activeTextElement.classList.add("cursor-text-target");
        }
      } else {
        cursor.current?.classList.remove("cursor-text");
        follower.current?.classList.remove("cursor-text");
        activeTextElement?.classList.remove("cursor-text-target");
        activeTextElement = null;
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mousemove", updateCursor);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mousemove", updateCursor);
      cancelAnimationFrame(animationFrameId);
      activeTextElement?.classList.remove("cursor-text-target");
    };
  }, []);

  return (
    <>
      <div ref={cursor} className="custom-cursor" />
      <div ref={follower} className="custom-cursor-follower" />
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
