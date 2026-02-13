import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Scale, Shield, FileText } from 'lucide-react';

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

const sections = [
  {
    id: 'impressum',
    icon: Scale,
    title: 'Impressum',
    content: `Autosmaya – KFZ Handel
Inhaber: Salaheddine Khammale
Münsterstraße 207
44534 Lünen

Telefon: +49 2306 9988585
E-Mail: kfzhandelsmaya@autosmaya.de

USt-IdNr.: DE-Nr. wird nachgereicht
Zuständige Aufsichtsbehörde: Stadt Lünen

Streitschlichtung:
Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/
Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.`,
  },
  {
    id: 'datenschutz',
    icon: Shield,
    title: 'Datenschutzerklärung',
    content: `1. Datenschutz auf einen Blick

Allgemeine Hinweise: Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.

Datenerfassung auf dieser Website: Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Deren Kontaktdaten können Sie dem Impressum entnehmen.

2. Hosting

Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.

3. Allgemeine Hinweise und Pflichtinformationen

Datenschutz: Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.

4. Datenerfassung auf dieser Website

Kontaktformular: Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.

5. Ihre Rechte

Sie haben jederzeit das Recht auf Auskunft über die bei uns gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung. Sie haben zudem das Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.`,
  },
  {
    id: 'agb',
    icon: FileText,
    title: 'Allgemeine Geschäftsbedingungen',
    content: `1. Geltungsbereich

Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge, die zwischen Autosmaya und dem Käufer über den Kauf von Gebrauchtfahrzeugen geschlossen werden.

2. Vertragsschluss

Die Darstellung der Fahrzeuge auf der Website stellt kein bindendes Angebot dar. Durch die Kontaktaufnahme bzw. Reservierung gibt der Interesse bekannt. Der Kaufvertrag kommt erst mit der Unterzeichnung des schriftlichen Kaufvertrages zustande.

3. Preise und Zahlung

Alle angegebenen Preise sind Endpreise inklusive der gesetzlichen Mehrwertsteuer. Die Zahlung erfolgt bei Übergabe des Fahrzeugs per Banküberweisung oder in bar.

4. Gewährleistung

Für den Verkauf von Gebrauchtfahrzeugen an Verbraucher gilt die gesetzliche Gewährleistungsfrist von 12 Monaten.

5. Haftung

Autosmaya haftet für Schäden nur bei Vorsatz und grober Fahrlässigkeit. Dies gilt nicht für die Verletzung von Leben, Körper und Gesundheit.

6. Schlussbestimmungen

Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Lünen, soweit gesetzlich zulässig.`,
  },
];

const Legal = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-[800px] mx-auto px-6 md:px-16 pt-8">
        <Section>
          <p className="text-[#14A79D] text-xs font-medium tracking-[0.2em] uppercase mb-3">Rechtliches</p>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-14">
            Rechtliche Hinweise
          </h1>
        </Section>

        <div className="space-y-16">
          {sections.map((section, i) => (
            <Section key={section.id} delay={i * 0.1}>
              <div id={section.id} className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                  <section.icon className="w-5 h-5 text-[#14A79D]" />
                  <h2 className="text-xl font-display font-bold text-white">{section.title}</h2>
                </div>
                <div className="text-white/40 text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            </Section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Legal;