import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Award, Star, Car, Gauge, Settings, Users, Mail, ChevronDown, Heart, ChevronLeft, ChevronRight, RepeatIcon, Share2, User } from 'lucide-react';
import { MarqueeLogos } from '../components/MarqueeLogos';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

// Verbesserte Struktur der Testimonials ohne Bilder
const testimonials = [
  {
    name: "Michael S.",
    text: "Der Service bei Autosmaya war erstklassig. Das Team hat sich Zeit genommen, alle meine Fragen zu beantworten und mir geholfen, den perfekten BMW zu finden.",
    rating: 5,
    car: "BMW 5er",
    date: "Oktober 2023",
    color: "#14A79D"
  },
  {
    name: "Laura W.",
    text: "Ich war zunächst skeptisch, aber der gesamte Kaufprozess verlief absolut reibungslos. Mein Mercedes ist in einem hervorragenden Zustand und zu einem fairen Preis.",
    rating: 5,
    car: "Mercedes E-Klasse",
    date: "Januar 2024",
    color: "#f97316"
  },
  {
    name: "Thomas K.",
    text: "Sehr kompetente Beratung und faire Preisgestaltung. Mein Audi A6 wurde vor der Übergabe perfekt aufbereitet und sieht aus wie neu.",
    rating: 4,
    car: "Audi A6",
    date: "März 2024",
    color: "#8b5cf6"
  },
  {
    name: "Sophie M.",
    text: "Ich hatte einige spezielle Anforderungen und das Team hat alles getan, um diese zu erfüllen. Der Porsche ist genau wie beschrieben - ich bin begeistert!",
    rating: 5,
    car: "Porsche Macan",
    date: "Dezember 2023",
    color: "#ec4899"
  },
  {
    name: "Andreas H.",
    text: "Die Transparenz und Ehrlichkeit hat mich überzeugt. Ein kleines Problem nach dem Kauf wurde sofort und kulant behoben. So sollte es sein!",
    rating: 4,
    car: "VW Golf GTI",
    date: "Februar 2024", 
    color: "#3b82f6"
  }
];

// Verbesserte Marken mit realistischeren Logos
const brands = [
  {
    name: "BMW",
    logo: "https://www.carlogos.org/car-logos/bmw-logo-2020-blue-white-show.png"
  },
  {
    name: "Mercedes-Benz",
    logo: "https://www.carlogos.org/logo/Mercedes-Benz-logo-2011-1920x1080.png"
  },
  {
    name: "Audi",
    logo: "https://www.carlogos.org/car-logos/audi-logo-2016.png"
  },
  {
    name: "Porsche",
    logo: "https://www.carlogos.org/logo/Porsche-logo-2008-1920x1080.png"
  },
  {
    name: "Tesla",
    logo: "https://www.carlogos.org/car-logos/tesla-logo-2007.png"
  },
  {
    name: "Volkswagen",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Volkswagen_logo_2019.svg/2048px-Volkswagen_logo_2019.svg.png"
  },
  {
    name: "Ferrari",
    logo: "https://www.carlogos.org/car-logos/ferrari-logo-1947.png"
  },
  {
    name: "Lamborghini",
    logo: "https://www.carlogos.org/car-logos/lamborghini-logo-2014.png"
  }
];

// Kompakte Vorteile für "Warum Autosmaya"
const benefits = [
  { 
    icon: Shield, 
    title: "Garantierte Qualität", 
    desc: "Lückenlose Fahrzeughistorie & 12 Monate Garantie",
    color: "#14A79D"
  },
  { 
    icon: Clock, 
    title: "Einfacher Prozess", 
    desc: "Schneller, transparenter Kauf ohne Wartezeiten",
    color: "#f97316" 
  },
  { 
    icon: Award, 
    title: "Premium-Auswahl", 
    desc: "Nur geprüfte Top-Fahrzeuge renommierter Hersteller",
    color: "#8b5cf6" 
  },
  { 
    icon: Star, 
    title: "Persönlicher Service", 
    desc: "Individuell auf Ihre Wünsche abgestimmt",
    color: "#ec4899" 
  }
];

