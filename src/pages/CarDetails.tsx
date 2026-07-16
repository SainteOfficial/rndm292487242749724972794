import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Heart, Share2, Phone, Mail, MapPin,
  Calendar, Gauge, Fuel, Settings, Palette, Car, Shield,
  X, ExternalLink, ChevronDown, ChevronUp, CheckCircle2, Printer
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [relatedCars, setRelatedCars] = useState<any[]>([]);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showBottomBar, setShowBottomBar] = useState(false);
  const priceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowBottomBar(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" } // offset for navbar
    );
    if (priceRef.current) observer.observe(priceRef.current);
    return () => observer.disconnect();
  }, [loading, car]);

  useEffect(() => {
    if (id) { fetchCar(); checkFavorite(); }
    else { setLoading(false); setError(true); }
  }, [id]);

  useEffect(() => {
    if (!car?.images || car.images.length === 0) return;
    const interval = setInterval(() => {
      setPreviewIndex(prev => (prev + 1) % car.images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [car?.images]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') setCurrentImage(p => p === 0 ? (car?.images?.length || 1) - 1 : p - 1);
      if (e.key === 'ArrowRight') setCurrentImage(p => p === (car?.images?.length || 1) - 1 ? 0 : p + 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, car]);

  const safeJSON = (val: any, fb: any = {}) => {
    if (!val) return fb;
    if (typeof val === 'object') return val;
    try { return JSON.parse(val); } catch { return fb; }
  };

  const fetchCar = async () => {
    try {
      const { data, error: e } = await supabase.from('cars').select('*').eq('id', id).single();
      if (e || !data) { setError(true); setLoading(false); return; }
      setCar({
        ...data,
        specs: safeJSON(data.specs, {}),
        condition: safeJSON(data.condition, {}),
        images: Array.isArray(data.images) ? data.images : [],
        additionalfeatures: typeof data.additionalfeatures === 'string'
          ? data.additionalfeatures.split(',') : Array.isArray(data.additionalfeatures) ? data.additionalfeatures : [],
      });
      if (data.brand) fetchRelated(data.brand);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  const fetchRelated = async (brand: string) => {
    const { data } = await supabase.from('cars').select('*').eq('brand', brand).eq('status', 'available').neq('id', id).limit(3);
    if (data) setRelatedCars(data);
  };

  const checkFavorite = () => {
    try { setIsFavorite(JSON.parse(localStorage.getItem('carFavorites') || '[]').includes(id)); } catch { }
  };

  const toggleFavorite = () => {
    const saved = JSON.parse(localStorage.getItem('carFavorites') || '[]');
    const next = isFavorite ? saved.filter((f: string) => f !== id) : [...saved, id];
    localStorage.setItem('carFavorites', JSON.stringify(next));
    setIsFavorite(!isFavorite);
  };

  const share = () => {
    if (navigator.share) navigator.share({ title: `${car.brand} ${car.model}`, url: window.location.href });
    else navigator.clipboard.writeText(window.location.href);
  };

  /* Loading */
  if (loading) return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-8">
        <div className="skeleton h-[50vh] rounded-2xl mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 skeleton h-96 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    </div>
  );

  /* Error */
  if (!car || error) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-white mb-3">Fahrzeug nicht gefunden</h2>
        <p className="text-white/40 mb-6">Das gesuchte Fahrzeug ist leider nicht mehr verfügbar.</p>
        <Link to="/showroom" className="btn-primary">Zum Showroom</Link>
      </div>
    </div>
  );

  const images = car.images || [];
  const specs = car.specs || {};
  const condition = car.condition || {};
  const features = car.additionalfeatures || [];

  // All available specs mapped compactly
  const techSpecs = [
    { label: 'Kategorie', value: specs.category },
    { label: 'Erstzulassung', value: car.year ? `01/${car.year}` : null },
    { label: 'Kilometerstand', value: car.mileage ? `${car.mileage.toLocaleString()} km` : null },
    { label: 'Leistung', value: specs.power ? `${specs.power}` : null },
    { label: 'Hubraum', value: specs.hubraum },
    { label: 'Kraftstoff', value: car.fuel },
    { label: 'Verbrauch', value: specs.consumption },
    { label: 'CO2-Emissionen', value: specs.emissions },
    { label: 'Getriebe', value: car.transmission },
    { label: 'Antriebsart', value: specs.driveType },
    { label: 'Sitzplätze', value: specs.seats },
    { label: 'Türen', value: specs.doors },
    { label: 'Schadstoffklasse', value: specs.emissionClass },
    { label: 'Umweltplakette', value: specs.environmentBadge },
    { label: 'Fahrzeughalter', value: condition.previousOwners ? condition.previousOwners.toString() : null },
    { label: 'HU', value: specs.inspection },
    { label: 'Klimatisierung', value: specs.airConditioning },
    { label: 'Einparkhilfe', value: specs.parkingAssist },
    { label: 'Airbags', value: specs.airbags },
    { label: 'Farbe', value: specs.color },
    { label: 'Innenausstattung', value: specs.interiorColor },
    { label: 'Zylinder', value: specs.cylinders },
    { label: 'Tankgröße', value: specs.tankVolume },
    { label: 'Anhängelast', value: specs.trailerLoad },
  ].filter(s => s.value);

  const visibleFeatures = showAllFeatures ? features : features.slice(0, 12);
  const isDescLong = car.description?.length > 300;

  return (
    <div className="min-h-screen bg-[#050505] pt-20 pb-24 md:pb-20">
      
      {/* ─── Airbnb-style Image Grid (Desktop) & Swipeable (Mobile) ─── */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-4">
        {/* Mobile Swipeable Gallery */}
        <div className="md:hidden relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white/[0.02]" onClick={() => setLightboxOpen(true)}>
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage} src={images[currentImage]} alt=""
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          <img src="/logov2.png" alt="" className="absolute bottom-6 right-4 w-24 opacity-50 pointer-events-none drop-shadow-md z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10" />
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.slice(0, 8).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImage ? 'w-4 bg-white' : 'w-1.5 bg-white/30'}`} />
            ))}
          </div>
          
          <button onClick={e => { e.stopPropagation(); setCurrentImage(p => p === 0 ? images.length - 1 : p - 1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:text-white z-20">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={e => { e.stopPropagation(); setCurrentImage(p => p === images.length - 1 ? 0 : p + 1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:text-white z-20">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Grid Gallery */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[60vh] rounded-3xl overflow-hidden">
          {/* Main big image */}
          <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => { setCurrentImage(0); setLightboxOpen(true); }}>
            <img src={images[0]} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
            <img src="/logov2.png" alt="" className="absolute bottom-6 right-6 w-32 opacity-40 pointer-events-none drop-shadow-lg z-10" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
          {/* Smaller side images */}
          {images.slice(1, 5).map((img: string, idx: number) => (
            <div key={idx} className="relative group cursor-pointer overflow-hidden" onClick={() => { setCurrentImage(idx + 1); setLightboxOpen(true); }}>
              <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              {idx === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                  <span className="text-white font-medium text-lg">+{images.length - 5} Fotos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column (Details) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
                    {car.brand} {car.model}
                  </h1>
                  <p className="text-white/40 text-sm md:text-base mt-2 flex items-center gap-3">
                    <span>{car.year}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{car.mileage?.toLocaleString()} km</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{car.fuel}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => window.print()} className="p-3 rounded-full border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 hidden md:flex" title="Exposé drucken">
                    <Printer className="w-5 h-5" />
                  </button>
                  <button onClick={toggleFavorite} className={`p-3 rounded-full border transition-all duration-300 ${isFavorite ? 'border-red-500/30 text-red-500 bg-red-500/10' : 'border-white/[0.08] text-white/50 hover:text-white hover:bg-white/5'}`}>
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                  </button>
                  <button onClick={share} className="p-3 rounded-full border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 hidden md:flex">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Mobile Only: Big Price & Quick Action */}
              <div ref={priceRef} className="lg:hidden mt-6 mb-4 space-y-4">
                <div>
                  <p className="text-4xl font-display font-bold text-white leading-none">€{car.price?.toLocaleString()}</p>
                  <p className="text-white/30 text-xs mt-1">inkl. MwSt. • Finanzierung möglich</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <a href={`https://wa.me/4915153366666?text=${encodeURIComponent(`Ich interessiere mich für den ${car.brand} ${car.model} (${car.year})`)}`}
                    target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 justify-center py-3 text-sm shadow-[0_0_15px_rgba(20,167,157,0.3)]">
                    <Phone className="w-4 h-4 mr-1.5" /> WhatsApp
                  </a>
                  <a href="tel:+4915153366666" className="btn-outline flex-1 justify-center py-3 text-sm border-white/10 hover:border-white/20 bg-white/5">
                    <Phone className="w-4 h-4 mr-1.5" /> Anrufen
                  </a>
                </div>
            </div>

          </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2">
              {condition.type && <span className="px-3 py-1 text-xs font-medium bg-white/5 text-white/70 rounded-full border border-white/10">{condition.type}</span>}
              {condition.accident && <span className="px-3 py-1 text-xs font-medium bg-red-500/10 text-red-400 rounded-full border border-red-500/20">Unfallfahrzeug</span>}
              {!condition.accident && <span className="px-3 py-1 text-xs font-medium bg-[#14A79D]/10 text-[#14A79D] rounded-full border border-[#14A79D]/20">Unfallfrei</span>}
              {specs.inspection && <span className="px-3 py-1 text-xs font-medium bg-white/5 text-white/70 rounded-full border border-white/10">HU Neu</span>}
              {condition.warranty && <span className="px-3 py-1 text-xs font-medium bg-[#14A79D]/10 text-[#14A79D] rounded-full border border-[#14A79D]/20">Garantie</span>}
            </div>

            <hr className="border-white/[0.06]" />

            {/* Technical Specs (Compact List) */}
            {techSpecs.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-display font-semibold text-white">Technische Daten & Zustand</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                  {techSpecs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-white/[0.04] pb-2">
                      <span className="text-white/40 text-sm">{spec.label}</span>
                      <span className="text-white text-sm font-medium text-right ml-4">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {car.description && (
              <div className="space-y-4">
                <h2 className="text-xl font-display font-semibold text-white">Beschreibung</h2>
                <div className={`relative ${!showFullDesc && isDescLong ? 'max-h-40 overflow-hidden' : ''}`}>
                  <p className="text-white/50 text-sm md:text-base leading-relaxed whitespace-pre-line font-light">
                    {car.description}
                  </p>
                  {!showFullDesc && isDescLong && (
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#050505] to-transparent" />
                  )}
                </div>
                {isDescLong && (
                  <button onClick={() => setShowFullDesc(!showFullDesc)} className="text-[#14A79D] text-sm font-medium hover:text-[#19d6c9] transition-colors flex items-center gap-1">
                    {showFullDesc ? 'Weniger anzeigen' : 'Mehr lesen'} {showFullDesc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
              </div>
            )}

            {/* Features (Compact Chips) */}
            {features.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-display font-semibold text-white">Ausstattung</h2>
                <div className="flex flex-wrap gap-2">
                  {visibleFeatures.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-1.5 text-white/70 text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#14A79D] opacity-70" />
                      {f.trim()}
                    </div>
                  ))}
                </div>
                {features.length > 12 && (
                  <button onClick={() => setShowAllFeatures(!showAllFeatures)} className="text-[#14A79D] text-sm font-medium hover:text-[#19d6c9] transition-colors flex items-center gap-1 mt-4">
                    {showAllFeatures ? 'Weniger anzeigen' : `Alle ${features.length} Ausstattungen anzeigen`} {showAllFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Right Column (Sticky Action Box) */}
          <div className="hidden lg:block lg:sticky lg:top-28 self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
              className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] shadow-2xl shadow-black/50"
            >
              {/* Sliding Preview Box */}
              {images.length > 0 && (
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 relative cursor-pointer group" onClick={() => { setCurrentImage(previewIndex); setLightboxOpen(true); }}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={previewIndex}
                      src={images[previewIndex]}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />
                  <img src="/logov2.png" alt="" className="absolute bottom-3 right-3 w-16 opacity-50 pointer-events-none drop-shadow-lg z-20" />
                </div>
              )}

              <p className="text-white/30 text-xs uppercase tracking-widest font-semibold mb-2">Fahrzeugpreis</p>
              <p className="text-4xl font-display font-bold text-white mb-2">€{car.price?.toLocaleString()}</p>
              <p className="text-white/30 text-xs mb-8">inkl. MwSt. • Finanzierung möglich</p>

              <div className="space-y-4">
                <a href={`https://wa.me/4915153366666?text=${encodeURIComponent(`Ich interessiere mich für den ${car.brand} ${car.model} (${car.year})`)}`}
                  target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center py-4 text-[15px] shadow-[0_0_20px_rgba(20,167,157,0.3)]">
                  <Phone className="w-5 h-5 mr-1" /> WhatsApp Anfrage
                </a>
                <a href="tel:+4915153366666" className="btn-outline w-full justify-center py-4 text-[15px] border-white/10 hover:border-white/20 bg-white/5">
                  <Phone className="w-5 h-5 mr-1" /> Anrufen
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-white/[0.04]">
                <h3 className="text-sm font-display font-semibold text-white mb-4">Ihre Vorteile bei Autosmaya</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/50 text-sm">
                    <Shield className="w-4 h-4 text-[#14A79D]" /> 12 Monate Garantie
                  </div>
                  <div className="flex items-center gap-3 text-white/50 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#14A79D]" /> TÜV-geprüfte Fahrzeuge
                  </div>
                  <div className="flex items-center gap-3 text-white/50 text-sm">
                    <MapPin className="w-4 h-4 text-white/20" /> Aplerbecker Str. 351, Dortmund
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ─── Related Cars ─── */}
        {relatedCars.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }} className="mt-24 pt-16 border-t border-white/[0.04]">
            <h2 className="text-2xl font-display font-bold text-white tracking-tight mb-8">Ähnliche Fahrzeuge</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCars.map(rc => (
                <Link key={rc.id} to={`/car/${rc.id}`} className="group card-luxury">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={rc.images?.[0]} alt={`${rc.brand} ${rc.model}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <img src="/logov2.png" alt="" className="absolute bottom-4 right-4 w-24 opacity-40 pointer-events-none drop-shadow-md z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 z-20">
                      <p className="text-white text-lg font-display font-bold">€{rc.price?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-display font-semibold group-hover:text-[#14A79D] transition-colors duration-300">{rc.brand} {rc.model}</h3>
                    <p className="text-white/30 text-xs mt-1">{rc.year} • {rc.mileage?.toLocaleString()} km</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ─── Mobile Sticky Bottom Bar ─── */}
      <AnimatePresence>
        {showBottomBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/5 p-4 z-40 flex items-center justify-between gap-4 pb-safe"
          >
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Preis</p>
              <p className="text-white font-display font-bold text-xl leading-none">€{car.price?.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <a href="tel:+4915153366666" className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </a>
              <a href={`https://wa.me/4915153366666?text=${encodeURIComponent(`Ich interessiere mich für den ${car.brand} ${car.model} (${car.year})`)}`}
                target="_blank" rel="noopener noreferrer" className="px-5 py-3.5 rounded-xl bg-[#14A79D] text-white font-medium text-sm flex items-center shadow-[0_0_15px_rgba(20,167,157,0.3)]">
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Lightbox (Rendered in Portal) ─── */}
      {createPortal(
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
              <button className="absolute top-6 right-6 p-3 bg-white/5 rounded-full text-white/60 hover:text-white transition-colors z-10"><X className="w-6 h-6" /></button>
              {images.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setCurrentImage(p => p === 0 ? images.length - 1 : p - 1); }}
                    className="absolute left-4 md:left-8 p-3 rounded-full bg-white/5 text-white/70 hover:text-white transition-colors z-10">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setCurrentImage(p => p === images.length - 1 ? 0 : p + 1); }}
                    className="absolute right-4 md:right-8 p-3 rounded-full bg-white/5 text-white/70 hover:text-white transition-colors z-10">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative max-w-[95vw] max-h-[90vh]"
                  onClick={e => e.stopPropagation()}
                >
                  <img src={images[currentImage]} alt="" className="w-full h-full object-contain rounded-xl max-h-[90vh]" />
                  <img src="/logov2.png" alt="" className="absolute bottom-8 right-8 w-40 opacity-40 pointer-events-none drop-shadow-lg z-10" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm z-10">{currentImage + 1} / {images.length}</div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default CarDetails;
