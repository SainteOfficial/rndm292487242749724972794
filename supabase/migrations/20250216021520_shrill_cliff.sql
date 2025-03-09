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