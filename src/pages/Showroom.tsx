import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Search, SlidersHorizontal, X, Heart, ArrowUpRight, Fuel, Gauge, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const Showroom = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('newest');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]'); } catch { return []; }
  });
  const [filters, setFilters] = useState({ brand: '', fuel: '', minPrice: '', maxPrice: '' });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('cars').select('*').eq('status', 'available').order('created_at', { ascending: false });
        if (data) setCars(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const toggleFav = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem('favorites', JSON.stringify(next));
  };

  const brands = [...new Set(cars.map(c => c.brand))].sort();
  const fuels = [...new Set(cars.map(c => c.fuel))].filter(Boolean).sort();

  const filtered = cars
    .filter(c => {
      const q = search.toLowerCase();
      if (q && !`${c.brand} ${c.model}`.toLowerCase().includes(q)) return false;
      if (filters.brand && c.brand !== filters.brand) return false;
      if (filters.fuel && c.fuel !== filters.fuel) return false;
      if (filters.minPrice && c.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && c.price > Number(filters.maxPrice)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const clearFilters = () => { setFilters({ brand: '', fuel: '', minPrice: '', maxPrice: '' }); setSearch(''); };
  const hasFilters = search || filters.brand || filters.fuel || filters.minPrice || filters.maxPrice;

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
        {/* Header */}
        <Section className="pt-8 pb-10">
          <p className="text-[#14A79D] text-xs font-medium tracking-[0.2em] uppercase mb-3">Showroom</p>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-3">
            Unsere Fahrzeuge
          </h1>
          <p className="text-white/35 text-base max-w-lg">
            Entdecken Sie unsere handverlesene Auswahl an Premium-Gebrauchtwagen.
          </p>
        </Section>

        {/* Search & Filter bar */}
        <Section className="mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Marke oder Modell suchen..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#14A79D]/40 transition-all duration-300"
              />
            </div>

            {/* Filter toggle + sort */}
            <div className="flex gap-3">
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border text-sm transition-all duration-300 ${showFilters ? 'bg-[#14A79D]/10 border-[#14A79D]/30 text-[#14A79D]' : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:text-white'}`}>
                <SlidersHorizontal className="w-4 h-4" /> Filter
              </button>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-[#14A79D]/40 transition-all duration-300">
                <option value="newest">Neueste zuerst</option>
                <option value="price-asc">Preis aufsteigend</option>
                <option value="price-desc">Preis absteigend</option>
              </select>
            </div>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <select value={filters.brand} onChange={e => setFilters({ ...filters, brand: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none">
                    <option value="">Alle Marken</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <select value={filters.fuel} onChange={e => setFilters({ ...filters, fuel: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none">
                    <option value="">Alle Kraftstoffe</option>
                    {fuels.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <input type="number" placeholder="Min. Preis" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none" />
                  <input type="number" placeholder="Max. Preis" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-white/25 focus:outline-none" />
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 mt-3 text-xs text-white/40 hover:text-white transition-colors">
                    <X className="w-3 h-3" /> Filter zurücksetzen
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Section>

        {/* Results count */}
        <div className="mb-6 text-sm text-white/30">
          {filtered.length} Fahrzeug{filtered.length !== 1 ? 'e' : ''} gefunden
        </div>

        {/* Car Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-luxury">
                <div className="skeleton aspect-[4/5]" />
                <div className="p-5">
                  <div className="skeleton h-5 w-3/4 rounded mb-2" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg mb-4">Keine Fahrzeuge gefunden</p>
            <button onClick={clearFilters} className="btn-outline text-sm">Filter zurücksetzen</button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((car, i) => (
                <motion.div
                  key={car.id} layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="group"
                >
                  <Link to={`/car/${car.id}`} className="block card-luxury">
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={car.images?.[0]} alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Price */}
                      <div className="absolute bottom-4 left-4">
                        <p className="text-white text-xl font-display font-bold">€{car.price?.toLocaleString()}</p>
                      </div>

                      {/* Favorite */}
                      <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(car.id); }}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-white/60 hover:text-white transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(car.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>

                      {/* Badge */}
                      {car.featured && (
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#14A79D]/90 text-white text-xs font-medium">
                          Exklusiv
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="text-white font-display font-semibold tracking-tight group-hover:text-[#14A79D] transition-colors duration-300">
                        {car.brand} {car.model}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-white/30 text-xs">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{car.year}</span>
                        <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{car.mileage?.toLocaleString()} km</span>
                        {car.fuel && <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{car.fuel}</span>}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Showroom;