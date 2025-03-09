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