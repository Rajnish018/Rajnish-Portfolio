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
    const resumeUrl = "/Rajnish_Kumar_Resume.pdf";
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Rajnish_Kumar_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (

    <SEO
      title="About Rajnish Kumar | Full Stack & AI Developer | Next.js, React, Machine Learning"
      description="Learn about Rajnish Kumar, a Full Stack and AI Developer specializing in React, Next.js, Node.js, Machine Learning, and Deep Learning. Explore skills, experience, and technical expertise in building scalable and intelligent applications."
      keywords="about Rajnish Kumar, full stack developer, AI developer, next.js developer, react developer, machine learning engineer, deep learning, MERN stack, tensorflow"
      url="https://rajnish-kumar-portfolio.vercel.app/about"
      image="https://rajnish-kumar-portfolio.vercel.app/og-ai-portfolio.png"
    >
      <div className="min-h-screen pt-32 px-6 pb-20 max-w-7xl mx-auto">
        {/* Header Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 w-full aspect-square rounded-full border-2 border-accent/30 p-4"
            >
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-accent/10">
                <img
                  src="https://picsum.photos/seed/architect/800/800"
                  alt="Profile"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </motion.div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-accent text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
              Available for Hire
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full -z-10 animate-pulse" />
          </div>

          <div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-8">
              I build <span className="accent-gradient">digital worlds</span> through architecture.
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-12">
              Architect by training, digital experience designer by passion. I bridge the gap between physical space and digital interfaces.
            </p>
            <div className="flex flex-wrap gap-6">
              <a href="mailto:yourname@example.com" className="px-8 py-4 bg-accent rounded-xl font-medium hover:bg-accent/80 transition-all hover:scale-105 flex items-center">
                Let&apos;s Collaborate <ExternalLink size={18} className="ml-2" />
              </a>
              <button onClick={handleDownloadResume} className="px-8 py-4 glass-card font-medium hover:bg-white/10 transition-all hover:scale-105 flex items-center">
                Download Resume <Download size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Professional Journey */}
          <section className="flex-1 w-full">
            <div className="flex items-center gap-4 mb-16">
              <div className="h-px flex-1 bg-white/10" />
              <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Professional Journey</h2>
              <div className="h-px w-12 bg-accent" />
            </div>

            <div className="space-y-16 relative">
              <div className="absolute left-0 top-2 bottom-0 w-px bg-linear-to-b from-accent via-white/20 to-transparent" />
              {experience.length === 0 ? (
                <div className="text-center py-20 bg-white/2 rounded-2xl border border-dashed border-white/10">
                  <p className="text-white/40 text-sm uppercase tracking-widest">No Experience Added</p>
                </div>
              ) : (
                experience.map((exp, i) => (
                  <motion.div key={exp._id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="relative pl-10 group">
                    <div className="absolute top-2 -left-1.25 w-2.75 h-2.75 rounded-full bg-background border-2 border-accent shadow-[0_0_10px_rgba(124,58,237,0.5)] group-hover:bg-accent transition-colors duration-300" />
                    <div className="flex flex-wrap justify-between items-baseline mb-3 gap-4">
                      <h3 className="text-2xl font-display font-bold text-white/90 group-hover:text-accent transition-colors">{exp.role}</h3>
                      <span className="text-[11px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 font-mono tracking-tighter">{exp.period}</span>
                    </div>
                    <p className="text-accent text-sm mb-6 font-semibold uppercase tracking-widest">{exp.company}</p>
                    <p className="text-white/50 text-base leading-relaxed max-w-2xl italic">&quot;{exp.description}&quot;</p>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* Skills Matrix with Tabs */}
          <section>
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px w-12 bg-accent" />
              <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Skill Matrix</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 mb-10">
              {skills?.categories?.map((cat) => (
                <button
                  key={cat.categoryName}
                  onClick={() => setActiveCategory(cat.categoryName)}
                  className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${activeCategory === cat.categoryName
                      ? "bg-accent border-accent text-white"
                      : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
                    }`}
                >
                  {cat.categoryName}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-6 mb-12">
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
                        className="glass-card p-6 hover:border-accent/50 transition-colors group flex flex-col justify-between min-h-40"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent transition-colors">
                              <div className="w-4 h-4 rounded bg-current" style={{ color: catColor }} />
                            </div>
                            <span className="text-xs font-mono text-white/40 group-hover:text-white transition-colors">{skill.level}%</span>
                          </div>
                          <h3 className="text-sm font-bold mb-3 text-white/80 group-hover:text-white">{skill.name}</h3>
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