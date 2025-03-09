import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 50 };
      case 'down': return { y: -50 };
      case 'left': return { x: 50 };
      case 'right': return { x: -50 };
      default: return { y: 50 };
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start({
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
          duration,
          delay,
          ease: "easeOut"
        }
      });
    }
  }, [isInView, controls, delay, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ ...getInitialPosition(), opacity: 0 }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;