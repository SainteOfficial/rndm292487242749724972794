import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Shield, CreditCard, Car, MessageCircle, Truck, Sparkles, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: 'Kaufprozess',
    icon: CreditCard,
    gradient: 'from-[#14A79D]',
    questions: [
      {
        q: 'Wie läuft der Kaufprozess ab?',
        a: 'Der Prozess ist einfach: Wählen Sie Ihr Wunschfahrzeug aus unserem Showroom, vereinbaren Sie eine Probefahrt, und wir kümmern uns um den Rest. Finanzierung, Versicherung und Zulassung – alles aus einer Hand für ein stressfreies Kauferlebnis.'
      },
      {
        q: 'Bieten Sie Finanzierungsmöglichkeiten an?',
        a: 'Ja, wir arbeiten mit renommierten Finanzierungspartnern zusammen und finden die optimale Lösung für Sie. Von klassischer Finanzierung bis Leasing – wir bieten flexible Raten und attraktive Konditionen, maßgeschneidert auf Ihre Bedürfnisse.'
      },
      {
        q: 'Kann ich mein aktuelles Fahrzeug in Zahlung geben?',
        a: 'Absolut! Wir bewerten Ihr Fahrzeug professionell und fair. Der ermittelte Wert wird transparent mit dem Kaufpreis verrechnet – so gestalten wir den Wechsel für Sie so einfach wie möglich.'
      },
      {
        q: 'Welche Zahlungsmethoden akzeptieren Sie?',
        a: 'Wir akzeptieren Banküberweisung, Finanzierung über unsere Partner sowie Barzahlung. Für größere Beträge empfehlen wir aus Sicherheitsgründen die Banküberweisung.'
      },
    ]
  },
  {
    category: 'Qualität & Garantie',
    icon: Shield,
    gradient: 'from-[#EBA530]',
    questions: [
      {
        q: 'Sind alle Fahrzeuge TÜV-geprüft?',
        a: 'Ja, jedes Fahrzeug durchläuft eine umfassende technische Prüfung und wird mit gültigem TÜV übergeben. Wir verkaufen ausschließlich Fahrzeuge, die unseren strengen Qualitätsstandards entsprechen.'
      },
      {
        q: 'Welche Garantie erhalte ich beim Kauf?',
        a: 'Sie erhalten standardmäßig 12 Monate Garantie auf alle Fahrzeuge. Optional können Sie die Garantie auf bis zu 24 Monate erweitern, für noch mehr Sicherheit und Sorglosigkeit.'
      },
      {
        q: 'Was ist, wenn nach dem Kauf Probleme auftreten?',
        a: 'Unser Service-Team steht Ihnen auch nach dem Kauf zur Verfügung. Innerhalb der Garantiezeit kümmern wir uns um alle technischen Probleme. Ihre Zufriedenheit hat für uns höchste Priorität.'
      },
      {
        q: 'Wie wird die Fahrzeughistorie überprüft?',
        a: 'Wir prüfen jeden Wagen auf Herz und Nieren: Lückenlose Dokumentation, HU-Berichte, Wartungshistorie und Unfallfreiheit. Volle Transparenz ist für uns selbstverständlich.'
      },
    ]
  },
  {
    category: 'Fahrzeuge & Service',
    icon: Car,
    gradient: 'from-purple-500',
    questions: [
      {
        q: 'Welche Marken bieten Sie an?',
        a: 'Wir spezialisieren uns auf Premium-Marken wie BMW, Mercedes-Benz, Audi, Porsche, Tesla und weitere hochwertige Hersteller. Unser Fokus liegt auf Qualität, nicht Quantität.'
      },
      {
        q: 'Kann ich eine Probefahrt vereinbaren?',
        a: 'Natürlich! Eine Probefahrt ist der beste Weg, Ihr Wunschfahrzeug kennenzulernen. Vereinbaren Sie einfach einen Termin – telefonisch oder über unser Kontaktformular.'
      },
      {
        q: 'Wie läuft die Fahrzeugaufbereitung ab?',
        a: 'Vor der Übergabe wird jedes Fahrzeug professionell aufbereitet: Innen- und Außenreinigung, Motorwäsche, Lackpflege und bei Bedarf kleinere kosmetische Arbeiten. Sie erhalten Ihren Wagen in bestem Zustand.'
      },
    ]
  },
  {
    category: 'Lieferung & Abholung',
    icon: Truck,
    gradient: 'from-rose-500',
    questions: [
      {
        q: 'Bieten Sie Lieferung an?',
        a: 'Ja, wir bieten deutschlandweite Lieferung an. Die Kosten richten sich nach der Entfernung und werden individuell berechnet. Fragen Sie gerne nach einem Angebot.'
      },
      {
        q: 'Kann ich das Fahrzeug vor Ort abholen?',
        a: 'Selbstverständlich! Bei Abholung in Lünen erhalten Sie eine ausführliche Einweisung in Ihr neues Fahrzeug und alle notwendigen Dokumente.'
      },
      {
        q: 'Wie lange dauert die Übergabe?',
        a: 'Nach Kaufabschluss und Zahlungseingang ist Ihr Fahrzeug in der Regel innerhalb von 2-5 Werktagen zur Übergabe bereit. Bei Finanzierung kann es etwas länger dauern.'
      },
    ]
  },
];

