-- Add alt text columns for images in home_page table
ALTER TABLE home_page 
ADD COLUMN hero_background_image_alt TEXT;

ALTER TABLE home_page 
ADD COLUMN exhibition_europe_booth_image_alt TEXT;

ALTER TABLE home_page 
ADD COLUMN solutions_items_alt JSONB; -- Array of alt texts for solution items

-- Update the get_home_page_data function to include alt text fields
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
                'htmlContent', home_record.exhibition_usa_html_content
            )
        ),
        'solutions', json_build_object(
            'title', home_record.solutions_title,
            'htmlContent', home_record.solutions_html_content,
            'items', home_record.solutions_items,
            'itemsAlt', home_record.solutions_items_alt
        ),
        'whyBest', json_build_object(
            'title', home_record.why_best_title,
            'subtitle', home_record.why_best_subtitle,
            'htmlContent', home_record.why_best_html_content
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the update_home_section function to handle alt text fields
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
                exhibition_usa_html_content = section_data->>'htmlContent'
            WHERE id = home_id;
            
        WHEN 'solutions' THEN
            UPDATE home_page SET 
                solutions_title = section_data->>'title',
                solutions_html_content = section_data->>'htmlContent',
                solutions_items = section_data->'items',
                solutions_items_alt = section_data->'itemsAlt'
            WHERE id = home_id;
            
        WHEN 'whyBest' THEN
            UPDATE home_page SET 
                why_best_title = section_data->>'title',
                why_best_subtitle = section_data->>'subtitle',
                why_best_html_content = section_data->>'htmlContent'
            WHERE id = home_id;
            
        ELSE
            RETURN FALSE;
    END CASE;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;