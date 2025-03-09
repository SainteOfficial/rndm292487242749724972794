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
                <p className="text-gray-300">Mobil: +49 176 7036 1769</p>
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
                <h3 className="font-semibold text-white mb-2">Aufsichtsbehörde</h3>
                <p className="text-gray-300">IHK Berlin</p>
                <p className="text-gray-300">Fasanenstraße 85</p>
                <p className="text-gray-300">10623 Berlin</p>
              </div>
              
              <div className="bg-[#1a1c25]/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Berufsbezeichnung</h3>
                <p className="text-gray-300">Kraftfahrzeughandel</p>
                <p className="text-gray-300">Verliehen in: Deutschland</p>
              </div>
              
              <div className="bg-[#1a1c25]/50 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Berufskammer</h3>
                <p className="text-gray-300">Zentralverband Deutsches Kraftfahrzeuggewerbe</p>
                <p className="text-gray-300">Franz-Lohe-Str. 21</p>
                <p className="text-gray-300">53129 Bonn</p>
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
                Die Autosmaya GmbH nimmt den Schutz Ihrer persönlichen Daten sehr ernst. 
                Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend 
                der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">2. Datenerfassung auf unserer Website</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Cookies</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr 
                    Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser 
                    Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-2">Server-Log-Dateien</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Der Provider der Seiten erhebt und speichert automatisch Informationen in 
                    so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">3. Ihre Rechte</h3>
              <p className="text-gray-300 leading-relaxed">
                Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre 
                gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und 
                den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, 
                Sperrung oder Löschung dieser Daten.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">4. Kontaktformular</h3>
              <p className="text-gray-300 leading-relaxed">
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre 
                Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen 
                Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von 
                Anschlussfragen bei uns gespeichert.
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
                Diese Allgemeinen Geschäftsbedingungen gelten für alle gegenwärtigen 
                und zukünftigen Geschäftsbeziehungen zwischen der Autosmaya GmbH und 
                ihren Kunden.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§2 Vertragsschluss</h3>
              <p className="text-gray-300 leading-relaxed">
                Der Kaufvertrag kommt durch Angebot und Annahme zustande. Unsere 
                Angebote sind freibleibend. Technische Änderungen sowie Änderungen 
                in Form, Farbe und/oder Gewicht bleiben im Rahmen des Zumutbaren 
                vorbehalten.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§3 Eigentumsvorbehalt</h3>
              <p className="text-gray-300 leading-relaxed">
                Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum. 
                Vor Übergang des Eigentums ist eine Verpfändung, 
                Sicherungsübereignung, Verarbeitung oder Umgestaltung ohne unsere 
                Zustimmung nicht gestattet.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§4 Gewährleistung</h3>
              <p className="text-gray-300 leading-relaxed">
                Es gelten die gesetzlichen Gewährleistungsrechte. Bei gebrauchten 
                Fahrzeugen beträgt die Gewährleistungsfrist ein Jahr ab Übergabe 
                des Fahrzeugs.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§5 Haftung</h3>
              <p className="text-gray-300 leading-relaxed">
                Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie 
                nach Maßgabe des Produkthaftungsgesetzes. Für leichte Fahrlässigkeit 
                haften wir bei Schäden aus der Verletzung des Lebens, des Körpers 
                und der Gesundheit von Personen.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§6 Widerrufsrecht</h3>
              <p className="text-gray-300 leading-relaxed">
                Verbrauchern steht ein Widerrufsrecht nach Maßgabe der im Anhang 
                aufgeführten Widerrufsbelehrung zu. Unternehmern wird kein 
                freiwilliges Widerrufsrecht eingeräumt.
              </p>
            </div>

            <div className="bg-[#1a1c25]/50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">§7 Schlussbestimmungen</h3>
              <p className="text-gray-300 leading-relaxed">
                Es gilt das Recht der Bundesrepublik Deutschland. Erfüllungsort 
                und Gerichtsstand ist Berlin, soweit der Kunde Kaufmann, juristische 
                Person des öffentlichen Rechts oder öffentlich-rechtliches 
                Sondervermögen ist.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Legal;