-- Add portfolio and testimonials fields to home_page table
ALTER TABLE home_page 
ADD COLUMN portfolio_section_title TEXT,
ADD COLUMN portfolio_section_subtitle TEXT,
ADD COLUMN portfolio_section_cta_text TEXT,
ADD COLUMN portfolio_section_cta_link TEXT,
ADD COLUMN testimonials_section_title TEXT,
ADD COLUMN exhibition_usa_cta_text TEXT;

-- Update the existing home page record with default values
UPDATE home_page SET
  portfolio_section_title = 'OUR PORTFOLIO',
  portfolio_section_subtitle = 'Explore our extensive portfolio of exhibition stands and discover the quality and creativity we bring to every project.',
  portfolio_section_cta_text = 'View All Projects',
  portfolio_section_cta_link = '/portfolio',
  testimonials_section_title = 'OUR HAPPY CLIENTS',
  exhibition_usa_cta_text = 'Request Form'
WHERE is_active = true;

-- Update the get_home_page_data function to include the new fields
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
        'hero', json_build_object(
            'backgroundImage', home_record.hero_background_image
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
            'title', home_record.portfolio_section_title,
            'subtitle', home_record.portfolio_section_subtitle,
            'ctaText', home_record.portfolio_section_cta_text,
            'ctaLink', home_record.portfolio_section_cta_link
        ),
        'testimonialsSection', json_build_object(
            'title', home_record.testimonials_section_title
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the update_home_section function to handle the new sections
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
        WHEN 'hero' THEN
            UPDATE home_page SET 
                hero_background_image = section_data->>'backgroundImage'
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
                portfolio_section_title = section_data->>'title',
                portfolio_section_subtitle = section_data->>'subtitle',
                portfolio_section_cta_text = section_data->>'ctaText',
                portfolio_section_cta_link = section_data->>'ctaLink'
            WHERE id = home_id;
            
        WHEN 'testimonialsSection' THEN
            UPDATE home_page SET 
                testimonials_section_title = section_data->>'title'
            WHERE id = home_id;
            
        ELSE
            RETURN FALSE;
    END CASE;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;