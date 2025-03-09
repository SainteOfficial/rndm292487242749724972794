import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Award, Star, Car, Gauge, Settings, Users, Mail } from 'lucide-react';
import { MarqueeLogos } from '../components/MarqueeLogos';
import { supabase } from '../lib/supabase';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInScale = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

// Testimonials data
const testimonials = [
  {
    name: "Michael Schmidt",
    text: "Hervorragender Service und faire Preise. Mein neuer BMW ist genau das, was ich gesucht habe. Die Beratung war kompetent und der Kaufprozess reibungslos.",
    rating: 5,
    car: "BMW M4 Competition",
    date: "März 2024"
  },
  {
    name: "Laura Weber",
    text: "Die Beratung war erstklassig und die Abwicklung sehr professionell. Absolut empfehlenswert! Besonders beeindruckt hat mich die Transparenz während des gesamten Prozesses.",
    rating: 5,
    car: "Mercedes-Benz GLC 300",
    date: "Februar 2024"
  },
  {
    name: "Thomas Müller",
    text: "Schnelle und unkomplizierte Kaufabwicklung. Das Team von Autosmaya ist einfach spitze! Die Finanzierungsberatung war sehr hilfreich und kundenorientiert.",
    rating: 5,
    car: "Audi RS e-tron GT",
    date: "Januar 2024"
  },
  {
    name: "Sarah Klein",
    text: "Ein großartiges Erlebnis von Anfang bis Ende. Die Probefahrt war ausführlich und die Fahrzeugübergabe perfekt organisiert. Mein neuer Porsche ist ein Traum!",
    rating: 5,
    car: "Porsche 911 Carrera",
    date: "März 2024"
  },
  {
    name: "Markus Wagner",
    text: "Sehr zufrieden mit dem gesamten Service. Die Inzahlungnahme meines alten Fahrzeugs war fair und der Übergang zum neuen Auto problemlos.",
    rating: 5,
    car: "Tesla Model 3",
    date: "Februar 2024"
  },
  {
    name: "Julia Becker",
    text: "Fantastische Erfahrung! Die Expertise und Leidenschaft des Team ist beeindruckend. Mein neuer Audi übertrifft alle Erwartungen.",
    rating: 5,
    car: "Audi Q8 e-tron",
    date: "Januar 2024"
  }
];

