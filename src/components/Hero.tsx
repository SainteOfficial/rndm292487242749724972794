import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Sparkles } from 'lucide-react';

const images = [
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2560", // Audi GT
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2560", // BMW M
    "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2560", // Porsche
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2560", // Mercedes
];

export const Hero = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 6000); // Change image every 6 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-[#050505]">
            {/* Background Slider with Ken Burns Effect */}
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }} // Smooth Crossfade
                    className="absolute inset-0 z-0"
                >
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.1 }}
                        transition={{ duration: 10, ease: "linear" }} // Slow Zoom (Ken Burns)
                        className="w-full h-full"
                    >
                        <img
                            src={images[index]}
                            alt="Premium Car"
                            className="w-full h-full object-cover object-center"
                        />
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/40 to-[#050505] z-10" />
            <div className="absolute inset-0 bg-black/20 z-10" />

            {/* Content */}
            <div className="relative z-20 h-full flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-[#14A79D]" />
                        <span className="text-sm font-medium text-white/90">Premium Experience</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white mb-8"
                    >
                        <span className="block mb-2">Drive</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#14A79D] via-[#2DD4BF] to-[#EBA530]">
                            Excellence
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.9 }}
                        className="text-lg sm:text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Erleben Sie Performance und Luxus. <br className="hidden sm:block" />
                        Handverlesene Premium-Fahrzeuge für höchste Ansprüche.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            to="/showroom"
                            className="group w-full sm:w-auto px-8 py-4 bg-[#14A79D] hover:bg-[#118f86] text-white rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(20,167,157,0.3)] hover:shadow-[0_0_30px_rgba(20,167,157,0.5)]"
                        >
                            Fahrzeuge ansehen
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            to="/contact"
                            className="group w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-semibold border border-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Phone className="w-5 h-5 opacity-70" />
                            Kontakt aufnehmen
                        </Link>
                    </motion.div>

                </div>
            </div>

            {/* Slider Progress Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};
