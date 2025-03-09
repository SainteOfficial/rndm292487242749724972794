-- Enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for buckets
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'buckets' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can create buckets'
  ) THEN
    CREATE POLICY "Authenticated users can create buckets"
      ON storage.buckets
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'buckets' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can update buckets'
  ) THEN
    CREATE POLICY "Authenticated users can update buckets"
      ON storage.buckets
      FOR UPDATE
      TO authenticated
      USING (true);
  END IF;
END
$$;

-- Create policies for objects (files)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Anyone can read car images'
  ) THEN
    CREATE POLICY "Anyone can read car images"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'car-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can upload car images'
  ) THEN
    CREATE POLICY "Authenticated users can upload car images"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'car-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can update car images'
  ) THEN
    CREATE POLICY "Authenticated users can update car images"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'car-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage'
    AND policyname = 'Authenticated users can delete car images'
  ) THEN
    CREATE POLICY "Authenticated users can delete car images"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'car-images');
  END IF;
END
$$;

-- Create the car-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'car-images',
  'car-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;