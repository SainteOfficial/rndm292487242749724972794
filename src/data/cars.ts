import { v4 as uuidv4 } from 'uuid';

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images: string[];
  description: string;
  specs: {
    engine: string;
    power: string;
    transmission: string;
    fuelType: string;
    acceleration: string;
    topSpeed: string;
    consumption: string;
    emissions: string;
    hubraum: string;
    seats: string;
    doors: string;
    emissionClass: string;
    environmentBadge: string;
    inspection: string;
    airConditioning: string;
    parkingAssist: string;
    airbags: string;
    color: string;
    interiorColor: string;
    trailerLoad: string;
    cylinders: string;
    tankVolume: string;
  };
  features: string[];
  additionalFeatures: string[];
  condition: {
    type: 'Neu' | 'Gebraucht' | 'Jahreswagen';
    accident: boolean;
    previousOwners: number;
    warranty: boolean;
    serviceHistory: boolean;
  };
}

export const cars: Car[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    brand: 'Porsche',
    model: 'Cayenne Coupe E-Hybrid',
    year: 2024,
    price: 144470,
    mileage: 10,
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e'
    ],
    description: 'Luxuriöser Hybrid-SUV mit modernster Technologie und erstklassiger Ausstattung. Dieses Fahrzeug vereint sportliche Performance mit umweltbewusster Effizienz. Die hochwertige Verarbeitung und das elegante Design machen den Cayenne Coupe E-Hybrid zu einem besonderen Fahrerlebnis.',
    specs: {
      engine: '3.0L V6 Turbo Hybrid',
      power: '224 kW (305 PS)',
      transmission: 'Automatik',
      fuelType: 'Hybrid (Benzin/Elektro)',
      acceleration: '5.1s (0-100 km/h)',
      topSpeed: '253 km/h',
      consumption: '10.0 l/100km (kombiniert)',
      emissions: '-- g/km',
      hubraum: '2.995 cm³',
      seats: '5',
      doors: '4/5',
      emissionClass: 'Euro 6e',
      environmentBadge: '4 (Grün)',
      inspection: 'Neu',
      airConditioning: 'Klimaautomatik',
      parkingAssist: '360°-Kamera, Hinten',
      airbags: 'Front-, Seiten- und weitere Airbags',
      color: 'KREIDE',
      interiorColor: 'Vollleder, Rot',
      trailerLoad: '750 kg',
      cylinders: '6',
      tankVolume: '75 l'
    },
    features: [
      'ABS',
      'Allradantrieb',
      'Anhängerkupplung fest',
      'Elektr. Seitenspiegel',
      'Elektr. Wegfahrsperre',
      'ESP',
      'Freisprecheinrichtung',
      'Isofix',
      'Luftfederung',
      'Regensensor',
      'Scheckheftgepflegt',
      'Sitzheizung hinten',
      'Sportfahrwerk',
      'Sportpaket',
      'Sportsitze',
      'Start/Stopp-Automatik',
      'Zentralverriegelung'
    ],
    additionalFeatures: [
      'Adaptive Sportsitze inkl. Sitzverstellung 18-Wege und Memory-Paket',
      'Ambiente-Beleuchtung',
      'Außen-/Innenspiegel mit Abblendautomatik',
      'Exterieur-Paket',
      'Fahrassistenz-System: aktiver Park-Assistent vorn und hinten inkl. Rückfahrkamera und Surround View',
      'Fondsitzanlage (2+1 Sitzplätze)',
      'Fußmatten',
      'Geschwindigkeits-Regelanlage (Tempomat) mit Abstandsregelung (erweitert)',
      'Head-up-Display',
      'Interieur-Paket: Diamar Silver Shade',
      'Klimaautomatik 4-Zonen',
      'Koffer-/Laderaummanagement-System',
      'Komfortzugang (Schlüssellose Türentriegelung)',
      'Kopfstützen vorn mit Porschewappen',
      'Lenkrad heizbar (GT Sport / Leder) mit Multifunktion und Schaltfunktion',
      'LM-Felgen vorn/hinten: 10x22 / 11,5x22 (RS Spyder Design Rad, schwarz Hochglanz, glanzgedreht)',
      'Matrix-LED-Scheinwerfer inkl. Porsche Dynamic Light System Plus (PDLS+)',
      'Radioempfang digital (DAB+)',
      'Radnaben - Abdeckungen Porschewappen farbig',
      'Schriftzug Porsche lackiert',
      'Seitenairbag hinten',
      'Soft Close Türen',
      'Sound-System BOSE',
      'Sport-Design-Paket schwarz, Hochglanz',
      'Sportendrohre 4-Rohr-Optik, Bronze',
      'Sportendrohre 4-Rohr-Optik, schwarz',
      'Verglasung hinten abgedunkelt (Privacyverglasung)'
    ],
    condition: {
      type: 'Neu',
      accident: false,
      previousOwners: 0,
      warranty: true,
      serviceHistory: true
    }
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    brand: 'BMW',
    model: '530d xDrive',
    year: 2020,
    price: 28900,
    mileage: 98500,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e'
    ],
    description: 'Gebrauchter BMW 530d xDrive mit Unfallschaden an der Front. Das Fahrzeug ist technisch in gutem Zustand, benötigt jedoch Karosseriearbeiten. Der Unfallschaden wurde professionell begutachtet und dokumentiert. Trotz des Schadens ist das Fahrzeug fahrbereit und sicher. Eine detaillierte Schadensdokumentation liegt vor.',
    specs: {
      engine: '3.0L Reihensechszylinder Diesel',
      power: '195 kW (265 PS)',
      transmission: 'Automatik',
      fuelType: 'Diesel',
      acceleration: '5.4s (0-100 km/h)',
      topSpeed: '250 km/h',
      consumption: '6.2 l/100km (kombiniert)',
      emissions: '163 g/km',
      hubraum: '2.993 cm³',
      seats: '5',
      doors: '4/5',
      emissionClass: 'Euro 6d',
      environmentBadge: '4 (Grün)',
      inspection: 'Neu',
      airConditioning: 'Klimaautomatik',
      parkingAssist: 'Parksensoren vorne und hinten',
      airbags: 'Front-, Seiten- und Kopfairbags',
      color: 'Mineralgrau Metallic',
      interiorColor: 'Leder Dakota Schwarz',
      trailerLoad: '2000 kg',
      cylinders: '6',
      tankVolume: '66 l'
    },
    features: [
      'ABS',
      'Allradantrieb',
      'Bordcomputer',
      'Einparkhilfe',
      'Elektr. Fensterheber',
      'ESP',
      'Navigationssystem',
      'Regensensor',
      'Sitzheizung',
      'Tempomat',
      'Zentralverriegelung'
    ],
    additionalFeatures: [
      'BMW Live Cockpit Professional',
      'Business Paket Professional',
      'Driving Assistant Professional',
      'Harman Kardon Surround Sound System',
      'M Sportpaket',
      'Panorama Glasdach',
      'Sitzbelüftung vorne',
      'Standheizung'
    ],
    condition: {
      type: 'Gebraucht',
      accident: true,
      previousOwners: 2,
      warranty: false,
      serviceHistory: true
    }
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    brand: 'Mercedes-Benz',
    model: 'G 63 AMG',
    year: 2024,
    price: 239900,
    mileage: 50,
    images: [
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366',
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366',
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366',
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366'
    ],
    description: 'Brandneuer Mercedes-AMG G 63 in exklusiver Ausführung. Dieses Fahrzeug vereint legendäre Geländewagen-DNA mit modernster AMG-Performance. Ausgestattet mit allem erdenklichen Luxus und neuester Technologie. Ein Statement auf vier Rädern.',
    specs: {
      engine: '4.0L V8 Biturbo',
      power: '430 kW (585 PS)',
      transmission: 'AMG SPEEDSHIFT PLUS 9G-TRONIC',
      fuelType: 'Benzin',
      acceleration: '4.5s (0-100 km/h)',
      topSpeed: '220 km/h',
      consumption: '13.1 l/100km',
      emissions: '297 g/km',
      hubraum: '3.982 cm³',
      seats: '5',
      doors: '5',
      emissionClass: 'Euro 6d',
      environmentBadge: '4 (Grün)',
      inspection: 'Neu',
      airConditioning: 'THERMOTRONIC 3-Zonen',
      parkingAssist: '360°-Kamera',
      airbags: 'Vollausstattung',
      color: 'obsidianschwarz metallic',
      interiorColor: 'Leder Nappa Schwarz',
      trailerLoad: '3500 kg',
      cylinders: '8',
      tankVolume: '100 l'
    },
    features: [
      'AMG RIDE CONTROL',
      'Burmester® Surround-Soundsystem',
      'DISTRONIC PLUS',
      'Fahrassistenz-Paket Plus',
      'Head-up-Display',
      'KEYLESS-GO',
      'LED Intelligent Light System',
      'Panorama-Schiebedach',
      'Standheizung',
      'Widescreen Cockpit'
    ],
    additionalFeatures: [
      'AMG Driver\'s Package',
      'AMG Night-Paket',
      'Ambiente-Beleuchtung',
      'Carbon-Paket',
      'Entertainmentsystem hinten',
      'Massage-Sitze',
      'TV-Tuner digital'
    ],
    condition: {
      type: 'Neu',
      accident: false,
      previousOwners: 0,
      warranty: true,
      serviceHistory: true
    }
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    brand: 'Volkswagen',
    model: 'Golf II GTI',
    year: 1989,
    price: 24900,
    mileage: 138000,
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d',
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d'
    ],
    description: 'Liebevoll restaurierter VW Golf II GTI im Originalzustand. Ein echtes Sammlerstück mit nachvollziehbarer Historie. Komplett numbers-matching mit original Motor und Getriebe. Die Restaurierung wurde professionell durchgeführt und ist vollständig dokumentiert.',
    specs: {
      engine: '1.8L 4-Zylinder',
      power: '102 kW (139 PS)',
      transmission: '5-Gang Schaltgetriebe',
      fuelType: 'Benzin',
      acceleration: '8.3s (0-100 km/h)',
      topSpeed: '208 km/h',
      consumption: '8.5 l/100km',
      emissions: '-- g/km',
      hubraum: '1.781 cm³',
      seats: '5',
      doors: '3',
      emissionClass: 'Euro 1',
      environmentBadge: '4 (Grün)',
      inspection: '03/2025',
      airConditioning: 'Manuell',
      parkingAssist: 'Nein',
      airbags: 'Nein',
      color: 'Tornadorot',
      interiorColor: 'GTI-Interieur Schwarz/Rot',
      trailerLoad: '1000 kg',
      cylinders: '4',
      tankVolume: '55 l'
    },
    features: [
      'Elektrische Fensterheber vorne',
      'Getönte Scheiben',
      'GTI-Sportfahrwerk',
      'Nebelscheinwerfer',
      'Servolenkung',
      'Sportsitze',
      'Zentralverriegelung'
    ],
    additionalFeatures: [
      'H-Kennzeichen berechtigt',
      'Matching Numbers',
      'Original GTI-Felgen',
      'Originales Radio',
      'Unverbastelt'
    ],
    condition: {
      type: 'Gebraucht',
      accident: false,
      previousOwners: 3,
      warranty: false,
      serviceHistory: true
    }
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    brand: 'Tesla',
    model: 'Model S Plaid',
    year: 2024,
    price: 149900,
    mileage: 100,
    images: [
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771'
    ],
    description: 'Tesla Model S Plaid - das schnellste Serienfahrzeug der Welt. Mit seiner bahnbrechenden Technologie und unübertroffenen Leistung setzt dieses Fahrzeug neue Maßstäbe in der Elektromobilität. Ausgestattet mit der neuesten Version des Autopiloten und allen verfügbaren Extras.',
    specs: {
      engine: 'Tri Motor Elektro',
      power: '760 kW (1.020 PS)',
      transmission: 'Direkt-Antrieb',
      fuelType: 'Elektro',
      acceleration: '2.1s (0-100 km/h)',
      topSpeed: '322 km/h',
      consumption: '19.3 kWh/100km',
      emissions: '0 g/km',
      hubraum: '-- cm³',
      seats: '5',
      doors: '5',
      emissionClass: 'Elektro',
      environmentBadge: '4 (Grün)',
      inspection: 'Neu',
      airConditioning: 'Premium-Klimaautomatik',
      parkingAssist: 'Autopilot',
      airbags: 'Rundum-Airbag-System',
      color: 'Midnight Silver Metallic',
      interiorColor: 'Schwarz Premium',
      trailerLoad: '1600 kg',
      cylinders: '--',
      tankVolume: '100 kWh Batterie'
    },
    features: [
      'Autopilot',
      'Full Self-Driving Capability',
      'Premium Connectivity',
      'Premium Audio',
      'Glas-Panoramadach',
      'Adaptive Luftfederung',
      'Schlüsselloser Zugang',
      'Wireless Charging'
    ],
    additionalFeatures: [
      'Gaming-Computer',
      'Premium Interieur',
      'Yoke Steering',
      'Track Mode',
      'Smart Air Suspension',
      'Ultra Red Paint'
    ],
    condition: {
      type: 'Neu',
      accident: false,
      previousOwners: 0,
      warranty: true,
      serviceHistory: true
    }
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174005',
    brand: 'Audi',
    model: 'RS e-tron GT',
    year: 2023,
    price: 159900,
    mileage: 8500,
    images: [
      'https://images.unsplash.com/photo-1614708267811-b3c67c36a093',
      'https://images.unsplash.com/photo-1614708267811-b3c67c36a093',
      'https://images.unsplash.com/photo-1614708267811-b3c67c36a093',
      'https://images.unsplash.com/photo-1614708267811-b3c67c36a093'
    ],
    description: 'Der Audi RS e-tron GT vereint atemberaubende Performance mit zukunftsweisender Elektromobilität. Dieses Jahreswagenmodell präsentiert sich in einem perfekten Zustand mit umfangreicher Ausstattung und der vollen Herstellergarantie.',
    specs: {
      engine: 'Dual Motor Elektro',
      power: '475 kW (646 PS)',
      transmission: '2-Gang Automatik',
      fuelType: 'Elektro',
      acceleration: '3.3s (0-100 km/h)',
      topSpeed: '250 km/h',
      consumption: '20.2 kWh/100km',
      emissions: '0 g/km',
      hubraum: '-- cm³',
      seats: '4',
      doors: '4',
      emissionClass: 'Elektro',
      environmentBadge: '4 (Grün)',
      inspection: '02/2025',
      airConditioning: '3-Zonen Klimaautomatik',
      parkingAssist: 'Park Assist Plus',
      airbags: 'Vollausstattung',
      color: 'Taktikgrün Metallic',
      interiorColor: 'Leder Feinnappa Schwarz',
      trailerLoad: '0 kg',
      cylinders: '--',
      tankVolume: '93.4 kWh Batterie'
    },
    features: [
      'Adaptiver Luftfederung',
      'Bang & Olufsen Sound',
      'Head-up-Display',
      'Matrix LED Scheinwerfer',
      'Nachtsichtassistent',
      'Panorama-Glasdach',
      'quattro',
      'Sport Differenzial'
    ],
    additionalFeatures: [
      'Carbon Optikpaket',
      'Dynamik Plus Paket',
      'e-tron sport sound',
      'RS-Designpaket Rot',
      'RS-Sportabgasanlage'
    ],
    condition: {
      type: 'Jahreswagen',
      accident: false,
      previousOwners: 1,
      warranty: true,
      serviceHistory: true
    }
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174006',
    brand: 'Lamborghini',
    model: 'Huracán STO',
    year: 2023,
    price: 389900,
    mileage: 1500,
    images: [
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a'
    ],
    description: 'Der Lamborghini Huracán STO ist die straßenzugelassene Version des erfolgreichen Rennwagens. Dieses Exemplar wurde speziell konfiguriert und befindet sich in einem makellosen Zustand. Die geringen Kilometer und die exklusive Ausstattung machen dieses Fahrzeug zu einer einmaligen Gelegenheit.',
    specs: {
      engine: '5.2L V10',
      power: '470 kW (640 PS)',
      transmission: '7-Gang LDF Doppelkupplung',
      fuelType: 'Super Plus',
      acceleration: '3.0s (0-100 km/h)',
      topSpeed: '310 km/h',
      consumption: '13.9 l/100km',
      emissions: '331 g/km',
      hubraum: '5.204 cm³',
      seats: '2',
      doors: '2',
      emissionClass: 'Euro 6d',
      environmentBadge: '4 (Grün)',
      inspection: '01/2025',
      airConditioning: 'Klimaautomatik',
      parkingAssist: 'Rückfahrkamera',
      airbags: 'Front- und Seitenairbags',
      color: 'Blu Laufey',
      interiorColor: 'Alcantara Nero Cosmus',
      trailerLoad: '0 kg',
      cylinders: '10',
      tankVolume: '83 l'
    },
    features: [
      'Carbon Keramik Bremsen',
      'Frontlifting System',
      'Lamborghini Telemetrie',
      'Magneto-rheologisches Fahrwerk',
      'Racing Sportsitze',
      'Rückfahrkamera',
      'Telemetrie-System'
    ],
    additionalFeatures: [
      'Carbon Skin® Paket',
      'CCM Bremsanlage',
      'Comfort Paket',
      'Lamborghini Connect',
      'Travel Paket'
    ],
    condition: {
      type: 'Gebraucht',
      accident: false,
      previousOwners: 1,
      warranty: true,
      serviceHistory: true
    }
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174007',
    brand: 'Toyota',
    model: 'Land Cruiser J4',
    year: 1982,
    price: 39900,
    mileage: 156000,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'
    ],
    description: 'Vollständig restaurierter Toyota Land Cruiser J4 in einem außergewöhnlichen Zustand. Die Restaurierung wurde mit größter Sorgfalt und unter Verwendung originaler Teile durchgeführt. Ein echtes Sammlerstück mit H-Kennzeichen-Berechtigung.',
    specs: {
      engine: '4.2L 6-Zylinder Diesel',
      power: '96 kW (130 PS)',
      transmission: '4-Gang Schaltgetriebe',
      fuelType: 'Diesel',
      acceleration: '-- s (0-100 km/h)',
      topSpeed: '145 km/h',
      consumption: '13.5 l/100km',
      emissions: '-- g/km',
      hubraum: '4.164 cm³',
      seats: '6',
      doors: '3',
      emissionClass: '--',
      environmentBadge: '4 (Grün)',
      inspection: '06/2025',
      airConditioning: 'Nein',
      parkingAssist: 'Nein',
      airbags: 'Nein',
      color: 'Beige',
      interiorColor: 'Braun',
      trailerLoad: '3500 kg',
      cylinders: '6',
      tankVolume: '90 l'
    },
    features: [
      'Allradantrieb',
      'Differentialsperre',
      'Hardtop abnehmbar',
      'Seilwinde',
      'Unterfahrschutz',
      'Zusatztank'
    ],
    additionalFeatures: [
      'H-Kennzeichen berechtigt',
      'Neue Reifen',
      'Restaurierungsdokumentation',
      'Werkzeugset original'
    ],
    condition: {
      type: 'Gebraucht',
      accident: false,
      previousOwners: 4,
      warranty: false,
      serviceHistory: true
    }
  }
];