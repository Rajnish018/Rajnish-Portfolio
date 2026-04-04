import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../../components/Hero';
import Features from '../../components/Feature';
import CTA from '../../components/Cta';
import { getProjectsApi } from '@/src/services/apiService';

gsap.registerPlugin(ScrollTrigger);

export const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjectsApi();
        setProjects(data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchProjects();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Use matchMedia to adjust animation intensity for mobile
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Desktop Animation: Heavy lift and scale
        gsap.utils.toArray(".project-card").forEach((card: any) => {
          gsap.fromTo(card,
            { opacity: 0, y: 80, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        // Mobile Animation: Subtle slide and fade to save battery/performance
        gsap.utils.toArray(".project-card").forEach((card: any) => {
          gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 92%", // Trigger earlier on mobile
                toggleActions: "play none none none", // Disable reverse on mobile for smoothness
              },
            }
          );
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, [projects]);

  return (
    // Reduced padding-top for mobile (pt-24 -> pt-16)
    <div ref={containerRef} className="min-h-screen pt-16 md:pt-24 bg-background text-white">
      
      <Hero />

      {/* Featured Works */}
      <section className="px-4 sm:px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 md:mb-16 border-b border-white/5 pb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 uppercase tracking-tight">Featured Works</h2>
            <p className="text-white/40 text-[9px] md:text-[10px] uppercase tracking-[0.3em]">Selected Experiments 2024-2026</p>
          </div>
          <Link to="/projects" className="flex items-center text-white/40 hover:text-accent transition-all text-[10px] uppercase tracking-[0.2em] self-start sm:self-auto">
            Explore Archive <ArrowRight size={14} className="ml-2" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center gap-4 text-white/20 font-mono text-[10px] md:text-xs uppercase tracking-widest animate-pulse">
            <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            Synchronizing Archive...
          </div>
        ) : (
          // Adjusted grid gap (gap-6 for mobile, gap-10 for desktop)
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {projects.slice(0, 4).map((proj, idx) => (
              <div 
                key={idx} 
                className="project-card group relative overflow-hidden rounded-2xl md:rounded-3xl aspect-4/3 sm:aspect-video glass-card border-white/5 bg-white/5"
              >
                {/* Mobile Optimization: Image is slightly more visible by default for touch screens */}
                <img 
                  src={proj.image} 
                  alt={proj.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 md:opacity-40 group-hover:opacity-70 transition duration-1000" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
                
                {/* Adjusted padding for mobile text */}
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                   <span className="text-accent text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold mb-1 md:mb-2 block">
                     {proj.category}
                   </span>
                   <h3 className="text-xl md:text-2xl font-display font-bold mb-1 md:mb-2 leading-tight">
                     {proj.title}
                   </h3>
                   <p className="text-white/40 text-[11px] md:text-xs line-clamp-2 max-w-[90%]">
                     {proj.description}
                   </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Features />
      <CTA />
    </div>
  );
};