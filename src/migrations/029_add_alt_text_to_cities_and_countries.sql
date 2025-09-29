-- Migration to add alt text fields for images in cities and countries tables

-- Add alt text columns for images in cities table
ALTER TABLE cities 
ADD COLUMN hero_background_image_alt TEXT,
ADD COLUMN why_choose_us_main_image_alt TEXT;

-- Add alt text columns for images in countries table
ALTER TABLE countries 
ADD COLUMN hero_background_image_alt TEXT,
ADD COLUMN why_choose_us_main_image_alt TEXT;