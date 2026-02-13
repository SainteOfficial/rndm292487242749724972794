import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setIsVisible(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const circumference = 2 * Math.PI * 22;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.7, y: 20, filter: 'blur(8px)' }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 group"
          aria-label="Back to top"
        >
          {/* Progress Ring */}
          <svg className="w-13 h-13 -rotate-90" viewBox="0 0 52 52" style={{ width: 52, height: 52 }}>
            <circle
              cx="26" cy="26" r="22"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1.5"
            />
            <circle
              cx="26" cy="26" r="22"
              fill="none"
              stroke="url(#btt-gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - scrollProgress / 100)}
              className="transition-all duration-100"
            />
            <defs>
              <linearGradient id="btt-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14A79D" />
                <stop offset="100%" stopColor="#EBA530" />
              </linearGradient>
            </defs>
          </svg>

          {/* Button Inner */}
          <div className="absolute inset-[5px] flex items-center justify-center rounded-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/[0.04] group-hover:border-[#14A79D]/20 transition-all duration-300">
            <ChevronUp className="w-4 h-4 text-white/50 group-hover:text-[#14A79D] transition-colors duration-300" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;