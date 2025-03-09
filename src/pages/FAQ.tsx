import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const faqs = [
  {
    question: 'Wie läuft der Kaufprozess ab?',
    answer: 'Der Kaufprozess beginnt mit einer unverbindlichen Besichtigung in unserem Showroom. Nach Ihrer Entscheidung und erfolgreicher Probefahrt können wir direkt den Kaufvertrag aufsetzen. Unser erfahrenes Team begleitet Sie durch den gesamten Prozess und steht Ihnen für alle Fragen zur Verfügung. Wir legen großen Wert auf Transparenz und eine reibungslose Abwicklung.'
  },
  {
    question: 'Welche Garantieleistungen bieten Sie an?',
    answer: 'Alle unsere Fahrzeuge werden vor dem Verkauf gründlich geprüft und in einwandfreiem Zustand übergeben. Es gelten die gesetzlichen Gewährleistungsrechte. Bei Gebrauchtwagen beträgt die Gewährleistungsfrist ein Jahr ab Übergabe. Zusätzliche Garantiepakete können bei Bedarf über externe Anbieter vereinbart werden.'
  },
  {
    question: 'Bieten Sie eine TÜV-Abnahme an?',
    answer: 'Ja, wir verfügen über eine eigene TÜV-Prüfstelle direkt vor Ort. Bei Fahrzeugen ohne gültige Hauptuntersuchung kann die TÜV-Prüfung auf Wunsch direkt im Kaufpreis inkludiert werden. Dies ermöglicht Ihnen einen reibungslosen und schnellen Zulassungsprozess.'
  },
  {
    question: 'Wie lange dauert die Lieferung?',
    answer: 'Die Lieferzeit hängt von der Verfügbarkeit des gewünschten Fahrzeugs ab. Fahrzeuge aus unserem Showroom sind sofort verfügbar und können nach Kaufvertragsabschluss direkt übergeben werden. Bei Bestellfahrzeugen oder exklusiven Modellen rechnen Sie bitte mit einer Lieferzeit von 2-4 Wochen, abhängig von der Exklusivität des Fahrzeugs.'
  },
  {
    question: 'Wie kann ich bezahlen?',
    answer: 'Wir akzeptieren Barzahlung sowie Banküberweisung. Der vollständige Kaufpreis muss vor der Fahrzeugübergabe beglichen sein. Eine Finanzierung können Sie bei Bedarf über Ihre Hausbank oder einen Finanzierungspartner Ihrer Wahl arrangieren.'
  },
  {
    question: 'Wie läuft eine Probefahrt ab?',
    answer: 'Probefahrten sind nach Terminvereinbarung jederzeit möglich. Bringen Sie dazu bitte Ihren gültigen Führerschein und Personalausweis mit. Unsere Verkaufsberater erklären Ihnen vorab alle wichtigen Funktionen des Fahrzeugs. Die Probefahrt ist selbstverständlich kostenlos und unverbindlich.'
  },
  {
    question: 'Was ist im Kaufpreis enthalten?',
    answer: 'Der ausgewiesene Kaufpreis beinhaltet die gesetzliche Mehrwertsteuer und eine professionelle Fahrzeugaufbereitung. Bei Fahrzeugen ohne gültige Hauptuntersuchung kann die TÜV-Prüfung optional im Kaufpreis inbegriffen sein. Zusätzliche Leistungen wie Überführung oder Zulassung können auf Wunsch separat vereinbart werden.'
  },
  {
    question: 'Bieten Sie einen Werkstattservice an?',
    answer: 'Wir konzentrieren uns auf den Verkauf hochwertiger Fahrzeuge und bieten keinen eigenen Werkstattservice an. Gerne empfehlen wir Ihnen aber qualifizierte Partnerwerkstätten in der Region. Für die Hauptuntersuchung steht Ihnen unsere TÜV-Prüfstelle zur Verfügung.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 px-4 pb-12">
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-[#16181f]/60 to-[#1e2029]/60 backdrop-blur-md rounded-lg border border-gray-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
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