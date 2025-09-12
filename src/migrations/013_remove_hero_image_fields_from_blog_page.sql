-- Migration to remove hero_image and hero_image_alt fields from blog_page table

-- Remove hero_image column
ALTER TABLE blog_page 
DROP COLUMN IF EXISTS hero_image;

-- Remove hero_image_alt column
ALTER TABLE blog_page 
DROP COLUMN IF EXISTS hero_image_alt;