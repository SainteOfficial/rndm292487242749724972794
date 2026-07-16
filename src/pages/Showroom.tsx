import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Search, SlidersHorizontal, X, Heart, ArrowUpRight, Fuel, Gauge, Calendar, LayoutGrid, LayoutList, Settings, ExternalLink } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inventorySource, setInventorySource] = useState<'local' | 'mobilede'>('local');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('favorites') || '[]'); } catch { return []; }
  });
  const [filters, setFilters] = useState({ brand: '', fuel: '', transmission: '', minPrice: '', maxPrice: '', minYear: '', maxYear: '', minMileage: '', maxMileage: '', minPower: '' });

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
  const transmissions = [...new Set(cars.map(c => c.transmission))].filter(Boolean).sort();

  const filtered = cars
    .filter(c => {
      const q = search.toLowerCase();
      if (q && !`${c.brand} ${c.model}`.toLowerCase().includes(q)) return false;
      if (filters.brand && c.brand !== filters.brand) return false;
      if (filters.fuel && c.fuel !== filters.fuel) return false;
      if (filters.transmission && c.transmission !== filters.transmission) return false;
      if (filters.minPrice && c.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && c.price > Number(filters.maxPrice)) return false;
      if (filters.minYear && c.year < Number(filters.minYear)) return false;
      if (filters.maxYear && c.year > Number(filters.maxYear)) return false;
      if (filters.minMileage && c.mileage < Number(filters.minMileage)) return false;
      if (filters.maxMileage && c.mileage > Number(filters.maxMileage)) return false;
      if (filters.minPower) {
        if (!c.specs?.power) return false;
        const pMatch = c.specs.power.toString().match(/(\d+)/);
        if (pMatch && parseInt(pMatch[1], 10) < Number(filters.minPower)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'mileage-asc') return a.mileage - b.mileage;
      if (sort === 'year-desc') return b.year - a.year;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const clearFilters = () => { setFilters({ brand: '', fuel: '', transmission: '', minPrice: '', maxPrice: '', minYear: '', maxYear: '', minMileage: '', maxMileage: '', minPower: '' }); setSearch(''); };
  const hasFilters = search || filters.brand || filters.fuel || filters.transmission || filters.minPrice || filters.maxPrice || filters.minYear || filters.maxYear || filters.minMileage || filters.maxMileage || filters.minPower;
  const activeFilterCount = [filters.brand, filters.fuel, filters.transmission, filters.minPrice, filters.maxPrice, filters.minYear, filters.maxYear, filters.minMileage, filters.maxMileage, filters.minPower].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24">
        {/* Header section */}
        <Section className="mb-16">
          <p className="text-[#14A79D] text-xs font-medium tracking-[0.25em] uppercase mb-4">Bestand</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight mb-5">
            Showroom
          </h1>
          <p className="text-white/35 text-base max-w-xl leading-relaxed">
            Entdecken Sie unsere handverlesene Auswahl an exklusiven Premium-Fahrzeugen.
          </p>
        </Section>

        {/* Inventory Source Tabs */}
        <div className="flex gap-2 mb-8 bg-white/[0.02] p-1.5 rounded-xl border border-white/[0.04] w-fit">
          <button
            onClick={() => setInventorySource('local')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${inventorySource === 'local' ? 'bg-[#14A79D] text-white shadow-lg shadow-[#14A79D]/20' : 'text-white/40 hover:text-white/70'}`}
          >
            Lokaler Bestand
          </button>
          <button
            onClick={() => setInventorySource('mobilede')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${inventorySource === 'mobilede' ? 'bg-[#FF6600] text-white shadow-lg shadow-[#FF6600]/20' : 'text-white/40 hover:text-white/70'}`}
          >
            Mobile.de Bestand <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {inventorySource === 'mobilede' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-[800px] rounded-2xl overflow-hidden border border-white/[0.06] bg-white"
          >
            <iframe
              src="https://home.mobile.de/home/index.html?partnerHead=false&customerId=25931355"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="Mobile.de Fahrzeugbestand"
            />
          </motion.div>
        ) : (
          <>
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

            {/* Filter toggle + sort + view toggle */}
            <div className="flex gap-3">
              <button onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center gap-2 px-5 py-3.5 rounded-xl border text-sm transition-all duration-300 ${showFilters ? 'bg-[#14A79D]/10 border-[#14A79D]/30 text-[#14A79D]' : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:text-white'}`}>
                <SlidersHorizontal className="w-4 h-4" /> Filter
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#14A79D] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-[#14A79D]/40 transition-all duration-300">
                <option value="newest">Neueste zuerst</option>
                <option value="price-asc">Preis aufsteigend</option>
                <option value="price-desc">Preis absteigend</option>
                <option value="mileage-asc">Kilometerstand ↑</option>
                <option value="year-desc">Baujahr ↓</option>
              </select>

              {/* View mode toggle */}
              <div className="hidden md:flex rounded-xl border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3.5 transition-all duration-300 ${viewMode === 'grid' ? 'bg-[#14A79D]/10 text-[#14A79D]' : 'bg-white/[0.03] text-white/40 hover:text-white'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3.5 transition-all duration-300 ${viewMode === 'list' ? 'bg-[#14A79D]/10 text-[#14A79D]' : 'bg-white/[0.03] text-white/40 hover:text-white'}`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <>
                {/* Mobile Bottom Sheet Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="md:hidden fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                  onClick={() => setShowFilters(false)}
                />
                
                {/* Filter Container (Bottom Sheet on mobile, Inline on desktop) */}
                <motion.div
                  initial={{ y: 300, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, height: 'auto' }}
                  exit={{ y: 300, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed md:static bottom-0 left-0 right-0 z-[61] md:z-auto bg-[#0a0a0a] md:bg-transparent border-t border-white/10 md:border-none p-6 md:p-0 rounded-t-3xl md:rounded-none overflow-hidden max-h-[85vh] md:max-h-none overflow-y-auto"
                >
                  <div className="flex items-center justify-between md:hidden mb-6">
                    <h3 className="text-white font-display font-bold text-xl">Filter</h3>
                    <button onClick={() => setShowFilters(false)} className="p-2 bg-white/5 rounded-full text-white/50 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:pt-4">
                    <select value={filters.brand} onChange={e => setFilters({ ...filters, brand: e.target.value })}
                      className="col-span-2 md:col-span-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none">
                      <option value="">Alle Marken</option>
                      {brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <select value={filters.fuel} onChange={e => setFilters({ ...filters, fuel: e.target.value })}
                      className="col-span-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none">
                      <option value="">Alle Kraftstoffe</option>
                      {fuels.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <select value={filters.transmission} onChange={e => setFilters({ ...filters, transmission: e.target.value })}
                      className="col-span-1 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none">
                      <option value="">Alle Getriebe</option>
                      {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Second row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div className="flex gap-2 col-span-2">
                      <input type="number" placeholder="Min. Preis €" inputMode="numeric" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                        className="w-1/2 px-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none" />
                      <input type="number" placeholder="Max. Preis €" inputMode="numeric" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="w-1/2 px-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none" />
                    </div>
                    <div className="flex gap-2 col-span-2">
                      <input type="number" placeholder="Min. KM" inputMode="numeric" value={filters.minMileage} onChange={e => setFilters({ ...filters, minMileage: e.target.value })}
                        className="w-1/2 px-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none" />
                      <input type="number" placeholder="Max. KM" inputMode="numeric" value={filters.maxMileage} onChange={e => setFilters({ ...filters, maxMileage: e.target.value })}
                        className="w-1/2 px-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none" />
                    </div>
                  </div>

                  {/* Third row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div className="flex gap-2 col-span-2">
                      <input type="number" placeholder="Baujahr ab" inputMode="numeric" value={filters.minYear} onChange={e => setFilters({ ...filters, minYear: e.target.value })}
                        className="w-1/2 px-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none" />
                      <input type="number" placeholder="Baujahr bis" inputMode="numeric" value={filters.maxYear} onChange={e => setFilters({ ...filters, maxYear: e.target.value })}
                        className="w-1/2 px-3 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <input type="number" placeholder="Min. Leistung (PS/kW)" inputMode="numeric" value={filters.minPower} onChange={e => setFilters({ ...filters, minPower: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none" />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col md:flex-row items-center gap-4 mt-8 md:mt-4">
                    <button onClick={() => setShowFilters(false)} className="md:hidden w-full py-4 rounded-xl bg-[#14A79D] text-white font-medium">
                      Ergebnisse anzeigen ({filtered.length})
                    </button>
                    {hasFilters && (
                      <button onClick={clearFilters} className="flex items-center justify-center gap-1.5 w-full md:w-auto text-sm text-white/40 hover:text-white transition-colors py-2">
                        <X className="w-4 h-4" /> Filter zurücksetzen
                      </button>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </Section>

        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm text-white/30">
            {filtered.length} Fahrzeug{filtered.length !== 1 ? 'e' : ''} gefunden
          </span>
          {/* Mobile.de link */}
          <a
            href="https://www.mobile.de/haendler/autosmaya/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#FF6600]/70 hover:text-[#FF6600] transition-colors duration-300"
          >
            <ExternalLink className="w-3 h-3" />
            Alle Inserate auf Mobile.de
          </a>
        </div>

        {/* Car Grid / List */}
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
        ) : viewMode === 'grid' ? (
          /* ─── GRID VIEW ─── */
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
                      {/* Watermark */}
                      <img src="/logov2.png" alt="" className="absolute bottom-4 right-4 w-24 opacity-40 pointer-events-none drop-shadow-md z-10" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

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
                      {car.transmission && (
                        <div className="flex items-center gap-1 mt-1.5 text-white/20 text-xs">
                          <Settings className="w-3 h-3" />{car.transmission}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ─── LIST VIEW ─── */
          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((car, i) => (
                <motion.div
                  key={car.id} layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  className="group"
                >
                  <Link to={`/car/${car.id}`} className="block card-luxury">
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                        <img
                          src={car.images?.[0]} alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        {car.featured && (
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#14A79D]/90 text-white text-xs font-medium">
                            Exklusiv
                          </div>
                        )}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFav(car.id); }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white/60 hover:text-white transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(car.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-white font-display font-semibold text-lg tracking-tight group-hover:text-[#14A79D] transition-colors duration-300">
                            {car.brand} {car.model}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-white/30 text-xs">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{car.year}</span>
                            <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{car.mileage?.toLocaleString()} km</span>
                            {car.fuel && <span className="flex items-center gap-1"><Fuel className="w-3 h-3" />{car.fuel}</span>}
                            {car.transmission && <span className="flex items-center gap-1"><Settings className="w-3 h-3" />{car.transmission}</span>}
                          </div>
                          {car.description && (
                            <p className="text-white/25 text-sm mt-3 line-clamp-2 leading-relaxed">{car.description}</p>
                          )}
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                          <p className="text-white text-2xl font-display font-bold">€{car.price?.toLocaleString()}</p>
                          <span className="text-[#14A79D] text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Details <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default Showroom;