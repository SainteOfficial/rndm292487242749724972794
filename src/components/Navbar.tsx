import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Phone, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.1);
    y.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Showroom', path: '/showroom' },
    { name: 'Galerie', path: '/gallery' },
    { name: 'Kontakt', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <>
      {/* Main Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'py-3' : 'py-6'
          }`}
      >
        {/* Glassmorphic Background */}
        <motion.div
          className={`absolute inset-0 transition-all duration-500 ${scrolled
              ? 'bg-black/60 backdrop-blur-2xl border-b border-white/[0.03]'
              : 'bg-transparent'
            }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <MagneticButton>
              <Link to="/" className="relative group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <img
                    src="/logov2.png"
                    alt="Autosmaya"
                    className="h-10 md:h-12 w-auto transition-all duration-300"
                  />
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-[#14A79D]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </Link>
            </MagneticButton>

            {/* Desktop Navigation - Floating Pill */}
            <nav className="hidden lg:block absolute left-1/2 -translate-x-1/2">
              <motion.div
                className={`
                  flex items-center gap-1 px-2 py-2 rounded-full
                  transition-all duration-500
                  ${scrolled
                    ? 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.05]'
                    : 'bg-white/[0.02] backdrop-blur-lg border border-white/[0.03]'
                  }
                `}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;

                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onMouseEnter={() => setHoveredLink(link.name)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className="relative px-5 py-2.5"
                    >
                      {/* Active/Hover Background */}
                      <AnimatePresence>
                        {(isActive || hoveredLink === link.name) && (
                          <motion.div
                            layoutId="navPill"
                            className={`absolute inset-0 rounded-full ${isActive
                                ? 'bg-gradient-to-r from-[#14A79D] to-[#14A79D]/80'
                                : 'bg-white/[0.05]'
                              }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                          />
                        )}
                      </AnimatePresence>

                      <span className={`relative z-10 text-sm font-medium tracking-wide transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60 hover:text-white'
                        }`}>
                        {link.name}
                      </span>
                    </Link>
                  );
                })}
              </motion.div>
            </nav>

            {/* Right Section - CTA */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Phone */}
              <MagneticButton>
                <a
                  href="tel:+4923069988585"
                  className="flex items-center gap-2 px-4 py-2.5 text-white/60 hover:text-white transition-colors duration-300"
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">+49 2306 9988585</span>
                </a>
              </MagneticButton>

              {/* CTA Button */}
              <MagneticButton>
                <Link
                  to="/contact"
                  className="group relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative flex items-center gap-2 px-6 py-3 rounded-full overflow-hidden"
                  >
                    {/* Animated Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#14A79D] via-[#1bc9bd] to-[#14A79D] bg-[length:200%_100%] animate-shimmer" />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {/* Glow */}
                    <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(20,167,157,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <Sparkles className="w-4 h-4 text-white relative z-10" />
                    <span className="text-sm font-semibold text-white relative z-10">
                      Beratung
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </motion.div>
                </Link>
              </MagneticButton>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.05]"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <motion.span
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 7 : 0
                  }}
                  className="block w-full h-0.5 bg-white rounded-full origin-left"
                />
                <motion.span
                  animate={{
                    opacity: isOpen ? 0 : 1,
                    x: isOpen ? -10 : 0
                  }}
                  className="block w-full h-0.5 bg-white rounded-full"
                />
                <motion.span
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -7 : 0
                  }}
                  className="block w-full h-0.5 bg-white rounded-full origin-left"
                />
              </div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
              onClick={() => setIsOpen(false)}
            />

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.5 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="absolute -top-40 -left-40 w-96 h-96 bg-[#14A79D]/20 rounded-full blur-[100px]"
              />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.3 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#EBA530]/15 rounded-full blur-[100px]"
              />
            </div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="relative h-full flex flex-col justify-center px-8"
            >
              {/* Navigation Links */}
              <nav className="space-y-2">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;

                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ delay: i * 0.08 + 0.15 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center justify-between py-4 border-b border-white/[0.05]"
                      >
                        <div className="flex items-center gap-4">
                          {isActive && (
                            <motion.div
                              layoutId="mobileActive"
                              className="w-1.5 h-1.5 rounded-full bg-[#14A79D]"
                            />
                          )}
                          <span className={`text-3xl font-light tracking-tight ${isActive ? 'text-[#14A79D]' : 'text-white/80 group-hover:text-white'
                            } transition-colors duration-300`}>
                            {link.name}
                          </span>
                        </div>

                        <ArrowUpRight className={`w-6 h-6 transition-all duration-300 ${isActive ? 'text-[#14A79D]' : 'text-white/30 group-hover:text-white/60'
                          } group-hover:translate-x-1 group-hover:-translate-y-1`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="
                    flex items-center justify-center gap-3 w-full py-4 rounded-2xl
                    bg-gradient-to-r from-[#14A79D] to-[#14A79D]/80
                    text-white font-semibold text-lg
                  "
                >
                  <Sparkles className="w-5 h-5" />
                  Kostenlose Beratung
                </Link>

                <a
                  href="tel:+4923069988585"
                  className="flex items-center justify-center gap-2 mt-4 py-3 text-white/60"
                >
                  <Phone className="w-4 h-4" />
                  +49 2306 9988585
                </a>
              </motion.div>

              {/* Legal */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-8 left-8 right-8 flex items-center justify-center gap-6 text-sm text-white/30"
              >
                <Link to="/legal" onClick={() => setIsOpen(false)} className="hover:text-white/50 transition-colors">
                  Impressum
                </Link>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <Link to="/legal" onClick={() => setIsOpen(false)} className="hover:text-white/50 transition-colors">
                  Datenschutz
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Add shimmer animation to tailwind
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .animate-shimmer {
    animation: shimmer 3s linear infinite;
  }
`;
document.head.appendChild(style);

export default Navbar;