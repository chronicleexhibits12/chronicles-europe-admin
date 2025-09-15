-- Add alt text columns to portfolio_page table for accessibility
ALTER TABLE portfolio_page 
ADD COLUMN IF NOT EXISTS hero_background_image_alt TEXT,
ADD COLUMN IF NOT EXISTS portfolio_items_alt JSONB; -- Array of alt texts corresponding to portfolio items

-- Update the get_portfolio_page_data function to include the new alt text fields
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
            'backgroundImage', portfolio_record.hero_background_image,
            'backgroundImageAlt', portfolio_record.hero_background_image_alt
        ),
        'portfolio', json_build_object(
            'title', portfolio_record.portfolio_title,
            'subtitle', portfolio_record.portfolio_subtitle
        ),
        'items', portfolio_record.portfolio_items,
        'itemsAlt', portfolio_record.portfolio_items_alt,
        'seo', json_build_object(
            'title', portfolio_record.seo_title,
            'description', portfolio_record.seo_description,
            'keywords', portfolio_record.seo_keywords
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;