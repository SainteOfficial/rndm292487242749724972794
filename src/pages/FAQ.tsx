import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  { q: 'Welche Marken bieten Sie an?', a: 'Wir führen Premium-Marken wie BMW, Mercedes-Benz, Audi, Porsche, Volkswagen und mehr. Unser Sortiment wechselt regelmäßig — schauen Sie in unseren Showroom für die aktuelle Auswahl.' },
  { q: 'Bieten Sie Finanzierung an?', a: 'Ja, wir arbeiten mit verschiedenen Finanzierungspartnern zusammen und bieten flexible Ratenzahlungen an. Gerne erstellen wir Ihnen ein individuelles Angebot.' },
  { q: 'Wie läuft der Kaufprozess ab?', a: 'Nach der Auswahl Ihres Wunschfahrzeugs vereinbaren wir einen Besichtigungs- und Probefahrttermin. Nach erfolgreicher Prüfung kümmern wir uns um alle Formalitäten — Zulassung, Versicherung und Übergabe.' },
  { q: 'Haben alle Fahrzeuge Garantie?', a: 'Ja, alle unsere Fahrzeuge werden mit mindestens 12 Monaten Garantie verkauft. Zudem sind alle Fahrzeuge TÜV-geprüft und technisch aufbereitet.' },
  { q: 'Kann ich mein altes Fahrzeug in Zahlung geben?', a: 'Selbstverständlich. Wir bieten faire Inzahlungnahme-Konditionen. Bringen Sie Ihr Fahrzeug einfach zur Bewertung vorbei oder kontaktieren Sie uns vorab.' },
  { q: 'Wo befindet sich Autosmaya?', a: 'Unser Showroom befindet sich in der Münsterstraße 207, 44534 Lünen. Wir sind gut erreichbar über die A1/A2 und bieten ausreichend Parkplätze.' },
  { q: 'Bieten Sie Probefahrten an?', a: 'Ja, Probefahrten sind nach Terminvereinbarung jederzeit möglich. Rufen Sie uns an oder nutzen Sie unser Kontaktformular.' },
  { q: 'Was ist im Preis enthalten?', a: 'Unsere Preise verstehen sich inklusive Mehrwertsteuer. Zulassung, Überführung und Versicherung können wir auf Wunsch übernehmen — sprechen Sie uns einfach an.' },
];

const FAQItem = ({ faq, index, isOpen, toggle }: { faq: typeof faqs[0]; index: number; isOpen: boolean; toggle: () => void }) => (
  <div className="border-b border-white/[0.04] last:border-0">
    <button onClick={toggle} className="w-full flex items-center gap-4 py-5 text-left group">
      <span className="text-white/15 text-sm font-display font-medium w-6 flex-shrink-0 tabular-nums">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className={`flex-1 text-sm md:text-base font-medium transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
        {faq.q}
      </span>
      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
        <ChevronDown className="w-4 h-4 text-white/20 flex-shrink-0" />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
          <p className="pl-10 pb-5 text-white/35 text-sm leading-relaxed max-w-2xl">{faq.a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-[800px] mx-auto px-6 md:px-16 pt-8">
        <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-[#14A79D] text-xs font-medium tracking-[0.2em] uppercase mb-3">FAQ</p>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
            Häufig gestellte Fragen
          </h1>
          <p className="text-white/35 text-base leading-relaxed mb-14">
            Hier finden Sie Antworten auf die am häufigsten gestellten Fragen.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} isOpen={openIndex === i} toggle={() => setOpenIndex(openIndex === i ? null : i)} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
          <MessageCircle className="w-6 h-6 text-[#14A79D] mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-white mb-2">Noch Fragen?</h3>
          <p className="text-white/35 text-sm mb-6">Wir helfen Ihnen gerne persönlich weiter.</p>
          <Link to="/contact" className="btn-primary text-sm">Kontakt aufnehmen</Link>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;