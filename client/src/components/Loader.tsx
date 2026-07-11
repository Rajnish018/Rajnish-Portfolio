import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Synchronizing Archive..." }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 font-mono text-xs uppercase tracking-widest text-white/40">
      <div className="relative flex h-10 w-10 items-center justify-center">
        {/* Animated expanding outer ring */}
        <div className="absolute h-full w-full animate-ping rounded-full bg-purple-500/30 opacity-75 duration-1000" />
        
        {/* Solid core circle */}
        <div className="relative h-4 w-4 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
      </div>
      
      {/* Optional loading text */}
      {message && <span className="animate-pulse">{message}</span>}
    </div>
  );
};

export default Loader;