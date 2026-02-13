import React, { useRef, useEffect, ReactNode } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  width?: 'fit-content' | '100%';
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  once?: boolean;
  blur?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  width = '100%',
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  once = true,
  blur = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    margin: "-8% 0px -8% 0px"
  });
  const controls = useAnimation();

  const getInitialPosition = (): { x?: number; y?: number } => {
    switch (direction) {
      case 'up': return { y: 40 };
      case 'down': return { y: -40 };
      case 'left': return { x: 40 };
      case 'right': return { x: -40 };
      case 'none': return {};
      default: return { y: 40 };
    }
  };

  const variants = {
    hidden: {
      opacity: 0,
      filter: blur ? 'blur(8px)' : 'blur(0px)',
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={variants}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollReveal;