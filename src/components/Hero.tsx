import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Phone, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const fallbackSlides = [
    { kicker: 'Premium Automobile', headline: 'Exzellenz\nerleben.', subtitle: 'Handverlesene Fahrzeuge für höchste Ansprüche — TÜV-geprüft mit Garantie.' },
    { kicker: 'Luxus & Performance', headline: 'Ihr Traum\nwartet.', subtitle: 'BMW, Mercedes, Audi, Porsche und mehr — alle in bestem Zustand.' },
    { kicker: 'Vertrauen & Qualität', headline: 'Drive\nExcellence.', subtitle: 'Über 500 zufriedene Kunden und 5+ Jahre Erfahrung im Premium-Segment.' },
    { kicker: 'Autosmaya', headline: 'Premium\nSeit Tag 1.', subtitle: 'Finanzierung, Versicherung und Zulassung — alles aus einer Hand.' },
];

const Hero = () => {
    const [current, setCurrent] = useState(0);
    const [heroImages, setHeroImages] = useState<string[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

    // Fetch car images from Supabase to use as hero backgrounds
    useEffect(() => {
        (async () => {
            try {
                const { data } = await supabase
                    .from('cars')
                    .select('images')
                    .eq('status', 'available')
                    .order('created_at', { ascending: false })
                    .limit(8);
                if (data) {
                    const imgs = data
                        .filter(c => c.images && c.images.length > 0)
                        .map(c => c.images[0])
                        .slice(0, 4);
                    if (imgs.length > 0) {
                        setHeroImages(imgs);
                        setImagesLoaded(new Array(imgs.length).fill(false));
                        // Preload images
                        imgs.forEach((src, i) => {
                            const img = new Image();
                            img.onload = () => setImagesLoaded(prev => { const n = [...prev]; n[i] = true; return n; });
                            img.src = src;
                        });
                    }
                }
            } catch (e) { console.error(e); }
        })();
    }, []);

    const slides = fallbackSlides.slice(0, Math.max(heroImages.length, 1));

    const goTo = useCallback((idx: number) => {
        setCurrent(idx);
    }, []);

    useEffect(() => {
        if (heroImages.length === 0) return;
        const timer = setInterval(() => {
            setCurrent(p => (p + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [heroImages.length, slides.length]);

    const slide = fallbackSlides[current % fallbackSlides.length];
    const currentImage = heroImages[current % heroImages.length];

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background images with Ken Burns zoom */}
            <AnimatePresence mode="sync">
                {currentImage && (
                    <motion.div
                        key={current}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }, scale: { duration: 8, ease: 'linear' } }}
                    >
                        <motion.img
                            src={currentImage}
                            alt=""
                            className="w-full h-full object-cover"
                            animate={{ scale: 1.08 }}
                            transition={{ duration: 8, ease: 'linear' }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fallback gradient if no images */}
            {heroImages.length === 0 && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-[#0a1a18]" />
            )}

            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

            {/* Animated grain texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")', backgroundSize: '128px' }} />

            {/* Admin quick access — subtle top right */}
            <Link to="/admin/login" className="absolute top-24 right-6 md:right-16 lg:right-24 z-20 p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-white/20 hover:text-white/50 transition-all duration-300 backdrop-blur-sm" title="Admin">
                <Settings className="w-4 h-4" />
            </Link>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
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
                                {slide.kicker}
                            </span>
                        </motion.div>

                        {/* Headline — letter by letter stagger per word */}
                        <motion.h1
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.92] tracking-tight mb-6 md:mb-8 whitespace-pre-line"
                        >
                            {slide.headline}
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                            className="text-white/45 text-base md:text-lg max-w-lg mb-10 md:mb-12 leading-relaxed"
                        >
                            {slide.subtitle}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link to="/showroom" className="btn-primary group">
                                Fahrzeuge entdecken
                                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                                    <ArrowRight className="w-4 h-4" />
                                </motion.span>
                            </Link>
                            <a href="tel:+4923069988585" className="btn-outline">
                                <Phone className="w-4 h-4" /> Anrufen
                            </a>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Bottom bar: indicators + scroll hint */}
                <div className="absolute bottom-8 left-6 md:left-16 lg:left-24 right-6 md:right-16 lg:right-24 flex items-center justify-between">
                    {/* Slide indicators as animated lines */}
                    <div className="flex gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className="relative h-[2px] rounded-full overflow-hidden transition-all duration-500"
                                style={{ width: i === current ? 48 : 20, background: 'rgba(255,255,255,0.12)' }}
                            >
                                {i === current && (
                                    <motion.div
                                        className="absolute inset-0 bg-[#14A79D] rounded-full origin-left"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 6, ease: 'linear' }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Scroll hint */}
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
