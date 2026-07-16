import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#14A79D]/5 rounded-full blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-[#EBA530]/5 rounded-full blur-[80px]"
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative text-center max-w-lg">
        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-[8rem] md:text-[12rem] font-display font-bold leading-none tracking-tighter">
            <span className="gradient-text">4</span>
            <span className="text-white/10">0</span>
            <span className="gradient-text">4</span>
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4 tracking-tight">
            Seite nicht gefunden
          </h2>
          <p className="text-white/40 text-base mb-10 max-w-md mx-auto leading-relaxed">
            Die gesuchte Seite existiert leider nicht oder wurde verschoben. 
            Stöbern Sie in unserem Showroom oder kehren Sie zur Startseite zurück.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" /> Startseite
          </Link>
          <Link to="/showroom" className="btn-outline">
            <Search className="w-4 h-4" /> Showroom
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
