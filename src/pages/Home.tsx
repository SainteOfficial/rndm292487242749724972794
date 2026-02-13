import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Shield, Handshake, Award, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Hero from '../components/Hero';

/* ─── animated counter ─── */
const Counter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (end / duration) * 16;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{val}{suffix}</span>;
};

/* ─── section wrapper with better entrance ─── */
const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

/* ─── parallax text ─── */
const ParallaxText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
};

const Home = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredCar, setHoveredCar] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('cars').select('*').eq('status', 'available')
          .order('created_at', { ascending: false }).limit(8);
        if (data) setCars(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const scrollCars = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' });
  };

  const stats = [
    { value: 500, suffix: '+', label: 'Zufriedene Kunden' },
    { value: 150, suffix: '+', label: 'Premium Fahrzeuge' },
    { value: 12, suffix: '', label: 'Monate Garantie' },
    { value: 5, suffix: '+', label: 'Jahre Erfahrung' },
  ];

  const benefits = [
    { icon: Shield, title: 'TÜV-Geprüft', desc: 'Jedes Fahrzeug durchläuft eine umfassende technische Prüfung.' },
    { icon: Handshake, title: 'Faire Preise', desc: 'Transparente Preisgestaltung ohne versteckte Kosten.' },
    { icon: Award, title: 'Premium Qualität', desc: 'Nur handverlesene Fahrzeuge mit lückenloser Historie.' },
  ];

  return (
    <div className="bg-[#050505]">
      <Hero />

      {/* ─── STATS STRIP ─── */}
      <Section className="py-16 md:py-20 border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`text-center ${i > 0 ? 'md:border-l md:border-white/[0.06]' : ''}`}
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-white/30 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── FEATURED CARS — horizontal scroll ─── */}
      <Section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
          <div className="flex items-end justify-between mb-10">
            <ParallaxText>
              <p className="text-[#14A79D] text-xs font-medium tracking-[0.2em] uppercase mb-3">Neueste Angebote</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                Aktuelle Fahrzeuge
              </h2>
            </ParallaxText>
            <div className="hidden md:flex items-center gap-3">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => scrollCars('left')}
                className="p-2.5 rounded-full border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all duration-300">
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => scrollCars('right')}
                className="p-2.5 rounded-full border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all duration-300">
                <ChevronRight className="w-5 h-5" />
              </motion.button>
              <Link to="/showroom" className="ml-4 text-sm text-white/40 hover:text-white flex items-center gap-1.5 transition-colors duration-300 group">
                Alle ansehen
                <motion.span className="inline-block" whileHover={{ x: 3 }}>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </motion.span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex gap-5 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[300px] md:w-[320px]">
                  <div className="skeleton aspect-[3/4] rounded-2xl" />
                  <div className="skeleton h-4 w-3/4 mt-4 rounded" />
                  <div className="skeleton h-3 w-1/2 mt-2 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2 snap-x snap-mandatory"
            >
              {cars.map((car, i) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8 }}
                  onHoverStart={() => setHoveredCar(car.id)}
                  onHoverEnd={() => setHoveredCar(null)}
                  className="flex-shrink-0 w-[280px] md:w-[320px] snap-start group"
                >
                  <Link to={`/car/${car.id}`} className="block">
                    {/* Image */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0a0a0a] mb-4">
                      <motion.img
                        src={car.images?.[0]}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover"
                        animate={{ scale: hoveredCar === car.id ? 1.08 : 1 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      {/* Price overlay — slide up on hover */}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-4"
                        animate={{ y: hoveredCar === car.id ? -4 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-white text-xl font-display font-bold">
                          €{car.price?.toLocaleString()}
                        </p>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: hoveredCar === car.id ? '2rem' : 0 }}
                          transition={{ duration: 0.4 }}
                          className="h-[1.5px] bg-[#14A79D] mt-2"
                        />
                      </motion.div>
                      {/* Badge */}
                      {car.featured && (
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#14A79D]/90 text-white text-xs font-medium backdrop-blur-sm">
                          <Sparkles className="w-3 h-3 inline mr-1" />Exklusiv
                        </div>
                      )}
                      {/* View icon on hover */}
                      <motion.div
                        className="absolute top-4 right-4"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: hoveredCar === car.id ? 1 : 0, scale: hoveredCar === car.id ? 1 : 0.5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-2 rounded-full bg-white/10 backdrop-blur-md">
                          <ArrowUpRight className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                    </div>
                    {/* Info */}
                    <h3 className="text-white font-display font-semibold tracking-tight group-hover:text-[#14A79D] transition-colors duration-300">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-white/35 text-sm mt-1">
                      {car.year} • {car.mileage?.toLocaleString()} km • {car.fuel}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Mobile view all */}
          <div className="md:hidden mt-6 text-center">
            <Link to="/showroom" className="btn-outline text-sm">
              Alle Fahrzeuge <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ─── WHY AUTOSMAYA — split layout ─── */}
      <Section className="py-20 md:py-28 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ParallaxText>
              <p className="text-[#EBA530] text-xs font-medium tracking-[0.2em] uppercase mb-3">Warum Autosmaya</p>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight mb-6">
                Premium, ohne{'\n'}Kompromisse.
              </h2>
              <p className="text-white/35 text-base leading-relaxed max-w-md">
                Bei uns finden Sie keine Massenware. Jedes Fahrzeug wird persönlich ausgewählt, geprüft und aufbereitet — für ein Kauferlebnis, das unseren Qualitätsansprüchen gerecht wird.
              </p>
            </ParallaxText>

            <div className="space-y-0">
              {benefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, x: 30, filter: 'blur(6px)' }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 8, transition: { duration: 0.3 } }}
                  className="flex gap-5 py-6 border-b border-white/[0.04] last:border-0 cursor-default group"
                >
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/[0.03] group-hover:bg-[#14A79D]/10 flex items-center justify-center transition-colors duration-300"
                  >
                    <b.icon className="w-5 h-5 text-[#14A79D]" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-display font-semibold mb-1 group-hover:text-[#14A79D] transition-colors duration-300">{b.title}</h3>
                    <p className="text-white/35 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── TESTIMONIAL ─── */}
      <Section className="py-20 md:py-28 border-t border-white/[0.04]">
        <div className="max-w-[800px] mx-auto px-6 md:px-16 text-center">
          <div className="flex justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Star className="w-5 h-5 text-[#EBA530] fill-[#EBA530]" />
              </motion.div>
            ))}
          </div>
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-white/80 font-display font-medium leading-relaxed mb-8"
          >
            „Absolut professioneller Service. Das Fahrzeug war in einem perfekten Zustand. Ich habe mich von Anfang an gut beraten gefühlt."
          </motion.blockquote>
          <p className="text-white/30 text-sm">— Zufriedener Kunde aus Dortmund</p>
        </div>
      </Section>

      {/* ─── CTA BANNER ─── */}
      <Section className="py-20 md:py-28">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden py-16 md:py-20 px-8 md:px-16 text-center"
            style={{ background: 'linear-gradient(135deg, rgba(20,167,157,0.08) 0%, rgba(235,165,48,0.06) 100%)' }}
          >
            <div className="absolute inset-0 border border-white/[0.04] rounded-3xl pointer-events-none" />
            {/* Animated floating orb */}
            <motion.div
              className="absolute -top-20 -right-20 w-60 h-60 bg-[#14A79D]/5 rounded-full blur-3xl"
              animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#EBA530]/5 rounded-full blur-3xl"
              animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <h2 className="relative text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-4">
              Ihr Traumfahrzeug wartet
            </h2>
            <p className="relative text-white/40 text-base mb-8 max-w-md mx-auto">
              Besuchen Sie unseren Showroom und finden Sie Ihr nächstes Premium-Fahrzeug.
            </p>
            <div className="relative flex flex-wrap justify-center gap-4">
              <Link to="/showroom" className="btn-primary">
                Showroom besuchen <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="btn-outline">
                Beratung anfragen
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default Home;