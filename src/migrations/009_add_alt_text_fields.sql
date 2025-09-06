-- Migration to add alt text fields for images in home_page table

-- Add alt text columns for images
ALTER TABLE home_page 
ADD COLUMN hero_background_image_alt TEXT;

ALTER TABLE home_page 
ADD COLUMN exhibition_europe_booth_image_alt TEXT;

-- Note: For solution items, alt texts are stored within the JSONB array itself
-- No need for a separate column as they are part of the existing solutions_items JSONB field

-- Update existing row with sample alt text data (optional)
-- UPDATE home_page 
-- SET 
--   hero_background_image_alt = 'Hero background image',
--   exhibition_europe_booth_image_alt = 'Exhibition booth image'
-- WHERE is_active = true;