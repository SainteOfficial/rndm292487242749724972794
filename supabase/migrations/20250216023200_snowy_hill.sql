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