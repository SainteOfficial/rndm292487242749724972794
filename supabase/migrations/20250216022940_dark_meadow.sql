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