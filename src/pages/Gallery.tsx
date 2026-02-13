import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

interface GalleryImage { url: string; brand: string; model: string; }

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('cars').select('images, brand, model').eq('status', 'available');
        if (data) {
          const all: GalleryImage[] = [];
          data.forEach(car => {
            (car.images || []).forEach((url: string) => all.push({ url, brand: car.brand, model: car.model }));
          });
          setImages(all);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (!lightbox.open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox({ open: false, index: 0 });
      if (e.key === 'ArrowLeft') setLightbox(p => ({ ...p, index: p.index === 0 ? filtered.length - 1 : p.index - 1 }));
      if (e.key === 'ArrowRight') setLightbox(p => ({ ...p, index: p.index === filtered.length - 1 ? 0 : p.index + 1 }));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox.open]);

  const brands = [...new Set(images.map(i => i.brand))].sort();
  const filtered = selectedBrand ? images.filter(i => i.brand === selectedBrand) : images;

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 pt-8">
        {/* Header */}
        <Section>
          <p className="text-[#14A79D] text-xs font-medium tracking-[0.2em] uppercase mb-3">Galerie</p>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
            Unsere Fahrzeuge
          </h1>
          <p className="text-white/35 text-base mb-10">Einblicke in unser aktuelles Premium-Sortiment.</p>

          {/* Brand filter pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button onClick={() => setSelectedBrand('')}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${!selectedBrand ? 'bg-white text-black' : 'bg-white/[0.04] text-white/50 hover:text-white'}`}>
              Alle
            </button>
            {brands.map(b => (
              <button key={b} onClick={() => setSelectedBrand(b)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${selectedBrand === b ? 'bg-white text-black' : 'bg-white/[0.04] text-white/50 hover:text-white'}`}>
                {b}
              </button>
            ))}
          </div>
        </Section>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(12)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-xl" />)}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.url} layout
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i < 12 ? i * 0.03 : 0, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative overflow-hidden rounded-xl cursor-pointer bg-[#0a0a0a] border border-white/[0.03] ${i % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                    }`}
                  style={{ aspectRatio: i % 5 === 0 ? '1' : '1' }}
                  onClick={() => setLightbox({ open: true, index: i })}
                >
                  <img src={img.url} alt={`${img.brand} ${img.model}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <p className="text-white text-sm font-display font-semibold">{img.brand} {img.model}</p>
                      </div>
                      <ZoomIn className="w-4 h-4 text-white/60" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && filtered[lightbox.index] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center" onClick={() => setLightbox({ open: false, index: 0 })}>
            <button className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors z-10"><X className="w-6 h-6" /></button>
            {filtered.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); setLightbox(p => ({ ...p, index: p.index === 0 ? filtered.length - 1 : p.index - 1 })); }}
                  className="absolute left-4 md:left-8 p-3 rounded-full bg-white/5 text-white/70 hover:text-white transition-colors z-10">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={e => { e.stopPropagation(); setLightbox(p => ({ ...p, index: p.index === filtered.length - 1 ? 0 : p.index + 1 })); }}
                  className="absolute right-4 md:right-8 p-3 rounded-full bg-white/5 text-white/70 hover:text-white transition-colors z-10">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            <AnimatePresence mode="wait">
              <motion.img key={lightbox.index} src={filtered[lightbox.index].url} alt="" onClick={e => e.stopPropagation()}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }} />
            </AnimatePresence>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="text-white/70 text-sm font-display">{filtered[lightbox.index].brand} {filtered[lightbox.index].model}</p>
              <p className="text-white/30 text-xs mt-1">{lightbox.index + 1} / {filtered.length}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;