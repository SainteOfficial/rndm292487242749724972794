import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Scale, FileText, Lock } from 'lucide-react';

const Legal = () => {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white text-center mb-12"
        >
          Rechtliche Informationen
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-[#16181f]/60 to-[#1e2029]/60 backdrop-blur-md rounded-lg p-8 border border-gray-800"
          >
            <div className="flex items-center mb-6">
              <FileText className="w-8 h-8 text-orange-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Impressum</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-[#1a1c25]/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Inhaber</h3>
                <p className="text-gray-300">Salah-Eddine Khammale</p>
              </div>

              <div className="bg-[#1a1c25]/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Autosmaya</h3>
                <p className="text-gray-300">Münsterstraße 207</p>
                <p className="text-gray-300">44534 Lünen</p>
                <p className="text-gray-300">Deutschland</p>
              </div>

              <div className="bg-[#1a1c25]/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Kontakt</h3>
                <p className="text-gray-300">Tel: +49 2306 9988585</p>
                <p className="text-gray-300">Mobil 1: +49 176 7036 1769</p>
                <p className="text-gray-300">Mobil 2: +49 1515 3366666</p>
                <p className="text-gray-300">E-Mail: kfzhandelsmaya@autosmaya.info</p>
              </div>

              <div className="bg-[#1a1c25]/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Steuerdaten</h3>
                <p className="text-gray-300">USt-IdNr.: DE343310818</p>
                <p className="text-gray-300">Steuernummer: 314/5090/4518</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-[#16181f]/60 to-[#1e2029]/60 backdrop-blur-md rounded-lg p-8 border border-gray-800"
          >
            <div className="flex items-center mb-6">
              <Scale className="w-8 h-8 text-orange-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Rechtliches</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-[#1a1c25]/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Unternehmensform</h3>
                <p className="text-gray-300">Einzelunternehmen</p>
              </div>
              
              <div className="bg-[#1a1c25]/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Gewerbe</h3>
                <p className="text-gray-300">Kraftfahrzeughandel</p>
                <p className="text-gray-300">Gewerbeanmeldung: Stadt Lünen</p>
              </div>
              
              <div className="bg-[#1a1c25]/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Kammerzugehörigkeit</h3>
                <p className="text-gray-300">Industrie- und Handelskammer zu Dortmund</p>
                <p className="text-gray-300">Märkische Straße 120</p>
                <p className="text-gray-300">44141 Dortmund</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#16181f]/60 to-[#1e2029]/60 backdrop-blur-md rounded-lg p-8 mb-8 border border-gray-800"
        >
          <div className="flex items-center mb-6">
            <Lock className="w-8 h-8 text-orange-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">Datenschutzerklärung</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">1. Datenschutz auf einen Blick</h3>
              <p className="text-gray-300 leading-relaxed">
                Autosmaya (Inhaber: Salah-Eddine Khammale) nimmt den Schutz Ihrer persönlichen Daten sehr ernst. 
                Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der EU-Datenschutz-Grundverordnung (DSGVO) 
                sowie dieser Datenschutzerklärung.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">2. Datenerfassung auf unserer Website</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Cookies und Analyse-Tools</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Unsere Website verwendet Cookies. Dies sind kleine Textdateien, die Ihr 
                    Webbrowser auf Ihrem Endgerät speichert. Die meisten der von uns verwendeten 
                    Cookies sind sogenannte "Session-Cookies", die nach Ende Ihres Besuchs 
                    automatisch gelöscht werden. Andere Cookies bleiben auf Ihrem Endgerät gespeichert, 
                    bis Sie diese löschen oder die Speicherdauer abläuft.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Server-Log-Dateien</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Der Provider speichert automatisch Informationen in Server-Log-Dateien, die Ihr Browser 
                    automatisch übermittelt. Dies sind: Browsertyp und -version, verwendetes Betriebssystem, 
                    Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse. 
                    Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">3. Ihre Rechte</h3>
              <p className="text-gray-300 leading-relaxed">
                Sie haben folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:
              </p>
              <ul className="list-disc list-inside text-gray-300 leading-relaxed mt-2 space-y-2">
                <li>Recht auf Auskunft</li>
                <li>Recht auf Berichtigung oder Löschung</li>
                <li>Recht auf Einschränkung der Verarbeitung</li>
                <li>Recht auf Widerspruch gegen die Verarbeitung</li>
                <li>Recht auf Datenübertragbarkeit</li>
              </ul>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">4. Kontaktformular und Kommunikation</h3>
              <p className="text-gray-300 leading-relaxed">
                Wenn Sie uns kontaktieren (z.B. per Kontaktformular, E-Mail, Telefon), werden Ihre Angaben 
                zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. 
                Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung erfolgt auf 
                Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#16181f]/60 to-[#1e2029]/60 backdrop-blur-md rounded-lg p-8 border border-gray-800"
        >
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-orange-400 mr-3" />
            <h2 className="text-2xl font-bold text-white">AGB</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§1 Geltungsbereich</h3>
              <p className="text-gray-300 leading-relaxed">
                Diese Allgemeinen Geschäftsbedingungen gelten für alle Geschäftsbeziehungen zwischen 
                Autosmaya (Inhaber: Salah-Eddine Khammale) und unseren Kunden. Maßgeblich ist die 
                jeweils zum Zeitpunkt des Vertragsschlusses gültige Fassung.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§2 Vertragsschluss und Angebot</h3>
              <p className="text-gray-300 leading-relaxed">
                Unsere Angebote sind freibleibend und unverbindlich. Technische und sonstige Änderungen 
                in Form, Farbe, Gewicht oder Design bleiben im Rahmen des Zumutbaren vorbehalten. 
                Der Kaufvertrag kommt erst durch unsere schriftliche Auftragsbestätigung oder durch 
                Übergabe der Ware zustande.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§3 Preise und Zahlung</h3>
              <p className="text-gray-300 leading-relaxed">
                Alle Preise verstehen sich in Euro inklusive der gesetzlichen Mehrwertsteuer. 
                Der Kaufpreis ist bei Übergabe des Fahrzeugs fällig. Die Übergabe erfolgt nur gegen 
                vollständige Zahlung des Kaufpreises oder nach schriftlicher Finanzierungsbestätigung.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§4 Gewährleistung und Garantie</h3>
              <p className="text-gray-300 leading-relaxed">
                Bei gebrauchten Fahrzeugen verjähren die Ansprüche des Käufers wegen Mängeln in einem Jahr 
                ab Übergabe. Die Verkürzung der Verjährungsfrist gilt nicht für Schadensersatzansprüche 
                aus grob fahrlässiger oder vorsätzlicher Pflichtverletzung. Garantien im Rechtssinne 
                erhält der Kunde durch uns nicht, sofern nicht ausdrücklich schriftlich vereinbart.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§5 Eigentumsvorbehalt</h3>
              <p className="text-gray-300 leading-relaxed">
                Das Fahrzeug bleibt bis zur vollständigen Bezahlung unser Eigentum. Während der Dauer 
                des Eigentumsvorbehalts steht das Recht zum Besitz des Fahrzeugbriefes uns zu. 
                Bei Zugriffen Dritter auf die Vorbehaltsware wird der Käufer auf unser Eigentum hinweisen 
                und uns unverzüglich benachrichtigen.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§6 Probefahrten</h3>
              <p className="text-gray-300 leading-relaxed">
                Für Probefahrten ist ein gültiger Führerschein und Personalausweis vorzulegen. 
                Der Kunde haftet für Schäden, die während der Probefahrt am Fahrzeug entstehen, 
                soweit diese von ihm zu vertreten sind. Der Kunde hat das Fahrzeug pfleglich zu 
                behandeln und alle für die Benutzung maßgeblichen Vorschriften zu beachten.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§7 Schlussbestimmungen</h3>
              <p className="text-gray-300 leading-relaxed">
                Es gilt das Recht der Bundesrepublik Deutschland. Erfüllungsort ist Lünen. 
                Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist, soweit gesetzlich zulässig, 
                Lünen. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen 
                Bestimmungen unberührt.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Legal;