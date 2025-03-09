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