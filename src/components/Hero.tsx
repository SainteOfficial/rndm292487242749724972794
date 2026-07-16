import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Settings, Search, ShieldCheck, Star, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Fixed luxury background image (Unsplash dark luxury car)
    const heroImage = "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2560&auto=format&fit=crop";

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/showroom?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <section className="relative h-[85vh] min-h-[700px] max-h-[900px] w-full overflow-hidden bg-[#050505]">
            {/* Static Background Image with subtle constant scale */}
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <img
                    src={heroImage}
                    alt="Premium Luxury Car"
                    className="w-full h-full object-cover object-center"
                />
            </motion.div>

            {/* Premium Overlays */}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/50 to-transparent" />

            {/* Animated grain texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")', backgroundSize: '128px' }} />

            {/* Admin quick access */}
            <Link to="/admin/login" className="absolute top-24 right-6 md:right-16 lg:right-24 z-20 p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/20 hover:text-white/50 transition-all duration-300 backdrop-blur-sm" title="Admin">
                <Settings className="w-4 h-4" />
            </Link>

            {/* Main Content Area */}
            <div className="relative z-10 h-full flex flex-col justify-center pb-20 pt-10 px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Kicker with animated line */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center gap-3 mb-4 md:mb-6"
                        >
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="w-8 h-[1.5px] bg-[#14A79D] origin-left"
                            />
                            <span className="text-[#14A79D] text-xs md:text-sm font-medium tracking-[0.25em] uppercase">
                                Premium Automobile
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6 md:mb-8 whitespace-pre-line"
                        >
                            Exzellenz{'\n'}erleben.
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="text-white/60 text-lg md:text-xl max-w-xl mb-10 md:mb-12 leading-relaxed"
                        >
                            Handverlesene Premium-Fahrzeuge für höchste Ansprüche. TÜV-geprüft, mit Garantie und voller Historie.
                        </motion.p>

                        {/* Search Widget & CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col gap-8 max-w-xl"
                        >
                            {/* Glassmorphism Search Box */}
                            <form 
                                onSubmit={handleSearch}
                                className="relative p-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center shadow-2xl shadow-black/50"
                            >
                                <div className="pl-4 pr-2 text-white/40">
                                    <Search className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Fahrzeug finden (z.B. Mercedes AMG)..."
                                    className="flex-1 bg-transparent border-none text-white placeholder-white/30 focus:outline-none py-3 px-2 text-base md:text-lg"
                                />
                                <button
                                    type="submit"
                                    className="px-6 md:px-8 py-3.5 bg-[#14A79D] text-white font-medium rounded-xl hover:bg-[#118f86] transition-colors shadow-lg shadow-[#14A79D]/20 flex items-center gap-2 group"
                                >
                                    Suchen
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                            
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Scroll hint */}
                <div className="absolute bottom-8 left-6 md:left-16 lg:left-24 right-6 md:right-16 lg:right-24 flex items-center justify-between">
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="hidden md:flex items-center gap-2 text-white/25 text-xs tracking-widest uppercase"
                    >
                        <span>Scrollen</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
