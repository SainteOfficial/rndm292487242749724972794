import React from 'react';
import { motion } from 'framer-motion';

const carBrands = [
  'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Porsche',
  'Tesla', 'Toyota', 'Honda', 'Ford', 'Chevrolet',
  'Lamborghini', 'Ferrari', 'Maserati', 'Bentley', 'Rolls-Royce'
];

export const MarqueeLogos = () => {
  return (
    <div className="relative overflow-hidden py-10 bg-[#16181f]/30">
      <div className="absolute inset-0 bg-gradient-to-r from-[#13141d] via-transparent to-[#13141d] z-10" />
      
      <div className="flex overflow-hidden">
        <motion.div
          animate={{
            x: [0, -2000],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20, // Faster animation
              ease: "linear",
            },
          }}
          className="flex whitespace-nowrap"
        >
          {[...carBrands, ...carBrands].map((brand, index) => (
            <motion.span
              key={index}
              whileHover={{ scale: 1.1 }}
              className="mx-8 text-white/60 hover:text-white text-xl font-semibold transition-colors cursor-default"
            >
              {brand}
            </motion.span>
          ))}
        </motion.div>

        {/* Second row moving in opposite direction */}
        <motion.div
          animate={{
            x: [-2000, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25, // Slightly different speed for visual interest
              ease: "linear",
            },
          }}
          className="flex whitespace-nowrap"
        >
          {[...carBrands, ...carBrands].map((brand, index) => (
            <motion.span
              key={index}
              whileHover={{ scale: 1.1 }}
              className="mx-8 text-white/60 hover:text-white text-xl font-semibold transition-colors cursor-default"
            >
              {brand}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};