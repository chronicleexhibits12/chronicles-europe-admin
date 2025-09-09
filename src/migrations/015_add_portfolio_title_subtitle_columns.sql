-- Add portfolio title and subtitle columns to portfolio_page table
ALTER TABLE portfolio_page 
ADD COLUMN portfolio_title TEXT,
ADD COLUMN portfolio_subtitle TEXT;

-- Update existing record with default values
UPDATE portfolio_page 
SET 
  portfolio_title = 'OUR PORTFOLIO',
  portfolio_subtitle = 'Explore our extensive portfolio of exhibition stands and discover the quality and creativity we bring to every project.'
WHERE portfolio_title IS NULL;

-- Update the get_portfolio_page_data function to include the new fields
CREATE OR REPLACE FUNCTION get_portfolio_page_data()
RETURNS JSON AS $$
DECLARE
    portfolio_record RECORD;
    result JSON;
BEGIN
    -- Get the single active portfolio page record
    SELECT * INTO portfolio_record
    FROM portfolio_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'hero', json_build_object(
            'title', portfolio_record.hero_title,
            'backgroundImage', portfolio_record.hero_background_image
        ),
        'portfolio', json_build_object(
            'title', portfolio_record.portfolio_title,
            'subtitle', portfolio_record.portfolio_subtitle
        ),
        'items', portfolio_record.portfolio_items,
        'seo', json_build_object(
            'title', portfolio_record.seo_title,
            'description', portfolio_record.seo_description,
            'keywords', portfolio_record.seo_keywords
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the insert statement in the original migration to include the new columns
-- This is for reference only, as the table already exists
/*
INSERT INTO portfolio_page (
  -- Hero Section Data
  hero_title,
  hero_background_image,
  
  -- Portfolio Section Data
  portfolio_title,
  portfolio_subtitle,
  
  -- Portfolio Items Data
  portfolio_items,
  
  -- SEO Data
  seo_title,
  seo_description,
  seo_keywords,
  
  is_active
) VALUES (
  -- Hero Section
  'PORTFOLIO',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
  -- Portfolio Section
  'OUR PORTFOLIO',
  'Explore our extensive portfolio of exhibition stands and discover the quality and creativity we bring to every project.',
  
  -- Portfolio Items
  '[...]'::jsonb,
  
  -- SEO Data
  'Our Portfolio - Chronicle Exhibition Organizing LLC',
  'Explore our extensive portfolio of exhibition stands and discover the quality and creativity we bring to every project.',
  'portfolio, exhibition stands, trade show booths, custom displays',
  
  true
);
*/