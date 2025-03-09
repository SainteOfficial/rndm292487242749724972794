/*
  # Fix additional_features column in cars table

  1. Changes
    - Rename additional_features column to additionalfeatures to match frontend code
    - Ensure data is preserved during rename
*/

ALTER TABLE cars 
RENAME COLUMN additional_features TO additionalfeatures;