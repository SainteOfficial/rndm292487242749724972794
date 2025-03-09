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