const Home = () => {
  const [featuredCars, setFeaturedCars] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'available') // Only fetch available cars
        .limit(3)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const parsedCars = data?.map(car => ({
        ...car,
        specs: typeof car.specs === 'string' ? JSON.parse(car.specs) : car.specs,
        condition: typeof car.condition === 'string' ? JSON.parse(car.condition) : car.condition,
        additionalFeatures: car.additionalfeatures
      })) || [];

      setFeaturedCars(parsedCars);
    } catch (error) {
      console.error('Error fetching featured cars:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen relative overflow-hidden"
      >
        {/* Background Video or Image */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10" />
        <motion.div 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=3583&auto=format&fit=crop')] bg-cover bg-center"
        />

        <div className="relative z-20 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 w-full h-full">
            <div className="flex flex-col min-h-screen">
              {/* Main Content */}
              <div className="flex-grow flex items-center pt-32 pb-8 md:py-32">
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="max-w-3xl"
                >
                  <motion.h1
                    variants={fadeInUp}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                  >
                    Luxus auf vier Rädern
                  </motion.h1>
                  <motion.p
                    variants={fadeInUp}
                    className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
                  >
                    Entdecken Sie bei Autosmaya exklusive Fahrzeuge, die Ihre höchsten Ansprüche erfüllen. 
                    Premium-Service und faire Preise garantiert.
                  </motion.p>
                  <motion.div
                    variants={fadeInUp}
                    className="flex flex-wrap gap-4"
                  >
                    <Link
                      to="/showroom"
                      className="bg-[#14A79D] text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-[#118F86] transition-colors duration-200 inline-flex items-center"
                    >
                      Fahrzeuge entdecken
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <Link
                      to="/contact"
                      className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-white/20 transition-colors duration-200 inline-flex items-center"
                    >
                      Kontakt aufnehmen
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              {/* Stats Section */}
              <motion.div 
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="pb-8 md:pb-32"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  {[
                    { icon: Car, text: "Fahrzeuge", value: "150+" },
                    { icon: Users, text: "Zufriedene Kunden", value: "1000+" },
                    { icon: Settings, text: "Jahre Erfahrung", value: "10+" },
                    { icon: Gauge, text: "Support", value: "24/7" }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInScale}
                      className="bg-black/30 backdrop-blur-md rounded-lg p-4 md:p-6 border border-white/10 hover:border-white/20 transition-colors duration-300"
                    >
                      <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-[#14A79D] mb-2" />
                      <p className="text-xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-gray-400 text-sm md:text-base">{stat.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-[#16181f]/30">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Warum Autosmaya?
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Shield, title: "Sicherheit", desc: "Umfassende Garantie und Qualitätssicherung" },
              { icon: Clock, title: "Schnell & Einfach", desc: "Unkomplizierte Abwicklung" },
              { icon: Award, title: "Qualität", desc: "Nur geprüfte Fahrzeuge" },
              { icon: Star, title: "Service", desc: "Persönliche Beratung" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInScale}
                className="text-center transform hover:-translate-y-2 transition-transform duration-300"
              >
                <feature.icon className="w-12 h-12 text-[#14A79D] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ausgewählte Premium-Fahrzeuge
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Entdecken Sie unsere handverlesene Auswahl an exklusiven Fahrzeugen. 
              Jedes Modell wird sorgfältig geprüft und bietet höchste Qualität zu fairen Preisen.
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center text-gray-400">Lade Fahrzeuge...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-[#16181f]/60 backdrop-blur-md rounded-lg overflow-hidden group hover:shadow-xl hover:shadow-[#14A79D]/10 transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Price Tag */}
                    <div className="absolute top-4 right-4 bg-[#14A79D] text-white px-4 py-2 rounded-full font-bold shadow-lg">
                      €{car.price.toLocaleString()}
                    </div>

                    {/* Condition Badge */}
                    {car.condition.type === 'Neu' && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-[#14A79D] to-[#EBA530] text-white px-4 py-2 rounded-full font-medium">
                        Neufahrzeug
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
                        className="flex-1 bg-gradient-to-r from-[#14A79D] to-[#EBA530] text-white h-12 rounded-full text-center font-medium hover:shadow-lg hover:shadow-[#14A79D]/20 transition-all duration-300 hover:scale-95 inline-flex items-center justify-center"
                      >
                        Details ansehen
                      </Link>
                      <Link
                        to={`/contact?carId=${car.id}`}
                        className="bg-white/10 backdrop-blur-md text-white w-12 h-12 rounded-full hover:bg-white/20 transition-colors duration-300 group inline-flex items-center justify-center"
                      >
                        <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/showroom"
              className="inline-flex items-center space-x-2 bg-[#1a1c25] text-white px-8 py-3 rounded-full hover:bg-[#1e2029] transition-colors group"
            >
              <span>Alle Fahrzeuge ansehen</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-gray-400 mt-4">
              Über {featuredCars.length} Premium-Fahrzeuge in unserem Showroom
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-[#16181f]/30 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Was unsere Kunden sagen
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Erfahren Sie aus erster Hand, wie zufrieden unsere Kunden mit unserem Service sind.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#13141d] via-transparent to-[#13141d] z-10" />
            
            <div className="flex overflow-hidden">
              <motion.div
                animate={{
                  x: [0, -2000],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40,
                    ease: "linear",
                  },
                }}
                className="flex gap-8"
              >
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="w-[400px] flex-shrink-0 bg-gradient-to-br from-[#1a1c25] to-[#1e2029] rounded-lg p-6 hover:shadow-xl hover:shadow-[#14A79D]/10 transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-5 h-5 text-[#14A79D] fill-[#14A79D] mr-1"
                        />
                      ))}
                    </div>
                    <div className="h-[120px] overflow-hidden mb-6">
                      <p className="text-gray-300 text-lg leading-relaxed line-clamp-4">
                        "{testimonial.text}"
                      </p>
                    </div>
                    <div className="border-t border-gray-700/50 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-semibold truncate">{testimonial.name}</p>
                        <p className="text-gray-400 text-sm">{testimonial.date}</p>
                      </div>
                      <p className="text-[#14A79D] font-medium truncate">{testimonial.car}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Second row moving in opposite direction */}
              <motion.div
                animate={{
                  x: [-2000, 0],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 45,
                    ease: "linear",
                  },
                }}
                className="flex gap-8"
              >
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="w-[400px] flex-shrink-0 bg-gradient-to-br from-[#1a1c25] to-[#1e2029] rounded-lg p-6 hover:shadow-xl hover:shadow-[#14A79D]/10 transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-5 h-5 text-[#14A79D] fill-[#14A79D] mr-1"
                        />
                      ))}
                    </div>
                    <div className="h-[120px] overflow-hidden mb-6">
                      <p className="text-gray-300 text-lg leading-relaxed line-clamp-4">
                        "{testimonial.text}"
                      </p>
                    </div>
                    <div className="border-t border-gray-700/50 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-white font-semibold truncate">{testimonial.name}</p>
                        <p className="text-gray-400 text-sm">{testimonial.date}</p>
                      </div>
                      <p className="text-[#14A79D] font-medium truncate">{testimonial.car}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 bg-[#14A79D] text-white px-8 py-3 rounded-full hover:bg-[#118F86] transition-colors"
            >
              <span>Kontaktieren Sie uns</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-gray-400 mt-4">
              Über 1000+ zufriedene Kunden vertrauen uns
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brands Marquee */}
      <MarqueeLogos />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Bereit für Ihr Traumauto?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Kontaktieren Sie uns noch heute und lassen Sie sich von unseren Experten beraten.
          </p>
          <Link
            to="/contact"
            className="bg-[#14A79D] text-white px-8 py-3 rounded-full text-lg font-medium hover:scale-95 transition-transform duration-200 inline-flex items-center"
          >
            Jetzt Kontakt aufnehmen
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;