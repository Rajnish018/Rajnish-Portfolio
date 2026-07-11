import React, { useEffect, useMemo, useState } from 'react';

const ProjectSlideshow: React.FC<{ 
  images: string | string[]; 
  alt: string; 
  className?: string; 
}> = ({ images, alt, className = '' }) => {
  const imageArray = useMemo(() => (Array.isArray(images) ? images : [images]), [images]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageArray.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [imageArray.length]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {imageArray.map((imgUrl, idx) => (
          <div key={imgUrl + idx} className="w-full h-full flex-shrink-0 relative">
            <img
              src={imgUrl}
              alt={`${alt} - Slide ${idx + 1}`}
              className={`${className} w-full h-full object-cover`}
            />
          </div>
        ))}
      </div>

      {imageArray.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {imageArray.map((_, idx) => (
            <button
              key={`dot-${idx}`}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => goToIndex(idx)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                idx === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectSlideshow;
