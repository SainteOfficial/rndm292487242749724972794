import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SmoothCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(true);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Only show on desktop
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 1024px)').matches ||
                'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 10);
            cursorY.set(e.clientY - 10);
            setIsVisible(true);
        };

        const handleEnter = () => setIsVisible(true);
        const handleLeave = () => setIsVisible(false);

        // Track hoverable elements
        const addHoverListeners = () => {
            const interactives = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .cursor-pointer');
            interactives.forEach(el => {
                el.addEventListener('mouseenter', () => setIsHovering(true));
                el.addEventListener('mouseleave', () => setIsHovering(false));
            });
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseenter', handleEnter);
        document.addEventListener('mouseleave', handleLeave);

        // Re-scan interactive elements periodically
        addHoverListeners();
        const observer = new MutationObserver(() => {
            setTimeout(addHoverListeners, 100);
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseenter', handleEnter);
            document.removeEventListener('mouseleave', handleLeave);
            window.removeEventListener('resize', checkMobile);
            observer.disconnect();
        };
    }, []);

    if (isMobile) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
            style={{ x, y }}
            animate={{
                opacity: isVisible ? 1 : 0,
                scale: isHovering ? 2 : 1,
            }}
            transition={{
                scale: { type: 'spring', stiffness: 300, damping: 20 },
                opacity: { duration: 0.2 },
            }}
        >
            <div
                className="w-5 h-5 rounded-full bg-white/80"
                style={{ willChange: 'transform' }}
            />
        </motion.div>
    );
};

export default SmoothCursor;
