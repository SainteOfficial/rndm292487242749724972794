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
  MapPin,
  Calculator,
  CreditCard,
  Scale,
  PlusCircle,
  Search as SearchIcon,
  User,
  Users
} from 'lucide-react';

// Cookie-Hilfsfunktionen
const setCookie = (name: string, value: string, days: number = 30) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarCars, setSimilarCars] = useState<any[]>([]);
  
  // Zustandsvariablen für den Fahrzeugvergleich
  const [comparisonCars, setComparisonCars] = useState<any[]>([null, null]);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectionSlot, setSelectionSlot] = useState<number | null>(null);
  const [availableCars, setAvailableCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  
  // Zustandsvariable für aktive Betrachter
  const [activeViewers, setActiveViewers] = useState<number>(0);
  const [realViewers, setRealViewers] = useState<number>(0);
  const [showRealViewers, setShowRealViewers] = useState<boolean>(false);

  useEffect(() => {
    if (!id?.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      navigate('/showroom');
      return;
    }
    fetchCar();
    initializeViewers();
    trackRealViewers();
  }, [id, navigate]);

  // Tracking von echten Benutzern über Supabase Realtime
  const trackRealViewers = async () => {
    if (!id) return;

    try {
      // Inkrementierung des Zählers für dieses Auto
      await supabase.rpc('increment_car_view_counter', { car_id: id });
      
      // Abonnieren des Kanals für aktive Betrachter
      const channel = supabase
        .channel(`car-viewers-${id}`)
        .on('presence', { event: 'sync' }, () => {
          const viewers = Object.keys(channel.presenceState()).length;
          setRealViewers(viewers);
          
          // Wenn mehr als 10 echte Betrachter, zeige die echte Anzahl
          if (viewers > 10) {
            setShowRealViewers(true);
            setActiveViewers(viewers);
          } else {
            setShowRealViewers(false);
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            // Präsenz des aktuellen Benutzers signalisieren
            await channel.track({ user_id: getCookie('user_id') || `anonymous-${Date.now()}` });
          }
        });
      
      return () => {
        channel.unsubscribe();
      };
    } catch (error) {
      console.error('Fehler beim Tracken der echten Betrachter:', error);
    }
  };

  // Initialisierung der Betrachteranzahl
  const initializeViewers = () => {
    if (!id) return;
    
    // Cookie-Name für dieses spezifische Fahrzeug
    const cookieName = `car_viewers_${id}`;
    
    // Prüfen, ob bereits ein Cookie existiert
    let viewers = getCookie(cookieName);
    
    if (!viewers) {
      // Wenn kein Cookie existiert, generiere eine realistische Anzahl
      // Basiert auf Fahrzeugpreis, Tageszeit und einer zufälligen Komponente
      const hour = new Date().getHours();
      const isPeakHour = hour >= 9 && hour <= 20;
      
      // Basis-Betrachter: höher während der Hauptzeit
      const baseViewers = isPeakHour ? 
        Math.floor(Math.random() * 4) + 3 : // 3-6 während Hauptzeit
        Math.floor(Math.random() * 3) + 1;  // 1-3 während Nebenzeit
      
      viewers = baseViewers.toString();
      setCookie(cookieName, viewers, 1); // Cookie für 1 Tag speichern
    }
    
    setActiveViewers(parseInt(viewers));
    
    // Subtile periodische Änderungen, nur wenn wir keine echten Betrachter anzeigen
    const viewerInterval = setInterval(() => {
      // Wenn wir echte Betrachter anzeigen, stoppe die Änderungen
      if (showRealViewers) return;
      
      // Bestehenden Cookie-Wert abrufen
      const currentViewers = parseInt(getCookie(cookieName) || '0');
      
      // 85% der Zeit bleibt der Wert gleich
      if (Math.random() > 0.15) return;
      
      // Kleine Änderung mit höherer Wahrscheinlichkeit für +1 als für -1
      const change = Math.random() > 0.7 ? 1 : -1;
      
      // Sicherstellen, dass wir mindestens 1 Betrachter haben
      const newViewers = Math.max(1, currentViewers + change);
      
      // Cookie und State aktualisieren
      setCookie(cookieName, newViewers.toString(), 1);
      setActiveViewers(newViewers);
    }, 25000); // Alle 25 Sekunden prüfen - subtiler
    
    return () => clearInterval(viewerInterval);
  };

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
        .eq('sold', false)
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
    // Angepasst an die tatsächliche Implementierung der Contact.tsx
    // Dies stellt sicher, dass das Auto in der Kontaktanfrage vorausgewählt ist
    // und in der E-Mail-Nachricht erwähnt wird
    const query = new URLSearchParams({
      carId: car.id,
      subject: 'Fahrzeuganfrage', // Dies setzt den Betreff auf Fahrzeuganfrage
      message: `Ich interessiere mich für den ${car.brand} ${car.model} (${car.year})` // Vorausgefüllte Nachricht
    }).toString();
    
    // Zur Kontaktseite navigieren
    navigate(`/contact?${query}`);
  };

  // Lädt alle Fahrzeuge für den Vergleich
  const fetchAvailableCars = async () => {
    setLoadingCars(true);
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .neq('id', id)
        .limit(10);

      if (error) throw error;

      // Parse JSON strings back to objects if needed
      const parsedCars = data.map(car => ({
        ...car,
        specs: typeof car.specs === 'string' ? JSON.parse(car.specs) : car.specs,
        condition: typeof car.condition === 'string' ? JSON.parse(car.condition) : car.condition
      }));

      setAvailableCars(parsedCars);
    } catch (error) {
      console.error('Error fetching available cars:', error);
    } finally {
      setLoadingCars(false);
    }
  };

  const openSelectionModal = (slot: number) => {
    setSelectionSlot(slot);
    setShowSelectionModal(true);
    fetchAvailableCars();
  };

  const selectCarForComparison = (selectedCar: any) => {
    if (selectionSlot === null) return;
    
    const newComparisonCars = [...comparisonCars];
    newComparisonCars[selectionSlot] = selectedCar;
    setComparisonCars(newComparisonCars);
    setShowSelectionModal(false);
    setSelectionSlot(null);
  };

  const clearComparisonSlot = (slot: number) => {
    const newComparisonCars = [...comparisonCars];
    newComparisonCars[slot] = null;
    setComparisonCars(newComparisonCars);
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
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold text-white">
                  {car.brand} {car.model}
                </h1>
                
                {/* Aktive Betrachter Anzeige */}
                {(activeViewers > 0 || realViewers > 0) && (
                  <div className="flex items-center bg-black/20 hover:bg-black/30 transition-colors rounded-full px-3 py-1.5 text-white">
                    <Users className="w-4 h-4 mr-2 text-[#14A79D]" />
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{showRealViewers ? realViewers : activeViewers}</span>
                      <div className="ml-1.5 relative flex">
                        <span className="absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </div>
                      <span className="text-xs ml-1.5 text-gray-300">Interessenten online</span>
                    </div>
                  </div>
                )}
              </div>
              
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
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Info className="w-6 h-6 text-orange-400 mr-2" />
            Fahrzeugbeschreibung
          </h2>

          <div className="space-y-8">
            {car.description && (
              <div className="bg-gradient-to-r from-[#1a1c25] to-[#1e2029] p-6 rounded-xl shadow-lg border border-[#14A79D]/10 hover:border-[#14A79D]/20 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="hidden md:block">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#14A79D] to-[#EBA530] rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl text-white font-semibold mb-3 flex items-center">
                      <Sparkles className="md:hidden w-5 h-5 text-[#14A79D] mr-2" />
                      Über dieses Fahrzeug
                    </h3>
                    <p className="text-lg text-gray-200 leading-relaxed border-l-2 border-[#14A79D]/30 pl-4 italic">
                      {car.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Technische Daten */}
            <motion.div 
              className="bg-gradient-to-r from-[#1a1c25] to-[#1e2029] rounded-xl shadow-lg overflow-hidden border border-[#14A79D]/10"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-[#14A79D]/10 to-transparent p-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Settings className="w-5 h-5 text-[#14A79D] mr-2" />
                  Technische Daten
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {car.specs.engine && (
                    <div className="bg-black/20 p-4 rounded-lg hover:bg-black/30 transition-colors group">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-[#14A79D]/20 rounded-full flex items-center justify-center group-hover:bg-[#14A79D]/30 transition-colors">
                          <Settings className="w-4 h-4 text-[#14A79D]" />
                        </div>
                        <span className="text-gray-300 font-medium">Motor</span>
                      </div>
                      <p className="text-white font-semibold ml-11">{car.specs.engine}</p>
                    </div>
                  )}
                  {car.specs.power && (
                    <div className="bg-black/20 p-4 rounded-lg hover:bg-black/30 transition-colors group">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-[#14A79D]/20 rounded-full flex items-center justify-center group-hover:bg-[#14A79D]/30 transition-colors">
                          <Gauge className="w-4 h-4 text-[#14A79D]" />
                        </div>
                        <span className="text-gray-300 font-medium">Leistung</span>
                      </div>
                      <p className="text-white font-semibold ml-11">{car.specs.power}</p>
                    </div>
                  )}
                  {car.specs.transmission && (
                    <div className="bg-black/20 p-4 rounded-lg hover:bg-black/30 transition-colors group">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-[#14A79D]/20 rounded-full flex items-center justify-center group-hover:bg-[#14A79D]/30 transition-colors">
                          <Settings className="w-4 h-4 text-[#14A79D]" />
                        </div>
                        <span className="text-gray-300 font-medium">Getriebe</span>
                      </div>
                      <p className="text-white font-semibold ml-11">{car.specs.transmission}</p>
                    </div>
                  )}
                  {car.specs.fuelType && (
                    <div className="bg-black/20 p-4 rounded-lg hover:bg-black/30 transition-colors group">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-[#14A79D]/20 rounded-full flex items-center justify-center group-hover:bg-[#14A79D]/30 transition-colors">
                          <Car className="w-4 h-4 text-[#14A79D]" />
                        </div>
                        <span className="text-gray-300 font-medium">Kraftstoff</span>
                      </div>
                      <p className="text-white font-semibold ml-11">{car.specs.fuelType}</p>
                    </div>
                  )}
                  {car.specs.consumption && (
                    <div className="bg-black/20 p-4 rounded-lg hover:bg-black/30 transition-colors group">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-[#14A79D]/20 rounded-full flex items-center justify-center group-hover:bg-[#14A79D]/30 transition-colors">
                          <Lightbulb className="w-4 h-4 text-[#14A79D]" />
                        </div>
                        <span className="text-gray-300 font-medium">Verbrauch</span>
                      </div>
                      <p className="text-white font-semibold ml-11">{car.specs.consumption}</p>
                    </div>
                  )}
                  {car.specs.acceleration && (
                    <div className="bg-black/20 p-4 rounded-lg hover:bg-black/30 transition-colors group">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-[#14A79D]/20 rounded-full flex items-center justify-center group-hover:bg-[#14A79D]/30 transition-colors">
                          <Navigation2 className="w-4 h-4 text-[#14A79D]" />
                        </div>
                        <span className="text-gray-300 font-medium">Beschleunigung</span>
                      </div>
                      <p className="text-white font-semibold ml-11">{car.specs.acceleration}</p>
                    </div>
                  )}
                  {car.specs.emissions && (
                    <div className="bg-black/20 p-4 rounded-lg hover:bg-black/30 transition-colors group">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-[#14A79D]/20 rounded-full flex items-center justify-center group-hover:bg-[#14A79D]/30 transition-colors">
                          <Eye className="w-4 h-4 text-[#14A79D]" />
                        </div>
                        <span className="text-gray-300 font-medium">CO₂-Emissionen</span>
                      </div>
                      <p className="text-white font-semibold ml-11">{car.specs.emissions}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Fahrzeughistorie (Optional) */}
            {car.condition && (
              <motion.div 
                className="bg-gradient-to-r from-[#1a1c25] to-[#1e2029] rounded-xl overflow-hidden shadow-lg border border-[#14A79D]/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-gradient-to-r from-[#14A79D]/10 to-transparent p-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Clock className="w-5 h-5 text-[#14A79D] mr-2" />
                    Fahrzeughistorie
                  </h3>
                  {car.condition.type && (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      car.condition.type === 'Neu' 
                        ? 'bg-indigo-500/20 text-indigo-400' 
                        : car.condition.type === 'Gebraucht' && car.year >= new Date().getFullYear() - 2
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {car.condition.type}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {car.condition.previousOwners !== undefined && (
                      <div className="flex items-start space-x-4 bg-black/20 p-4 rounded-lg">
                        <div className="w-10 h-10 bg-[#14A79D]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-[#14A79D]" />
                        </div>
                        <div>
                          <span className="text-gray-300 font-medium block">Vorbesitzer</span>
                          <span className="text-white text-xl font-bold">
                            {car.condition.previousOwners === 0 
                              ? "Erstbesitz" 
                              : `${car.condition.previousOwners} ${car.condition.previousOwners === 1 ? 'Vorbesitzer' : 'Vorbesitzer'}`
                            }
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {car.condition.serviceHistory !== undefined && (
                      <div className="flex items-start space-x-4 bg-black/20 p-4 rounded-lg">
                        <div className="w-10 h-10 bg-[#14A79D]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <BookCheck className="w-5 h-5 text-[#14A79D]" />
                        </div>
                        <div>
                          <span className="text-gray-300 font-medium block">Scheckheft</span>
                          <span className={`text-xl font-bold ${car.condition.serviceHistory ? 'text-green-400' : 'text-red-400'}`}>
                            {car.condition.serviceHistory ? 'Scheckheftgepflegt' : 'Nicht vorhanden'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {car.condition.accident !== undefined && (
                      <div className="flex items-start space-x-4 bg-black/20 p-4 rounded-lg">
                        <div className="w-10 h-10 bg-[#14A79D]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-[#14A79D]" />
                        </div>
                        <div>
                          <span className="text-gray-300 font-medium block">Unfallfrei</span>
                          <span className={`text-xl font-bold ${car.condition.accident ? 'text-red-400' : 'text-green-400'}`}>
                            {car.condition.accident ? 'Unfallfahrzeug' : 'Unfallfrei'}
                          </span>
                          {car.condition.accident && (
                            <p className="text-gray-400 text-sm mt-1">Bitte kontaktieren Sie uns für Details zum Unfallschaden.</p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {car.condition.warranty !== undefined && (
                      <div className="flex items-start space-x-4 bg-black/20 p-4 rounded-lg">
                        <div className="w-10 h-10 bg-[#14A79D]/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="w-5 h-5 text-[#14A79D]" />
                        </div>
                        <div>
                          <span className="text-gray-300 font-medium block">Garantie</span>
                          <span className={`text-xl font-bold ${car.condition.warranty ? 'text-green-400' : 'text-red-400'}`}>
                            {car.condition.warranty ? 'Garantie vorhanden' : 'Keine Garantie'}
                          </span>
                          {car.condition.warranty && (
                            <p className="text-gray-400 text-sm mt-1">12 Monate Gebrauchtwagengarantie</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!car.condition.accident && car.condition.serviceHistory && car.condition.warranty && (
                    <div className="mt-6 bg-gradient-to-r from-[#14A79D]/20 to-[#EBA530]/20 p-4 rounded-lg border border-[#14A79D]/20">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#14A79D] to-[#EBA530] rounded-full flex items-center justify-center mr-3">
                          <ThumbsUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-lg">Premium-Fahrzeug</h4>
                          <p className="text-gray-300">Dieses Fahrzeug erfüllt unsere höchsten Qualitätsstandards und wird mit umfassender Garantie angeboten.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Neuer Abschnitt für Besonderheiten */}
            <motion.div 
              className="bg-gradient-to-r from-[#1a1c25] to-[#1e2029] rounded-xl overflow-hidden shadow-lg border border-[#14A79D]/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gradient-to-r from-[#14A79D]/10 to-transparent p-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Sparkles className="w-5 h-5 text-[#14A79D] mr-2" />
                  Besonderheiten
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center bg-black/20 p-3 rounded-lg hover:bg-black/30 transition-colors">
                    <Calendar className="w-5 h-5 text-[#14A79D] mr-3" />
                    <div>
                      <span className="text-gray-400 text-sm">Verfügbar ab</span>
                      <p className="text-white font-medium">Sofort</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-black/20 p-3 rounded-lg hover:bg-black/30 transition-colors">
                    <Calculator className="w-5 h-5 text-[#14A79D] mr-3" />
                    <div>
                      <span className="text-gray-400 text-sm">Preis</span>
                      <p className="text-white font-medium">€{car.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-black/20 p-3 rounded-lg hover:bg-black/30 transition-colors">
                    <CreditCard className="w-5 h-5 text-[#14A79D] mr-3" />
                    <div>
                      <span className="text-gray-400 text-sm">Zahlungsarten</span>
                      <p className="text-white font-medium">Überweisung, Barzahlung</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleContact}
                    className="bg-gradient-to-r from-[#14A79D] via-[#17A39A] to-[#EBA530] text-white py-3 px-6 rounded-full inline-flex items-center justify-center hover:shadow-lg transition-all duration-300 font-medium w-full"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Probefahrt vereinbaren
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Fahrzeugvergleich */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Scale className="w-6 h-6 text-[#14A79D] mr-2" />
            Fahrzeugvergleich
          </h2>
          
          <div className="space-y-6">
            <p className="text-gray-300">
              Vergleichen Sie diesen {car.brand} {car.model} mit anderen Fahrzeugen aus unserem Bestand und finden Sie das perfekte Auto für Ihre Bedürfnisse.
            </p>

            {/* Vergleichsfahrzeuge Auswahl */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Hauptfahrzeug */}
              <div className="bg-gradient-to-br from-[#1a1c25] to-[#1e2029] rounded-lg p-4 border border-[#14A79D]/30 relative">
                <div className="absolute top-2 right-2 bg-[#14A79D] text-white text-xs px-2 py-1 rounded-full">
                  Ausgewählt
                </div>
                <div className="w-full h-40 mb-3 overflow-hidden rounded-lg">
                  <img 
                    src={car.images[0]} 
                    alt={`${car.brand} ${car.model}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-white font-semibold text-lg">{car.brand} {car.model}</h3>
                <p className="text-[#14A79D] font-bold">€{car.price.toLocaleString()}</p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div className="text-gray-400">Baujahr: <span className="text-white">{car.year}</span></div>
                  <div className="text-gray-400">KM: <span className="text-white">{car.mileage.toLocaleString()}</span></div>
                </div>
              </div>
              
              {/* Vergleichsfahrzeug 1 */}
              {comparisonCars[0] ? (
                <div className="bg-gradient-to-br from-[#1a1c25] to-[#1e2029] rounded-lg p-4 border border-gray-700 relative">
                  <button 
                    onClick={() => clearComparisonSlot(0)}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white text-xs px-2 py-1 rounded-full transition-colors"
                  >
                    Entfernen
                  </button>
                  <div className="w-full h-40 mb-3 overflow-hidden rounded-lg">
                    <img 
                      src={comparisonCars[0].images?.[0] || '/placeholder.jpg'} 
                      alt={`${comparisonCars[0].brand} ${comparisonCars[0].model}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-white font-semibold text-lg">{comparisonCars[0].brand} {comparisonCars[0].model}</h3>
                  <p className="text-[#14A79D] font-bold">€{comparisonCars[0].price.toLocaleString()}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="text-gray-400">Baujahr: <span className="text-white">{comparisonCars[0].year}</span></div>
                    <div className="text-gray-400">KM: <span className="text-white">{comparisonCars[0].mileage.toLocaleString()}</span></div>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => openSelectionModal(0)}
                  className="bg-[#1a1c25]/60 rounded-lg border border-gray-700 border-dashed flex flex-col items-center justify-center p-8 h-64 cursor-pointer hover:bg-[#1a1c25]/80 transition-colors"
                >
                  <PlusCircle className="w-10 h-10 text-gray-500 mb-3" />
                  <p className="text-gray-400 text-center">Fahrzeug zum Vergleichen hinzufügen</p>
                  <button className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                    Fahrzeug auswählen
                  </button>
                </div>
              )}
              
              {/* Vergleichsfahrzeug 2 */}
              {comparisonCars[1] ? (
                <div className="bg-gradient-to-br from-[#1a1c25] to-[#1e2029] rounded-lg p-4 border border-gray-700 relative">
                  <button 
                    onClick={() => clearComparisonSlot(1)}
                    className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white text-xs px-2 py-1 rounded-full transition-colors"
                  >
                    Entfernen
                  </button>
                  <div className="w-full h-40 mb-3 overflow-hidden rounded-lg">
                    <img 
                      src={comparisonCars[1].images?.[0] || '/placeholder.jpg'} 
                      alt={`${comparisonCars[1].brand} ${comparisonCars[1].model}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-white font-semibold text-lg">{comparisonCars[1].brand} {comparisonCars[1].model}</h3>
                  <p className="text-[#14A79D] font-bold">€{comparisonCars[1].price.toLocaleString()}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                    <div className="text-gray-400">Baujahr: <span className="text-white">{comparisonCars[1].year}</span></div>
                    <div className="text-gray-400">KM: <span className="text-white">{comparisonCars[1].mileage.toLocaleString()}</span></div>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => openSelectionModal(1)}
                  className="bg-[#1a1c25]/60 rounded-lg border border-gray-700 border-dashed flex flex-col items-center justify-center p-8 h-64 cursor-pointer hover:bg-[#1a1c25]/80 transition-colors"
                >
                  <PlusCircle className="w-10 h-10 text-gray-500 mb-3" />
                  <p className="text-gray-400 text-center">Fahrzeug zum Vergleichen hinzufügen</p>
                  <button className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                    Fahrzeug auswählen
                  </button>
                </div>
              )}
            </div>
            
            {/* Vergleichstabelle */}
            <div className="overflow-x-auto mt-8">
              <table className="w-full text-left">
                <thead className="bg-[#1a1c25] text-white border-b border-gray-700">
                  <tr>
                    <th className="px-4 py-3">Spezifikationen</th>
                    <th className="px-4 py-3">{car.brand} {car.model}</th>
                    <th className="px-4 py-3 text-gray-500">{comparisonCars[0] ? `${comparisonCars[0].brand} ${comparisonCars[0].model}` : 'Fahrzeug 2'}</th>
                    <th className="px-4 py-3 text-gray-500">{comparisonCars[1] ? `${comparisonCars[1].brand} ${comparisonCars[1].model}` : 'Fahrzeug 3'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr>
                    <td className="px-4 py-3 bg-[#1a1c25] text-white">Preis</td>
                    <td className="px-4 py-3 text-white">€{car.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[0] ? `€${comparisonCars[0].price.toLocaleString()}` : '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[1] ? `€${comparisonCars[1].price.toLocaleString()}` : '-'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#1a1c25] text-white">Baujahr</td>
                    <td className="px-4 py-3 text-white">{car.year}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[0] ? comparisonCars[0].year : '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[1] ? comparisonCars[1].year : '-'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#1a1c25] text-white">Kilometerstand</td>
                    <td className="px-4 py-3 text-white">{car.mileage.toLocaleString()} km</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[0] ? `${comparisonCars[0].mileage.toLocaleString()} km` : '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[1] ? `${comparisonCars[1].mileage.toLocaleString()} km` : '-'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#1a1c25] text-white">Motor</td>
                    <td className="px-4 py-3 text-white">{car.specs.engine || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[0]?.specs?.engine || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[1]?.specs?.engine || '-'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#1a1c25] text-white">Leistung</td>
                    <td className="px-4 py-3 text-white">{car.specs.power || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[0]?.specs?.power || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[1]?.specs?.power || '-'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#1a1c25] text-white">Kraftstoffart</td>
                    <td className="px-4 py-3 text-white">{car.specs.fuelType || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[0]?.specs?.fuelType || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[1]?.specs?.fuelType || '-'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#1a1c25] text-white">Getriebe</td>
                    <td className="px-4 py-3 text-white">{car.specs.transmission || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[0]?.specs?.transmission || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[1]?.specs?.transmission || '-'}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-[#1a1c25] text-white">Verbrauch</td>
                    <td className="px-4 py-3 text-white">{car.specs.consumption || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[0]?.specs?.consumption || '-'}</td>
                    <td className="px-4 py-3 text-gray-300">{comparisonCars[1]?.specs?.consumption || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Empfehlung */}
            <div className="bg-gradient-to-r from-[#14A79D]/10 to-[#14A79D]/5 rounded-lg p-5 border border-[#14A79D]/20 mt-6">
              <h3 className="text-white font-semibold flex items-center mb-3">
                <Award className="w-5 h-5 text-[#14A79D] mr-2" />
                Unser Vergleichstipp
              </h3>
              <p className="text-gray-300">
                Unsere Empfehlung basierend auf Ihren bisherigen Suchkriterien ist der <span className="text-white font-semibold">{car.brand} {car.model}</span>. 
                Er bietet das beste Verhältnis aus Preis, Leistung und Ausstattung in seiner Klasse.
              </p>
              
              <div className="mt-4 flex gap-3">
                <button className="px-4 py-2 bg-[#14A79D] hover:bg-[#14A79D]/90 text-white rounded-lg transition-colors flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Dieses Fahrzeug wählen
                </button>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center">
                  <SearchIcon className="w-4 h-4 mr-1" />
                  Alle ähnlichen Fahrzeuge
                </button>
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
      
      {/* Fahrzeugauswahlmodal */}
      <CarSelectionModal
        isOpen={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        cars={availableCars}
        onSelect={selectCarForComparison}
        loading={loadingCars}
      />
    </div>
  );
};

// Fahrzeugauswahlmodal-Komponente
const CarSelectionModal = ({ 
  isOpen, 
  onClose, 
  cars,
  onSelect,
  loading
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cars: any[];
  onSelect: (car: any) => void;
  loading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#16181f] rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Fahrzeug zum Vergleich auswählen</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14A79D]"></div>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Keine Fahrzeuge gefunden
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars.map(car => (
                <div 
                  key={car.id}
                  onClick={() => onSelect(car)}
                  className="bg-[#1a1c25] rounded-lg overflow-hidden cursor-pointer hover:bg-[#1a1c25]/80 transition-all hover:scale-[1.02] border border-gray-700 hover:border-[#14A79D]/50"
                >
                  <div className="h-32 overflow-hidden">
                    <img 
                      src={car.images?.[0] || '/placeholder.jpg'} 
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-white">{car.brand} {car.model}</h4>
                    <div className="flex justify-between text-sm mt-1">
                      <div className="text-[#14A79D]">€{car.price.toLocaleString()}</div>
                      <div className="text-gray-400">{car.year}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;