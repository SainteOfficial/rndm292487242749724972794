import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Section = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', privacy: false });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Nachricht erfolgreich gesendet!');
      setFormData({ name: '', email: '', phone: '', message: '', privacy: false });
    } catch { toast.error('Fehler beim Senden.'); }
    finally { setSending(false); }
  };

  const contactInfo = [
    { icon: Phone, label: 'Telefon', value: '+49 2306 9988585', href: 'tel:+4923069988585' },
    { icon: Mail, label: 'E-Mail', value: 'kfzhandelsmaya@autosmaya.de', href: 'mailto:kfzhandelsmaya@autosmaya.de' },
    { icon: MapPin, label: 'Adresse', value: 'Münsterstraße 207, 44534 Lünen', href: 'https://maps.google.com/?q=Münsterstraße+207+44534+Lünen' },
    { icon: Clock, label: 'Öffnungszeiten', value: 'Mo–Fr 9–19 Uhr | Sa 10–18 Uhr' },
  ];

  const inputClass = "w-full bg-transparent border-b border-white/[0.08] py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#14A79D]/50 transition-colors duration-300";

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 lg:px-24 pt-8">
        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">
          {/* Left — info */}
          <div className="lg:col-span-2">
            <Section>
              <p className="text-[#14A79D] text-xs font-medium tracking-[0.2em] uppercase mb-3">Kontakt</p>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight mb-6">
                Lassen Sie uns{'\n'}sprechen.
              </h1>
              <p className="text-white/35 text-base leading-relaxed mb-12">
                Ob Fragen zu einem Fahrzeug, Finanzierung oder Probefahrt — wir sind für Sie da.
              </p>
            </Section>

            <div className="space-y-6">
              {contactInfo.map((item, i) => (
                <Section key={item.label} delay={0.1 * i}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-white/30" />
                    </div>
                    <div>
                      <p className="text-white/30 text-xs mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                          className="text-white text-sm hover:text-[#14A79D] transition-colors duration-300">{item.value}</a>
                      ) : (
                        <p className="text-white text-sm">{item.value}</p>
                      )}
                    </div>
                  </div>
                </Section>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <Section delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-white/30 text-xs uppercase tracking-wider block mb-2">Name *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ihr Name" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-white/30 text-xs uppercase tracking-wider block mb-2">E-Mail *</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ihre@email.de" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-white/30 text-xs uppercase tracking-wider block mb-2">Telefon</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 ..." className={inputClass} />
                </div>
                <div>
                  <label className="text-white/30 text-xs uppercase tracking-wider block mb-2">Nachricht *</label>
                  <textarea required rows={5} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Wie können wir Ihnen helfen?" className={`${inputClass} resize-none`} />
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="privacy" checked={formData.privacy} onChange={e => setFormData({ ...formData, privacy: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border border-white/10 bg-transparent accent-[#14A79D]" />
                  <label htmlFor="privacy" className="text-white/30 text-xs leading-relaxed">
                    Ich stimme der Verarbeitung meiner Daten gemäß der <a href="/legal#datenschutz" className="text-white/50 underline">Datenschutzerklärung</a> zu. *
                  </label>
                </div>
                <button type="submit" disabled={!formData.privacy || sending} className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed">
                  {sending ? 'Wird gesendet...' : 'Nachricht senden'} <Send className="w-4 h-4" />
                </button>
              </form>
            </Section>
          </div>
        </div>

        {/* Map */}
        <Section className="mt-20">
          <div className="rounded-2xl overflow-hidden h-[300px] md:h-[400px] border border-white/[0.04]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.5!2d7.551914!3d51.625382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDM3JzMxLjQiTiA3wrAzMycwNi45IkU!5e0!3m2!1sde!2sde!4v1"
              width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(30%)' }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Contact;