const Home = () => {
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('carFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const toggleFavorite = (carId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setFavorites(prev => {
      if (prev.includes(carId)) {
        return prev.filter(id => id !== carId);
      } else {
        return [...prev, carId];
      }
    });
  };

  useEffect(() => {
    localStorage.setItem('carFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    fetchFeaturedCars();
    
    // Carousel auto-rotation
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available') // Only fetch available cars
        .limit(3)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const parsedCars = data?.map(car => ({
        ...car,
        specs: typeof car.specs === 'string' ? JSON.parse(car.specs) : car.specs,
        condition: typeof car.condition === 'string' ? JSON.parse(car.condition) : car.condition,
        additionalFeatures: car.additionalfeatures
      })) || [];

      setFeaturedCars(parsedCars);
    } catch (error) {
      console.error('Error fetching featured cars:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Neuer innovativer Hero mit Split-Design */}
      <motion.section
        ref={heroRef}
        className="min-h-[85vh] md:min-h-screen relative overflow-hidden"
      >
        {/* Beibehaltene Hintergrund-Elemente */}
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[15%] w-20 md:w-40 h-20 md:h-40 rounded-full bg-gradient-to-br from-[#14A79D]/30 to-[#00ffdd]/20 mix-blend-screen blur-3xl animate-float1"></div>
          <div className="absolute top-[50%] right-[10%] w-32 md:w-56 h-32 md:h-56 rounded-full bg-gradient-to-tr from-orange-500/20 to-yellow-400/10 mix-blend-screen blur-3xl animate-float2"></div>
          <div className="absolute bottom-[15%] left-[25%] w-40 md:w-72 h-40 md:h-72 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-400/10 mix-blend-screen blur-3xl animate-float3"></div>
          
          <div className="absolute inset-0 bg-[url('/particles-dot.svg')] opacity-10 animate-pulse"></div>
        </div>

        {/* Overlay mit verstärkter Deckkraft auf Mobile */}
        <motion.div className="absolute inset-0 z-10 bg-gradient-to-r from-black/95 via-black/85 to-black/95 md:from-black/90 md:via-black/70 md:to-black/90" />
        
        {/* Background Image - beibehalten */}
        <motion.div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=3583&auto=format&fit=crop')] bg-cover bg-center"
          style={{ scale: heroScale }}
        />

        {/* KOMPLETT NEUER HERO-BEREICH MIT FUTURISTISCHEM DESIGN */}
        <div className="absolute inset-0 z-30 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full px-4 sm:px-6">
            {/* Hauptinhalt */}
            <div className="h-full flex items-center justify-center">
              {/* Zentrale Content Box mit Glaseffekt */}
              <motion.div
                style={{ y: heroTextY, opacity: heroOpacity }}
                className="max-w-4xl relative z-10 text-center px-4 md:px-0"
              >
                {/* Moderne, professionelle Headline */}
                <div className="mb-10 relative mt-6">
                  <div className="h-10 md:h-20"></div>
                </div>
                
                {/* Moderne, professionelle Headline */}
                <div className="mb-6 md:mb-10 relative">
                  {/* Hauptüberschrift mit gestaffeltem Reveal-Effekt */}
                  <div className="overflow-hidden mb-2">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                    >
                      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-white uppercase">
                        Luxuriöse
                      </h1>
                    </motion.div>
                  </div>
                  
                  <div className="overflow-hidden">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                    >
                      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#14A79D] via-white to-[#14A79D]">
                        Fahrerlebnisse
                      </h1>
                    </motion.div>
                  </div>
                </div>
                
                {/* Beschreibungstext mit Splitscreen-Layout */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="relative max-w-2xl mx-auto mb-8 md:mb-12"
                >
                  <div className="px-4 md:px-6">
                    <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed font-light">
                      <span className="text-white/90">Premium Autoerlebnis</span> – Einzigartige Fahrzeuge, die höchsten Ansprüchen gerecht werden. <span className="text-[#14A79D]">Autosmaya</span> steht für Exklusivität, Qualität und erstklassigen Service.
                    </p>
                  </div>
                  
                  {/* Verbesserter Divider mit Animationseffekt */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "60px" }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mx-auto h-px bg-gradient-to-r from-[#14A79D]/40 via-[#14A79D] to-[#14A79D]/40 my-6 md:my-8"
                  ></motion.div>
                  
                  {/* Statistiken in horizontaler Reihe - aktualisiert */}
                  <div className="grid grid-cols-3 gap-4 md:gap-6">
                    {[
                      { label: "FAHRZEUGE", value: "150+" },
                      { label: "GARANTIE", value: "12 MO" },
                      { label: "ERFAHRUNG", value: "5 J" }
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + (i * 0.1) }}
                        className="flex flex-col items-center"
                      >
                        <div className="text-white font-light text-xl sm:text-2xl md:text-3xl tracking-wide">{stat.value}</div>
                        <div className="text-gray-400 text-[10px] md:text-xs tracking-[0.2em] mt-1 md:mt-2 font-light">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Dual CTA Buttons mit modernen Effekten */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4"
                >
                  <Link
                    to="/showroom"
                    className="group bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-[#14A79D]/30 px-6 md:px-10 py-3 md:py-4 rounded-md transition-all duration-300 overflow-hidden relative w-full sm:w-auto"
                  >
                    {/* Hover-Effekt */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#14A79D]/0 via-[#14A79D]/20 to-[#14A79D]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    
                    <span className="relative z-10 flex items-center justify-center text-white group-hover:text-white tracking-wide font-light text-sm md:text-base">
                      <span className="relative mr-2 overflow-hidden flex">
                        <span className="transition-transform duration-500 group-hover:-translate-y-full">KOLLEKTION</span>
                        <span className="absolute inset-0 transition-transform duration-500 translate-y-full group-hover:translate-y-0">ENTDECKEN</span>
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                  
                  <Link
                    to="/contact"
                    className="group bg-[#14A79D] hover:bg-[#14A79D]/90 text-white px-6 md:px-10 py-3 md:py-4 rounded-md transition-all duration-300 overflow-hidden relative w-full sm:w-auto"
                  >
                    {/* Shine-Effekt beim Hover */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shine"></div>
                    
                    <span className="relative z-10 flex items-center justify-center tracking-wide font-light text-sm md:text-base">
                      <span className="mr-2">KONTAKT</span>
                      <Mail className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Moderne Scroll-Indicator mit Kreisen - nur auf Desktop */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex flex-col items-center cursor-pointer"
                onClick={() => {
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                  });
                }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#14A79D]"></div>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60"></div>
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Compact mobile-friendly sections */}
      <div className="bg-[#16181f]">
        {/* Combined Benefits & Brands Section for better mobile experience */}
        <section className="py-12 md:py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#16181f] to-[#101217] z-0"></div>
          
          {/* Verbesserte Hintergrundeffekte */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14A79D]/30 to-transparent"></div>

          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5 z-0"></div>
          
          <div className="absolute top-1/4 right-1/5 w-64 h-64 rounded-full bg-[#14A79D]/10 blur-3xl z-0"></div>
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl z-0"></div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* KOMPLETT NEU GESTALTET: Warum Autosmaya? */}
            <div className="relative z-20 pb-20">
              {/* Kreative 3D-Hintergrundeffekte */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Subtiler Gradient-Hintergrund */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#16181f] to-[#121318] opacity-80"></div>
                
                {/* Angepasste Hintergrundmuster */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05] bg-repeat"></div>
                
                {/* Horizontale Trennlinie oben, wie in anderen Abschnitten */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14A79D]/30 to-transparent"></div>
                
                {/* Spezielle Lichteffekte */}
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#14A79D]/10 via-[#14A79D]/5 to-transparent blur-3xl opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-orange-500/3 to-transparent blur-3xl opacity-60"></div>
                
                {/* Subtile Animationen für mehr Dynamik, passend zum Hero-Bereich */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.4, 0.3]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 10,
                    ease: "easeInOut" 
                  }}
                  className="absolute top-[20%] right-[30%] w-32 h-32 rounded-full bg-[#14A79D]/10 mix-blend-screen blur-3xl"
                />
                
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 13,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute bottom-[30%] left-[20%] w-40 h-40 rounded-full bg-gradient-to-br from-orange-500/8 to-transparent mix-blend-screen blur-3xl"
                />
                
                {/* Schwebende Partikel, ähnlich wie im Featured Cars Bereich */}
                <div className="absolute inset-0 overflow-hidden opacity-30">
                  <motion.div
                    animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                    className="absolute top-[15%] left-[45%] w-1 h-1 rounded-full bg-[#14A79D]/80"
                  />
                  <motion.div
                    animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[60%] left-[25%] w-1.5 h-1.5 rounded-full bg-orange-500/50"
                  />
                  <motion.div
                    animate={{ y: [0, -25, 0], x: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 1 }}
                    className="absolute top-[40%] right-[30%] w-1 h-1 rounded-full bg-white/50"
                  />
                </div>
              </div>
              
              {/* Überschrift mit 3D-Tiefeneffekt */}
              <div className="relative mx-auto max-w-7xl px-6 lg:px-8 mb-16 pt-16">
                <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="text-center"
                >
                  {/* Dekorativer Abzeichen */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#14A79D]/20 to-[#14A79D]/5 backdrop-blur-sm"
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#14A79D] to-[#11968d] flex items-center justify-center shadow-lg shadow-[#14A79D]/20">
                      <Star className="h-6 w-6 text-white" fill="white" />
                    </div>
                  </motion.div>
                  
                  {/* Überschriften-Stack mit 3D-Effekt */}
                  <div className="relative">
                    {/* Schattenkopie für Tiefeneffekt */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 0.1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.4 }}
                      className="absolute left-1/2 -translate-x-[50.5%] translate-y-[3px] w-full text-center invisible sm:visible"
                    >
                      <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-black">
                        Luxuriöse Fahrerlebnisse
                      </span>
                    </motion.div>
                    
                    {/* Hauptüberschrift */}
                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.3 }}
                      className="text-3xl md:text-5xl lg:text-6xl font-bold relative z-10"
                    >
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14A79D] via-white to-[#14A79D]">
                        Luxuriöse Fahrerlebnisse
                      </span>
                    </motion.h2>
                  </div>
                  
                  {/* Untertitel mit schwebendem Highlight */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-6 max-w-3xl mx-auto relative bg-gradient-to-r from-black/40 via-transparent to-black/40 backdrop-blur-sm px-8 py-6 rounded-xl border border-white/5"
                  >
                    <div className="absolute -left-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br from-[#14A79D]/40 to-transparent blur-xl animate-pulse-slow opacity-70"></div>
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/30 to-transparent blur-xl animate-pulse-slow opacity-60"></div>
                    
                    {/* Horizontal line decoration */}
                    <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-[#14A79D]/40 to-transparent"></div>
                    <div className="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#14A79D]/40 to-transparent"></div>
                    
                    <p className="text-xl md:text-2xl text-white relative z-10 font-bold text-center mb-2">
                      Warum sich unsere Kunden für <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14A79D] to-white">Autosmaya</span> entscheiden
                    </p>
                    
                    <p className="text-sm md:text-base text-gray-300 text-center relative z-10">
                      Exklusive Auswahl, persönlicher Service und kompromisslose Qualität auf höchstem Niveau
                    </p>
                  </motion.div>
                  
                  {/* Dekorativer Trennstrich */}
                  <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100px" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-0.5 bg-gradient-to-r from-transparent via-[#14A79D] to-transparent mx-auto mt-8 mb-12"
                  ></motion.div>
                </motion.div>
              </div>
              
              {/* Premium-Vorteile in 3D-Karten */}
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.15
                    }
                  }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="mx-auto max-w-7xl px-6 lg:px-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        show: { 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                          }
                        }
                      }}
                      whileHover={{ 
                        y: -5,
                        transition: { 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 10 
                        }
                      }}
                      className="group relative"
                    >
                      {/* 3D-Karte mit Glaseffekt */}
                      <div className="relative h-full transform perspective-1000 transition-all duration-500 group-hover:rotate-y-12">
                        {/* Schwebender Schatten */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#14A79D]/20 to-transparent rounded-2xl opacity-0 blur-xl group-hover:opacity-100 transition-opacity duration-700"></div>
                        
                        {/* Karteninhalt mit Glaseffekt */}
                        <div className="relative h-full rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-6 shadow-xl overflow-hidden group-hover:border-[#14A79D]/20 transition-all duration-500">
                          {/* Hintergrundeffekte */}
                          <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] opacity-[0.02]"></div>
                          <div 
                            className="absolute right-0 top-0 -mr-16 -mt-16 w-40 h-40 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-xl"
                            style={{ background: `radial-gradient(circle at center, ${benefit.color}30, transparent)` }}
                          ></div>
                          
                          {/* Leuchtender Icon-Container */}
                          <div className="mb-6 relative z-10">
                            <div className="relative w-14 h-14 rounded-xl flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110">
                              {/* Leuchtender Hintergrund */}
                              <div 
                                className="absolute inset-0 rounded-xl opacity-20 group-hover:opacity-100 transition-all duration-700"
                                style={{ background: `linear-gradient(135deg, ${benefit.color}40, ${benefit.color}00)` }}
                              ></div>
                              
                              {/* Icon mit Glow-Effekt */}
                              <benefit.icon 
                                className="w-7 h-7 relative z-10 transition-all duration-500 group-hover:scale-110" 
                                style={{ color: benefit.color }} 
                              />
                              
                              {/* Leuchteffekt beim Hover */}
                              <div 
                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                                style={{ boxShadow: `0 0 20px 2px ${benefit.color}40` }}
                              ></div>
                            </div>
                            
                            {/* Dekorative Akzentlinie */}
                            <div 
                              className="absolute top-7 -left-6 h-px w-4 opacity-0 group-hover:opacity-100 group-hover:w-5 transition-all duration-700"
                              style={{ background: benefit.color }}
                            ></div>
                          </div>
                          
                          {/* Titel mit Hover-Effekt */}
                          <h3 
                            className="text-xl font-bold mb-3 transition-all duration-500"
                            style={{ color: benefit.color }}
                          >
                            {benefit.title}
                          </h3>
                          
                          {/* Beschreibung */}
                          <p className="text-gray-300 text-sm">{benefit.desc}</p>
                          
                          {/* Schwebender Pfeil am unteren Rand */}
                          <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-2 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-500">
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ repeat: Infinity, duration: 2, repeatType: "loop", ease: "easeInOut" }}
                            >
                              <ArrowRight className="w-4 h-4" style={{ color: benefit.color }} />
                            </motion.div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Numerischer Indikator */}
                      <div 
                        className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br shadow-lg z-20 transition-transform duration-500 group-hover:scale-110"
                        style={{ 
                          background: `linear-gradient(135deg, ${benefit.color}, ${benefit.color}80)`,
                          boxShadow: `0 5px 15px -5px ${benefit.color}80`
                        }}
                      >
                        {index + 1}
                      </div>
              </motion.div>
            ))}
                </div>
          </motion.div>
              
              {/* Vertrauenszeichen mit 3D-Badge-Effekt */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="mt-20 max-w-7xl mx-auto px-6 lg:px-8"
              >
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#14A79D]/10 to-transparent backdrop-blur-sm border border-white/5 p-8 md:p-10">
                  {/* Hintergrundeffekte */}
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#14A79D]/20 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>
                  
                  <div className="relative z-10">
                    {/* 3D-Badge */}
                    <div className="flex justify-center mb-8">
                      <motion.div
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: 360 }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 15,
                          ease: "linear"
                        }}
                        className="relative w-24 h-24 perspective-1000"
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#14A79D] to-[#11968d] transform preserve-3d rotate-y-0 backface-hidden"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#11968d] to-[#14A79D] transform preserve-3d rotate-y-180 backface-hidden"></div>
                        <div className="absolute inset-4 rounded-full flex items-center justify-center bg-gradient-to-br from-black/50 to-black/70 transform-gpu preserve-3d z-10">
                          <Shield className="w-10 h-10 text-white" />
                        </div>
                      </motion.div>
                    </div>
                    
                    <div className="text-center mb-10">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Vertrauenswürdige Premium-Qualität</h3>
                      <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
                        Als führender Anbieter von Premiumfahrzeugen setzen wir höchste Standards für Qualität, Service und Kundenzufriedenheit.
                      </p>
                    </div>
                    
                    {/* Vertrauenszeichen in modernen Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center">
                          <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-bold text-white">4.9/5</div>
                          <div className="text-xs text-gray-400">Kundenzufriedenheit</div>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#14A79D]/20 to-[#14A79D]/10 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-[#14A79D]" />
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-bold text-white">100%</div>
                          <div className="text-xs text-gray-400">TÜV-geprüfte Fahrzeuge</div>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-bold text-white">1000+</div>
                          <div className="text-xs text-gray-400">Zufriedene Kunden</div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
        </div>
      </section>

      {/* Featured Cars Section - Optimized for mobile with cooler effects */}
      <section className="py-14 md:py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#101217] to-[#16181f] z-0"></div>
        
        {/* Verbesserte Hintergrundeffekte */}
        <div className="absolute inset-0 opacity-5 z-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14A79D]/50 to-transparent"></div>
        </div>
        
        {/* Animated Patterns */}
        <div className="absolute inset-0 bg-[url('/car-pattern.svg')] bg-repeat opacity-2 z-0"></div>
        
        {/* Animated particles */}
        <div className="hidden md:block absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-[#14A79D]/40 animate-float-particle1"></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-orange-500/30 animate-float-particle2"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1 h-1 rounded-full bg-white/30 animate-float-particle3"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-block text-white/80 bg-white/5 text-sm font-medium tracking-wider uppercase px-3 py-1 rounded-full mb-3"
            >
              Neueste Angebote
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              <span className="relative">
                Premium-Fahrzeuge
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#14A79D] to-transparent"></span>
              </span>
            </h2>
            <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto mt-4">
              Handverlesene Auswahl exklusiver Fahrzeuge höchster Qualität
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[#14A79D] animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-[#14A79D]/60 animate-spin animate-delay-150"></div>
                <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-[#14A79D]/40 animate-spin animate-delay-300"></div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Neuer Hintergrund mit dynamischen Elementen für die Fahrzeuge */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{ 
                    y: [-10, 10, -10],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 10,
                    ease: "easeInOut"
                  }}
                  className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#14A79D]/10 blur-3xl"
                />
                <motion.div
                  animate={{ 
                    y: [10, -10, 10],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 12,
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-orange-500/5 blur-3xl"
                />
              </div>
              
              {/* Optimiertes Grid-Layout für 1-3 Fahrzeuge */}
              <div className={`grid ${featuredCars.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : 'md:grid-cols-2'} gap-8`}>
              {featuredCars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="group rounded-xl overflow-hidden relative bg-gradient-to-br from-[#1e2029]/90 to-[#16181f]/80 backdrop-blur-md border border-white/5"
                >
                    {/* Hover-Gradient-Effekt für die gesamte Karte */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#14A79D]/0 to-transparent opacity-0 group-hover:opacity-10 transition-all duration-500"></div>
                    
                    {/* Verbesserte Bildanzeige mit Premium-Rahmen */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                      {/* Dekorative Eckelemente für Premium-Look */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#14A79D]/50 z-20"></div>
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#14A79D]/50 z-20"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#14A79D]/50 z-20"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#14A79D]/50 z-20"></div>
                      
                    <img
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                      {/* Premium Overlay mit verbessertem Lichteffekt */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />
                      
                      {/* Dynamischer Schein-Effekt beim Hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#14A79D]/20 via-transparent to-transparent blur-2xl"></div>
                      </div>
                      
                      {/* Animated Pattern Overlay */}
                      <div className="absolute inset-0 bg-[url('/luxury-pattern.svg')] bg-repeat opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                      
                      {/* Enhanced Favorite Button */}
                    <motion.button
                      onClick={(e) => toggleFavorite(car.id, e)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      className={cn(
                          "absolute top-3 right-3 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 z-20",
                        favorites.includes(car.id) 
                          ? "bg-orange-400 shadow-lg shadow-orange-500/20" 
                            : "bg-black/40 hover:bg-black/60 border border-white/10"
                      )}
                    >
                      <Heart 
                        className={cn(
                            "w-5 h-5 md:w-6 md:h-6", 
                          favorites.includes(car.id) 
                            ? "fill-white text-white" 
                            : "text-white"
                        )} 
                      />
                      
                      {/* Pulse effect for favorited cars */}
                      {favorites.includes(car.id) && (
                        <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-30"></div>
                      )}
                    </motion.button>
                    
                      {/* Enhanced Price Tag */}
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute top-3 left-3 bg-gradient-to-r from-[#14A79D] to-[#14A79D]/80 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg z-20"
                    >
                      €{car.price.toLocaleString()}
                    </motion.div>
                  </div>

                    {/* Verbesserte Content-Section */}
                    <div className="p-6 md:p-8 relative">
                      {/* Glaseffekt-Hintergrund für Premium-Look */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#14A79D]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      
                      {/* Animated Accent Line */}
                      <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#14A79D]/40 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                      
                      {/* Fahrzeugdetails mit Premium-Styling */}
                      <div className="mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#14A79D] transition-colors duration-300">
                          {car.brand} {car.model}
                        </h3>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-0.5 w-10 bg-[#14A79D]/60"></div>
                          <p className="text-gray-400 text-sm">{car.year} • {car.specs.fuelType}</p>
                        </div>
                      </div>
                      
                      {/* Specs in Premium 2x2 Grid */}
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#14A79D]/10 flex items-center justify-center">
                            <Car className="w-4 h-4 text-[#14A79D]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Leistung</p>
                            <p className="text-white">{car.specs.power}</p>
                          </div>
                          </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#14A79D]/10 flex items-center justify-center">
                            <Gauge className="w-4 h-4 text-[#14A79D]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Laufleistung</p>
                            <p className="text-white">{car.mileage.toLocaleString()} km</p>
                      </div>
                    </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#14A79D]/10 flex items-center justify-center">
                            <Settings className="w-4 h-4 text-[#14A79D]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Getriebe</p>
                            <p className="text-white">{car.specs.transmission}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#14A79D]/10 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-[#14A79D]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Garantie</p>
                            <p className="text-white">12 Monate</p>
                          </div>
                        </div>
                      </div>

                      {/* Premium Call-to-Action Button */}
                      <Link
                        to={`/car/${car.id}`}
                        className="w-full group inline-flex items-center justify-center relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#14A79D] to-[#0c7b74] rounded-lg"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#14A79D]/80 to-[#0c7b74]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        
                        {/* Shine-Effekt beim Hover */}
                        <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden">
                          <div className="absolute -inset-full h-[200%] w-[200%] transform rotate-45 translate-x-full -translate-y-1/2 bg-white opacity-0 group-hover:opacity-10 group-hover:animate-shine transition-all duration-700"></div>
                        </div>
                        
                        <span className="relative z-10 py-3 px-6 text-white font-medium flex items-center justify-center gap-2">
                          <span>Fahrzeug details</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      </Link>
                  </div>
                </motion.div>
              ))}
                
                {/* Premium Platzhalter-Karte, wenn nur ein Fahrzeug vorhanden ist */}
                {featuredCars.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="hidden md:block rounded-xl overflow-hidden relative bg-gradient-to-br from-[#1e2029]/60 to-[#16181f]/40 backdrop-blur-md border border-white/5"
                  >
                    <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-[#14A79D]/10 flex items-center justify-center mb-4">
                        <Car className="w-6 h-6 text-[#14A79D]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Weitere Fahrzeuge</h3>
                      <p className="text-gray-400 mb-6 max-w-xs">Entdecken Sie unsere komplette Auswahl an Premium-Fahrzeugen in unserem Showroom</p>
                      <Link 
                        to="/showroom"
                        className="bg-transparent border border-[#14A79D]/40 text-white px-6 py-2 rounded-lg hover:bg-[#14A79D]/10 transition-all duration-300 inline-flex items-center gap-2"
                      >
                        <span>Zum Showroom</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10 md:mt-16"
          >
            <Link
              to="/showroom"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#16181f] to-[#1e2029] text-white px-8 py-4 rounded-full hover:shadow-inner transition-all group border border-gray-800 hover:border-[#14A79D]/30 text-sm md:text-base relative overflow-hidden"
            >
              {/* Enhanced hover effect */}
              <div className="absolute inset-0 bg-[#14A79D]/0 group-hover:bg-[#14A79D]/5 transition-colors duration-300"></div>
              <div className="absolute -inset-full h-[200%] w-[200%] transform rotate-45 translate-x-full -translate-y-1/2 bg-white opacity-0 group-hover:opacity-5 group-hover:animate-shimmer-slow transition-all duration-700"></div>
              
              <span className="relative z-10">Alle Fahrzeuge ansehen</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials - More compact version with enhanced animations */}
      <section className="py-14 md:py-20 px-4 relative overflow-hidden">
        {/* Premium Hintergrundelemente */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#16181f]/95 to-[#16181f]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#14A79D_1px,transparent_1px)] [background-size:20px_20px] opacity-5"></div>
        <motion.div
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 right-1/5 w-80 h-80 rounded-full bg-[#14A79D]/5 blur-3xl"
        />
        <motion.div
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/2 left-1/4 w-64 h-64 rounded-full bg-orange-500/5 blur-3xl"
        />
        
        {/* Verbesserte Ziermuster */}
        <div className="absolute inset-0 bg-[url('/quote-pattern.svg')] bg-repeat opacity-[0.02]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14A79D]/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14A79D]/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Premium-Header mit Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            {/* Dekorativer Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#14A79D]/20 to-[#14A79D]/5 backdrop-blur-sm"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#14A79D] to-[#11968d] flex items-center justify-center shadow-lg shadow-[#14A79D]/20">
                <Star className="h-6 w-6 text-white" fill="white" />
              </div>
            </motion.div>
            
            {/* Animierter Header-Text */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative inline-block">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[#14A79D]/20 to-purple-500/20 opacity-30 blur-lg"></div>
                <span className="relative bg-gradient-to-r from-[#14A79D] via-white to-[#14A79D] bg-clip-text text-transparent text-sm font-medium tracking-wider uppercase px-3 py-1 rounded-full">
                  Das sagen unsere Kunden
                </span>
              </div>
              
              <h2 className="mt-6 text-3xl md:text-5xl font-bold text-white">
                <span className="inline-block">Erfahrungen</span>{" "}
                <span className="inline-block relative">
                  zufriedener 
            <motion.div 
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[#14A79D]/10 via-[#14A79D] to-[#14A79D]/10"
              initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
              viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
                </span>{" "}
                <span className="inline-block">Kunden</span>
              </h2>
              
              <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
                Entdecken Sie, warum sich unsere Kunden für Autosmaya entschieden haben und wie 
                wir ihnen geholfen haben, ihr Traumfahrzeug zu finden.
              </p>
            </motion.div>
          </motion.div>

          {/* Verbesserte Testimonial-Anzeige */}
          <div className="relative">
            {/* Fluide Hintergrundeffekte */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ 
                  y: [-30, 30, -30],
                  x: [10, -10, 10],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 20,
                  ease: "easeInOut"
                }}
                className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-[#14A79D]/5 to-transparent blur-3xl"
              />
              <motion.div
                animate={{ 
                  y: [20, -20, 20],
                  x: [-15, 15, -15],
                  opacity: [0.1, 0.15, 0.1]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 25,
                  ease: "easeInOut",
                  delay: 3
                }}
                className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full bg-gradient-to-br from-orange-500/5 to-transparent blur-3xl"
              />
            </div>
            
            {/* Premium-Karussell-Steuerelemente */}
            <div className="flex items-center justify-center gap-8 mb-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => setActiveTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-[#14A79D]/30 flex items-center justify-center transition-all duration-300 group"
              >
                <ChevronLeft className="w-5 h-5 text-white group-hover:text-[#14A79D] transition-colors" />
                <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow bg-[#14A79D]/10 transition-opacity duration-300"></div>
              </motion.button>
              
              {/* Indikator-Punkte */}
              <div className="flex items-center gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className="group outline-none"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      activeTestimonial === index
                        ? "bg-[#14A79D] scale-125"
                        : "bg-white/20 hover:bg-white/40"
                    }`}>
                      <div className={`absolute -inset-1 rounded-full opacity-0 transition-opacity duration-300 ${
                        activeTestimonial === index ? "animate-ping-slow opacity-100 bg-[#14A79D]/30" : ""
                      }`}></div>
                    </div>
                  </button>
                ))}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={() => setActiveTestimonial(prev => (prev + 1) % testimonials.length)}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-[#14A79D]/30 flex items-center justify-center transition-all duration-300 group"
              >
                <ChevronRight className="w-5 h-5 text-white group-hover:text-[#14A79D] transition-colors" />
                <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow bg-[#14A79D]/10 transition-opacity duration-300"></div>
              </motion.button>
            </div>
            
            {/* Verbesserte Testimonial-Karten */}
            <div className="flex overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={activeTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: "spring", damping: 25, stiffness: 150 }}
                  className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8"
                >
                  {/* Hauptkarte */}
                  <div className="md:col-span-2 relative rounded-2xl overflow-hidden">
                    {/* Luxuriöse Karte mit Schattierungseffekten */}
                    <div className="relative h-full bg-gradient-to-br from-[#1c1e27]/90 to-[#16181f]/80 backdrop-blur-md border border-white/10 p-6 md:p-10 overflow-hidden">
                      {/* Dekorative Akzente */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#14A79D]/10 to-transparent blur-3xl"></div>
                      <div className="absolute -left-5 -bottom-5 w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/10 to-transparent blur-2xl"></div>
                      
                      {/* Anführungszeichen */}
                      <div className="mb-2">
                        <div className="relative w-12 h-12 rounded-full bg-[#14A79D]/10 flex items-center justify-center">
                          <span className="text-[#14A79D] text-2xl font-serif">"</span>
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute inset-0 rounded-full border border-[#14A79D]/20"
                          ></motion.div>
                        </div>
                      </div>
                      
                      {/* Haupttestimonial-Text */}
                      <div className="mb-8 md:mb-10">
                        <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                          {testimonials[activeTestimonial].text}
                        </h3>
                      </div>
                      
                      {/* Detaillierte Kundendaten */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br" style={{ 
                              background: `linear-gradient(135deg, ${testimonials[activeTestimonial].color}40, ${testimonials[activeTestimonial].color}10)` 
                            }}>
                              <div className="w-full h-full rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-white">{testimonials[activeTestimonial].name}</p>
                              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                <span>{testimonials[activeTestimonial].date}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                                  className={`w-4 h-4 ${i < testimonials[activeTestimonial].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} 
                        />
                      ))}
                            </div>
                            <span className="text-sm text-gray-400">Kundenbewertung</span>
                          </div>
                    </div>
                
                        <div className="flex items-center p-2 rounded-lg bg-white/5 border border-white/10">
                          <div className="mr-2">
                            <Car className="w-5 h-5" style={{ color: testimonials[activeTestimonial].color }} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-300">Gekauftes Fahrzeug</p>
                            <p className="text-white font-medium">{testimonials[activeTestimonial].car}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sekundäre Karten - Zeigt die nächsten 2 Testimonials an */}
                  <div className="hidden md:flex flex-col gap-5">
                    {[
                      (activeTestimonial + 1) % testimonials.length,
                      (activeTestimonial + 2) % testimonials.length
                    ].map((index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * (index - activeTestimonial) }}
                        className="flex-1 relative rounded-xl overflow-hidden cursor-pointer"
                        onClick={() => setActiveTestimonial(index)}
                      >
                        <div className="h-full bg-gradient-to-br from-[#1c1e27]/70 to-[#16181f]/60 backdrop-blur-sm border border-white/5 p-5 hover:border-[#14A79D]/20 transition-all duration-300 group">
                          {/* Minimierter Text */}
                          <div className="mb-3">
                            <p className="text-gray-300 line-clamp-2 group-hover:text-white transition-colors duration-300">
                              {testimonials[index].text}
                            </p>
                          </div>
                          
                          {/* Kompakte Info */}
                <div className="flex items-center justify-between">
                  <div>
                              <p className="font-medium text-white text-sm">{testimonials[index].name}</p>
                              <div className="flex items-center mt-1">
                                {[...Array(testimonials[index].rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                ))}
                              </div>
                    </div>
                  
                            <div className="flex items-center gap-1.5 text-xs rounded-full px-2 py-1" style={{ 
                              backgroundColor: `${testimonials[index].color}15`,
                              color: testimonials[index].color 
                            }}>
                              <Car className="w-3 h-3" />
                              <span>{testimonials[index].car.split(' ')[0]}</span>
                            </div>
                          </div>
                          
                          {/* Hover-Akzent */}
                  <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: "0%" }}
                            whileHover={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r"
                            style={{ 
                              backgroundImage: `linear-gradient(to right, ${testimonials[index].color}80, ${testimonials[index].color}00)` 
                            }}
                          ></motion.div>
                        </div>
                  </motion.div>
                    ))}
                    </div>
                  </motion.div>
            </AnimatePresence>
            </div>
            
            {/* Verbesserte Statistiken - Zufriedenheitswerte */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10"
            >
              {[
                { label: "Zufriedene Kunden", value: "98%", icon: Users, color: "#14A79D" },
                { label: "Wiederholungskäufer", value: "76%", icon: RepeatIcon, color: "#f97316" },
                { label: "Weiterempfehlungen", value: "9/10", icon: Share2, color: "#8b5cf6" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ 
                      background: `linear-gradient(135deg, ${stat.color}30, ${stat.color}10)` 
                    }}>
                      <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                  
                  {/* Animated progress indicator */}
                  <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: stat.value.includes('/') 
                        ? `${(parseInt(stat.value.split('/')[0]) / parseInt(stat.value.split('/')[1])) * 100}%` 
                        : stat.value.replace('%', '') + '%' 
                      }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.2 + (i * 0.2) }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: stat.color }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
                    </div>
              
          {/* Verbesserter Link zu allen Bewertungen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center mt-10 md:mt-16"
          >
            <Link
              to="/testimonials"
              className="group bg-gradient-to-br from-[#1c1e27]/80 to-[#16181f]/60 hover:from-[#1c1e27] hover:to-[#16181f] backdrop-blur-sm border border-white/5 hover:border-[#14A79D]/20 px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-3"
            >
              <span className="text-white group-hover:text-[#14A79D] transition-colors duration-300">Alle Bewertungen ansehen</span>
              <div className="w-8 h-8 rounded-full bg-[#14A79D]/10 flex items-center justify-center group-hover:bg-[#14A79D]/20 transition-all duration-300">
                <ArrowRight className="w-4 h-4 text-[#14A79D] group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
            </Link>
          </motion.div>
                    </div>
      </section>

      {/* Compact CTA with enhanced effects */}
      <section className="py-16 md:py-20 px-4 relative overflow-hidden">
        {/* Premium Hintergrundeffekte */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101217] to-[#16181f]"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('/luxury-pattern.svg')] bg-repeat"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#14A79D]/30 to-transparent"></div>
        
        {/* Animierte Gradientenkreise */}
          <motion.div 
            animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ 
              repeat: Infinity, 
            duration: 15,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-[10%] md:right-[20%] w-96 h-96 rounded-full bg-gradient-to-br from-[#14A79D]/10 to-transparent blur-3xl"
        />
        
        <motion.div
          animate={{ 
            scale: [1.05, 0.95, 1.05],
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 12,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 left-[10%] md:left-[15%] w-80 h-80 rounded-full bg-gradient-to-br from-orange-500/10 to-transparent blur-3xl"
        />
        
        {/* Hauptcontainer mit Glaseffekt */}
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl bg-black/30 backdrop-blur-md border border-white/10 overflow-hidden"
          >
            {/* Dynamischer Hintergrund mit Partikeln */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Leuchtender Akzentkreis */}
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-[#14A79D]/20 to-transparent blur-3xl"></div>
              
              {/* Subtile Hintergrundanimationen */}
              <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-[#14A79D]/30 animate-float-particle1"></div>
                <div className="absolute bottom-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-orange-500/20 animate-float-particle2"></div>
                <div className="absolute top-2/3 right-1/4 w-1 h-1 rounded-full bg-white/20 animate-float-particle3"></div>
              </div>
              
              {/* Horizontale Linie mit Glühen */}
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                whileInView={{ opacity: 1, width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="absolute top-0 left-0 h-px bg-gradient-to-r from-transparent via-[#14A79D]/40 to-transparent"
          ></motion.div>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 p-8 md:p-0">
              {/* Linke Hälfte - Text und Features */}
              <div className="md:py-16 md:px-12 md:pr-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center py-1 px-3 mb-6 rounded-full bg-[#14A79D]/10 border border-[#14A79D]/20">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-2 h-2 rounded-full bg-[#14A79D] mr-2"
                    ></motion.div>
                    <span className="text-[#14A79D] text-sm font-medium">Premium Fahrzeuge</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                    Erleben Sie <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14A79D] to-white">außergewöhnliche</span> Automobile
                  </h2>
                  
                  <p className="text-gray-300 mb-10 max-w-lg">
                    Kontaktieren Sie uns noch heute und entdecken Sie, warum Autosmaya Ihre erste Wahl für exklusive Premium-Fahrzeuge ist.
                  </p>
                  
                  {/* Neue Feature-Punkte */}
                  <div className="space-y-5 mb-10">
                    {[
                      { icon: Shield, text: "12 Monate Garantie auf alle Fahrzeuge" },
                      { icon: Clock, text: "Schneller, unkomplizierter Kaufprozess" },
                      { icon: Star, text: "Persönliche Beratung durch Experten" }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.1 + (index * 0.1) }}
                        className="flex items-center gap-4"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#14A79D]/20 to-transparent flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-[#14A79D]" />
                        </div>
                        <p className="text-white">{feature.text}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Mobile CTA */}
                  <div className="md:hidden mt-8">
                    <Link
                      to="/contact"
                      className="w-full inline-flex items-center justify-center px-8 py-4 bg-[#14A79D] hover:bg-[#14A79D]/90 text-white rounded-xl transition-all duration-300 font-medium text-lg"
                    >
                      Jetzt Kontakt aufnehmen
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              </div>
              
              {/* Rechte Hälfte - CTA */}
              <div className="hidden md:block relative">
                {/* Hintergrund mit Akzent für den CTA-Bereich */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#14A79D]/20 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('/luxury-pattern.svg')] bg-repeat opacity-5"></div>
                
                <div className="relative h-full flex flex-col items-center justify-center p-12">
            <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="w-full max-w-lg bg-gradient-to-br from-[#1c1e27]/80 to-[#16181f]/95 backdrop-blur-md rounded-2xl border border-white/10 p-8 md:p-10 shadow-2xl"
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 10,
                          delay: 0.3
                        }}
                        className="w-16 h-16 mx-auto bg-gradient-to-br from-[#14A79D] to-[#11968d] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#14A79D]/20"
                      >
                        <Mail className="w-7 h-7 text-white" />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">Bereit für Ihr Traumfahrzeug?</h3>
                      <p className="text-gray-300 mb-6">
                        Unser Team von Experten steht Ihnen bei jedem Schritt zur Seite
                      </p>
                    </div>
                    
                    {/* Premium CTA Button */}
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
            >
          <Link
            to="/contact"
                        className="group relative block w-full overflow-hidden"
                      >
                        {/* Hintergrund-Glühen */}
                        <motion.div
                          animate={{ 
                            opacity: [0.6, 1, 0.6],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{ 
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut" 
                          }}
                          className="absolute -inset-1 rounded-xl opacity-30 blur-md bg-gradient-to-r from-[#14A79D] to-[#14A79D]/70"
                        ></motion.div>
                        
                        {/* Primärer Button */}
                        <div className="relative">
                          <div className="p-px rounded-xl bg-gradient-to-r from-[#14A79D] via-[#0a968c] to-[#14A79D] shadow-xl">
                            <div className="px-8 py-4 rounded-[calc(0.75rem-1px)] bg-gradient-to-br from-[#14A79D] to-[#0c7b74] relative overflow-hidden">
                              {/* Shine Effekt */}
                              <div className="absolute inset-0 w-full h-full">
                                <div className="absolute -inset-full h-[200%] w-[200%] transform rotate-45 translate-x-full -translate-y-1/2 bg-white opacity-0 group-hover:opacity-10 group-hover:animate-shine transition-all duration-700"></div>
                              </div>
                              
                              <div className="relative flex items-center justify-center text-white text-lg font-medium">
                                <span className="mr-2">Jetzt Kontakt aufnehmen</span>
                                <motion.div
                                  animate={{ x: [0, 4, 0] }}
                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                  <ArrowRight className="w-5 h-5" />
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </div>
          </Link>
            </motion.div>
                    
                    {/* Vertrauenshinweise */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-[#14A79D]" />
                          <span>Sichere Kommunikation</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-[#14A79D]" />
                          <span>24h Antwortzeit</span>
                        </div>
                      </div>
        </div>
        </motion.div>
                  
                  {/* Dekorative Elemente */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      opacity: [0.5, 0.7, 0.5]
                    }}
                    transition={{ 
                      rotate: { repeat: Infinity, duration: 20 },
                      opacity: { repeat: Infinity, duration: 3 }
                    }}
                    className="absolute -top-16 -right-16 w-32 h-32 border border-[#14A79D]/20 rounded-full"
                  />
                  <motion.div
                    animate={{ 
                      rotate: [0, -360],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ 
                      rotate: { repeat: Infinity, duration: 30 },
                      opacity: { repeat: Infinity, duration: 4, delay: 1 }
                    }}
                    className="absolute -top-24 -right-24 w-48 h-48 border border-[#14A79D]/10 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default Home;