-- Check if alt text columns exist and add them if they don't
DO $$ 
BEGIN
  -- Add logo_alt column to trade_shows table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'trade_shows' 
    AND column_name = 'logo_alt'
  ) THEN
    ALTER TABLE trade_shows ADD COLUMN logo_alt TEXT DEFAULT 'Trade show logo';
  END IF;
  
  -- Add hero_background_image_alt column to trade_shows_page table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'trade_shows_page' 
    AND column_name = 'hero_background_image_alt'
  ) THEN
    ALTER TABLE trade_shows_page ADD COLUMN hero_background_image_alt TEXT DEFAULT 'Trade shows and exhibitions in Europe';
  END IF;
END $$;