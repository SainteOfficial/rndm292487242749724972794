import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Images, X, ChevronLeft, ChevronRight, ZoomIn, ArrowUpRight, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

const Gallery = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; car: any; index: number } | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (data) setCars(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique brands
  const brands = ['all', ...new Set(cars.map(car => car.brand))];

  // Flatten images with car info
  const allImages = cars
    .filter(car => filter === 'all' || car.brand === filter)
    .flatMap(car =>
      (car.images || []).map((url: string, idx: number) => ({
        url,
        car,
        index: idx
      }))
    );

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    const currentIdx = allImages.findIndex(img => img.url === selectedImage.url);
    const newIdx = direction === 'next'
      ? (currentIdx + 1) % allImages.length
      : (currentIdx - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[newIdx]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, allImages]);

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] -left-40 w-[500px] h-[500px] bg-[#14A79D]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-[20%] -right-40 w-[400px] h-[400px] bg-[#EBA530]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] mb-6"
          >
            <Images className="w-4 h-4 text-[#14A79D]" />
            <span className="text-sm text-white/60">Bildergalerie</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Unsere <span className="bg-gradient-to-r from-[#14A79D] to-[#EBA530] bg-clip-text text-transparent">Fahrzeuge</span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            {allImages.length} hochauflösende Bilder unserer Premium-Automobile
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setFilter(brand)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${filter === brand
                  ? 'bg-[#14A79D] text-white shadow-lg shadow-[#14A79D]/20'
                  : 'bg-white/[0.02] border border-white/[0.05] text-white/50 hover:text-white hover:border-white/10'
                }`}
            >
              {brand === 'all' ? 'Alle Marken' : brand}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-2 border-[#14A79D]/20 border-t-[#14A79D] rounded-full animate-spin mb-4" />
            <p className="text-white/40">Bilder werden geladen...</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
          >
            <AnimatePresence mode="popLayout">
              {allImages.slice(0, 24).map((image, i) => (
                <motion.div
                  key={`${image.car.id}-${image.index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-[#0a0a0a] border border-white/[0.03]"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={`${image.car.brand} ${image.car.model}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* Car Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-semibold mb-1">
                        {image.car.brand} {image.car.model}
                      </p>
                      <p className="text-white/50 text-sm">{image.car.year} • €{image.car.price?.toLocaleString()}</p>
                    </div>

                    {/* Zoom Icon */}
                    <div className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 backdrop-blur-md">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* View More CTA */}
        {allImages.length > 24 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-white/40 mb-4">
              Zeige 24 von {allImages.length} Bildern
            </p>
            <Link
              to="/showroom"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
            >
              Alle Fahrzeuge im Showroom
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 z-50 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm">
              {allImages.findIndex(img => img.url === selectedImage.url) + 1} / {allImages.length}
            </div>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
              className="absolute left-4 md:left-8 z-50 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
              className="absolute right-4 md:right-8 z-50 p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-6xl max-h-[85vh] px-4 z-40"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={`${selectedImage.car.brand} ${selectedImage.car.model}`}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
              />

              {/* Info Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]"
              >
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {selectedImage.car.brand} {selectedImage.car.model}
                  </h3>
                  <p className="text-white/50">
                    {selectedImage.car.year} • €{selectedImage.car.price?.toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/car/${selectedImage.car.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14A79D] text-white font-medium hover:bg-[#14A79D]/90 transition-colors"
                  >
                    Fahrzeug ansehen
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;