// GlowCard Component
const GlowCard = ({ children, className = "", gradient = "from-[#14A79D]/10" }: any) => (
  <motion.div className={`group relative ${className}`}>
    <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${gradient} to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
    <div className="relative h-full rounded-2xl bg-[#0a0a0a] border border-white/[0.04] group-hover:border-white/[0.08] transition-all duration-500 overflow-hidden">
      {children}
    </div>
  </motion.div>
);

const FAQ = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(0);

  const toggleItem = (id: string) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] -left-40 w-[500px] h-[500px] bg-[#14A79D]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-[20%] -right-40 w-[400px] h-[400px] bg-[#EBA530]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 lg:px-8">
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
            <HelpCircle className="w-4 h-4 text-[#14A79D]" />
            <span className="text-sm text-white/60">Häufige Fragen</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Wie können wir <span className="bg-gradient-to-r from-[#14A79D] to-[#EBA530] bg-clip-text text-transparent">helfen?</span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Finden Sie Antworten auf häufig gestellte Fragen rund um unseren Service.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {faqs.map((cat, i) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(i)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${activeCategory === i
                  ? 'bg-[#14A79D]/10 border-[#14A79D]/30 text-[#14A79D]'
                  : 'bg-white/[0.02] border-white/[0.05] text-white/50 hover:text-white hover:border-white/10'
                }`}
            >
              <cat.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{cat.category}</span>
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlowCard gradient={`${faqs[activeCategory].gradient}/10`}>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/[0.05]">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${faqs[activeCategory].gradient}/20 to-transparent`}>
                  {React.createElement(faqs[activeCategory].icon, { className: "w-6 h-6 text-white/80" })}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{faqs[activeCategory].category}</h2>
                  <p className="text-sm text-white/40">{faqs[activeCategory].questions.length} Fragen</p>
                </div>
              </div>

              <div className="space-y-3">
                {faqs[activeCategory].questions.map((item, idx) => {
                  const itemId = `${activeCategory}-${idx}`;
                  const isOpen = openItems.includes(itemId);

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border transition-all duration-300 ${isOpen
                          ? 'bg-white/[0.02] border-[#14A79D]/20'
                          : 'bg-transparent border-white/[0.03] hover:border-white/[0.08]'
                        }`}
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full flex items-center justify-between px-6 py-5 text-left"
                      >
                        <span className={`font-medium pr-4 transition-colors ${isOpen ? 'text-white' : 'text-white/70'}`}>
                          {item.q}
                        </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex-shrink-0 p-1 rounded-full ${isOpen ? 'bg-[#14A79D]/20' : ''}`}
                        >
                          <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-[#14A79D]' : 'text-white/30'}`} />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5">
                              <p className="text-white/50 leading-relaxed">{item.a}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <GlowCard gradient="from-[#14A79D]/10">
            <div className="p-10 text-center">
              <Sparkles className="w-12 h-12 text-[#14A79D]/50 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-3">
                Noch Fragen offen?
              </h3>
              <p className="text-white/40 mb-8 max-w-md mx-auto">
                Unser Team beantwortet gerne alle Ihre Fragen persönlich und unverbindlich.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#14A79D] text-white font-semibold hover:bg-[#14A79D]/90 transition-colors shadow-lg shadow-[#14A79D]/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Kontakt aufnehmen
                </Link>
                <a
                  href="tel:+4923069988585"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Anrufen
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;