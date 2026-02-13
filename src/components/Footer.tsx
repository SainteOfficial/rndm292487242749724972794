import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = [
  { label: 'Showroom', to: '/showroom' },
  { label: 'Galerie', to: '/gallery' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Kontakt', to: '/contact' },
  { label: 'Impressum', to: '/legal#impressum' },
  { label: 'Datenschutz', to: '/legal#datenschutz' },
  { label: 'AGB', to: '/legal#agb' },
];

const socials = [
  { icon: Instagram, href: 'https://www.instagram.com/auto.smaya/', label: 'Instagram' },
  { icon: Youtube, href: 'https://www.youtube.com/@SalaheddineKhammale', label: 'YouTube' },
];

const Footer = () => (
  <footer className="relative bg-[#050505] border-t border-white/[0.04]">
    <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 py-16 md:py-20">
      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
        {/* Brand */}
        <div>
          <img src="/logov2.png" alt="Autosmaya" className="h-10 mb-6" />
          <p className="text-white/35 text-sm leading-relaxed max-w-xs">
            Premium Gebrauchtwagen in Lünen. Handverlesene Qualität mit TÜV-Garantie.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white/50 text-xs uppercase tracking-[0.15em] font-medium mb-5">Navigation</h4>
          <ul className="space-y-3">
            {footerLinks.map(link => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-white/40 text-sm hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white/50 text-xs uppercase tracking-[0.15em] font-medium mb-5">Kontakt</h4>
          <ul className="space-y-3 text-sm text-white/40">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/25" />
              <span>Münsterstraße 207<br />44534 Lünen</span>
            </li>
            <li>
              <a href="tel:+4923069988585" className="flex items-center gap-3 hover:text-white transition-colors duration-300">
                <Phone className="w-4 h-4 flex-shrink-0 text-white/25" />
                +49 2306 9988585
              </a>
            </li>
            <li>
              <a href="mailto:kfzhandelsmaya@autosmaya.de" className="flex items-center gap-3 hover:text-white transition-colors duration-300">
                <Mail className="w-4 h-4 flex-shrink-0 text-white/25" />
                kfzhandelsmaya@autosmaya.de
              </a>
            </li>
          </ul>

          {/* Social icons */}
          <div className="flex gap-3 mt-6">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-white/[0.06] text-white/30 hover:text-white hover:border-white/15 transition-all duration-300"
              >
                <s.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="section-separator mb-6" />

      {/* Bottom */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/25">
        <p>© {new Date().getFullYear()} Autosmaya. Alle Rechte vorbehalten.</p>
        <p>Mo–Fr 9–19 Uhr | Sa 10–18 Uhr</p>
      </div>
    </div>
  </footer>
);

export default Footer;