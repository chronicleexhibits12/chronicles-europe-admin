-- Add SEO fields to home_page table
ALTER TABLE home_page 
ADD COLUMN IF NOT EXISTS meta_title TEXT DEFAULT 'Home - Exhibition Stand Builder Europe | RADON SP. Z.O.O.',
ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT 'Leading exhibition stand builder in Europe and USA with 20+ years experience. Custom, modular, and double decker stands for trade shows.',
ADD COLUMN IF NOT EXISTS meta_keywords TEXT DEFAULT 'exhibition stand builder, trade show booth, custom stands, modular stands, double decker stands, Europe, USA';

-- Update the existing record with default SEO values
UPDATE home_page 
SET 
  meta_title = 'Home - Exhibition Stand Builder Europe | RADON SP. Z.O.O.',
  meta_description = 'Leading exhibition stand builder in Europe and USA with 20+ years experience. Custom, modular, and double decker stands for trade shows.',
  meta_keywords = 'exhibition stand builder, trade show booth, custom stands, modular stands, double decker stands, Europe, USA'
WHERE meta_title IS NULL;

-- Update the get_home_page_data function to include SEO fields
CREATE OR REPLACE FUNCTION get_home_page_data()
RETURNS JSON AS $$
DECLARE
    home_record RECORD;
    result JSON;
BEGIN
    -- Get the single active home page record
    SELECT * INTO home_record
    FROM home_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', home_record.meta_title,
            'description', home_record.meta_description,
            'keywords', home_record.meta_keywords
        ),
        'hero', json_build_object(
            'backgroundImage', home_record.hero_background_image,
            'backgroundImageAlt', home_record.hero_background_image_alt
        ),
        'mainSection', json_build_object(
            'title', home_record.main_title,
            'subtitle', home_record.main_subtitle,
            'htmlContent', home_record.main_html_content
        ),
        'exhibitionData', json_build_object(
            'europe', json_build_object(
                'title', home_record.exhibition_europe_title,
                'subtitle', home_record.exhibition_europe_subtitle,
                'boothImage', home_record.exhibition_europe_booth_image,
                'boothImageAlt', home_record.exhibition_europe_booth_image_alt,
                'htmlContent', home_record.exhibition_europe_html_content
            ),
            'usa', json_build_object(
                'title', home_record.exhibition_usa_title,
                'htmlContent', home_record.exhibition_usa_html_content,
                'ctaText', home_record.exhibition_usa_cta_text
            )
        ),
        'solutions', json_build_object(
            'title', home_record.solutions_title,
            'htmlContent', home_record.solutions_html_content,
            'items', home_record.solutions_items
        ),
        'whyBest', json_build_object(
            'title', home_record.why_best_title,
            'subtitle', home_record.why_best_subtitle,
            'htmlContent', home_record.why_best_html_content
        ),
        'portfolioSection', json_build_object(
            'title', home_record.portfolio_title,
            'subtitle', home_record.portfolio_subtitle,
            'ctaText', home_record.portfolio_cta_text,
            'ctaLink', home_record.portfolio_cta_link
        ),
        'testimonialsSection', json_build_object(
            'title', home_record.testimonials_title
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the update_home_section function to handle SEO fields
CREATE OR REPLACE FUNCTION update_home_section(
    section_name TEXT,
    section_data JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    update_sql TEXT;
    home_id UUID;
BEGIN
    -- Get the home page ID
    SELECT id INTO home_id FROM home_page WHERE is_active = true LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Update based on section name
    CASE section_name
        WHEN 'meta' THEN
            UPDATE home_page SET 
                meta_title = section_data->>'title',
                meta_description = section_data->>'description',
                meta_keywords = section_data->>'keywords'
            WHERE id = home_id;
            
        WHEN 'hero' THEN
            UPDATE home_page SET 
                hero_background_image = section_data->>'backgroundImage',
                hero_background_image_alt = section_data->>'backgroundImageAlt'
            WHERE id = home_id;
            
        WHEN 'mainSection' THEN
            UPDATE home_page SET 
                main_title = section_data->>'title',
                main_subtitle = section_data->>'subtitle',
                main_html_content = section_data->>'htmlContent'
            WHERE id = home_id;
            
        WHEN 'exhibitionEurope' THEN
            UPDATE home_page SET 
                exhibition_europe_title = section_data->>'title',
                exhibition_europe_subtitle = section_data->>'subtitle',
                exhibition_europe_booth_image = section_data->>'boothImage',
                exhibition_europe_booth_image_alt = section_data->>'boothImageAlt',
                exhibition_europe_html_content = section_data->>'htmlContent'
            WHERE id = home_id;
            
        WHEN 'exhibitionUsa' THEN
            UPDATE home_page SET 
                exhibition_usa_title = section_data->>'title',
                exhibition_usa_html_content = section_data->>'htmlContent',
                exhibition_usa_cta_text = section_data->>'ctaText'
            WHERE id = home_id;
            
        WHEN 'solutions' THEN
            UPDATE home_page SET 
                solutions_title = section_data->>'title',
                solutions_html_content = section_data->>'htmlContent',
                solutions_items = section_data->'items'
            WHERE id = home_id;
            
        WHEN 'whyBest' THEN
            UPDATE home_page SET 
                why_best_title = section_data->>'title',
                why_best_subtitle = section_data->>'subtitle',
                why_best_html_content = section_data->>'htmlContent'
            WHERE id = home_id;
            
        WHEN 'portfolioSection' THEN
            UPDATE home_page SET 
                portfolio_title = section_data->>'title',
                portfolio_subtitle = section_data->>'subtitle',
                portfolio_cta_text = section_data->>'ctaText',
                portfolio_cta_link = section_data->>'ctaLink'
            WHERE id = home_id;
            
        WHEN 'testimonialsSection' THEN
            UPDATE home_page SET 
                testimonials_title = section_data->>'title'
            WHERE id = home_id;
            
        ELSE
            RETURN FALSE;
    END CASE;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;