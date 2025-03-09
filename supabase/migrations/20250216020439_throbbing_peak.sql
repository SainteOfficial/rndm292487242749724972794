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