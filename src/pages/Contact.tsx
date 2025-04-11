import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Car as CarIcon, Globe, Navigation2, Apple } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Car } from '../data/cars';

const Contact = () => {
  const location = useLocation();
  const carId = new URLSearchParams(location.search).get('carId');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', carId)
          .single();
          
        if (error) {
          console.error('Error fetching car:', error);
          return;
        }
          
        const parsedCar = {
          ...data,
          specs: typeof data.specs === 'string' ? JSON.parse(data.specs) : data.specs,
          condition: typeof data.condition === 'string' ? JSON.parse(data.condition) : data.condition,
          additionalFeatures: data.additionalfeatures
        };
          
        setSelectedCar(parsedCar);
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCar();
  }, [carId]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredContact: 'email',
    preferredTime: '',
    subject: carId ? 'Fahrzeuganfrage' : 'Allgemeine Anfrage',
    newsletter: false,
    privacy: false
  });

  useEffect(() => {
    if (selectedCar) {
      setFormData(prevData => ({
        ...prevData,
        message: `Ich interessiere mich für den ${selectedCar.brand} ${selectedCar.model} (${selectedCar.year})`,
        subject: 'Fahrzeuganfrage'
      }));
    }
  }, [selectedCar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacy) {
      alert('Bitte akzeptieren Sie die Datenschutzerklärung.');
      return;
    }
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white text-center mb-12"
        >
          Kontaktieren Sie uns
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Kontaktinformationen
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start text-gray-300">
                  <MapPin className="w-6 h-6 mr-4 text-orange-400 mt-1" />
                  <div>
                    <p className="font-semibold">Adresse</p>
                    <p>Münsterstraße 207</p>
                    <p>44534 Lünen</p>
                    <p>Deutschland</p>
                    <div className="flex gap-2 mt-3">
                      <a 
                        href="https://maps.app.goo.gl/X5NgfpaNaGw5bscWA?g_st=com.google.maps.preview.copy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-[#1a1c25] text-orange-400 px-4 py-2 rounded-full hover:bg-[#1e2029] transition-colors group"
                      >
                        <Navigation2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Google Maps
                      </a>
                      <a 
                        href="https://maps.apple.com/?address=Münster%20strasse%20207,%2044534%20Lünen,%20Deutschland&auid=13659803734692933419&ll=51.625382,7.551914&lsp=9902&q=Autosmaya%20Kfz%20Handel&t=m"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-[#1a1c25] text-orange-400 px-4 py-2 rounded-full hover:bg-[#1e2029] transition-colors group"
                      >
                        <Apple className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Apple Maps
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Phone className="w-6 h-6 mr-4 text-orange-400" />
                  <div>
                    <p className="font-semibold">Telefon</p>
                    <p>+49 2306 9988585</p>
                    <p>+49 176 7036 1769</p>
                    <p>+49 1515 3366666</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Mail className="w-6 h-6 mr-4 text-orange-400" />
                  <div>
                    <p className="font-semibold">E-Mail</p>
                    <p>kfzhandelsmaya@autosmaya.info</p>
                  </div>
                </div>

                <div className="flex items-start text-gray-300">
                  <Clock className="w-6 h-6 mr-4 text-orange-400 mt-1" />
                  <div>
                    <p className="font-semibold">Öffnungszeiten</p>
                    <p>Montag - Freitag: 9:00 - 19:00 Uhr</p>
                    <p>Samstag: 10:00 - 18:00 Uhr</p>
                    <p>Sonntag & Feiertage: Geschlossen</p>
                    <p className="text-orange-400 mt-2 text-sm">
                      Wir beantworten Ihre E-Mails auch außerhalb der Öffnungszeiten!
                    </p>
                  </div>
                </div>

                <div className="flex items-start text-gray-300">
                  <Globe className="w-6 h-6 mr-4 text-orange-400 mt-1" />
                  <div>
                    <p className="font-semibold">Sprachen</p>
                    <p>Deutsch, English, Français, العربية</p>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8 flex items-center justify-center">
                <div className="text-white">Fahrzeugdaten werden geladen...</div>
              </div>
            ) : selectedCar && (
              <div className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8">
                <div className="flex items-center mb-4">
                  <CarIcon className="w-6 h-6 mr-3 text-orange-400" />
                  <h3 className="text-xl font-bold text-white">Ausgewähltes Fahrzeug</h3>
                </div>
                <div className="space-y-2">
                  <img
                    src={selectedCar.images[0]}
                    alt={`${selectedCar.brand} ${selectedCar.model}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <p className="text-xl font-bold text-white">
                    {selectedCar.brand} {selectedCar.model}
                  </p>
                  <p className="text-gray-300">Baujahr: {selectedCar.year}</p>
                  <p className="text-gray-300">
                    Kilometerstand: {selectedCar.mileage.toLocaleString()} km
                  </p>
                  <p className="text-orange-400 text-xl font-bold">
                    €{selectedCar.price.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#16181f]/60 backdrop-blur-md rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Nachricht senden
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-300 mb-2">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-gray-300 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-300 mb-2">
                    Betreff *
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                    required
                  >
                    <option value="Fahrzeuganfrage">Fahrzeuganfrage</option>
                    <option value="Probefahrt">Probefahrt vereinbaren</option>
                    <option value="Allgemeine Anfrage">Allgemeine Anfrage</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">
                  Nachricht *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Bevorzugte Kontaktart
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center text-gray-300">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={formData.preferredContact === 'email'}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      className="mr-2"
                    />
                    E-Mail
                  </label>
                  <label className="flex items-center text-gray-300">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={formData.preferredContact === 'phone'}
                      onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                      className="mr-2"
                    />
                    Telefon
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-gray-300 mb-2">
                  Bevorzugte Kontaktzeit
                </label>
                <select
                  id="preferredTime"
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Beliebig</option>
                  <option value="morning">Vormittags (9-12 Uhr)</option>
                  <option value="afternoon">Nachmittags (12-15 Uhr)</option>
                  <option value="evening">Spätnachmittag (15-18 Uhr)</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                    className="mr-2"
                  />
                  Newsletter abonnieren
                </label>

                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.privacy}
                    onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
                    className="mr-2"
                    required
                  />
                  Ich habe die <a href="/legal" className="text-orange-400 hover:underline mx-1">Datenschutzerklärung</a> 
                  gelesen und stimme dieser zu *
                </label>
              </div>
              
              <div className="mt-8">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
                >
                  Nachricht senden
                </motion.button>
              </div>

              <p className="text-gray-400 text-sm text-center">
                * Pflichtfelder
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;