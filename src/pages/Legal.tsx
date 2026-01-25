import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Scale, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// GlowCard
const GlowCard = ({ children, className = "" }: any) => (
  <div className={`group relative ${className}`}>
    <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#14A79D]/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
    <div className="relative h-full rounded-2xl bg-[#0a0a0a] border border-white/[0.04] group-hover:border-white/[0.08] transition-all duration-500 overflow-hidden">
      {children}
    </div>
  </div>
);

const Legal = () => {
  const sections = [
    {
      id: 'impressum',
      title: 'Impressum',
      icon: FileText,
      content: (
        <div className="space-y-6 text-white/60">
          <div>
            <h4 className="text-white font-medium mb-2">Angaben gemäß § 5 TMG</h4>
            <p>Autosmaya KFZ Handel</p>
            <p>Münsterstraße 207</p>
            <p>44534 Lünen</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Kontakt</h4>
            <p>Telefon: +49 2306 9988585</p>
            <p>E-Mail: kfzhandelsmaya@autosmaya.de</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Umsatzsteuer-ID</h4>
            <p>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz: DE XXX XXX XXX</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Streitschlichtung</h4>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              https://ec.europa.eu/consumers/odr/</p>
            <p className="mt-2">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.</p>
          </div>
        </div>
      )
    },
    {
      id: 'datenschutz',
      title: 'Datenschutzerklärung',
      icon: Shield,
      content: (
        <div className="space-y-6 text-white/60">
          <div>
            <h4 className="text-white font-medium mb-2">1. Datenschutz auf einen Blick</h4>
            <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
              Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen
              Sie persönlich identifiziert werden können.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">2. Datenerfassung auf dieser Website</h4>
            <p className="mb-2"><strong className="text-white/80">Wer ist verantwortlich für die Datenerfassung?</strong></p>
            <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten
              können Sie dem Impressum entnehmen.</p>

            <p className="mt-4 mb-2"><strong className="text-white/80">Wie erfassen wir Ihre Daten?</strong></p>
            <p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich
              z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">3. Ihre Rechte</h4>
            <p>Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer
              gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung
              oder Löschung dieser Daten zu verlangen.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">4. Analyse-Tools</h4>
            <p>Diese Website nutzt keine Analyse-Tools von Drittanbietern.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">5. Cookies</h4>
            <p>Diese Website verwendet nur technisch notwendige Cookies, die für den Betrieb der Website
              erforderlich sind. Sie dienen nicht zu Tracking- oder Werbezwecken.</p>
          </div>
        </div>
      )
    },
    {
      id: 'agb',
      title: 'Allgemeine Geschäftsbedingungen',
      icon: Scale,
      content: (
        <div className="space-y-6 text-white/60">
          <div>
            <h4 className="text-white font-medium mb-2">§ 1 Geltungsbereich</h4>
            <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen Autosmaya KFZ Handel
              und dem Käufer über den Verkauf von Gebrauchtfahrzeugen.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">§ 2 Vertragsschluss</h4>
            <p>Der Kaufvertrag kommt durch die beiderseitige Unterzeichnung eines Kaufvertrages oder durch
              die Übergabe des Fahrzeugs an den Käufer zustande.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">§ 3 Preise und Zahlung</h4>
            <p>Die angegebenen Preise sind Endpreise inkl. gesetzlicher MwSt. Die Zahlung erfolgt bei
              Übergabe des Fahrzeugs, sofern nicht anders vereinbart.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">§ 4 Gewährleistung</h4>
            <p>Bei Gebrauchtfahrzeugen beträgt die Gewährleistungsfrist 12 Monate ab Übergabe. Die
              Gewährleistung kann auf 24 Monate erweitert werden.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">§ 5 Eigentumsvorbehalt</h4>
            <p>Das Fahrzeug bleibt bis zur vollständigen Bezahlung Eigentum des Verkäufers.</p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">§ 6 Haftung</h4>
            <p>Der Verkäufer haftet für Schäden nur bei Vorsatz oder grober Fahrlässigkeit, es sei denn,
              es handelt sich um die Verletzung wesentlicher Vertragspflichten.</p>
          </div>
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-28 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] -left-40 w-[500px] h-[500px] bg-[#14A79D]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-[20%] -right-40 w-[400px] h-[400px] bg-[#EBA530]/5 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6 lg:px-8">
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
            <FileText className="w-4 h-4 text-[#14A79D]" />
            <span className="text-sm text-white/60">Rechtliches</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Rechtliche Informationen
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Impressum, Datenschutz und AGB
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.02] border border-white/[0.05] text-white/50 hover:text-white hover:border-white/10 transition-all"
            >
              <section.icon className="w-4 h-4" />
              {section.title}
            </a>
          ))}
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
            >
              <GlowCard>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/[0.05]">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#14A79D]/20 to-transparent">
                      <section.icon className="w-6 h-6 text-[#14A79D]" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                  </div>

                  {section.content}
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <GlowCard gradient="from-[#14A79D]/10">
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-3">Fragen zu unseren Richtlinien?</h3>
              <p className="text-white/40 mb-6">
                Kontaktieren Sie uns gerne bei Fragen zu unseren rechtlichen Informationen.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="mailto:kfzhandelsmaya@autosmaya.de"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14A79D] text-white font-medium"
                >
                  <Mail className="w-4 h-4" />
                  E-Mail senden
                </a>
                <a
                  href="tel:+4923069988585"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white"
                >
                  <Phone className="w-4 h-4" />
                  Anrufen
                </a>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Legal;