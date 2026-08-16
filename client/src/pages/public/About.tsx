import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, ExternalLink } from 'lucide-react';
import { SkillSet } from '../../types';
import InteractiveQuote from '../../components/Quote';
import { getExperienceApi, getSkillsApi } from '@/src/services/apiService';
import SEO from '@/src/components/SEO';

export const About: React.FC = () => {
  const [experience, setExperience] = useState<any[]>([]);
  const [skills, setSkills] = useState<SkillSet | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");


  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await getSkillsApi();
        setSkills(response);
        if (response?.categories?.length > 0) {
          setActiveCategory(response.categories[0].categoryName);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await getExperienceApi();
        const sorted = data.sort((a: any, b: any) => {
          const getYear = (p: string) => parseInt(p.split("—")[0]);
          return getYear(b.period) - getYear(a.period);
        });
        setExperience(sorted);
      } catch (error) {
        console.error("Error fetching experience:", error);
      }
    };
    fetchExperience();
  }, []);

  const handleDownloadResume = () => {
    window.open("/Rajnish_Kumar_Resume.pdf", "_blank");
 
};

  return (

    <SEO
      title="About Rajnish Kumar | Full Stack & AI Developer | Next.js, React, Machine Learning"
      description="Learn about Rajnish Kumar, a Full Stack and AI Developer specializing in React, Next.js, Node.js, Machine Learning, and Deep Learning. Explore skills, experience, and technical expertise in building scalable and intelligent applications."
      keywords="about Rajnish Kumar, full stack developer, AI developer, next.js developer, react developer, machine learning engineer, deep learning, MERN stack, tensorflow"
      url="https://rajnish-kumar-portfolio.vercel.app/about"
      image="https://rajnish-kumar-portfolio.vercel.app/og-ai-portfolio.png"
    >
      <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 pb-20 max-w-7xl mx-auto overflow-x-hidden">
        {/* Header Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center mb-20 sm:mb-24 lg:mb-32">
          <div className="relative w-48 sm:w-64 md:w-80 lg:w-full mx-auto lg:mx-0">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 w-full aspect-square rounded-full border-2 border-accent/30 p-3 sm:p-4"
            >
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-accent/10">
                <img
                  src="https://picsum.photos/seed/architect/800/800"
                  alt="Profile"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent text-[8px] sm:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
              Available for Hire
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full -z-10 animate-pulse" />
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 sm:mb-8">
              I build <span className="accent-gradient">digital worlds</span> through architecture.
            </h1>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 sm:mb-12">
              Architect by training, digital experience designer by passion. I bridge the gap between physical space and digital interfaces.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center lg:justify-start">
              <a href="mailto:yourname@example.com" className="px-6 sm:px-8 py-3.5 sm:py-4 bg-accent rounded-xl font-medium hover:bg-accent/80 transition-all hover:scale-105 flex items-center justify-center">
                Let&apos;s Collaborate <ExternalLink size={18} className="ml-2" />
              </a>
              <button onClick={handleDownloadResume} className="px-6 sm:px-8 py-3.5 sm:py-4 glass-card font-medium hover:bg-white/10 transition-all hover:scale-105 flex items-center justify-center">
                Download Resume <Download size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 sm:gap-16 lg:gap-20">
          {/* Professional Journey */}
          <section className="flex-1 w-full">
            <div className="flex items-center gap-4 mb-10 sm:mb-16">
              <div className="h-px flex-1 bg-white/10" />
              <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-center">Professional Journey</h2>
              <div className="h-px w-8 sm:w-12 bg-accent" />
            </div>

            <div className="space-y-12 sm:space-y-16 relative">
              <div className="absolute left-0 top-2 bottom-0 w-px bg-linear-to-b from-accent via-white/20 to-transparent" />
              {experience.length === 0 ? (
                <div className="text-center py-16 sm:py-20 bg-white/2 rounded-2xl border border-dashed border-white/10 px-4">
                  <p className="text-white/40 text-sm uppercase tracking-widest">No Experience Added</p>
                </div>
              ) : (
                experience.map((exp, i) => (
                  <motion.div key={exp._id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="relative pl-8 sm:pl-10 group">
                    <div className="absolute top-2 -left-1.25 w-2.75 h-2.75 rounded-full bg-background border-2 border-accent shadow-[0_0_10px_rgba(124,58,237,0.5)] group-hover:bg-accent transition-colors duration-300" />
                    <div className="flex flex-wrap justify-between items-baseline mb-3 gap-2 sm:gap-4">
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-white/90 group-hover:text-accent transition-colors">{exp.role}</h3>
                      <span className="text-[10px] sm:text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 font-mono tracking-tighter shrink-0">{exp.period}</span>
                    </div>
                    <p className="text-accent text-xs sm:text-sm mb-4 sm:mb-6 font-semibold uppercase tracking-widest">{exp.company}</p>
                    <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-2xl italic">&quot;{exp.description}&quot;</p>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Skills Matrix with Tabs */}
          <section>
            <div className="flex items-center gap-4 mb-8 sm:mb-12">
              <div className="h-px w-8 sm:w-12 bg-accent" />
              <h2 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-tight text-center">Skill Matrix</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10">
              {skills?.categories?.map((cat) => (
                <button
                  key={cat.categoryName}
                  onClick={() => setActiveCategory(cat.categoryName)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all border ${activeCategory === cat.categoryName
                      ? "bg-accent border-accent text-white"
                      : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                    }`}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-10 sm:mb-12">
              <AnimatePresence mode="wait">
                {skills?.categories
                  ?.find(cat => cat.categoryName === activeCategory)
                  ?.items.map((skill, i) => {
                    const catColor = skills?.categories?.find(c => c.categoryName === activeCategory)?.config?.hex || '#7C3AED';
                    return (
                      <motion.div
                        key={`${activeCategory}-${skill.name}`}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        viewport={{ once: true }}
                        className="glass-card p-3 sm:p-5 md:p-6 hover:border-accent/50 transition-colors group flex flex-col justify-between min-h-28 sm:min-h-36 md:min-h-40"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                            <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent transition-colors">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-current" style={{ color: catColor }} />
                            </div>
                            <span className="text-[10px] sm:text-xs font-mono text-white/40 group-hover:text-white transition-colors">{skill.level}%</span>
                          </div>
                          <h3 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 text-white/80 group-hover:text-white leading-snug">{skill.name}</h3>
                        </div>

                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          {/* 🔥 Progress Bar Animation with whileInView */}
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{
                              duration: 1.5,
                              ease: "circOut",
                              delay: (i * 0.1) + 0.2 // Slight additional delay after card appears
                            }}
                            viewport={{ once: true }}
                            className="h-full bg-accent"
                            style={{ backgroundColor: catColor }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>

            <InteractiveQuote />
          </section>
        </div>
      </div>
    </SEO>
  );
};