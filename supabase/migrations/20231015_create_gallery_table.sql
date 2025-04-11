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