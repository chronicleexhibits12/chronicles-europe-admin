-- Migration to add alt text field for hero background image in main_countries_page table

-- Add alt text column for hero background image in main_countries_page table
ALTER TABLE main_countries_page 
ADD COLUMN hero_background_image_alt TEXT;