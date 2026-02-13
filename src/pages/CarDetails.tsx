import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Heart, Share2, Phone, Mail, MapPin,
  Calendar, Gauge, Fuel, Settings, Palette, Car, Shield,
  X, ArrowRight
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

  useEffect(() => {
    if (id) { fetchCar(); checkFavorite(); }
    else { setLoading(false); setError(true); }
  }, [id]);

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
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 pt-8">
        <div className="skeleton h-[60vh] rounded-2xl mb-6" />
        <div className="grid grid-cols-5 gap-3 mb-12">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>
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

  const specItems = [
    { icon: Calendar, label: 'Erstzulassung', value: car.year },
    { icon: Gauge, label: 'Kilometerstand', value: car.mileage ? `${car.mileage.toLocaleString()} km` : null },
    { icon: Fuel, label: 'Kraftstoff', value: car.fuel },
    { icon: Settings, label: 'Getriebe', value: car.transmission },
    { icon: Car, label: 'Leistung', value: specs.power ? `${specs.power} PS` : null },
    { icon: Palette, label: 'Farbe', value: specs.color },
  ].filter(s => s.value);

  return (
    <div className="min-h-screen bg-[#050505] pt-20 pb-20">
      {/* ─── Hero Image ─── */}
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-black overflow-hidden cursor-pointer" onClick={() => setLightboxOpen(true)}>
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); setCurrentImage(p => p === 0 ? images.length - 1 : p - 1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={e => { e.stopPropagation(); setCurrentImage(p => p === images.length - 1 ? 0 : p + 1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white/60 text-xs font-medium">
          {currentImage + 1} / {images.length}
        </div>
      </div>

      {/* ─── Thumbnail strip ─── */}
      {images.length > 1 && (
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 mt-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {images.map((img: string, i: number) => (
              <button key={i} onClick={() => setCurrentImage(i)}
                className={`flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${i === currentImage ? 'border-[#14A79D] opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                  }`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Main content ─── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left — details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title row */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                    {car.brand} {car.model}
                  </h1>
                  <p className="text-white/35 text-sm mt-1">{car.year} • {car.mileage?.toLocaleString()} km • {car.fuel}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={toggleFavorite} className={`p-2.5 rounded-full border transition-all duration-300 ${isFavorite ? 'border-red-500/30 text-red-500' : 'border-white/[0.06] text-white/40 hover:text-white'}`}>
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                  </button>
                  <button onClick={share} className="p-2.5 rounded-full border border-white/[0.06] text-white/40 hover:text-white transition-all duration-300">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Specs grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
              <h2 className="text-lg font-display font-semibold text-white mb-4">Technische Daten</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specItems.map(s => (
                  <div key={s.label} className="px-4 py-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <s.icon className="w-4 h-4 text-[#14A79D] mb-2" />
                    <p className="text-white/30 text-xs mb-0.5">{s.label}</p>
                    <p className="text-white font-medium text-sm">{s.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            {car.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="text-lg font-display font-semibold text-white mb-4">Beschreibung</h2>
                <p className="text-white/40 text-sm leading-relaxed whitespace-pre-line">{car.description}</p>
              </motion.div>
            )}

            {/* Features */}
            {car.additionalfeatures?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="text-lg font-display font-semibold text-white mb-4">Ausstattung</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {car.additionalfeatures.map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-white/40 text-sm py-1.5">
                      <div className="w-1 h-1 rounded-full bg-[#14A79D]" />
                      {f.trim()}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — sticky sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-5">
            {/* Price card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
            >
              <p className="text-white/30 text-xs uppercase tracking-[0.1em] mb-2">Preis</p>
              <p className="text-3xl font-display font-bold text-white mb-1">€{car.price?.toLocaleString()}</p>
              <p className="text-white/20 text-xs mb-6">inkl. MwSt. • Finanzierung möglich</p>

              <div className="space-y-3">
                <a href={`https://wa.me/4923069988585?text=${encodeURIComponent(`Ich interessiere mich für den ${car.brand} ${car.model} (${car.year})`)}`}
                  target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">
                  <Phone className="w-4 h-4" /> WhatsApp Anfrage
                </a>
                <a href="tel:+4923069988585" className="btn-outline w-full justify-center">
                  <Phone className="w-4 h-4" /> Anrufen
                </a>
              </div>
            </motion.div>

            {/* Dealer card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
            >
              <h3 className="text-sm font-display font-semibold text-white mb-4">Autosmaya</h3>
              <div className="space-y-3 text-sm text-white/40">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-white/20 flex-shrink-0" />
                  <span>Münsterstraße 207, 44534 Lünen</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-white/20 flex-shrink-0" />
                  <a href="tel:+4923069988585" className="hover:text-white transition-colors">+49 2306 9988585</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-white/20 flex-shrink-0" />
                  <a href="mailto:kfzhandelsmaya@autosmaya.de" className="hover:text-white transition-colors">kfzhandelsmaya@autosmaya.de</a>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-2 text-white/30 text-xs">
                  <Shield className="w-3.5 h-3.5 text-[#14A79D]" />
                  <span>12 Monate Garantie • TÜV-geprüft</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── Related cars ─── */}
        {relatedCars.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-20 pt-16 border-t border-white/[0.04]">
            <h2 className="text-2xl font-display font-bold text-white tracking-tight mb-8">Ähnliche Fahrzeuge</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCars.map(rc => (
                <Link key={rc.id} to={`/car/${rc.id}`} className="group card-luxury">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={rc.images?.[0]} alt={`${rc.brand} ${rc.model}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
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

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
            <button className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors z-10"><X className="w-6 h-6" /></button>
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
              <motion.img key={currentImage} src={images[currentImage]} alt="" onClick={e => e.stopPropagation()}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }} />
            </AnimatePresence>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">{currentImage + 1} / {images.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarDetails;