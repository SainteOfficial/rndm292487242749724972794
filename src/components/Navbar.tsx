import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { name: 'Startseite', path: '/' },
  { name: 'Showroom', path: '/showroom' },
  { name: 'Galerie', path: '/gallery' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Kontakt', path: '/contact' },
];

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(5, 5, 5, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(40px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
            {/* Logo */}
            <Link to="/" className="relative z-10">
              <img src="/logov2.png" alt="Autosmaya" className={`transition-all duration-500 ${scrolled ? 'h-8' : 'h-10'}`} />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="relative px-5 py-2 text-sm tracking-wide transition-colors duration-300"
                    style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={(e) => !isActive && (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                    onMouseLeave={(e) => !isActive && (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-5 right-5 h-[1.5px] bg-[#14A79D] rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+4923069988585"
                className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-300"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+49 2306 9988585</span>
              </a>
              <Link
                to="/showroom"
                className="px-5 py-2 text-sm font-medium text-white bg-[#14A79D] rounded-full hover:bg-[#11968d] transition-all duration-300"
              >
                Showroom
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden relative z-10 p-2 text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#050505] flex flex-col justify-center px-8"
          >
            <nav className="space-y-2">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={link.path}
                      className={`block py-3 text-3xl font-display font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-[#14A79D]' : 'text-white/70 hover:text-white'
                        }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 space-y-4"
            >
              <a
                href="tel:+4923069988585"
                className="flex items-center gap-3 text-white/50 text-sm"
              >
                <Phone className="w-4 h-4" />
                +49 2306 9988585
              </a>
              <Link to="/showroom" className="btn-primary w-full text-center">
                Showroom besuchen
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;