import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  { name: "BMW", logo: "https://cdn.simpleicons.org/bmw/white" },
  { name: "Mercedes-Benz", logo: "https://cdn.simpleicons.org/mercedes/white" },
  { name: "Audi", logo: "https://cdn.simpleicons.org/audi/white" },
  { name: "Porsche", logo: "https://cdn.simpleicons.org/porsche/white" },
  { name: "Tesla", logo: "https://cdn.simpleicons.org/tesla/white" },
  { name: "Volkswagen", logo: "https://cdn.simpleicons.org/volkswagen/white" },
  { name: "Ferrari", logo: "https://cdn.simpleicons.org/ferrari/white" },
  { name: "Lamborghini", logo: "https://cdn.simpleicons.org/lamborghini/white" },
];

export const MarqueeLogos: React.FC = () => {
  // Double the brands for seamless loop
  const allBrands = [...brands, ...brands, ...brands];

  return (
    <div className="relative w-full overflow-hidden py-12">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <motion.div
        className="flex items-center gap-16"
        animate={{
          x: ['0%', '-33.33%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          },
        }}
      >
        {allBrands.map((brand, index) => (
          <div
            key={`${brand.name}-${index}`}
            className="flex-shrink-0 group"
          >
            <div className="w-24 h-16 flex items-center justify-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeLogos;