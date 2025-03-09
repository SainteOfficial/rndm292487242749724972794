import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, width: 0 });
  const navRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Showroom', path: '/showroom' },
    { name: 'Legal', path: '/legal' },
  ];

  useEffect(() => {
    const activeIndex = navLinks.findIndex(link => link.path === location.pathname);
    const activeElement = navRefs.current[activeIndex];
    
    if (activeElement) {
      const rect = activeElement.getBoundingClientRect();
      const parentRect = activeElement.parentElement?.getBoundingClientRect();
      
      if (parentRect) {
        setHighlightPosition({
          x: rect.left - parentRect.left,
          width: rect.width
        });
      }
    }
  }, [location.pathname]);

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const contactButtonVariants = {
    rest: {
      scale: 1
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.nav
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#16181f]/95 backdrop-blur-md py-2 shadow-lg' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center">
              <img 
                src="/logov2.png" 
                alt="Autosmaya Logo" 
                className="h-12 w-auto"
              />
            </Link>
          </motion.div>

          <div className="hidden md:block">
            <div className="relative ml-10 flex items-center">
              <div className="flex relative">
                {/* Background highlight */}
                <motion.div
                  className="absolute bg-[#14A79D] rounded-full"
                  initial={false}
                  animate={{
                    x: highlightPosition.x,
                    width: highlightPosition.width
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                  style={{
                    height: '36px',
                    top: '2px'
                  }}
                />

                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    ref={el => navRefs.current[index] = el}
                    variants={linkVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="relative px-4"
                  >
                    <Link
                      to={link.path}
                      className={`h-[40px] flex items-center justify-center text-sm font-medium transition-colors duration-300 relative z-10 ${
                        location.pathname === link.path
                          ? 'text-white'
                          : 'text-white hover:text-white/90'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <motion.div
              variants={contactButtonVariants}
              initial="rest"
              whileHover="hover"
            >
              <Link
                to="/contact"
                className="bg-gradient-to-r from-[#14A79D] to-[#EBA530] text-white px-6 py-2 rounded-full font-medium inline-block hover:shadow-lg hover:shadow-[#14A79D]/20 transition-all duration-300"
              >
                Kontaktieren Sie uns
              </Link>
            </motion.div>
          </div>

          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#16181f]/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      location.pathname === link.path
                        ? 'bg-gradient-to-r from-[#14A79D] to-[#EBA530] text-white'
                        : 'text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="pt-2 mt-2 border-t border-gray-700"
              >
                <Link
                  to="/contact"
                  className="block px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-[#14A79D] to-[#EBA530] text-white text-center transition-all duration-300 hover:scale-95"
                  onClick={() => setIsOpen(false)}
                >
                  Kontaktieren Sie uns
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;