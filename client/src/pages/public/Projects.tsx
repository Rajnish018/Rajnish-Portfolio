import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, LayoutGrid, Smartphone, Cpu } from 'lucide-react';
import { Project } from '../../types';
import { getProjectsApi } from '@/src/services/apiService';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjectsApi();
        // console.log("response",response)
        setProjects(response);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
    fetchProjects();
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

  // Animation variants for the container (stagger effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // Animation variants for individual cards
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } // Smooth cubic-bezier
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 px-4 md:px-6 pb-20 max-w-7xl mx-auto overflow-x-hidden">
      {/* Header with scroll reveal */}
      <motion.header 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-20"
      >
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold leading-[1.1] mb-6 md:mb-8">
          Visionary <span className="accent-gradient">Constructions.</span>
        </h1>
        <p className="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
          Exploring the intersection of high-performance architecture and digital seamlessness. Each project represents a synthesis of technical rigor and ethereal aesthetics.
        </p>
      </motion.header>

      {/* Filter Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col gap-4 mb-12 md:mb-16"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Filter By</span>
        <div className="flex items-center gap-3 overflow-x-auto pb-4 md:pb-0 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilter(cat.name)}
              className={`flex items-center px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                filter === cat.name
                  ? 'bg-accent text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]'
                  : 'bg-white/5 border border-white/5 hover:bg-white/10 text-white/60'
              }`}
            >
              <span className="mr-2 opacity-70">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }} // Triggers slightly before it enters center view
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 text-center"
            >
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2 font-bold">
                No Projects Found
              </p>
              <p className="text-white/20 text-[10px]">
                Try changing the filter or add new projects
              </p>
            </motion.div>
          ) : (
            filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                layout
                variants={itemVariants} // Inherits visibility from parent container or uses viewport
                whileInView="visible"
                viewport={{ once: true }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group glass-card overflow-hidden flex flex-col h-full"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent/90 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest text-white">
                    {project.status}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <h3 className="text-xl md:text-2xl font-display font-bold mb-3 group-hover:text-accent transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6 flex-1 line-clamp-3 md:line-clamp-none">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-[9px] uppercase tracking-tighter text-white/40">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center justify-between pt-5 border-t border-white/10">
                    <a
                      href={project.githubLink || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                    >
                      <Github size={14} className="mr-2" /> GitHub
                    </a>
                    <a
                      href={project.previewLink || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center px-4 py-2 rounded-lg bg-white/5 hover:bg-accent text-white transition-all text-[10px] font-bold uppercase tracking-widest"
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
  );
};
