import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Shield, Clock, Award, Star, Heart,
  ChevronLeft, ChevronRight, Sparkles, MapPin, Phone, Play,
  Gauge, Fuel, Calendar, Users, CheckCircle2, Quote, ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// ============ ANIMATION VARIANTS ============
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

// ============ DATA ============
const testimonials = [
  {
    name: "Michael Schneider",
    role: "Unternehmer",
    text: "Die Professionalität und Transparenz bei Autosmaya haben mich absolut überzeugt. Mein BMW 5er wurde perfekt aufbereitet übergeben.",
    rating: 5,
    car: "BMW 540i xDrive",
    avatar: "MS"
  },
  {
    name: "Laura Wagner",
    role: "Ärztin",
    text: "Von der ersten Beratung bis zur Übergabe - alles verlief absolut reibungslos. Ein erstklassiges Kauferlebnis.",
    rating: 5,
    car: "Mercedes E 300",
    avatar: "LW"
  },
  {
    name: "Thomas König",
    role: "Rechtsanwalt",
    text: "Kompetente Beratung, faire Preise und ein makelloser Porsche. Besser geht es nicht.",
    rating: 5,
    car: "Porsche Macan S",
    avatar: "TK"
  },
];

const stats = [
  { value: "500+", label: "Zufriedene Kunden", icon: Users },
  { value: "150+", label: "Premium Fahrzeuge", icon: Shield },
  { value: "12", label: "Monate Garantie", icon: Award },
  { value: "5+", label: "Jahre Erfahrung", icon: Star },
];

const brands = ["BMW", "Mercedes-Benz", "Audi", "Porsche", "Tesla", "Volkswagen", "Lamborghini", "Ferrari"];

// ============ COMPONENTS ============
const AnimatedCounter = ({ value, suffix = "" }: { value: string; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <span ref={ref} className="tabular-nums">
      {isInView ? value : "0"}{suffix}
    </span>
  );
};

const GlowCard = ({ children, className = "", gradient = "from-[#14A79D]/20" }: any) => (
  <motion.div
    whileHover={{ y: -4, transition: { duration: 0.3 } }}
    className={`group relative rounded-3xl ${className}`}
  >
    {/* Glow Effect */}
    <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${gradient} to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />

    {/* Card */}
    <div className="relative h-full rounded-3xl bg-[#0c0c0c] border border-white/[0.04] group-hover:border-white/[0.08] transition-colors duration-500 overflow-hidden">
      {children}
    </div>
  </motion.div>
);

// ============ MAIN COMPONENT ============
const Home = () => {
  const [featuredCars, setFeaturedCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const saved = localStorage.getItem('carFavorites');
    if (saved) setFavorites(JSON.parse(saved));
    fetchFeaturedCars();

    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('carFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchFeaturedCars = async () => {
    try {
      const { data } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .limit(6)
        .order('created_at', { ascending: false });

      if (data) {
        setFeaturedCars(data.map(car => ({
          ...car,
          specs: typeof car.specs === 'string' ? JSON.parse(car.specs) : car.specs,
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden">
      {/* ============ HERO SECTION ============ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center">
        {/* Background Image with Parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070')`,
            }}
          />
          {/* Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/40 to-[#050505]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]/80" />
        </motion.div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-[15%] w-72 h-72 bg-[#14A79D]/10 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              y: [0, 25, 0],
              x: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-[20%] w-96 h-96 bg-[#EBA530]/8 rounded-full blur-[150px]"
          />
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[200px]"
          />
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8 pt-32 pb-20"
          style={{ opacity: heroOpacity }}
        >
          <div className="max-w-4xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 mb-8 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#14A79D]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#14A79D]" />
              </span>
              <span className="text-sm text-white/70 font-medium tracking-wide">
                Premium Automobile seit 2021
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8"
            >
              <span className="text-white">Exklusive</span>
              <br />
              <span className="bg-gradient-to-r from-[#14A79D] via-[#1ee0d3] to-[#EBA530] bg-clip-text text-transparent">
                Fahrzeuge
              </span>
              <br />
              <span className="text-white/90">für Sie.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mb-12"
            >
              Handverlesene Premium-Automobile mit TÜV-geprüfter Qualität
              und 12 Monaten Garantie. Ihr Traumauto wartet.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="/showroom"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full overflow-hidden"
              >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#14A79D] to-[#14A79D]/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(20,167,157,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <span className="relative text-white font-semibold">Showroom entdecken</span>
                <ArrowRight className="relative w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500"
              >
                <Phone className="w-5 h-5 text-white/60" />
                <span className="text-white/80 font-medium">Beratung</span>
              </Link>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-3 cursor-pointer"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <span className="text-xs text-white/30 uppercase tracking-[0.2em]">Scrollen</span>
              <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
                <motion.div
                  animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1 h-2 rounded-full bg-[#14A79D]"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============ BRANDS MARQUEE ============ */}
      <section className="py-16 border-y border-white/[0.03] bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex gap-16 animate-marquee whitespace-nowrap"
        >
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <span key={i} className="text-2xl font-light text-white/20 hover:text-white/40 transition-colors duration-300">
              {brand}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ============ STATS BENTO GRID ============ */}
      <section className="py-24 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
              >
                <GlowCard gradient={i === 0 ? "from-[#14A79D]/20" : i === 1 ? "from-[#EBA530]/20" : i === 2 ? "from-purple-500/20" : "from-rose-500/20"}>
                  <div className="p-6 md:p-8">
                    <stat.icon className="w-8 h-8 text-white/20 mb-6" />
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                      <AnimatedCounter value={stat.value} />
                    </div>
                    <div className="text-sm text-white/40">{stat.label}</div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURED CARS ============ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#14A79D]/[0.02] to-transparent" />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
          >
            <div>
              <span className="text-[#14A79D] text-sm font-medium tracking-wider uppercase mb-4 block">
                Neueste Angebote
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Aktuelle Fahrzeuge
              </h2>
            </div>

            <Link
              to="/showroom"
              className="group inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <span>Alle ansehen</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Cars Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-2 border-[#14A79D]/30 border-t-[#14A79D] rounded-full animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {featuredCars.slice(0, 6).map((car) => (
                <motion.div key={car.id} variants={fadeInScale}>
                  <GlowCard>
                    <Link to={`/car/${car.id}`} className="block">
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={car.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />

                        {/* Favorite */}
                        <button
                          onClick={(e) => toggleFavorite(car.id, e)}
                          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-all"
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(car.id) ? 'fill-red-500 text-red-500' : 'text-white/80'}`} />
                        </button>

                        {/* Price */}
                        <div className="absolute bottom-4 left-4">
                          <span className="px-4 py-2 rounded-full bg-[#14A79D] text-white font-semibold text-sm">
                            €{car.price?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white mb-3">
                          {car.brand} {car.model}
                        </h3>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/40">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {car.year}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Gauge className="w-4 h-4" />
                            {car.mileage?.toLocaleString()} km
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Fuel className="w-4 h-4" />
                            {car.specs?.power || car.power} PS
                          </span>
                        </div>
                      </div>
                    </Link>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-24 relative">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[#EBA530] text-sm font-medium tracking-wider uppercase mb-4 block">
              Kundenstimmen
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Was unsere Kunden sagen
            </h2>
          </motion.div>

          {/* Testimonial Card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <GlowCard gradient="from-[#EBA530]/10">
                  <div className="p-8 md:p-12 text-center">
                    {/* Quote Icon */}
                    <Quote className="w-12 h-12 text-[#EBA530]/30 mx-auto mb-8" />

                    {/* Text */}
                    <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
                      "{testimonials[activeTestimonial].text}"
                    </p>

                    {/* Author */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#14A79D] to-[#EBA530] flex items-center justify-center text-white font-semibold">
                        {testimonials[activeTestimonial].avatar}
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {testimonials[activeTestimonial].name}
                        </div>
                        <div className="text-white/40 text-sm">
                          {testimonials[activeTestimonial].car}
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mt-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#EBA530] text-[#EBA530]" />
                      ))}
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'w-8 bg-[#EBA530]' : 'w-2 bg-white/20 hover:bg-white/30'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-32 relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[2.5rem] overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#14A79D]/20 via-[#050505] to-[#EBA530]/10" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            <div className="absolute inset-0 border border-white/[0.05] rounded-[2.5rem]" />

            {/* Floating Orbs */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#14A79D]/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#EBA530]/15 rounded-full blur-[100px]" />

            {/* Content */}
            <div className="relative z-10 py-20 px-8 md:px-16 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Bereit für Ihr
                  <br />
                  <span className="bg-gradient-to-r from-[#14A79D] to-[#EBA530] bg-clip-text text-transparent">
                    Traumfahrzeug?
                  </span>
                </h2>

                <p className="text-lg text-white/50 max-w-xl mx-auto mb-10">
                  Lassen Sie sich von unserem Team persönlich beraten.
                  Kostenlos und unverbindlich.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/contact"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors shadow-[0_0_60px_rgba(255,255,255,0.15)]"
                  >
                    <Sparkles className="w-5 h-5" />
                    Beratung vereinbaren
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>

                  <a
                    href="https://maps.app.goo.gl/X5NgfpaNaGw5bscWA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.08] transition-all"
                  >
                    <MapPin className="w-5 h-5" />
                    Route planen
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CSS for Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;