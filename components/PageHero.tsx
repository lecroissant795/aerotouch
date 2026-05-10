
import React from 'react';

interface PageHeroProps {
  title: string;
  description?: string;
  image: string;
}

export const PageHero: React.FC<PageHeroProps> = ({ title, description, image }) => {
  return (
    <div className="relative h-[48vh] min-h-[360px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {image && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight drop-shadow-md">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
