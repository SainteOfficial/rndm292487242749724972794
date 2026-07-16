import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Shield, Handshake, Award, Star, ChevronLeft, ChevronRight,
  Sparkles, CreditCard, FileCheck, Wrench, CarFront, MapPin, Clock, Phone,
  Search, CheckCircle, Quote
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Hero from '../components/Hero';
import MarqueeLogos from '../components/MarqueeLogos';

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

/* ─── section wrapper with entrance animation ─── */
const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
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
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(p => (p + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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

  const steps = [
    { icon: Search, num: '01', title: 'Fahrzeug wählen', desc: 'Stöbern Sie in unserem Showroom oder auf Mobile.de und finden Sie Ihr Traumfahrzeug.' },
    { icon: CarFront, num: '02', title: 'Probefahrt vereinbaren', desc: 'Rufen Sie uns an oder schreiben Sie per WhatsApp — wir vereinbaren einen Termin.' },
    { icon: CheckCircle, num: '03', title: 'Kaufabschluss', desc: 'Finanzierung, Versicherung und Zulassung — alles aus einer Hand bei Autosmaya.' },
  ];

  const services = [
    { icon: CreditCard, title: 'Finanzierung', desc: 'Flexible Finanzierungsoptionen mit günstigen Konditionen und schneller Zusage.' },
    { icon: Shield, title: 'Garantie', desc: '12 Monate Garantie auf alle Fahrzeuge — für Ihre Sicherheit und Ihr Vertrauen.' },
    { icon: FileCheck, title: 'Zulassung', desc: 'Wir kümmern uns um die komplette Zulassung — Sie fahren stressfrei los.' },
    { icon: Wrench, title: 'Aufbereitung', desc: 'Jedes Fahrzeug wird professionell aufbereitet und in perfektem Zustand übergeben.' },
  ];

  const testimonials = [
    { text: 'Absolut professioneller Service. Das Fahrzeug war in einem perfekten Zustand. Ich habe mich von Anfang an gut beraten gefühlt.', name: 'Mehmet K.', location: 'Dortmund', rating: 5 },
    { text: 'Schnelle Abwicklung, fairer Preis und ein super Zustand des Fahrzeugs. Kann ich nur weiterempfehlen!', name: 'Sarah L.', location: 'Lünen', rating: 5 },
    { text: 'Top Beratung und ehrliche Kommunikation. Der BMW wurde sogar noch besser übergeben als erwartet. Sehr zufrieden!', name: 'Thomas R.', location: 'Unna', rating: 5 },
    { text: 'Endlich ein Händler, dem man vertrauen kann. Alles transparent, keine versteckten Mängel. Daumen hoch!', name: 'Fatima B.', location: 'Hamm', rating: 5 },
  ];

  return (
    <div className="bg-[#050505]">
      <Hero />

      {/* ─── BRAND MARQUEE ─── */}
      <Section className="border-b border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
          <p className="text-center text-white/20 text-xs uppercase tracking-[0.2em] pt-10">Wir führen Fahrzeuge von</p>
        </div>
        <MarqueeLogos />
      </Section>

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
                      {/* Price overlay */}
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

      {/* ─── WHY AUTOSMAYA — SLEEK MINIMALIST ─── */}
      <Section className="py-24 md:py-32 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
          <ParallaxText className="text-center mb-16 md:mb-24">
            <p className="text-[#14A79D] text-xs font-medium tracking-[0.2em] uppercase mb-4">Warum Autosmaya</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight max-w-2xl mx-auto">
              Premium Service ohne Kompromisse
            </h2>
          </ParallaxText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {[...benefits, { icon: CreditCard, title: 'Finanzierung', desc: 'Flexible Finanzierung mit günstigen Konditionen.' }].map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <div className="mx-auto w-12 h-12 flex items-center justify-center mb-6">
                  <b.icon className="w-8 h-8 text-[#14A79D]" strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-display font-semibold text-lg mb-3 tracking-wide">{b.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-[280px] mx-auto">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── TESTIMONIALS — carousel ─── */}
      <Section className="py-20 md:py-28 border-t border-white/[0.04]">
        <div className="max-w-[900px] mx-auto px-6 md:px-16">
          <ParallaxText className="text-center mb-12">
            <p className="text-[#EBA530] text-xs font-medium tracking-[0.2em] uppercase mb-3">Kundenstimmen</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              Was unsere Kunden sagen
            </h2>
          </ParallaxText>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-8">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#EBA530] fill-[#EBA530]" />
                  ))}
                </div>

                {/* Quote icon */}
                <Quote className="w-8 h-8 text-white/[0.06] mx-auto mb-6" />

                {/* Quote text */}
                <blockquote className="text-xl md:text-2xl text-white/80 font-display font-medium leading-relaxed mb-8">
                  „{testimonials[activeTestimonial].text}"
                </blockquote>

                {/* Author */}
                <div>
                  <p className="text-white font-display font-semibold text-sm">{testimonials[activeTestimonial].name}</p>
                  <p className="text-white/30 text-xs mt-1">{testimonials[activeTestimonial].location}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-10">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeTestimonial
                      ? 'w-8 h-2 bg-[#14A79D]'
                      : 'w-2 h-2 bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── GOOGLE MAPS + LOCATION ─── */}
      <Section className="py-20 md:py-28 border-t border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Info side */}
            <ParallaxText className="flex flex-col justify-center">
              <p className="text-[#14A79D] text-xs font-medium tracking-[0.2em] uppercase mb-3">Standort</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-6">
                Besuchen Sie uns
              </h2>

              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#14A79D]" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Adresse</p>
                    <p className="text-white/40 text-sm">Aplerbecker Straße 351, 44287 Dortmund</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#14A79D]" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Öffnungszeiten</p>
                    <div className="text-white/40 text-sm space-y-0.5 mt-1">
                      <p>Mo – Fr: <span className="text-white/60">9:00 – 19:00 Uhr</span></p>
                      <p>Sa: <span className="text-white/60">10:00 – 18:00 Uhr</span></p>
                      <p>So: <span className="text-white/40">Geschlossen</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#14A79D]" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Telefon</p>
                    <a href="tel:+4923069988585" className="text-white/40 text-sm hover:text-white transition-colors">+49 2306 9988585</a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://maps.google.com/?q=Aplerbecker+Straße+351,+44287+Dortmund"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  Route planen <ArrowRight className="w-4 h-4" />
                </a>
                <a href="tel:+4923069988585" className="btn-outline text-sm">
                  <Phone className="w-4 h-4" /> Anrufen
                </a>
              </div>
            </ParallaxText>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden border border-white/[0.04] bg-[#0a0a0a] min-h-[400px]"
            >
              <iframe
                src="https://maps.google.com/maps?q=Aplerbecker+Straße+351,+44287+Dortmund&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px', filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Autosmaya Standort"
              />
            </motion.div>
          </div>
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