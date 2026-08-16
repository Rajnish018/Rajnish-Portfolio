import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ExternalLink, Github, LayoutGrid, Smartphone, Cpu } from 'lucide-react';
import { Project } from '../../../types';
import { getProjectsApi } from '@/src/services/apiService';
import SEO from '@/src/components/SEO';
import Loader from '@/src/components/Loader';
import ProjectSlideshow from '../../../components/ProjectSlideshow';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  // Sliding filter-indicator position, measured from real button positions
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const fetchProjects = async (suppressLoading = false) => {
      try {
        const response = await getProjectsApi();
        if (import.meta.env.DEV) {
          console.log("[projects] fetched in component:", response);
        }
        setProjects(response);
        try {
          sessionStorage.setItem('projectsCache', JSON.stringify(response));
          sessionStorage.setItem('projectsLoaded', 'true');
        } catch (e) {
          // ignore sessionStorage errors
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        if (!suppressLoading) setLoading(false);
      }
    };

    try {
      const cached = sessionStorage.getItem('projectsCache');
      const loadedFlag = sessionStorage.getItem('projectsLoaded');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
        }
      }
      if (loadedFlag === 'true') {
        setLoading(false);
        fetchProjects(true);
      } else {
        fetchProjects(false);
      }
    } catch (e) {
      fetchProjects(false);
    }
  }, []);

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.category.includes(filter));

  const categories = [
    { name: 'All', icon: <LayoutGrid size={14} /> },
    { name: 'Web', icon: <LayoutGrid size={14} /> },
    { name: 'AI', icon: <Cpu size={14} /> },
    { name: 'Mobile', icon: <Smartphone size={14} /> }
  ];

  const updateIndicator = () => {
    const container = filterContainerRef.current;
    const activeBtn = buttonRefs.current[filter];
    if (!container || !activeBtn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - containerRect.left,
      top: btnRect.top - containerRect.top,
      width: btnRect.width,
      height: btnRect.height,
    });
  };

  useEffect(() => {
    updateIndicator();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Animation variants — collapse to instant opacity-only when the user
  // has asked their OS for reduced motion, instead of sliding y-30.
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const headerMotionProps = prefersReducedMotion
    ? { initial: { opacity: 1, y: 0 }, whileInView: { opacity: 1, y: 0 } }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.8 }
      };

  const renderHeaderAndFilters = () => (
    <>
      <motion.header
        {...headerMotionProps}
        viewport={{ once: true }}
        className="mb-12 md:mb-20"
      >
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold leading-[1.1] mb-6 md:mb-8 break-words">
          Visionary <span className="accent-gradient">Constructions.</span>
        </h1>
        <p className="text-white/80 text-base md:text-lg max-w-2xl leading-relaxed">
          Explore full stack, AI, and machine learning projects built using React, Next.js, Node.js, and TensorFlow. Each project demonstrates scalable web development, deep learning models, and real-world problem-solving.
        </p>
      </motion.header>

      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col gap-3 sm:gap-4 mb-12 md:mb-16"
      >
        <span className="text-sm uppercase tracking-[0.3em] text-white/70 font-bold">Filter By</span>

        <div
          ref={filterContainerRef}
          className="relative grid grid-cols-4 sm:flex sm:flex-wrap gap-1 sm:gap-3 p-1 sm:p-0 rounded-2xl sm:rounded-none bg-white/5 sm:bg-transparent border border-white/10 sm:border-none"
        >
          {/* Single sliding indicator — animates from its real current position
              to the new button's real position, so it naturally moves forward
              or backward depending on which tab was clicked. */}
          <motion.span
            className="absolute bg-accent rounded-xl sm:rounded-full shadow-[0_0_20px_rgba(124,58,237,0.3)] pointer-events-none"
            animate={{
              left: indicator.left,
              top: indicator.top,
              width: indicator.width,
              height: indicator.height,
            }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 30 }
            }
            style={{ willChange: "transform" }}
          />

          {categories.map((cat) => (
            <button
              key={cat.name}
              ref={(el) => { buttonRefs.current[cat.name] = el; }}
              aria-pressed={filter === cat.name}
              onClick={() => setFilter(cat.name)}
              className={`relative z-10 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-5 py-2.5 rounded-xl sm:rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${filter === cat.name
                ? 'text-white'
                : 'text-white/60 hover:text-white sm:bg-white/5 sm:border sm:border-white/5 sm:hover:bg-white/10'
                }`}
            >
              <span className="opacity-70">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );

  if (loading) {
    return (
      <SEO
        title="Projects | Full Stack, AI & Machine Learning Portfolio | React, Next.js"
        description="Explore full stack, AI, and machine learning projects built with React, Next.js, Node.js, and TensorFlow. Discover web applications, deep learning models, and real-world software solutions."
        keywords="react projects, next.js projects, machine learning projects, AI projects, full stack projects, MERN stack projects, deep learning portfolio"
        url="https://rajnish-kumar-portfolio.vercel.app/projects"
        image="https://rajnish-kumar-portfolio.vercel.app/og-ai-portfolio.png"
      >
        <div className="min-h-screen pt-24 md:pt-32 px-4 md:px-6 pb-20 max-w-7xl mx-auto overflow-x-hidden">
          {renderHeaderAndFilters()}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[40vh] items-center">
            <div className="col-span-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <Loader key="loading" />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </SEO>
    );
  }

  return (
    <SEO
      title="Projects | Full Stack, AI & Machine Learning Portfolio | React, Next.js"
      description="Explore full stack, AI, and machine learning projects built with React, Next.js, Node.js, and TensorFlow. Discover web applications, deep learning models, and real-world software solutions."
      keywords="react projects, next.js projects, machine learning projects, AI projects, full stack projects, MERN stack projects, deep learning portfolio"
      url="https://rajnish-kumar-portfolio.vercel.app/projects"
      image="https://rajnish-kumar-portfolio.vercel.app/og-ai-portfolio.png"
    >
      <div className="min-h-screen pt-24 md:pt-32 px-4 md:px-6 pb-20 max-w-7xl mx-auto overflow-x-hidden">
        {renderHeaderAndFilters()}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center px-4"
              >
                <p className="text-white/70 text-sm uppercase tracking-widest mb-2 font-bold">
                  No Projects Found
                </p>
                <p className="text-white/80 text-sm">
                  Try changing the filter or add new projects
                </p>
              </motion.div>
            ) : (
              filteredProjects.map((project) => (
                <motion.div
                  key={project._id}
                  layout={!prefersReducedMotion}
                  variants={itemVariants}
                  whileInView="visible"
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group glass-card overflow-hidden flex flex-col h-full"
                >
                  <div className="relative aspect-16/10 overflow-hidden">
                    <ProjectSlideshow
                      images={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-white">
                      {project.status}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold mb-3 group-hover:text-accent transition-colors leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1 line-clamp-3 md:line-clamp-none">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {(project.tags || []).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] uppercase tracking-tighter text-white/40">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-white/10 gap-2">
                      <a
                        href={project.githubLink || "#"}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${project.title} source code on GitHub`}
                        className="flex items-center text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors shrink-0"
                      >
                        <Github size={14} className="mr-2" /> GitHub
                      </a>
                      <a
                        href={project.previewLink || "#"}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View live demo of ${project.title}`}
                        className="flex items-center px-4 py-2 rounded-lg bg-white/5 hover:bg-accent text-white transition-all text-[10px] font-bold uppercase tracking-widest shrink-0"
                      >
                        Preview <ExternalLink size={12} className="ml-2" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </SEO>
  );
};