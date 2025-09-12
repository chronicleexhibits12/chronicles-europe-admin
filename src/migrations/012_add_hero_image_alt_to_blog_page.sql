-- Migration to add hero_image_alt field to blog_page table

-- Add hero_image_alt column
ALTER TABLE blog_page 
ADD COLUMN hero_image_alt TEXT;

-- Set a default value for existing records
UPDATE blog_page 
SET hero_image_alt = 'Blog hero image'
WHERE hero_image_alt IS NULL;

-- Update the getBlogPage function in BlogService to include hero_image_alt field
-- This would be handled in the TypeScript code, not in SQL

-- Update the updateBlogPage function in BlogService to handle hero_image_alt field
-- This would be handled in the TypeScript code, not in SQL