import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import BackgroundPattern from './BackgroundPattern';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const patternWrapperRef = useRef<HTMLDivElement>(null);

  // The specific Yellow Accent for this section
  const ACCENT = "124, 58, 237";

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 0.5 });
      
      heroTl.fromTo(".hero-badge", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6 })
      .fromTo(".hero-title", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=0.3")
      .fromTo(".hero-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.6")
      .fromTo(".hero-btns", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");

      // Parallax Effects
      gsap.to(heroContentRef.current, {
        y: 100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });

      gsap.to(patternWrapperRef.current, {
        y: -40,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative w-full py-20 md:py-32 flex items-center min-h-[85vh] overflow-hidden ">
      {/* Background Pattern Layer */}
      <div ref={patternWrapperRef} className="absolute inset-0 z-0 w-screen h-full left-1/2 -translate-x-1/2 pointer-events-auto">
        <BackgroundPattern accentColor={ACCENT} columns={24} rows={14} />
      </div>
      {/* Content Layer */}
      <div ref={heroContentRef} className="relative z-10 pointer-events-none w-full px-6 max-w-7xl mx-auto">
        <div className="pointer-events-auto">
          <div 
            className="hero-badge inline-flex items-center px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest mb-8"
            style={{ 
              backgroundColor: `rgba(${ACCENT}, 0.1)`, 
              borderColor: `rgba(${ACCENT}, 0.2)`,
              color: `rgb(${ACCENT})` 
            }}
          >
            <div className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ backgroundColor: `rgb(${ACCENT})` }} />
            Available for Architecture & Code
          </div>
          
          <h1 className="hero-title text-6xl md:text-8xl font-display font-bold leading-tight mb-8">
            Rajnish Kumar <span className="text-white/20">/</span><br />
            <span 
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(to right, rgb(${ACCENT}), #fff)` }}
            >
              ML & Full-Stack Developer
            </span>
          </h1>
          
          <p className="hero-subtitle text-lg md:text-xl text-white/60 max-w-2xl mb-12 leading-relaxed">
            Building the Future with Code & Design. Crafting cinematic digital experiences that bridge the gap between architectural precision and technical excellence.
          </p>
          
          <div className="hero-btns flex flex-wrap gap-6">
            <Link 
              to="/projects" 
              className="px-8 py-4 rounded-xl font-bold text-black transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: `rgb(${ACCENT})` }}
            >
              View Projects
            </Link>
            <Link to="/about" className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-all hover:scale-105 text-white/80">
              The Studio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;