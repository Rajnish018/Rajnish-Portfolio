import React, { useState, useEffect } from 'react';
import Loader from './Loader';

// 1. Updated Project Interface to accept multiple images
interface Project {
  _id?: string;
  title: string;
  description?: string;
  image: string | string[]; // Can be a single string URL or an array of strings
  category?: string;
  tags?: string[];
}

interface FeaturedProjectsProps {
  projects: Project[];
  loading: boolean;
}

import ProjectSlideshow from './ProjectSlideshow';

// 2. Reusable Slideshow Component is extracted to components/ProjectSlideshow.tsx

// 3. Main Featured Projects Component
const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects, loading }) => {
  useEffect(() => {
      
  }, [projects]);
  if (loading) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center">
        <Loader message="Synchronizing Archive..." />
      </div>
    );
  }

  if (projects.length === 0) {
    return <p className="text-white/20 text-sm italic">Archive is currently empty.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* BIG CARD (First Project) */}
      {projects[0] && (
        <div className="project-card group relative overflow-hidden rounded-3xl aspect-16/10 glass-card border-white/5">
          <ProjectSlideshow 
            images={projects[0].image} 
            alt={projects[0].title}
            className="opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 p-10 z-10">
            <div className="flex gap-2 mb-4">
              {projects[0].tags?.slice(0, 3).map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-accent/20 backdrop-blur-md border border-accent/20 text-[9px] uppercase tracking-widest text-accent rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-4xl font-display font-bold mb-3">{projects[0].title}</h3>
            <p className="text-white/50 text-sm max-w-sm line-clamp-2">{projects[0].description}</p>
          </div>
        </div>
      )}

      {/* SECONDARY SIDE CONTAINER */}
      <div className="flex flex-col gap-10">
        {/* SECONDARY WIDE CARD (Second Project) */}
        {projects[1] && (
          <div className="project-card group relative overflow-hidden rounded-3xl aspect-video glass-card border-white/5">
            <ProjectSlideshow 
              images={projects[1].image} 
              alt={projects[1].title}
              className="opacity-40 group-hover:opacity-70 group-hover:scale-105 transition duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 p-8 z-10">
              <span className="text-accent text-[9px] uppercase tracking-[0.2em] font-bold mb-2 block">
                {projects[1].category}
              </span>
              <h3 className="text-2xl font-display font-bold mb-2">{projects[1].title}</h3>
              <p className="text-white/40 text-xs line-clamp-2">{projects[1].description}</p>
            </div>
          </div>
        )}

        {/* MINI GRID (Third & Fourth Projects) */}
        <div className="grid grid-cols-2 gap-10">
          {projects.slice(2, 4).map((proj, i) => (
            <div key={proj._id || i} className="project-card group relative overflow-hidden rounded-3xl aspect-square glass-card border-white/5">
              <ProjectSlideshow 
                images={proj.image} 
                alt={proj.title}
                className="opacity-30 group-hover:opacity-60 transition duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/90 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-6 z-10">
                <span className="text-white/30 text-[8px] uppercase tracking-widest mb-1 block">
                  {proj.category}
                </span>
                <h3 className="text-lg font-display font-bold group-hover:text-accent transition-colors">
                  {proj.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;