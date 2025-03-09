import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  Clock, 
  MapPin, 
  Youtube, 
  Instagram,
  Star,
  Globe,
  MessageCircle,
  ChevronRight,
  Navigation2,
  Apple,
  Heart,
  Headphones,
  ShieldCheck,
  Users,
  Lock
} from 'lucide-react';

const TikTokIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-5 h-5"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const OpeningHours = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [nextOpenTime, setNextOpenTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const day = now.getDay();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const currentTimeInMinutes = hour * 60 + minutes;

      if (day === 0) {
        setIsOpen(false);
        setNextOpenTime('Montag 09:00');
      } else if (day === 6) {
        if (currentTimeInMinutes >= 10 * 60 && currentTimeInMinutes < 18 * 60) {
          setIsOpen(true);
          setNextOpenTime('heute bis 18:00');
        } else {
          setIsOpen(false);
          setNextOpenTime('Montag 09:00');
        }
      } else {
        if (currentTimeInMinutes >= 9 * 60 && currentTimeInMinutes < 19 * 60) {
          setIsOpen(true);
          setNextOpenTime('heute bis 19:00');
        } else {
          setIsOpen(false);
          if (currentTimeInMinutes >= 19 * 60) {
            setNextOpenTime(day === 5 ? 'Samstag 10:00' : 'morgen 09:00');
          } else {
            setNextOpenTime('heute 09:00');
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Europe/Berlin'
    });
  };

  return (
    <div className="bg-[#1a1c25] rounded-lg p-4">
      <div className="flex items-center gap-3 mb-4 border-b border-gray-700/50 pb-4">
        <Clock className="w-6 h-6 text-orange-400" />
        <div className="flex-1">
          <p className="font-medium text-gray-300">Aktuelle Zeit</p>
          <p className="text-2xl font-bold text-orange-400">{formatTime(currentTime)}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm ${
          isOpen 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {isOpen ? 'Geöffnet' : 'Geschlossen'}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Montag - Freitag</span>
          <span className="text-white font-medium">09:00 - 19:00</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Samstag</span>
          <span className="text-white font-medium">10:00 - 18:00</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Sonntag & Feiertage</span>
          <span className="text-red-400 font-medium">Geschlossen</span>
        </div>
      </div>

      {!isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <p className="text-orange-400 font-medium">
            Wieder geöffnet {nextOpenTime} Uhr
          </p>
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="relative">
      {/* Top Wave Separator */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent to-[#16181f]/95" />

      {/* Main Content */}
      <div className="relative bg-[#16181f]/95 backdrop-blur-md pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Company Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <Link to="/" className="inline-block mb-6">
                <img 
                  src="/logov2.png" 
                  alt="Autosmaya Logo" 
                  className="h-16 w-auto"
                />
              </Link>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Ihr vertrauenswürdiger Partner für Premium-Automobile seit 2021. 
                Wir bieten Ihnen eine exklusive Auswahl an hochwertigen Fahrzeugen 
                und erstklassigen Service.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1a1c25] rounded-lg p-4 text-center">
                  <Heart className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Qualität</p>
                </div>
                <div className="bg-[#1a1c25] rounded-lg p-4 text-center">
                  <Headphones className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Service</p>
                </div>
                <div className="bg-[#1a1c25] rounded-lg p-4 text-center">
                  <ShieldCheck className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Garantie</p>
                </div>
                <div className="bg-[#1a1c25] rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Beratung</p>
                </div>
              </div>
            </div>
            <div>
              <OpeningHours />
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-xl mb-6 flex items-center">
                <MessageCircle className="w-6 h-6 text-orange-400 mr-2" />
                Kontakt
              </h3>
              <div className="space-y-6">
                <div className="bg-[#1a1c25] rounded-lg p-4 flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-white mb-2">Adresse</p>
                    <p className="text-gray-400">Münsterstraße 207</p>
                    <p className="text-gray-400">44534 Lünen</p>
                    <p className="text-gray-400">Deutschland</p>
                    <div className="flex gap-2 mt-3">
                      <a 
                        href="https://maps.app.goo.gl/X5NgfpaNaGw5bscWA?g_st=com.google.maps.preview.copy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm bg-[#1e2029] text-orange-400 px-3 py-1 rounded-full hover:bg-[#1e2029]/80 transition-colors group"
                      >
                        <Navigation2 className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                        Google Maps
                      </a>
                      <a 
                        href="https://maps.apple.com/?address=Münster%20strasse%20207,%2044534%20Lünen,%20Deutschland&auid=13659803734692933419&ll=51.625382,7.551914&lsp=9902&q=Autosmaya%20Kfz%20Handel&t=m"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm bg-[#1e2029] text-orange-400 px-3 py-1 rounded-full hover:bg-[#1e2029]/80 transition-colors group"
                      >
                        <Apple className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />
                        Apple Maps
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-[#1a1c25] rounded-lg p-4 flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-white mb-2">Telefon</p>
                    <p className="text-gray-400">+49 2306 9988585</p>
                    <p className="text-gray-400">+49 176 7036 1769</p>
                  </div>
                </div>
                <div className="bg-[#1a1c25] rounded-lg p-4 flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-white mb-2">E-Mail</p>
                    <p className="text-gray-400">kfzhandelsmaya@autosmaya.info</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-xl mb-6 flex items-center">
                <Star className="w-6 h-6 text-orange-400 mr-2" />
                Schnellzugriff
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <Link 
                  to="/" 
                  className="bg-[#1a1c25] rounded-lg p-4 text-gray-400 hover:text-orange-400 flex items-center group"
                >
                  <ChevronRight className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                  Home
                </Link>
                <Link 
                  to="/showroom" 
                  className="bg-[#1a1c25] rounded-lg p-4 text-gray-400 hover:text-orange-400 flex items-center group"
                >
                  <ChevronRight className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                  Showroom
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-[#1a1c25] rounded-lg p-4 text-gray-400 hover:text-orange-400 flex items-center group"
                >
                  <ChevronRight className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                  Kontakt
                </Link>
                <Link 
                  to="/faq" 
                  className="bg-[#1a1c25] rounded-lg p-4 text-gray-400 hover:text-orange-400 flex items-center group"
                >
                  <ChevronRight className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                  FAQ
                </Link>
                <a 
                  href="https://home.mobile.de/KHAMMALEKFZHANDEL#ses"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a1c25] rounded-lg p-4 text-gray-400 hover:text-orange-400 flex items-center group"
                >
                  <ChevronRight className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                  Mobile.de
                </a>
              </div>
            </div>

            {/* Social Media and Languages */}
            <div className="space-y-6">
              <h3 className="text-white font-semibold text-xl mb-6 flex items-center">
                <Globe className="w-6 h-6 text-orange-400 mr-2" />
                Social Media & Sprachen
              </h3>
              <div className="space-y-6">
                <div className="bg-[#1a1c25] rounded-lg p-4">
                  <h4 className="text-white font-medium mb-4">Social Media</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <a 
                      href="https://www.instagram.com/auto.smaya/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-400 hover:text-orange-400 group"
                    >
                      <div className="bg-[#1e2029] p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                        <Instagram className="w-5 h-5" />
                      </div>
                      <span>Instagram</span>
                    </a>
                    <a 
                      href="https://www.tiktok.com/@autosmaya1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-400 hover:text-orange-400 group"
                    >
                      <div className="bg-[#1e2029] p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                        <TikTokIcon />
                      </div>
                      <span>TikTok</span>
                    </a>
                    <a 
                      href="https://www.youtube.com/@SalaheddineKhammale"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-400 hover:text-orange-400 group"
                    >
                      <div className="bg-[#1e2029] p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                        <Youtube className="w-5 h-5" />
                      </div>
                      <span>YouTube</span>
                    </a>
                  </div>
                </div>
                <div className="bg-[#1a1c25] rounded-lg p-4">
                  <h4 className="text-white font-medium mb-4">Sprachen</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="bg-[#1e2029] px-4 py-2 rounded-lg text-gray-400 text-sm text-center">
                      Deutsch
                    </span>
                    <span className="bg-[#1e2029] px-4 py-2 rounded-lg text-gray-400 text-sm text-center">
                      English
                    </span>
                    <span className="bg-[#1e2029] px-4 py-2 rounded-lg text-gray-400 text-sm text-center">
                      Français
                    </span>
                    <span className="bg-[#1e2029] px-4 py-2 rounded-lg text-gray-400 text-sm text-center">
                      العربية
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Autosmaya. Alle Rechte vorbehalten.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link 
                  to="/legal" 
                  className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                >
                  Impressum
                </Link>
                <Link 
                  to="/legal" 
                  className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                >
                  Datenschutz
                </Link>
                <Link 
                  to="/legal" 
                  className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                >
                  AGB
                </Link>
                <Link 
                  to="/admin/login" 
                  className="text-gray-400 hover:text-orange-400 text-sm transition-colors flex items-center gap-1"
                >
                  <Lock className="w-4 h-4" />
                  Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;