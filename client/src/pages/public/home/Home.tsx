import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../../../components/Hero';
import Features from '../../../components/Feature';
import CTA from '../../../components/Cta';
import { getProjectsApi } from '@/src/services/apiService';
import SEO from '@/src/components/SEO';
import FeaturedProjects from '../../../components/FeaturedProjects'; // Adjust import path as needed

gsap.registerPlugin(ScrollTrigger);

export const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async (suppressLoading = false) => {
      try {
        const data = await getProjectsApi();
        setProjects(data);
        try {
          sessionStorage.setItem('projectsCache', JSON.stringify(data));
          sessionStorage.setItem('projectsLoaded', 'true');
        } catch (e) {
          // ignore session storage errors
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!suppressLoading) setLoading(false);
      }
    };

    try {
      const cached = sessionStorage.getItem('projectsCache');
      const loadedFlag = sessionStorage.getItem('projectsLoaded');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) setProjects(parsed);
      }

      if (loadedFlag === 'true') {
        // already fetched this session — don't show loader, fetch in background
        setLoading(false);
        fetchProjects(true);
      } else {
        // first time in session: show loader
        fetchProjects(false);
      }
    } catch (e) {
      fetchProjects(false);
    }
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.utils.toArray(".project-card").forEach((card: any) => {
          gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
              opacity: 1, 
              y: 0, 
              duration: 1, 
              ease: "power3.out",
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

          {/* Cleaned up implementation using the new component */}
          <FeaturedProjects projects={projects.slice(0, 4)} loading={loading} />
        </section>

        <Features />
        <CTA />
      </div>
    </SEO>
  );
};