import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../../components/Hero';
import Features from '../../components/Feature';
import CTA from '../../components/Cta';
import { getProjectsApi } from '@/src/services/apiService';
import SEO from '@/src/components/SEO';

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
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.utils.toArray(".project-card").forEach((card: any) => {
          gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0, duration: 1, ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, [projects]);

  return (

    <SEO
       title="Rajnish Kumar | Full Stack & AI Developer (Next.js, React, Machine Learning)"
      description="Rajnish Kumar is a Full Stack & AI Developer specializing in React, Next.js, Node.js, Machine Learning, and Deep Learning. Explore innovative projects, AI-powered applications, and scalable web solutions."
      keywords="Rajnish Kumar, full stack developer, AI developer, next.js developer, react developer, machine learning projects, deep learning, MERN stack, tensorflow portfolio"
      url="https://rajnish-kumar-portfolio.vercel.app/"
      image="https://rajnish-kumar-portfolio.vercel.app/og-ai-portfolio.png"
    >
      <div ref={containerRef} className="min-h-screen pt-16 md:pt-24 bg-background text-white">
        <Hero />

        {/* Featured Works Section */}
        <section className="px-6 py-20 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16 border-b border-white/5 pb-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2 uppercase tracking-tight">Featured Works</h2>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">Selected Experiments 2024-2026</p>
            </div>
            <Link to="/projects" className="flex items-center text-white/40 hover:text-accent transition-all text-[10px] uppercase tracking-[0.2em]">
              Explore Archive <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center gap-4 text-white/20 font-mono text-xs uppercase tracking-widest animate-pulse">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />Synchronizing Archive...
            </div>
          ) : projects.length === 0 ? (
            <p className="text-white/20 text-sm italic">Archive is currently empty.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* BIG CARD */}
              {projects[0] && (
                <div className="project-card group relative overflow-hidden rounded-3xl aspect-16/10 glass-card border-white/5">
                  <img src={projects[0].image} alt={projects[0].title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-10">
                    <div className="flex gap-2 mb-4">
                      {projects[0].tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-accent/20 backdrop-blur-md border border-accent/20 text-[9px] uppercase tracking-widest text-accent rounded-full">{tag}</span>
                      ))}
                    </div>
                    <h3 className="text-4xl font-display font-bold mb-3">{projects[0].title}</h3>
                    <p className="text-white/50 text-sm max-w-sm line-clamp-2">{projects[0].description}</p>
                  </div>
                </div>
              )}

              {/* SECONDARY SIDE */}
              <div className="flex flex-col gap-10">
                {projects[1] && (
                  <div className="project-card group relative overflow-hidden rounded-3xl aspect-video glass-card border-white/5">
                    <img src={projects[1].image} alt={projects[1].title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-105 transition duration-1000" />
                    <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8">
                      <span className="text-accent text-[9px] uppercase tracking-[0.2em] font-bold mb-2 block">{projects[1].category}</span>
                      <h3 className="text-2xl font-display font-bold mb-2">{projects[1].title}</h3>
                      <p className="text-white/40 text-xs line-clamp-2">{projects[1].description}</p>
                    </div>
                  </div>
                )}

                {/* MINI GRID */}
                <div className="grid grid-cols-2 gap-10">
                  {[projects[2], projects[3]].map((proj, i) => proj && (
                    <div key={proj._id || i} className="project-card group relative overflow-hidden rounded-3xl aspect-square glass-card border-white/5">
                      <img src={proj.image} alt={proj.title} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition duration-700" />
                      <div className="absolute inset-0 bg-linear-to-t from-background/90 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <span className="text-white/30 text-[8px] uppercase tracking-widest mb-1 block">{proj.category}</span>
                        <h3 className="text-lg font-display font-bold group-hover:text-accent transition-colors">{proj.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <Features />
        <CTA />
      </div>
    </SEO>
  );
};
