-- COMBINED SUPABASE SETUP SCRIPT --

-- 20231015_create_gallery_table.sql --
-- Create a table for the photo gallery
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  car_brand TEXT,
  car_model TEXT,
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to view images (but not modify)
CREATE POLICY "Allow anonymous read access" 
  ON gallery FOR SELECT 
  USING (true);

-- Allow authenticated users (admin) to insert/update/delete
CREATE POLICY "Allow authenticated users full access" 
  ON gallery FOR ALL 
  USING (auth.role() = 'authenticated');

-- Create a function to help automatically populate car_brand and car_model
CREATE OR REPLACE FUNCTION set_car_details() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.car_id IS NOT NULL THEN
    SELECT brand, model INTO NEW.car_brand, NEW.car_model
    FROM cars WHERE id = NEW.car_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set car details
CREATE TRIGGER trigger_set_car_details
BEFORE INSERT OR UPDATE ON gallery
FOR EACH ROW
EXECUTE FUNCTION set_car_details();

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER trigger_update_gallery_timestamp
BEFORE UPDATE ON gallery
FOR EACH ROW
EXECUTE FUNCTION update_modified_column(); 

-- 20250215224825_azure_ember.sql --
/*
  # Create cars table

  1. New Tables
    - `cars`
      - `id` (uuid, primary key)
      - `brand` (text)
      - `model` (text)
      - `year` (integer)
      - `price` (integer)
      - `mileage` (integer)
      - `images` (text array)
      - `description` (text)
      - `specs` (jsonb)
      - `features` (text array)
      - `additional_features` (text array)
      - `condition` (jsonb)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `cars` table
    - Add policies for authenticated users to manage cars
*/

CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price integer NOT NULL,
  mileage integer NOT NULL,
  images text[] NOT NULL,
  description text NOT NULL,
  specs jsonb NOT NULL,
  features text[] NOT NULL,
  additional_features text[] NOT NULL,
  condition jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all cars
CREATE POLICY "Anyone can read cars"
  ON cars
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert cars
CREATE POLICY "Authenticated users can insert cars"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update their cars
CREATE POLICY "Authenticated users can update cars"
  ON cars
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete cars
CREATE POLICY "Authenticated users can delete cars"
  ON cars
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 20250215230309_small_thunder.sql --
/*
  # Create cars table with proper schema and safe policy creation

  1. New Tables
    - `cars`
      - `id` (uuid, primary key)
      - `brand` (text)
      - `model` (text)
      - `year` (integer)
      - `price` (integer)
      - `mileage` (integer)
      - `images` (text array)
      - `description` (text)
      - `specs` (jsonb)
      - `features` (text array)
      - `additional_features` (text array)
      - `condition` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `cars` table
    - Add policies for CRUD operations with safety checks
*/

-- Create the cars table if it doesn't exist
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price integer NOT NULL,
  mileage integer NOT NULL,
  images text[] NOT NULL,
  description text NOT NULL,
  specs jsonb NOT NULL,
  features text[] NOT NULL,
  additional_features text[] NOT NULL,
  condition jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Safely create policies
DO $$ 
BEGIN
  -- Read policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cars' 
    AND policyname = 'Anyone can read cars'
  ) THEN
    CREATE POLICY "Anyone can read cars"
      ON cars
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cars' 
    AND policyname = 'Authenticated users can insert cars'
  ) THEN
    CREATE POLICY "Authenticated users can insert cars"
      ON cars
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cars' 
    AND policyname = 'Authenticated users can update cars'
  ) THEN
    CREATE POLICY "Authenticated users can update cars"
      ON cars
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'cars' 
    AND policyname = 'Authenticated users can delete cars'
  ) THEN
    CREATE POLICY "Authenticated users can delete cars"
      ON cars
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop the trigger if it exists and create it again
DROP TRIGGER IF EXISTS update_cars_updated_at ON cars;
CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 20250215231428_soft_credit.sql --
/*
  # Fix additional_features column in cars table

  1. Changes
    - Rename additional_features column to additionalfeatures to match frontend code
    - Ensure data is preserved during rename
*/

ALTER TABLE cars 
RENAME COLUMN additional_features TO additionalfeatures;

-- 20250215231504_plain_cliff.sql --
/*
  # Fix cars table schema

  1. Changes
    - Drop and recreate cars table with correct column names
    - Ensure all policies are recreated
    - Add updated_at trigger
*/

-- Drop existing table and recreate with correct schema
DROP TABLE IF EXISTS cars;

CREATE TABLE cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price integer NOT NULL,
  mileage integer NOT NULL,
  images text[] NOT NULL,
  description text NOT NULL,
  specs jsonb NOT NULL,
  features text[] NOT NULL,
  additionalfeatures text[] NOT NULL,
  condition jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read cars"
  ON cars
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert cars"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cars"
  ON cars
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cars"
  ON cars
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 20250215232751_odd_cell.sql --
/*
  # Fix cars table schema

  1. Changes
    - Drop and recreate cars table with correct column names
    - Ensure all column names are lowercase and match frontend expectations
    - Reapply RLS policies
*/

-- Drop existing table and recreate with correct schema
DROP TABLE IF EXISTS cars;

CREATE TABLE cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price integer NOT NULL,
  mileage integer NOT NULL,
  images text[] NOT NULL,
  description text NOT NULL,
  specs jsonb NOT NULL,
  features text[] NOT NULL,
  additionalfeatures text[] NOT NULL,
  condition jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read cars"
  ON cars
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert cars"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cars"
  ON cars
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cars"
  ON cars
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 20250215233012_winter_fountain.sql --
/*
  # Create cars table with correct schema

  1. New Tables
    - `cars`
      - `id` (uuid, primary key)
      - `brand` (text)
      - `model` (text)
      - `year` (integer)
      - `price` (integer)
      - `mileage` (integer)
      - `images` (text array)
      - `description` (text)
      - `specs` (jsonb)
      - `features` (text array)
      - `additionalfeatures` (text array)
      - `condition` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `cars` table
    - Add policies for authenticated users to perform CRUD operations
*/

-- Drop existing table and recreate with correct schema
DROP TABLE IF EXISTS cars;

CREATE TABLE cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price integer NOT NULL,
  mileage integer NOT NULL,
  images text[] NOT NULL,
  description text NOT NULL,
  specs jsonb NOT NULL,
  features text[] NOT NULL,
  additionalfeatures text[] NOT NULL,
  condition jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read cars"
  ON cars
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert cars"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cars"
  ON cars
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete cars"
  ON cars
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 20250216002831_humble_tree.sql --
-- Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for buckets
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'buckets' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can create buckets'
  ) THEN
    CREATE POLICY "Authenticated users can create buckets"
      ON storage.buckets
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'buckets' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can update buckets'
  ) THEN
    CREATE POLICY "Authenticated users can update buckets"
      ON storage.buckets
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Create policies for objects (files)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Anyone can read car images'
  ) THEN
    CREATE POLICY "Anyone can read car images"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'car-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can upload car images'
  ) THEN
    CREATE POLICY "Authenticated users can upload car images"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'car-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can update car images'
  ) THEN
    CREATE POLICY "Authenticated users can update car images"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'car-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can delete car images'
  ) THEN
    CREATE POLICY "Authenticated users can delete car images"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'car-images');
  END IF;
END
$$;

-- Create the car-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'car-images',
  'car-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 20250216005148_round_lodge.sql --
/*
  # Update car table policies

  1. Changes
    - Allow public access to read cars
    - Keep admin-only access for write operations

  2. Security
    - Enable RLS
    - Add policy for public read access
    - Maintain existing admin policies
*/

-- Update policies for cars table
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read cars" ON cars;
DROP POLICY IF EXISTS "Authenticated users can insert cars" ON cars;
DROP POLICY IF EXISTS "Authenticated users can update cars" ON cars;
DROP POLICY IF EXISTS "Authenticated users can delete cars" ON cars;

-- Create new policies
CREATE POLICY "Allow public read access"
  ON cars
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert cars"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update cars"
  ON cars
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete cars"
  ON cars
  FOR DELETE
  TO authenticated
  USING (true);

-- 20250216011651_square_villa.sql --
/*
  # Add status field to cars table

  1. Changes
    - Add status field to cars table with default 'available'
    - Add status enum type for car status

  2. Security
    - Maintain existing RLS policies
*/

-- Create enum type for car status
CREATE TYPE car_status AS ENUM ('available', 'sold');

-- Add status column to cars table
ALTER TABLE cars ADD COLUMN IF NOT EXISTS status car_status NOT NULL DEFAULT 'available';

-- 20250216020439_throbbing_peak.sql --
/*
  # Add Newsletter System

  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `active` (boolean)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can read subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can update subscribers"
  ON newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (true);

-- 20250216021139_withered_prism.sql --
-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can read subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can update subscribers"
  ON newsletter_subscribers
  FOR UPDATE
  TO authenticated
  USING (true);

-- 20250216021201_weathered_glitter.sql --
/*
  # Newsletter Subscribers Table

  1. Changes
    - Safely create newsletter_subscribers table if it doesn't exist
    - Add RLS policies for newsletter management
    - Ensure idempotent execution
*/

-- Safely create the newsletter_subscribers table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'newsletter_subscribers'
  ) THEN
    CREATE TABLE newsletter_subscribers (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      email text UNIQUE NOT NULL,
      created_at timestamptz DEFAULT now(),
      active boolean DEFAULT true
    );
  END IF;
END
$$;

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Safely create policies
DO $$ 
BEGIN
  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' 
    AND policyname = 'Anyone can subscribe to newsletter'
  ) THEN
    CREATE POLICY "Anyone can subscribe to newsletter"
      ON newsletter_subscribers
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

  -- Select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' 
    AND policyname = 'Only authenticated users can read subscribers'
  ) THEN
    CREATE POLICY "Only authenticated users can read subscribers"
      ON newsletter_subscribers
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' 
    AND policyname = 'Only authenticated users can update subscribers'
  ) THEN
    CREATE POLICY "Only authenticated users can update subscribers"
      ON newsletter_subscribers
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- 20250216021520_shrill_cliff.sql --
-- Drop existing table and recreate with correct schema
DROP TABLE IF EXISTS cars;

CREATE TABLE cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price integer NOT NULL,
  mileage integer NOT NULL,
  images text[] NOT NULL,
  description text NOT NULL,
  specs jsonb NOT NULL,
  features text[] NOT NULL,
  additionalfeatures text[] NOT NULL,
  condition jsonb NOT NULL,
  status car_status NOT NULL DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON cars
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert cars"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update cars"
  ON cars
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete cars"
  ON cars
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 20250216022746_turquoise_fire.sql --
/*
  # Update Cars Table Policies

  1. Changes
    - Allow public read access to cars table
    - Keep authenticated-only access for write operations

  2. Security
    - Everyone can read cars
    - Only authenticated users can modify cars
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON cars;
DROP POLICY IF EXISTS "Only authenticated users can insert cars" ON cars;
DROP POLICY IF EXISTS "Only authenticated users can update cars" ON cars;
DROP POLICY IF EXISTS "Only authenticated users can delete cars" ON cars;

-- Create new policies
CREATE POLICY "Anyone can read cars"
  ON cars
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only authenticated users can insert cars"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update cars"
  ON cars
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete cars"
  ON cars
  FOR DELETE
  TO authenticated
  USING (true);

-- 20250216022940_dark_meadow.sql --
/*
  # Fix public access to cars table
  
  1. Changes
    - Enable public access to cars table without authentication
    - Update RLS policies to allow public read access
*/

-- Update RLS policies for cars table
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read cars" ON cars;

-- Create new policy for public access
CREATE POLICY "Public can read all cars"
  ON cars
  FOR SELECT
  TO public
  USING (true);

-- 20250216023200_snowy_hill.sql --
-- Ensure the cars table has the correct column name
ALTER TABLE cars RENAME COLUMN IF EXISTS additionalfeatures TO additionalfeatures;

-- Recreate the trigger if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS update_cars_updated_at ON cars;
CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Ensure RLS is enabled
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Recreate policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public can read all cars" ON cars;
  DROP POLICY IF EXISTS "Only authenticated users can insert cars" ON cars;
  DROP POLICY IF EXISTS "Only authenticated users can update cars" ON cars;
  DROP POLICY IF EXISTS "Only authenticated users can delete cars" ON cars;

  -- Create new policies
  CREATE POLICY "Public can read all cars"
    ON cars
    FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Only authenticated users can insert cars"
    ON cars
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

  CREATE POLICY "Only authenticated users can update cars"
    ON cars
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

  CREATE POLICY "Only authenticated users can delete cars"
    ON cars
    FOR DELETE
    TO authenticated
    USING (true);
END
$$;

-- 20250216023716_noisy_dust.sql --
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

