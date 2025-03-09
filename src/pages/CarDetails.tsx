import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  Check, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Car, 
  Calendar, 
  Gauge, 
  Settings, 
  Shield,
  Eye, 
  Lightbulb, 
  Star,
  AlertTriangle,
  X,
  Award,
  Sparkles,
  Heart,
  ThumbsUp,
  Clock,
  BookCheck,
  Verified,
  Medal,
  Navigation2,
  Apple,
  MapPin
} from 'lucide-react';

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarCars, setSimilarCars] = useState<any[]>([]);

  useEffect(() => {
    if (!id?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      navigate('/showroom');
      return;
    }
    fetchCar();
  }, [id, navigate]);

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Parse JSON strings back to objects if needed
      const parsedCar = {
        ...data,
        specs: typeof data.specs === 'string' ? JSON.parse(data.specs) : data.specs,
        condition: typeof data.condition === 'string' ? JSON.parse(data.condition) : data.condition,
        additionalFeatures: data.additionalfeatures
      };
      
      setCar(parsedCar);
      fetchSimilarCars(parsedCar);
    } catch (error) {
      console.error('Error fetching car:', error);
      navigate('/showroom');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarCars = async (currentCar: any) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .neq('id', currentCar.id)
        .or(`brand.eq.${currentCar.brand},price.gte.${currentCar.price * 0.8},price.lte.${currentCar.price * 1.2}`)
        .limit(3);

      if (error) throw error;

      // Parse JSON strings back to objects if needed
      const parsedCars = data.map(car => ({
        ...car,
        specs: typeof car.specs === 'string' ? JSON.parse(car.specs) : car.specs,
        condition: typeof car.condition === 'string' ? JSON.parse(car.condition) : car.condition,
        additionalFeatures: car.additionalfeatures
      }));

      setSimilarCars(parsedCars);
    } catch (error) {
      console.error('Error fetching similar cars:', error);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  const handleContact = () => {
    navigate(`/contact?carId=${car.id}&brand=${car.brand}&model=${car.model}&price=${car.price}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white">Lade Fahrzeug...</div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Fahrzeug nicht gefunden</h2>
          <Link
            to="/showroom"
            className="text-orange-400 hover:text-orange-300"
          >
            Zurück zum Showroom
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/showroom"
          className="inline-flex items-center text-white hover:text-orange-400 mb-8"
        >
          <ArrowLeft className="mr-2" />
          Zurück zum Showroom
        </Link>

        {car.condition.accident && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <h3 className="text-red-500 font-semibold mb-1">Unfallfahrzeug</h3>
              <p className="text-gray-300">Dieses Fahrzeug hat einen dokumentierten Unfallschaden. Weitere Details finden Sie in der Fahrzeugbeschreibung.</p>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="bg-[#16181f]/60 backdrop-blur-md rounded-lg overflow-hidden relative group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={car.images[currentImageIndex]}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-[400px] object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {car.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className={`bg-[#16181f]/60 backdrop-blur-md rounded-lg overflow-hidden cursor-pointer transition-all ${
                    index === currentImageIndex ? 'ring-2 ring-orange-400' : ''
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${car.brand} ${car.model} thumbnail`}
                    className="w-full h-24 object-cover hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Car Details */}
          <div className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                {car.brand} {car.model}
              </h1>
              <div className="flex items-center justify-between mb-6">
                <p className="text-3xl text-orange-400 font-bold">
                  €{car.price.toLocaleString()}
                </p>
                <span className="text-gray-400">inkl. MwSt.</span>
              </div>

              {/* Condition Badges */}
              <div className="mb-6 flex flex-wrap gap-2">
                {car.condition.accident ? (
                  <div className="inline-flex items-center bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                    <X className="w-4 h-4 mr-1" />
                    Unfallfahrzeug
                  </div>
                ) : (
                  <div className="inline-flex items-center bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    <Verified className="w-4 h-4 mr-1" />
                    Unfallfrei
                  </div>
                )}
                
                {car.condition.warranty ? (
                  <div className="inline-flex items-center bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                    <Shield className="w-4 h-4 mr-1" />
                    Garantie
                  </div>
                ) : (
                  <div className="inline-flex items-center bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Keine Garantie
                  </div>
                )}

                {car.condition.serviceHistory && (
                  <div className="inline-flex items-center bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                    <BookCheck className="w-4 h-4 mr-1" />
                    Scheckheftgepflegt
                  </div>
                )}

                {car.condition.previousOwners === 0 && (
                  <div className="inline-flex items-center bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
                    <Award className="w-4 h-4 mr-1" />
                    Erstbesitz
                  </div>
                )}

                {car.condition.previousOwners > 0 ? (
                  <div className="inline-flex items-center bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm">
                    <Info className="w-4 h-4 mr-1" />
                    {car.condition.previousOwners} Vorbesitzer
                  </div>
                ) : null}

                {car.condition.type === 'Neu' && (
                  <div className="inline-flex items-center bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Neufahrzeug
                  </div>
                )}

                {!car.condition.accident && car.condition.warranty && car.condition.serviceHistory && (
                  <div className="inline-flex items-center bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-sm">
                    <Heart className="w-4 h-4 mr-1" />
                    Top Zustand
                  </div>
                )}

                {car.year >= new Date().getFullYear() - 2 && (
                  <div className="inline-flex items-center bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">
                    <Medal className="w-4 h-4 mr-1" />
                    Junges Fahrzeug
                  </div>
                )}

                {car.mileage < 50000 && (
                  <div className="inline-flex items-center bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full text-sm">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Niedrige Laufleistung
                  </div>
                )}
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-orange-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Erstzulassung</p>
                    <p className="font-semibold">12/2024</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Gauge className="w-5 h-5 mr-2 text-orange-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Kilometerstand</p>
                    <p className="font-semibold">{car.mileage.toLocaleString()} km</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Car className="w-5 h-5 mr-2 text-orange-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Kraftstoff</p>
                    <p className="font-semibold">{car.specs.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-orange-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Getriebe</p>
                    <p className="font-semibold">{car.specs.transmission}</p>
                  </div>

                </div>
              </div>

              {/* Additional Specs */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p className="text-gray-400 text-sm">Leistung</p>
                  <p className="font-semibold">{car.specs.power}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Hubraum</p>
                  <p className="font-semibold">{car.specs.hubraum}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Verbrauch</p>
                  <p className="font-semibold">{car.specs.consumption}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">CO₂-Emissionen</p>
                  <p className="font-semibold">{car.specs.emissions}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleContact}
                className="bg-gradient-to-r from-[#14A79D] to-[#EBA530] text-white w-full py-3 rounded-full inline-block text-center hover:scale-95 transition-transform duration-200 font-medium"
              >
                Kontaktieren Sie uns
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white w-full py-3 rounded-full hover:bg-white/20 transition-colors duration-200">
                Finanzierung berechnen
              </button>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Ausstattung</h2>
            <div className="grid grid-cols-2 gap-4">
              {car.features.map((feature: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center text-gray-300"
                >
                  <Check className="w-5 h-5 text-orange-400 mr-2" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="w-6 h-6 text-orange-400 mr-2" />
              Sonderausstattung
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {car.additionalFeatures.map((feature: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-[#1a1c25] to-[#1e2029] p-4 rounded-lg hover:from-[#1e2029] hover:to-[#1a1c25] transition-all duration-300 group hover:scale-[1.01] hover:shadow-xl"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="text-gray-300 group-hover:text-white transition-colors">{feature}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Fahrzeugbeschreibung</h2>
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#1a1c25] to-[#1e2029] p-6 rounded-lg">
              <p className="text-xl text-gray-200 leading-relaxed">
                {car.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-[#1a1c25] to-[#1e2029] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-orange-400 mr-2" />
                  Sicherheit & Assistenz
                </h3>
                <ul className="space-y-2">
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Airbag Fahrer-/Beifahrerseite (abschaltbar)
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Aktive Motorhaube
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Antischlupfregelung (ASR)
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#1a1c25] to-[#1e2029] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 text-orange-400 mr-2" />
                  Antrieb & Fahrwerk
                </h3>
                <ul className="space-y-2">
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Allradantrieb
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Automatisches Bremsen Differential (ABD)
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Bremssättel schwarz eloxiert
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#1a1c25] to-[#1e2029] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Eye className="w-5 h-5 text-orange-400 mr-2" />
                  Exterieur
                </h3>
                <ul className="space-y-2">
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Außenspiegel asphärisch, links
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Außenspiegel elektr. anklappbar
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Außenspiegel mit Umfeldleuchte LED
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#1a1c25] to-[#1e2029] p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 text-orange-400 mr-2" />
                  Beleuchtung
                </h3>
                <ul className="space-y-2">
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Blinkleuchten LED
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Matrix-LED-Scheinwerfer
                  </li>
                  <li className="text-gray-300 flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                    Tagfahrlicht 4-Punkt-LED
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Similar Cars Section */}
        {similarCars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Car className="w-6 h-6 text-[#14A79D] mr-2" />
              Diese Fahrzeuge könnten Ihnen auch gefallen
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarCars.map((similarCar) => (
                <motion.div
                  key={similarCar.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#16181f]/60 backdrop-blur-md rounded-lg overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={similarCar.images[0]}
                      alt={`${similarCar.brand} ${similarCar.model}`}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {similarCar.brand} {similarCar.model}
                    </h3>
                    <p className="text-[#14A79D] text-lg font-semibold mb-2">
                      €{similarCar.price.toLocaleString()}
                    </p>
                    <div className="text-gray-300 space-y-1 mb-4">
                      <p>Baujahr: {similarCar.year}</p>
                      <p>Kilometerstand: {similarCar.mileage.toLocaleString()} km</p>
                      <p>Motor: {similarCar.specs.engine}</p>
                    </div>
                    <Link
                      to={`/car/${similarCar.id}`}
                      className="bg-[#14A79D] text-white px-4 py-2 rounded-full inline-block hover:bg-[#118F86] transition-colors"
                    >
                      Details ansehen
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CarDetails;