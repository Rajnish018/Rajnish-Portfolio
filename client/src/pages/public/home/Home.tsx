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
import FeaturedProjects from '../../../components/FeaturedProjects';

gsap.registerPlugin(ScrollTrigger);

export const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      try {
        const cached = sessionStorage.getItem("projectsCache");

        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0 && mounted) {
              setProjects(parsed);
              setLoading(false);
            }
          } catch {
            sessionStorage.removeItem("projectsCache");
          }
        }

        const data = await getProjectsApi();
        if (!mounted) return;

        if (Array.isArray(data)) {
          setProjects(data);
          sessionStorage.setItem("projectsCache", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProjects();
    return () => { mounted = false; };
  }, []);

  useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    const animateCards = (yOffset: number, duration: number, ease: string) => {
      gsap.utils.toArray(".project-card").forEach((card: any) => {
        gsap.fromTo(card,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            duration,
            ease,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "bottom 20%",
              toggleActions: "play none none reverse", // show on the way down, hide on the way back up
              // markers: true, // uncomment while debugging trigger points
            },
          }
        );
      });
    };

    mm.add("(min-width: 768px)", () => animateCards(50, 1, "power3.out"));
    mm.add("(max-width: 767px)", () => animateCards(20, 0.6, "power2.out"));
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".project-card", { opacity: 1, y: 0 });
    });

    // Recalculate trigger positions once images/layout settle,
    // otherwise cards can hide/show at the wrong scroll offset.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = setTimeout(refresh, 500); // catch late image loads
    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(t);
    };
  }, containerRef);

  return () => ctx.revert();
}, [projects, loading]); // re-run once loading flips false and real cards mount

  return (
    <SEO
      title="Rajnish Kumar | Full Stack & AI Developer (Next.js, React, Machine Learning)"
      description="Rajnish Kumar is a Full Stack & AI Developer specializing in React, Next.js, Node.js, Machine Learning, and Deep Learning. Explore innovative projects, AI-powered applications, and scalable web solutions."
      keywords="Rajnish Kumar, full stack developer, AI developer, next.js developer, react developer, machine learning projects, deep learning, MERN stack, tensorflow portfolio"
      url="https://rajnish-kumar-portfolio.vercel.app/"
      image="https://rajnish-kumar-portfolio.vercel.app/og-ai-portfolio.png"
    >
      <div ref={containerRef} className="min-h-screen pt-16 md:pt-24 bg-background text-white overflow-x-hidden">
        <Hero />

        {/* Featured Works Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 md:py-20 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0 mb-10 sm:mb-16 border-b border-white/5 pb-6 sm:pb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 uppercase tracking-tight">
                Featured Works
              </h2>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.3em]">
                Selected Experiments 2024-2026
              </p>
            </div>
            <Link
              to="/projects"
              className="flex items-center text-white/40 hover:text-accent transition-all text-[10px] uppercase tracking-[0.2em] self-start sm:self-auto"
            >
              Explore Archive <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>

          <FeaturedProjects projects={projects.slice(0, 4)} loading={loading} />
        </section>

        <Features />
        <CTA />
      </div>
    </SEO>
  );
};