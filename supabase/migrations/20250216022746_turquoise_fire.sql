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