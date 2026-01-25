import React from 'react';
import { motion } from 'framer-motion';

const brands = [
  { name: "BMW", logo: "https://www.carlogos.org/car-logos/bmw-logo-2020-blue-white-show.png" },
  { name: "Mercedes-Benz", logo: "https://www.carlogos.org/logo/Mercedes-Benz-logo-2011-1920x1080.png" },
  { name: "Audi", logo: "https://www.carlogos.org/car-logos/audi-logo-2016.png" },
  { name: "Porsche", logo: "https://www.carlogos.org/logo/Porsche-logo-2008-1920x1080.png" },
  { name: "Tesla", logo: "https://www.carlogos.org/car-logos/tesla-logo-2007.png" },
  { name: "Volkswagen", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png" },
  { name: "Ferrari", logo: "https://www.carlogos.org/car-logos/ferrari-logo-1947.png" },
  { name: "Lamborghini", logo: "https://www.carlogos.org/car-logos/lamborghini-logo-2014.png" },
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