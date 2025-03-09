/*
  # Insert example cars

  1. Data
    - Adds several example cars with detailed specifications
    - Includes various brands, models and conditions
    - Contains full feature sets and specifications
*/

-- Insert example cars
INSERT INTO cars (
  brand,
  model,
  year,
  price,
  mileage,
  images,
  description,
  specs,
  features,
  additionalfeatures,
  condition,
  status
) VALUES
(
  'Mercedes-Benz',
  'G 63 AMG',
  2024,
  239900,
  50,
  ARRAY[
    'https://images.unsplash.com/photo-1520031441872-265e4ff70366',
    'https://images.unsplash.com/photo-1520031441872-265e4ff70366',
    'https://images.unsplash.com/photo-1520031441872-265e4ff70366'
  ],
  'Brandneuer Mercedes-AMG G 63 in exklusiver Ausführung. Dieses Fahrzeug vereint legendäre Geländewagen-DNA mit modernster AMG-Performance. Ausgestattet mit allem erdenklichen Luxus und neuester Technologie.',
  '{
    "engine": "4.0L V8 Biturbo",
    "power": "430 kW (585 PS)",
    "transmission": "AMG SPEEDSHIFT PLUS 9G-TRONIC",
    "fuelType": "Benzin",
    "acceleration": "4.5s (0-100 km/h)",
    "topSpeed": "220 km/h",
    "consumption": "13.1 l/100km",
    "emissions": "297 g/km",
    "hubraum": "3.982 cm³",
    "seats": "5",
    "doors": "5",
    "emissionClass": "Euro 6d",
    "environmentBadge": "4 (Grün)",
    "inspection": "Neu",
    "airConditioning": "THERMOTRONIC 3-Zonen",
    "parkingAssist": "360°-Kamera",
    "airbags": "Vollausstattung",
    "color": "obsidianschwarz metallic",
    "interiorColor": "Leder Nappa Schwarz",
    "trailerLoad": "3500 kg",
    "cylinders": "8",
    "tankVolume": "100 l"
  }'::jsonb,
  ARRAY[
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
  ARRAY[
    'AMG Driver''s Package',
    'AMG Night-Paket',
    'Ambiente-Beleuchtung',
    'Carbon-Paket',
    'Entertainmentsystem hinten',
    'Massage-Sitze',
    'TV-Tuner digital'
  ],
  '{
    "type": "Neu",
    "accident": false,
    "previousOwners": 0,
    "warranty": true,
    "serviceHistory": true
  }'::jsonb,
  'available'
),
(
  'Porsche',
  'Cayenne Coupe E-Hybrid',
  2024,
  144470,
  10,
  ARRAY[
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
    'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e'
  ],
  'Luxuriöser Hybrid-SUV mit modernster Technologie und erstklassiger Ausstattung. Dieses Fahrzeug vereint sportliche Performance mit umweltbewusster Effizienz.',
  '{
    "engine": "3.0L V6 Turbo Hybrid",
    "power": "224 kW (305 PS)",
    "transmission": "Automatik",
    "fuelType": "Hybrid (Benzin/Elektro)",
    "acceleration": "5.1s (0-100 km/h)",
    "topSpeed": "253 km/h",
    "consumption": "10.0 l/100km",
    "emissions": "0 g/km",
    "hubraum": "2.995 cm³",
    "seats": "5",
    "doors": "4/5",
    "emissionClass": "Euro 6e",
    "environmentBadge": "4 (Grün)",
    "inspection": "Neu",
    "airConditioning": "Klimaautomatik",
    "parkingAssist": "360°-Kamera",
    "airbags": "Front-, Seiten- und weitere Airbags",
    "color": "KREIDE",
    "interiorColor": "Vollleder, Rot",
    "trailerLoad": "750 kg",
    "cylinders": "6",
    "tankVolume": "75 l"
  }'::jsonb,
  ARRAY[
    'ABS',
    'Allradantrieb',
    'Anhängerkupplung fest',
    'Elektr. Seitenspiegel',
    'Elektr. Wegfahrsperre',
    'ESP',
    'Freisprecheinrichtung',
    'Isofix',
    'Luftfederung',
    'Regensensor'
  ],
  ARRAY[
    'Adaptive Sportsitze',
    'Ambiente-Beleuchtung',
    'Head-up-Display',
    'Sport-Design-Paket schwarz',
    'Soft Close Türen',
    'Sound-System BOSE'
  ],
  '{
    "type": "Neu",
    "accident": false,
    "previousOwners": 0,
    "warranty": true,
    "serviceHistory": true
  }'::jsonb,
  'available'
),
(
  'BMW',
  'M4 Competition',
  2023,
  98500,
  15000,
  ARRAY[
    'https://images.unsplash.com/photo-1555215695-3004980ad54e',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e'
  ],
  'Der BMW M4 Competition vereint Sportlichkeit und Luxus auf höchstem Niveau. Ein echtes Fahrerlebnis mit modernster Technologie und beeindruckender Performance.',
  '{
    "engine": "3.0L Reihensechszylinder Biturbo",
    "power": "375 kW (510 PS)",
    "transmission": "8-Gang M Steptronic",
    "fuelType": "Benzin",
    "acceleration": "3.9s (0-100 km/h)",
    "topSpeed": "290 km/h",
    "consumption": "9.8 l/100km",
    "emissions": "224 g/km",
    "hubraum": "2.993 cm³",
    "seats": "4",
    "doors": "2",
    "emissionClass": "Euro 6d",
    "environmentBadge": "4 (Grün)",
    "inspection": "03/2025",
    "airConditioning": "3-Zonen-Klimaautomatik",
    "parkingAssist": "Park Assistant Plus",
    "airbags": "Front-, Seiten- und Kopfairbags",
    "color": "Sao Paulo Gelb",
    "interiorColor": "Leder Merino Schwarz",
    "trailerLoad": "0 kg",
    "cylinders": "6",
    "tankVolume": "59 l"
  }'::jsonb,
  ARRAY[
    'M xDrive',
    'M Sportbremse',
    'M Sportdifferenzial',
    'Adaptives M Fahrwerk',
    'M Drivers Package',
    'Laserlicht',
    'Harman Kardon',
    'Head-Up Display',
    'Live Cockpit Professional',
    'Komfortzugang'
  ],
  ARRAY[
    'M Carbon Paket',
    'M Performance Parts',
    'Driving Assistant Professional',
    'Parking Assistant Plus',
    'BMW Display Key',
    'Sitzbelüftung'
  ],
  '{
    "type": "Gebraucht",
    "accident": false,
    "previousOwners": 1,
    "warranty": true,
    "serviceHistory": true
  }'::jsonb,
  'available'
);