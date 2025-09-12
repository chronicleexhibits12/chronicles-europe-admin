-- Add city and country array columns to trade_shows_page table
DO $$ 
BEGIN
  -- Add cities column as TEXT[] if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'trade_shows_page' 
    AND column_name = 'cities'
  ) THEN
    ALTER TABLE trade_shows_page ADD COLUMN cities TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
  
  -- Add countries column as TEXT[] if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'trade_shows_page' 
    AND column_name = 'countries'
  ) THEN
    ALTER TABLE trade_shows_page ADD COLUMN countries TEXT[] DEFAULT ARRAY[]::TEXT[];
  END IF;
END $$;