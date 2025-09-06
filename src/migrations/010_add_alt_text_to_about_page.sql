-- Migration to add alt text fields for images in about_page table

-- Add alt text columns for images
ALTER TABLE about_page 
ADD COLUMN hero_background_image_alt TEXT;

ALTER TABLE about_page 
ADD COLUMN team_image_alt TEXT;

-- Note: For services, alt texts are stored within the JSONB array itself
-- No need for a separate column as they are part of the existing services JSONB field

-- Update the get_about_page_data function to include alt text fields
CREATE OR REPLACE FUNCTION get_about_page_data()
RETURNS JSON AS $$
DECLARE
    about_record RECORD;
    result JSON;
BEGIN
    -- Get the single active about page record
    SELECT * INTO about_record
    FROM about_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', about_record.meta_title,
            'description', about_record.meta_description,
            'keywords', about_record.meta_keywords
        ),
        'hero', json_build_object(
            'id', 'hero-1',
            'title', about_record.hero_title,
            'backgroundImage', about_record.hero_background_image,
            'backgroundImageAlt', about_record.hero_background_image_alt
        ),
        'companyInfo', json_build_object(
            'id', 'company-info-1',
            'yearsInBusiness', about_record.company_years_in_business,
            'yearsLabel', about_record.company_years_label,
            'whoWeAreTitle', about_record.company_who_we_are_title,
            'description', about_record.company_description,
            'quotes', about_record.company_quotes
        ),
        'factsSection', json_build_object(
            'id', 'facts-1',
            'title', about_record.facts_title,
            'description', about_record.facts_description
        ),
        'companyStats', about_record.company_stats,
        'teamInfo', json_build_object(
            'id', 'team-info-1',
            'title', about_record.team_title,
            'description', about_record.team_description,
            'teamImage', about_record.team_image,
            'teamImageAlt', about_record.team_image_alt
        ),
        'services', about_record.services
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the update_about_section function to handle alt text fields
CREATE OR REPLACE FUNCTION update_about_section(
    section_name TEXT,
    section_data JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    about_id UUID;
BEGIN
    -- Get the about page ID
    SELECT id INTO about_id FROM about_page WHERE is_active = true LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Update based on section name
    CASE section_name
        WHEN 'meta' THEN
            UPDATE about_page SET 
                meta_title = section_data->>'title',
                meta_description = section_data->>'description',
                meta_keywords = section_data->>'keywords'
            WHERE id = about_id;
            
        WHEN 'hero' THEN
            UPDATE about_page SET 
                hero_title = section_data->>'title',
                hero_background_image = section_data->>'backgroundImage',
                hero_background_image_alt = section_data->>'backgroundImageAlt'
            WHERE id = about_id;
            
        WHEN 'companyInfo' THEN
            UPDATE about_page SET 
                company_years_in_business = section_data->>'yearsInBusiness',
                company_years_label = section_data->>'yearsLabel',
                company_who_we_are_title = section_data->>'whoWeAreTitle',
                company_description = section_data->>'description',
                company_quotes = section_data->'quotes'
            WHERE id = about_id;
            
        WHEN 'factsSection' THEN
            UPDATE about_page SET 
                facts_title = section_data->>'title',
                facts_description = section_data->>'description'
            WHERE id = about_id;
            
        WHEN 'companyStats' THEN
            UPDATE about_page SET 
                company_stats = section_data
            WHERE id = about_id;
            
        WHEN 'teamInfo' THEN
            UPDATE about_page SET 
                team_title = section_data->>'title',
                team_description = section_data->>'description',
                team_image = section_data->>'teamImage',
                team_image_alt = section_data->>'teamImageAlt'
            WHERE id = about_id;
            
        WHEN 'services' THEN
            UPDATE about_page SET 
                services = section_data
            WHERE id = about_id;
            
        ELSE
            RETURN FALSE;
    END CASE;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;