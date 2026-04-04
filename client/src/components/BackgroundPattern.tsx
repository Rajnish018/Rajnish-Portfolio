import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BackgroundPatternProps {
  accentColor?: string; // Default Streetlight Yellow: "253, 186, 45"
  columns?: number;
  rows?: number;
}

const BackgroundPattern: React.FC<BackgroundPatternProps> = ({ 
  accentColor = "253, 186, 45",
  columns,
  rows,
}) => {
  // 1. Dynamic Grid Calculation
  const [dimensions, setDimensions] = useState({ columns: 30, rows: 15 });

  useEffect(() => {
    if (columns && rows) {
      setDimensions({ columns, rows });
      return;
    }

    const updateGrid = () => {
      const width = window.innerWidth;
      if (width < 640) { // Mobile
        setDimensions({ columns: 10, rows: 12 });
      } else if (width < 1024) { // Tablet
        setDimensions({ columns: 20, rows: 14 });
      } else { // Desktop
        setDimensions({ columns: 30, rows: 15 });
      }
    };

    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, [columns, rows]);

  const totalTiles = useMemo(() => dimensions.columns * dimensions.rows, [dimensions]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 w-full h-full grid p-2 sm:p-4 gap-1 sm:gap-2"
        style={{
          gridTemplateColumns: `repeat(${dimensions.columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${dimensions.rows}, minmax(0, 1fr))`,
          '--glow-rgb': accentColor,
        } as React.CSSProperties}
      >
        {[...Array(totalTiles)].map((_, i) => (
          <Tile key={i} />
        ))}
      </motion.div>
    </div>
  );
};

const Tile = () => {
  const randomDelay = useMemo(() => Math.random() * 5, []);
  const randomDuration = useMemo(() => 3 + Math.random() * 2, []);

  return (
    <motion.div
      className="bg-white/[0.02] border border-white/[0.05] rounded-sm cursor-crosshair will-change-transform"
      animate={{
        borderColor: [
          'rgba(255,255,255,0.03)', 
          'rgba(var(--glow-rgb), 0.12)', 
          'rgba(255,255,255,0.03)'
        ],
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      // Disable hover on touch devices to prevent "sticky" hover states
      whileHover={typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches ? {
        scale: 1.2,
        backgroundColor: 'rgba(var(--glow-rgb), 0.25)',
        borderColor: 'rgba(var(--glow-rgb), 0.5)',
        boxShadow: '0 0 15px 1px rgba(var(--glow-rgb), 0.2)',
        zIndex: 50,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      } : {}}
      // Optional: Add a subtle tap effect for mobile
      whileTap={{ scale: 0.95, opacity: 0.5 }}
    />
  );
};

export default BackgroundPattern;
