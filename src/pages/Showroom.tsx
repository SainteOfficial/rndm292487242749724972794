import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Heart, X, ChevronDown, Grid, List,
  Car, Fuel, Gauge, Calendar, ArrowUpRight, Sparkles, Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

// GlowCard Component
const GlowCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    whileHover={{ y: -6 }}
    transition={{ duration: 0.3 }}
    className={`group relative ${className}`}
  >
    <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#14A79D]/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
    <div className="relative h-full rounded-2xl bg-[#0a0a0a] border border-white/[0.04] group-hover:border-[#14A79D]/20 transition-all duration-500 overflow-hidden">
      {children}
    </div>
  </motion.div>
);

const Showroom = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    fuel: '',
    minYear: '',
    maxMileage: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('carFavorites');
    if (saved) setFavorites(JSON.parse(saved));
    fetchCars();
  }, []);

  useEffect(() => {
    localStorage.setItem('carFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setCars(data.map(car => ({
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

  const filteredCars = cars
    .filter(car => {
      const matchesSearch = searchQuery === '' ||
        `${car.brand} ${car.model}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = filters.brand === '' || car.brand === filters.brand;
      const matchesMinPrice = filters.minPrice === '' || car.price >= parseInt(filters.minPrice);
      const matchesMaxPrice = filters.maxPrice === '' || car.price <= parseInt(filters.maxPrice);
      const matchesFuel = filters.fuel === '' || car.specs?.fuel === filters.fuel;
      const matchesYear = filters.minYear === '' || car.year >= parseInt(filters.minYear);
      const matchesMileage = filters.maxMileage === '' || car.mileage <= parseInt(filters.maxMileage);

      return matchesSearch && matchesBrand && matchesMinPrice && matchesMaxPrice && matchesFuel && matchesYear && matchesMileage;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'year-desc': return b.year - a.year;
        case 'mileage-asc': return a.mileage - b.mileage;
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const brands = [...new Set(cars.map(car => car.brand))].sort();
  const fuels = ['Benzin', 'Diesel', 'Hybrid', 'Elektro'];
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ brand: '', minPrice: '', maxPrice: '', fuel: '', minYear: '', maxMileage: '' });
  };

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
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] mb-6"
          >
            <Car className="w-4 h-4 text-[#14A79D]" />
            <span className="text-sm text-white/60">Premium Auswahl</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Unser <span className="bg-gradient-to-r from-[#14A79D] to-[#EBA530] bg-clip-text text-transparent">Showroom</span>
          </h1>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">
            {filteredCars.length} handverlesene Premium-Fahrzeuge warten auf Sie
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#14A79D] transition-colors" />
              <input
                type="text"
                placeholder="Marke oder Modell suchen..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-white placeholder:text-white/30 focus:outline-none focus:border-[#14A79D]/30 focus:bg-white/[0.03] transition-all duration-300"
              />
            </div>

            <div className="flex gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="h-full px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-white/70 appearance-none cursor-pointer focus:outline-none focus:border-[#14A79D]/30 transition-colors pr-10"
                >
                  <option value="newest">Neueste</option>
                  <option value="price-asc">Preis aufsteigend</option>
                  <option value="price-desc">Preis absteigend</option>
                  <option value="year-desc">Baujahr (neueste)</option>
                  <option value="mileage-asc">Km (niedrigste)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex rounded-2xl bg-white/[0.02] border border-white/[0.05] p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#14A79D] text-white' : 'text-white/40 hover:text-white/60'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#14A79D] text-white' : 'text-white/40 hover:text-white/60'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center gap-2 px-5 py-4 rounded-2xl border transition-all duration-300 ${showFilters || activeFiltersCount > 0
                    ? 'bg-[#14A79D]/10 border-[#14A79D]/30 text-[#14A79D]'
                    : 'bg-white/[0.02] border-white/[0.05] text-white/60 hover:text-white hover:border-white/[0.1]'
                  }`}
              >
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#14A79D] text-white text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-6 border-t border-white/[0.05]">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {/* Brand */}
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Marke</label>
                      <select
                        value={filters.brand}
                        onChange={e => setFilters({ ...filters, brand: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white focus:outline-none focus:border-[#14A79D]/30"
                      >
                        <option value="">Alle</option>
                        {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                      </select>
                    </div>

                    {/* Min Price */}
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Preis ab €</label>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white placeholder:text-white/20 focus:outline-none focus:border-[#14A79D]/30"
                      />
                    </div>

                    {/* Max Price */}
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Preis bis €</label>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white placeholder:text-white/20 focus:outline-none focus:border-[#14A79D]/30"
                      />
                    </div>

                    {/* Fuel */}
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Kraftstoff</label>
                      <select
                        value={filters.fuel}
                        onChange={e => setFilters({ ...filters, fuel: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white focus:outline-none focus:border-[#14A79D]/30"
                      >
                        <option value="">Alle</option>
                        {fuels.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
                      </select>
                    </div>

                    {/* Min Year */}
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Baujahr ab</label>
                      <input
                        type="number"
                        placeholder="z.B. 2020"
                        value={filters.minYear}
                        onChange={e => setFilters({ ...filters, minYear: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white placeholder:text-white/20 focus:outline-none focus:border-[#14A79D]/30"
                      />
                    </div>

                    {/* Max Mileage */}
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Km bis</label>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxMileage}
                        onChange={e => setFilters({ ...filters, maxMileage: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white placeholder:text-white/20 focus:outline-none focus:border-[#14A79D]/30"
                      />
                    </div>
                  </div>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 inline-flex items-center gap-2 text-[#14A79D] text-sm hover:underline"
                    >
                      <X className="w-4 h-4" />
                      Filter zurücksetzen
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Cars Grid/List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-2 border-[#14A79D]/20 border-t-[#14A79D] rounded-full animate-spin mb-4" />
            <p className="text-white/40">Fahrzeuge werden geladen...</p>
          </div>
        ) : filteredCars.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <Car className="w-20 h-20 text-white/10 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-2">Keine Fahrzeuge gefunden</h3>
            <p className="text-white/40 mb-6">Versuchen Sie andere Suchkriterien</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14A79D] text-white font-medium"
            >
              Filter zurücksetzen
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }
          >
            {filteredCars.map((car) => (
              <motion.div key={car.id} variants={fadeInUp}>
                {viewMode === 'grid' ? (
                  <GlowCard>
                    <Link to={`/car/${car.id}`} className="block">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={car.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                        <button
                          onClick={(e) => toggleFavorite(car.id, e)}
                          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-all"
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(car.id) ? 'fill-red-500 text-red-500' : 'text-white/80'}`} />
                        </button>

                        <div className="absolute bottom-4 left-4">
                          <span className="px-4 py-2 rounded-full bg-[#14A79D] text-white font-semibold text-sm shadow-lg shadow-[#14A79D]/20">
                            €{car.price?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#14A79D] transition-colors">
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
                ) : (
                  // List View
                  <GlowCard>
                    <Link to={`/car/${car.id}`} className="flex gap-6 p-4">
                      <div className="relative w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={car.images?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'}
                          alt={`${car.brand} ${car.model}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-[#14A79D] transition-colors">
                            {car.brand} {car.model}
                          </h3>
                          <div className="flex gap-4 mt-2 text-sm text-white/40">
                            <span>{car.year}</span>
                            <span>{car.mileage?.toLocaleString()} km</span>
                            <span>{car.specs?.power || car.power} PS</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[#14A79D]">
                            €{car.price?.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-white/40 group-hover:text-white transition-colors">
                            Details <ArrowUpRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => toggleFavorite(car.id, e)}
                        className="self-center p-3 rounded-full hover:bg-white/5 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(car.id) ? 'fill-red-500 text-red-500' : 'text-white/40'}`} />
                      </button>
                    </Link>
                  </GlowCard>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Showroom;