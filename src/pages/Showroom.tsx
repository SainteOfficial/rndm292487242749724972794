import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Mail, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Showroom = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const parsedCars = data?.map(car => ({
        ...car,
        specs: typeof car.specs === 'string' ? JSON.parse(car.specs) : car.specs,
        condition: typeof car.condition === 'string' ? JSON.parse(car.condition) : car.condition,
        additionalFeatures: car.additionalfeatures
      })) || [];

      setCars(parsedCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Fehler beim Laden der Fahrzeuge');
    } finally {
      setLoading(false);
    }
  };

  const brands = useMemo(() => 
    [...new Set(cars.map(car => car.brand))].sort(),
    [cars]
  );

  const filteredCars = useMemo(() => 
    cars.filter(car => {
      const matchesSearch = (
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesBrand = !selectedBrand || car.brand === selectedBrand;
      const matchesPrice = car.price >= priceRange.min && car.price <= priceRange.max;
      
      return matchesSearch && matchesBrand && matchesPrice;
    }),
    [searchQuery, selectedBrand, priceRange, cars]
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white">Lade Fahrzeuge...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white text-center mb-12"
        >
          Unser Fahrzeug-Showroom
        </motion.h1>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Suchen Sie nach Marke, Modell oder Beschreibung..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#16181f]/60 backdrop-blur-md text-white pl-12 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedBrand('')}
              className={`px-4 py-2 rounded-full transition-colors ${
                !selectedBrand 
                  ? 'bg-orange-400 text-white' 
                  : 'bg-[#16181f]/60 text-gray-300 hover:bg-[#16181f]/80'
              }`}
            >
              Alle
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedBrand === brand 
                    ? 'bg-orange-400 text-white' 
                    : 'bg-[#16181f]/60 text-gray-300 hover:bg-[#16181f]/80'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#16181f]/60 backdrop-blur-md rounded-lg overflow-hidden group relative"
            >
              {/* Sold Overlay */}
              {car.status === 'sold' && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center">
                  <div className="bg-red-500 text-white px-8 py-4 rounded-lg transform -rotate-12 font-bold text-2xl shadow-lg">
                    VERKAUFT
                  </div>
                </div>
              )}

              <div className="relative overflow-hidden">
                <img
                  src={car.images[0]}
                  alt={`${car.brand} ${car.model}`}
                  className={`w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 ${
                    car.status === 'sold' ? 'filter grayscale' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Price Tag */}
                <div className="absolute top-4 right-4 bg-[#14A79D] text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  €{car.price.toLocaleString()}
                </div>

                {/* Status Badge */}
                {car.status === 'sold' && (
                  <div className="absolute top-4 left-4 bg-red-500/90 text-white px-4 py-2 rounded-full font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Verkauft
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Car Title with Hover Expand */}
                <div className="relative mb-6">
                  <div className="group/title">
                    <h3 className="text-xl font-bold text-white truncate transition-all duration-300 group-hover/title:opacity-0">
                      {car.brand} {car.model}
                    </h3>
                    <div className="absolute top-0 left-0 right-0 opacity-0 group-hover/title:opacity-100 transition-all duration-300 bg-[#16181f] p-2 rounded-lg -mx-2 z-10">
                      <h3 className="text-xl font-bold text-white">
                        {car.brand} {car.model}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Key Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#1a1c25] p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Leistung</p>
                    <div className="relative group/power">
                      <p className="text-white font-medium truncate transition-all duration-300 group-hover/power:opacity-0">
                        {car.specs.power}
                      </p>
                      <div className="absolute top-0 left-0 right-0 opacity-0 group-hover/power:opacity-100 transition-all duration-300 bg-[#1a1c25] p-1 rounded-lg -mx-1 z-10">
                        <p className="text-white font-medium">{car.specs.power}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1a1c25] p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Kilometer</p>
                    <div className="relative group/mileage">
                      <p className="text-white font-medium truncate transition-all duration-300 group-hover/mileage:opacity-0">
                        {car.mileage.toLocaleString()} km
                      </p>
                      <div className="absolute top-0 left-0 right-0 opacity-0 group-hover/mileage:opacity-100 transition-all duration-300 bg-[#1a1c25] p-1 rounded-lg -mx-1 z-10">
                        <p className="text-white font-medium">{car.mileage.toLocaleString()} km</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1a1c25] p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Getriebe</p>
                    <div className="relative group/transmission">
                      <p className="text-white font-medium truncate transition-all duration-300 group-hover/transmission:opacity-0">
                        {car.specs.transmission}
                      </p>
                      <div className="absolute top-0 left-0 right-0 opacity-0 group-hover/transmission:opacity-100 transition-all duration-300 bg-[#1a1c25] p-1 rounded-lg -mx-1 z-10">
                        <p className="text-white font-medium">{car.specs.transmission}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#1a1c25] p-3 rounded-lg">
                    <p className="text-gray-400 text-sm">Kraftstoff</p>
                    <div className="relative group/fuel">
                      <p className="text-white font-medium truncate transition-all duration-300 group-hover/fuel:opacity-0">
                        {car.specs.fuelType}
                      </p>
                      <div className="absolute top-0 left-0 right-0 opacity-0 group-hover/fuel:opacity-100 transition-all duration-300 bg-[#1a1c25] p-1 rounded-lg -mx-1 z-10">
                        <p className="text-white font-medium">{car.specs.fuelType}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {car.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="relative group/feature">
                      <div className="flex items-center text-gray-300 truncate transition-all duration-300 group-hover/feature:opacity-0">
                        <div className="w-2 h-2 bg-[#14A79D] rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                      <div className="absolute top-0 left-0 right-0 opacity-0 group-hover/feature:opacity-100 transition-all duration-300 bg-[#16181f] p-1 rounded-lg -mx-1 z-10">
                        <div className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-[#14A79D] rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  <Link
                    to={`/car/${car.id}`}
                    className={`flex-1 text-white h-12 rounded-full text-center font-medium transition-all duration-300 hover:scale-95 inline-flex items-center justify-center ${
                      car.status === 'sold'
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#14A79D] to-[#EBA530] hover:shadow-lg hover:shadow-[#14A79D]/20'
                    }`}
                  >
                    Details ansehen
                  </Link>
                  <Link
                    to={`/contact?carId=${car.id}`}
                    className={`text-white w-12 h-12 rounded-full transition-colors duration-300 group inline-flex items-center justify-center ${
                      car.status === 'sold'
                        ? 'bg-gray-500/50 cursor-not-allowed'
                        : 'bg-white/10 backdrop-blur-md hover:bg-white/20'
                    }`}
                  >
                    <Mail className={`w-5 h-5 ${car.status === 'sold' ? '' : 'group-hover:scale-110 transition-transform'}`} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            Keine Fahrzeuge gefunden, die Ihren Suchkriterien entsprechen.
          </div>
        )}
      </div>
    </div>
  );
};

export default Showroom;