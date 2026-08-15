import { useEffect, useRef, useState } from "react";

const usePointerDevice = () => {
  // null = "not determined yet" — prevents a flash of the wrong behavior on first paint
  const [isFinePointer, setIsFinePointer] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsFinePointer(mq.matches);

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isFinePointer;
};

export const CustomCursor = () => {
  const cursor = useRef<HTMLDivElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const isFinePointer = usePointerDevice();

  useEffect(() => {
    if (!isFinePointer) return; // covers both "false" (touch) and "null" (not determined yet)

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    let animationFrameId = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursor.current) {
        cursor.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px,0) translate(-50%,-50%)`;
      }
    };

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
    const textSelector = "p,h1,h2,h3,h4,h5,h6,span,strong,em,li";
    let activeTextElement: HTMLElement | null = null;

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const textElement = target.closest(textSelector) as HTMLElement | null;

      if (target.closest(interactiveSelector)) {
        cursor.current?.classList.add("cursor-active");
        follower.current?.classList.add("cursor-active");
      } else {
        cursor.current?.classList.remove("cursor-active");
        follower.current?.classList.remove("cursor-active");
      }

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
  }, [isFinePointer]);

  // Don't render on touch devices, and don't render before we know (avoids SSR/hydration mismatch)
  if (!isFinePointer) return null;

  return (
    <>
      <div ref={cursor} className="custom-cursor" />
      <div ref={follower} className="custom-cursor-follower" />
    </>
  );
};