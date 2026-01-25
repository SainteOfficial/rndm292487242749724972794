import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Heart, Share2, Phone, Mail, MapPin,
  Calendar, Gauge, Fuel, Settings, Palette, Car, Shield, Award,
  CheckCircle, ArrowUpRight, Sparkles, X, ZoomIn
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// GlowCard Component
const GlowCard = ({ children, className = "", gradient = "from-[#14A79D]/10" }: any) => (
  <div className={`group relative ${className}`}>
    <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${gradient} to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
    <div className="relative h-full rounded-2xl bg-[#0a0a0a] border border-white/[0.04] group-hover:border-white/[0.08] transition-all duration-500 overflow-hidden">
      {children}
    </div>
  </div>
);

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
    if (id) {
      fetchCar();
      checkFavorite();
    } else {
      setLoading(false);
      setError(true);
    }
  }, [id]);

  const safeJSONParse = (value: any, fallback: any = {}) => {
    if (!value) return fallback;
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  };

  const fetchCar = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        setError(true);
        setLoading(false);
        return;
      }

      if (data) {
        const parsedCar = {
          ...data,
          specs: safeJSONParse(data.specs, {}),
          condition: safeJSONParse(data.condition, {}),
          images: Array.isArray(data.images) ? data.images : [],
          additionalfeatures: typeof data.additionalfeatures === 'string'
            ? data.additionalfeatures.split(',')
            : Array.isArray(data.additionalfeatures)
              ? data.additionalfeatures
              : [],
        };
        setCar(parsedCar);
        if (data.brand) {
          fetchRelatedCars(data.brand);
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedCars = async (brand: string) => {
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('brand', brand)
      .eq('status', 'available')
      .neq('id', id)
      .limit(3);
    if (data) setRelatedCars(data);
  };

  const checkFavorite = () => {
    const saved = localStorage.getItem('carFavorites');
    if (saved) {
      const favorites = JSON.parse(saved);
      setIsFavorite(favorites.includes(id));
    }
  };

  const toggleFavorite = () => {
    const saved = localStorage.getItem('carFavorites');
    let favorites = saved ? JSON.parse(saved) : [];

    if (isFavorite) {
      favorites = favorites.filter((fav: string) => fav !== id);
    } else {
      favorites.push(id);
    }

    localStorage.setItem('carFavorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  const shareVehicle = () => {
    if (navigator.share) {
      navigator.share({
        title: `${car.brand} ${car.model}`,
        text: `Schau dir diesen ${car.brand} ${car.model} bei Autosmaya an!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-[#14A79D]/20 border-t-[#14A79D] rounded-full animate-spin" />
      </div>
    );
  }

  if (!car || error) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <Car className="w-20 h-20 text-white/10 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Fahrzeug nicht gefunden</h2>
        <p className="text-white/40 mb-6">Das gesuchte Fahrzeug existiert nicht mehr.</p>
        <Link to="/showroom" className="px-6 py-3 rounded-full bg-[#14A79D] text-white font-medium">
          Zum Showroom
        </Link>
      </div>
    );
  }

  const images = car.images || [];
  const specs = [
    { icon: Calendar, label: 'Baujahr', value: car.year },
    { icon: Gauge, label: 'Kilometerstand', value: `${car.mileage?.toLocaleString()} km` },
    { icon: Fuel, label: 'Kraftstoff', value: car.specs?.fuel || 'Benzin' },
    { icon: Settings, label: 'Getriebe', value: car.specs?.transmission || 'Automatik' },
    { icon: Car, label: 'Leistung', value: `${car.specs?.power || car.power} PS` },
    { icon: Palette, label: 'Farbe', value: car.specs?.color || car.color || 'Schwarz' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] -left-40 w-[500px] h-[500px] bg-[#14A79D]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-[20%] -right-40 w-[400px] h-[400px] bg-[#EBA530]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Zurück
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Main Image */}
            <GlowCard>
              <div
                className="relative aspect-[16/10] cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={images[currentImage] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200'}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Zoom Hint */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-black/50 backdrop-blur-md text-white/60 text-sm">
                  <ZoomIn className="w-4 h-4" />
                  Vergrößern
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-4 px-3 py-2 rounded-full bg-black/50 backdrop-blur-md text-white/60 text-sm">
                  {currentImage + 1} / {images.length}
                </div>
              </div>
            </GlowCard>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`relative flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${currentImage === i ? 'border-[#14A79D]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Specs Grid */}
            <GlowCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Technische Daten</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {specs.map((spec) => (
                    <div key={spec.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                      <spec.icon className="w-5 h-5 text-[#14A79D] mb-2" />
                      <div className="text-xs text-white/40 mb-1">{spec.label}</div>
                      <div className="text-white font-medium">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </GlowCard>

            {/* Features */}
            {car.additionalfeatures && car.additionalfeatures.length > 0 && (
              <GlowCard>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Ausstattung</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {car.additionalfeatures.map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-white/60">
                        <CheckCircle className="w-4 h-4 text-[#14A79D] flex-shrink-0" />
                        <span className="text-sm">{typeof feature === 'string' ? feature.trim() : feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlowCard>
            )}

            {/* Description */}
            {car.description && (
              <GlowCard>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Beschreibung</h3>
                  <p className="text-white/50 leading-relaxed whitespace-pre-line">{car.description}</p>
                </div>
              </GlowCard>
            )}
          </motion.div>

          {/* Right Column - Info & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Main Info Card */}
            <GlowCard gradient="from-[#14A79D]/10">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-[#14A79D] mb-1">Premium Fahrzeug</div>
                    <h1 className="text-2xl font-bold text-white">
                      {car.brand} {car.model}
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleFavorite}
                      className={`p-3 rounded-xl border transition-all ${isFavorite
                        ? 'bg-red-500/10 border-red-500/30 text-red-500'
                        : 'bg-white/[0.02] border-white/[0.05] text-white/40 hover:text-white'
                        }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={shareVehicle}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/40 hover:text-white transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-white/[0.05]">
                  <div className="text-4xl font-bold text-white">
                    €{car.price?.toLocaleString()}
                  </div>
                  <div className="text-white/40 text-sm mt-1">inkl. MwSt.</div>
                </div>

                {/* Trust Badges */}
                <div className="flex gap-3 mb-6">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                    <Shield className="w-4 h-4 text-[#14A79D]" />
                    <span className="text-xs text-white/60">TÜV geprüft</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                    <Award className="w-4 h-4 text-[#EBA530]" />
                    <span className="text-xs text-white/60">12 Mon. Garantie</span>
                  </div>
                </div>

                {/* CTAs */}
                <div className="space-y-3">
                  <Link
                    to={`/contact?carId=${id}`}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-[#14A79D] to-[#14A79D]/80 text-white font-semibold hover:shadow-lg hover:shadow-[#14A79D]/20 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Anfrage senden
                  </Link>

                  <a
                    href="tel:+4923069988585"
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    Anrufen
                  </a>
                </div>
              </div>
            </GlowCard>

            {/* Contact Card */}
            <GlowCard>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Standort</h3>
                <div className="space-y-3 text-white/50">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#14A79D] flex-shrink-0 mt-0.5" />
                    <div>
                      <div>Münsterstraße 207</div>
                      <div>44534 Lünen</div>
                    </div>
                  </div>
                  <a href="tel:+4923069988585" className="flex items-center gap-3 hover:text-white transition-colors">
                    <Phone className="w-5 h-5 text-[#14A79D]" />
                    +49 2306 9988585
                  </a>
                  <a href="mailto:kfzhandelsmaya@autosmaya.de" className="flex items-center gap-3 hover:text-white transition-colors">
                    <Mail className="w-5 h-5 text-[#14A79D]" />
                    kfzhandelsmaya@autosmaya.de
                  </a>
                </div>

                <a
                  href="https://maps.app.goo.gl/X5NgfpaNaGw5bscWA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/60 hover:text-white transition-colors"
                >
                  Route planen
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </GlowCard>
          </motion.div>
        </div>

        {/* Related Cars */}
        {relatedCars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              Ähnliche Fahrzeuge
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCars.map((relCar) => (
                <GlowCard key={relCar.id}>
                  <Link to={`/car/${relCar.id}`}>
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={relCar.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600'}
                        alt={`${relCar.brand} ${relCar.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-white font-semibold mb-2">{relCar.brand} {relCar.model}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-[#14A79D] font-bold">€{relCar.price?.toLocaleString()}</span>
                        <span className="text-white/40 text-sm">{relCar.year}</span>
                      </div>
                    </div>
                  </Link>
                </GlowCard>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 text-white">
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => prev === 0 ? images.length - 1 : prev - 1); }}
              className="absolute left-6 p-4 rounded-full bg-white/5 border border-white/10 text-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => prev === images.length - 1 ? 0 : prev + 1); }}
              className="absolute right-6 p-4 rounded-full bg-white/5 border border-white/10 text-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <img
              src={images[currentImage]}
              alt=""
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarDetails;