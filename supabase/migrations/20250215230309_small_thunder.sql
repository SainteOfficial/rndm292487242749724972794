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