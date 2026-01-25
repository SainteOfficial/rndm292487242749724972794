import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Mail, Phone, Clock, MapPin, Youtube, Instagram,
  ChevronRight, ExternalLink, Sparkles, ArrowUpRight,
  Shield, Award, Car, Heart
} from 'lucide-react';

// TikTok Icon
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// Magnetic Link Component
const MagneticLink = ({ children, href, external = false, className = "" }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.1);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = external ? 'a' : Link;
  const props = external
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { to: href };

  return (
    <Component {...props}>
      <motion.span
        style={{ x: xSpring, y: ySpring }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-block ${className}`}
      >
        {children}
      </motion.span>
    </Component>
  );
};

// Live Status Badge
const LiveStatus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      const day = now.getDay();
      const hour = now.getHours();
      setIsOpen(day !== 0 && (day === 6 ? (hour >= 10 && hour < 18) : (hour >= 9 && hour < 19)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.04]"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className={`absolute inline-flex h-full w-full rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'} opacity-75 animate-ping`} />
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${isOpen ? 'bg-green-400' : 'bg-red-400'}`} />
      </span>
      <span className="text-sm text-white/50">
        {isOpen ? 'Jetzt geöffnet' : 'Geschlossen'}
      </span>
      <span className="text-sm text-white/30">
        {time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </motion.div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Showroom', path: '/showroom' },
    { name: 'Galerie', path: '/gallery' },
    { name: 'Kontakt', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  const socials = [
    { icon: Instagram, href: 'https://www.instagram.com/auto.smaya/', label: 'Instagram' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@autosmaya1', label: 'TikTok' },
    { icon: Youtube, href: 'https://www.youtube.com/@SalaheddineKhammale', label: 'YouTube' },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#030303]">
      {/* Top Gradient Border */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#14A79D]/30 to-transparent" />

      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-[20%] w-80 h-80 bg-[#14A79D]/5 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 right-[20%] w-80 h-80 bg-[#EBA530]/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Main Footer */}
        <div className="pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8"
          >
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              <Link to="/">
                <img src="/logov2.png" alt="Autosmaya" className="h-12 w-auto" />
              </Link>

              <p className="text-white/40 leading-relaxed max-w-xs">
                Ihr vertrauenswürdiger Partner für Premium-Gebrauchtwagen in Lünen seit 2021.
              </p>

              <LiveStatus />

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { icon: Shield, text: 'TÜV Geprüft' },
                  { icon: Award, text: '12 Mo. Garantie' },
                ].map((badge) => (
                  <div
                    key={badge.text}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-white/40 text-xs"
                  >
                    <badge.icon className="w-3.5 h-3.5 text-[#14A79D]" />
                    {badge.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-medium mb-6">Navigation</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-300"
                    >
                      <ChevronRight className="w-4 h-4 text-[#14A79D]/50 group-hover:text-[#14A79D] group-hover:translate-x-0.5 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="lg:col-span-3">
              <h4 className="text-white font-medium mb-6">Kontakt</h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+4923069988585" className="group flex items-start gap-3 text-white/40 hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center group-hover:border-[#14A79D]/30 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-white/30 mb-0.5">Telefon</div>
                      <div className="text-sm">+49 2306 9988585</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="mailto:kfzhandelsmaya@autosmaya.de" className="group flex items-start gap-3 text-white/40 hover:text-white transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center group-hover:border-[#14A79D]/30 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-white/30 mb-0.5">E-Mail</div>
                      <div className="text-sm truncate">kfzhandelsmaya@autosmaya.de</div>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="https://maps.app.goo.gl/X5NgfpaNaGw5bscWA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 text-white/40 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center group-hover:border-[#14A79D]/30 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-white/30 mb-0.5">Standort</div>
                      <div className="text-sm">Münsterstraße 207, 44534 Lünen</div>
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-white/40">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-white/30 mb-0.5">Öffnungszeiten</div>
                    <div className="text-sm">Mo-Fr: 9-19 Uhr | Sa: 10-18 Uhr</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Social & CTA */}
            <div className="lg:col-span-3">
              <h4 className="text-white font-medium mb-6">Social Media</h4>

              <div className="flex gap-3 mb-8">
                {socials.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-white/40 hover:text-[#14A79D] hover:border-[#14A79D]/30 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon />
                  </motion.a>
                ))}
              </div>

              {/* CTA Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative p-5 rounded-2xl overflow-hidden bg-gradient-to-br from-[#14A79D]/10 to-transparent border border-[#14A79D]/20"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#14A79D]/20 rounded-full blur-3xl" />

                <Sparkles className="w-8 h-8 text-[#14A79D]/60 mb-3" />
                <h5 className="text-white font-medium mb-2">Beratung gewünscht?</h5>
                <p className="text-white/40 text-sm mb-4">Wir sind für Sie da.</p>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#14A79D] text-white text-sm font-medium hover:bg-[#14A79D]/90 transition-colors"
                >
                  Kontakt
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/[0.03]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/30">
              © {currentYear} Autosmaya. Alle Rechte vorbehalten.
            </p>

            <div className="flex items-center gap-6 text-sm text-white/30">
              <Link to="/legal" className="hover:text-white/50 transition-colors">Impressum</Link>
              <Link to="/legal" className="hover:text-white/50 transition-colors">Datenschutz</Link>
              <Link to="/legal" className="hover:text-white/50 transition-colors">AGB</Link>
              <a
                href="https://home.mobile.de/KHAMMALEKFZHANDEL#ses"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-white/50 transition-colors"
              >
                Mobile.de
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;