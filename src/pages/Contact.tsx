import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, Send, MessageCircle,
  Sparkles, Navigation, CheckCircle, ArrowUpRight, User
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// GlowCard
const GlowCard = ({ children, className = "", gradient = "from-[#14A79D]/10" }: any) => (
  <motion.div
    whileHover={{ y: -4 }}
    className={`group relative ${className}`}
  >
    <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${gradient} to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
    <div className="relative h-full rounded-2xl bg-[#0a0a0a] border border-white/[0.04] group-hover:border-white/[0.08] transition-all duration-500 overflow-hidden">
      {children}
    </div>
  </motion.div>
);

const Contact = () => {
  const location = useLocation();
  const carId = new URLSearchParams(location.search).get('carId');
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: carId ? 'Fahrzeuganfrage' : 'Allgemeine Anfrage',
    privacy: false
  });

  useEffect(() => {
    if (carId) fetchCar();
  }, [carId]);

  const fetchCar = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('cars').select('*').eq('id', carId).single();
      if (data) {
        setSelectedCar(data);
        setFormData(prev => ({
          ...prev,
          message: `Ich interessiere mich für den ${data.brand} ${data.model} (${data.year}).\n\nBitte kontaktieren Sie mich für weitere Informationen.`,
          subject: 'Fahrzeuganfrage'
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacy) return;
    // Simulate submission
    setSubmitted(true);
  };

  const contactMethods = [
    {
      icon: Phone,
      label: 'Telefon',
      value: '+49 2306 9988585',
      subtext: 'Mo-Fr 9-19 Uhr',
      href: 'tel:+4923069988585',
      gradient: 'from-[#14A79D]'
    },
    {
      icon: Mail,
      label: 'E-Mail',
      value: 'kfzhandelsmaya@autosmaya.de',
      subtext: 'Antwort innerhalb 24h',
      href: 'mailto:kfzhandelsmaya@autosmaya.de',
      gradient: 'from-[#EBA530]'
    },
    {
      icon: MapPin,
      label: 'Standort',
      value: 'Münsterstraße 207',
      subtext: '44534 Lünen',
      href: 'https://maps.app.goo.gl/X5NgfpaNaGw5bscWA',
      gradient: 'from-purple-500'
    },
    {
      icon: Clock,
      label: 'Öffnungszeiten',
      value: 'Mo-Fr: 9-19 Uhr',
      subtext: 'Sa: 10-18 Uhr',
      href: null,
      gradient: 'from-rose-500'
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[30%] -left-40 w-[500px] h-[500px] bg-[#14A79D]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-[30%] -right-40 w-[400px] h-[400px] bg-[#EBA530]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8">
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
            <MessageCircle className="w-4 h-4 text-[#14A79D]" />
            <span className="text-sm text-white/60">Kontakt aufnehmen</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Wir freuen uns <span className="bg-gradient-to-r from-[#14A79D] to-[#EBA530] bg-clip-text text-transparent">auf Sie</span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Haben Sie Fragen oder möchten eine Probefahrt vereinbaren? Wir sind für Sie da.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          {contactMethods.map((method, i) => (
            <motion.div key={method.label} variants={fadeInUp}>
              {method.href ? (
                <a
                  href={method.href}
                  target={method.label === 'Standort' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  <GlowCard gradient={`${method.gradient}/10`}>
                    <div className="p-6">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${method.gradient}/20 to-transparent mb-4`}>
                        <method.icon className="w-5 h-5 text-white/80" />
                      </div>
                      <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">{method.label}</div>
                      <div className="text-white font-medium mb-1">{method.value}</div>
                      <div className="text-sm text-white/40">{method.subtext}</div>
                    </div>
                  </GlowCard>
                </a>
              ) : (
                <GlowCard gradient={`${method.gradient}/10`}>
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${method.gradient}/20 to-transparent mb-4`}>
                      <method.icon className="w-5 h-5 text-white/80" />
                    </div>
                    <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">{method.label}</div>
                    <div className="text-white font-medium mb-1">{method.value}</div>
                    <div className="text-sm text-white/40">{method.subtext}</div>
                  </div>
                </GlowCard>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <GlowCard gradient="from-green-500/10">
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="inline-flex p-6 rounded-full bg-green-500/10 mb-6"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-3">Nachricht gesendet!</h3>
                  <p className="text-white/50 mb-6 max-w-md mx-auto">
                    Vielen Dank für Ihre Anfrage. Wir melden uns schnellstmöglich bei Ihnen.
                  </p>
                  <Link
                    to="/showroom"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                  >
                    Showroom besuchen
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </GlowCard>
            ) : (
              <GlowCard>
                <form onSubmit={handleSubmit} className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Name *</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white placeholder:text-white/20 focus:outline-none focus:border-[#14A79D]/30 transition-colors"
                          placeholder="Ihr vollständiger Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">E-Mail *</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white placeholder:text-white/20 focus:outline-none focus:border-[#14A79D]/30 transition-colors"
                          placeholder="ihre@email.de"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Telefon</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white placeholder:text-white/20 focus:outline-none focus:border-[#14A79D]/30 transition-colors"
                          placeholder="+49 ..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Betreff *</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white focus:outline-none focus:border-[#14A79D]/30 transition-colors"
                      >
                        <option value="Fahrzeuganfrage">Fahrzeuganfrage</option>
                        <option value="Probefahrt">Probefahrt vereinbaren</option>
                        <option value="Finanzierung">Finanzierungsanfrage</option>
                        <option value="Allgemeine Anfrage">Allgemeine Anfrage</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Nachricht *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white placeholder:text-white/20 focus:outline-none focus:border-[#14A79D]/30 transition-colors resize-none"
                      placeholder="Ihre Nachricht an uns..."
                    />
                  </div>

                  <label className="flex items-start gap-3 mb-8 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.privacy}
                      onChange={e => setFormData({ ...formData, privacy: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#14A79D] focus:ring-[#14A79D] focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
                      Ich habe die <Link to="/legal" className="text-[#14A79D] hover:underline">Datenschutzerklärung</Link> gelesen und stimme dieser zu. *
                    </span>
                  </label>

                  <motion.button
                    type="submit"
                    disabled={!formData.privacy}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full relative flex items-center justify-center gap-3 px-8 py-4 rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#14A79D] to-[#14A79D]/80" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Send className="w-5 h-5 text-white relative z-10" />
                    <span className="text-white font-semibold relative z-10">Nachricht senden</span>
                  </motion.button>
                </form>
              </GlowCard>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Selected Car */}
            {selectedCar && (
              <GlowCard gradient="from-[#14A79D]/10">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={selectedCar.images?.[0]}
                      alt={`${selectedCar.brand} ${selectedCar.model}`}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <div className="text-xs text-[#14A79D] mb-1 uppercase tracking-wider">Ausgewählt</div>
                      <div className="text-white font-semibold">{selectedCar.brand} {selectedCar.model}</div>
                      <div className="text-white/40 text-sm">€{selectedCar.price?.toLocaleString()}</div>
                    </div>
                  </div>
                  <Link
                    to={`/car/${selectedCar.id}`}
                    className="inline-flex items-center gap-2 text-[#14A79D] text-sm hover:underline"
                  >
                    Fahrzeug ansehen <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </GlowCard>
            )}

            {/* Map */}
            <GlowCard>
              <div className="aspect-[4/3] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2475.8!2d7.55!3d51.625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDM3JzMwLjAiTiA3wrAzMycwMC4wIkU!5e0!3m2!1sde!2sde!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(30%)' }}
                  allowFullScreen
                  loading="lazy"
                />
                <a
                  href="https://maps.app.goo.gl/X5NgfpaNaGw5bscWA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#14A79D] text-white text-sm font-medium shadow-lg shadow-[#14A79D]/20 hover:bg-[#14A79D]/90 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Route planen
                </a>
              </div>
            </GlowCard>

            {/* Quick Contact */}
            <GlowCard gradient="from-[#EBA530]/10">
              <div className="p-6 text-center">
                <Sparkles className="w-10 h-10 text-[#EBA530]/60 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Schnelle Beratung?</h3>
                <p className="text-white/40 text-sm mb-4">Rufen Sie uns direkt an</p>
                <a
                  href="tel:+4923069988585"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +49 2306 9988585
                </a>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;