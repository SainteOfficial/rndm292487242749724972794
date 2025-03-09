import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const faqs = [
  {
    question: 'Wie läuft der Kaufprozess ab?',
    answer: 'Der Kaufprozess beginnt mit einer unverbindlichen Besichtigung. Nach erfolgreicher Probefahrt und Einigung können wir den Kaufvertrag aufsetzen. Wir unterstützen Sie auch bei der Finanzierung und Versicherung. Unser Team begleitet Sie durch den gesamten Prozess und steht Ihnen jederzeit für Fragen zur Verfügung.'
  },
  {
    question: 'Bieten Sie Garantie auf Ihre Fahrzeuge?',
    answer: 'Ja, alle unsere Fahrzeuge kommen mit einer 12-monatigen Gebrauchtwagengarantie. Zusätzliche Garantiepakete sind optional erhältlich. Die Garantie umfasst wichtige Komponenten wie Motor, Getriebe, Elektronik und mehr. Bei Neufahrzeugen gilt die Herstellergarantie.'
  },
  {
    question: 'Kann ich mein altes Fahrzeug in Zahlung geben?',
    answer: 'Selbstverständlich! Wir bieten faire Inzahlungnahme Ihres bisherigen Fahrzeugs an. Kontaktieren Sie uns für eine kostenlose Bewertung. Unsere Experten begutachten Ihr Fahrzeug und machen Ihnen ein transparentes Angebot. Die Inzahlungnahme wird direkt mit dem Kaufpreis des neuen Fahrzeugs verrechnet.'
  },
  {
    question: 'Welche Finanzierungsmöglichkeiten gibt es?',
    answer: 'Wir arbeiten mit verschiedenen Banken zusammen und können Ihnen maßgeschneiderte Finanzierungslösungen anbieten. Von klassischen Krediten bis hin zu Leasing-Optionen finden wir die passende Lösung für Sie. Auch Sonderkonditionen und flexible Laufzeiten sind möglich. Sprechen Sie uns an für eine individuelle Beratung.'
  },
  {
    question: 'Wie lange dauert die Lieferung?',
    answer: 'Die Lieferzeit hängt vom gewählten Fahrzeug ab. Lagerfahrzeuge können meist innerhalb weniger Tage übergeben werden. Bei Bestellfahrzeugen rechnen Sie bitte mit 3-6 Monaten. Wir halten Sie während der Wartezeit stets über den Status Ihrer Bestellung auf dem Laufenden.'
  },
  {
    question: 'Bieten Sie auch einen Werkstattservice an?',
    answer: 'Ja, wir verfügen über eine moderne Werkstatt mit qualifizierten Mechanikern. Wir führen Wartungen, Reparaturen und Inspektionen für alle Marken durch. Auch für Unfallreparaturen und Garantiearbeiten sind wir Ihr kompetenter Partner.'
  },
  {
    question: 'Wie läuft eine Probefahrt ab?',
    answer: 'Probefahrten sind nach Terminvereinbarung jederzeit möglich. Bringen Sie einfach Ihren Führerschein mit. Unsere Verkaufsberater erklären Ihnen vorher alle wichtigen Funktionen des Fahrzeugs. Die Probefahrt ist selbstverständlich kostenlos und unverbindlich.'
  },
  {
    question: 'Was ist im Kaufpreis enthalten?',
    answer: 'Der ausgewiesene Kaufpreis beinhaltet die gesetzliche Mehrwertsteuer, eine aktuelle Hauptuntersuchung, eine professionelle Fahrzeugaufbereitung sowie eine Garantie. Zusätzliche Leistungen wie Überführung oder Zulassung können optional hinzugebucht werden.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h1 className="text-4xl font-bold text-white text-center mb-12">
              Häufig gestellte Fragen
            </h1>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <motion.div
                  className="bg-[#16181f]/60 backdrop-blur-md rounded-lg overflow-hidden hover:bg-[#16181f]/80 transition-colors duration-300"
                >
                  <motion.button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <h3 className="text-xl font-bold text-white">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {openIndex === index ? (
                        <Minus className="w-6 h-6 text-orange-400 flex-shrink-0" />
                      ) : (
                        <Plus className="w-6 h-6 text-orange-400 flex-shrink-0" />
                      )}
                    </motion.div>
                  </motion.button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: openIndex === index ? 'auto' : 0,
                      opacity: openIndex === index ? 1 : 0
                    }}
                    transition={{
                      height: { duration: 0.3, ease: "easeOut" },
                      opacity: { duration: 0.2, delay: openIndex === index ? 0.1 : 0 }
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-300 px-6 pb-6 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.5}>
            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-4">
                Haben Sie weitere Fragen?
              </p>
              <motion.a
                href="/contact"
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                className="inline-block bg-gradient-to-r from-[#14A79D] to-[#EBA530] text-white px-8 py-3 rounded-full"
              >
                Kontaktieren Sie uns
              </motion.a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageTransition>
  );
};

export default FAQ;