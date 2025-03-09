import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const faqs = [
  {
    question: 'Wie läuft der Kaufprozess ab?',
    answer: 'Der Kaufprozess beginnt mit einer unverbindlichen Besichtigung in unserem Showroom. Nach Ihrer Entscheidung und erfolgreicher Probefahrt können wir direkt den Kaufvertrag aufsetzen. Die Fahrzeugübergabe erfolgt nach vollständiger Zahlung des Kaufpreises. Unser Team steht Ihnen während des gesamten Prozesses für Fragen zur Verfügung.'
  },
  {
    question: 'Welche Garantie bieten Sie auf Ihre Fahrzeuge?',
    answer: 'Bei Gebrauchtwagen gilt die gesetzliche Gewährleistung von einem Jahr ab Übergabe des Fahrzeugs. Diese deckt bereits zum Zeitpunkt des Verkaufs bestehende Mängel ab. Zusätzliche Garantiepakete können je nach Fahrzeug optional erworben werden.'
  },
  {
    question: 'Bieten Sie Inzahlungnahme an?',
    answer: 'Nein, wir nehmen keine Fahrzeuge in Zahlung. Wir konzentrieren uns auf den direkten Verkauf unserer sorgfältig ausgewählten Fahrzeuge.'
  },
  {
    question: 'Bieten Sie Finanzierung an?',
    answer: 'Nein, wir bieten keine eigene Finanzierung an. Der Kaufpreis ist bei Fahrzeugübergabe in voller Höhe zu entrichten. Gerne können Sie sich selbstständig um eine Finanzierung bei Ihrer Bank bemühen.'
  },
  {
    question: 'Wie lange dauert die Lieferung?',
    answer: 'Bei Fahrzeugen aus unserem Showroom ist eine sofortige Übergabe nach Kaufabschluss und Zahlung möglich. Bei Bestellfahrzeugen und exklusiven Modellen rechnen Sie bitte mit einer Lieferzeit von 2-4 Wochen, abhängig von der Verfügbarkeit und Exklusivität des Fahrzeugs.'
  },
  {
    question: 'Bieten Sie einen Werkstattservice an?',
    answer: 'Wir betreiben keine eigene Werkstatt, verfügen jedoch über eine TÜV-Prüfstelle vor Ort. Bei Fahrzeugen ohne gültige HU kann die TÜV-Prüfung gegen Aufpreis im Kaufpreis inkludiert werden.'
  },
  {
    question: 'Wie läuft eine Probefahrt ab?',
    answer: 'Probefahrten sind nach Terminvereinbarung möglich. Bitte bringen Sie einen gültigen Führerschein und Personalausweis mit. Unsere Verkaufsberater erklären Ihnen vor der Probefahrt alle wichtigen Funktionen des Fahrzeugs. Die Probefahrt ist kostenlos und unverbindlich.'
  },
  {
    question: 'Was ist im Kaufpreis enthalten?',
    answer: 'Der ausgewiesene Kaufpreis beinhaltet die gesetzliche Mehrwertsteuer und eine professionelle Fahrzeugaufbereitung. Bei Fahrzeugen ohne gültige HU kann die TÜV-Prüfung optional im Kaufpreis inkludiert werden. Zusätzliche Leistungen wie Überführung oder Zulassung können separat vereinbart werden.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white text-center mb-12"
          >
            Häufig gestellte Fragen
          </motion.h1>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <ScrollReveal key={index}>
                <motion.div
                  className="bg-gradient-to-br from-[#16181f]/60 to-[#1e2029]/60 backdrop-blur-md rounded-lg border border-gray-800 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span className="text-lg font-semibold text-white">{faq.question}</span>
                    {openIndex === index ? (
                      <Minus className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-orange-400 flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default FAQ;