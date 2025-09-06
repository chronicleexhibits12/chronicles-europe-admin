-- Migration to add alt text fields for images in custom_stands_page table

-- Add alt text columns for images
ALTER TABLE custom_stands_page 
ADD COLUMN hero_background_image_alt TEXT;

ALTER TABLE custom_stands_page 
ADD COLUMN benefits_image_alt TEXT;

ALTER TABLE custom_stands_page 
ADD COLUMN exhibition_benefits_image_alt TEXT;

-- Update the get_custom_stands_page_data function to include alt text fields
CREATE OR REPLACE FUNCTION get_custom_stands_page_data()
RETURNS JSON AS $$
DECLARE
    custom_stands_record RECORD;
    result JSON;
BEGIN
    -- Get the single active custom stands page record
    SELECT * INTO custom_stands_record
    FROM custom_stands_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', custom_stands_record.meta_title,
            'description', custom_stands_record.meta_description
        ),
        'hero', json_build_object(
            'title', custom_stands_record.hero_title,
            'subtitle', custom_stands_record.hero_subtitle,
            'backgroundImage', custom_stands_record.hero_background_image,
            'backgroundImageAlt', custom_stands_record.hero_background_image_alt
        ),
        'benefits', json_build_object(
            'title', custom_stands_record.benefits_title,
            'image', custom_stands_record.benefits_image,
            'imageAlt', custom_stands_record.benefits_image_alt,
            'content', custom_stands_record.benefits_content
        ),
        'StandProjectText', json_build_object(
            'title', custom_stands_record.stand_project_title,
            'highlight', custom_stands_record.stand_project_highlight,
            'description', custom_stands_record.stand_project_description
        ),
        'exhibitionBenefits', json_build_object(
            'title', custom_stands_record.exhibition_benefits_title,
            'subtitle', custom_stands_record.exhibition_benefits_subtitle,
            'content', custom_stands_record.exhibition_benefits_content,
            'image', custom_stands_record.exhibition_benefits_image,
            'imageAlt', custom_stands_record.exhibition_benefits_image_alt
        ),
        'bespoke', json_build_object(
            'title', custom_stands_record.bespoke_title,
            'subtitle', custom_stands_record.bespoke_subtitle,
            'description', custom_stands_record.bespoke_description
        ),
        'freshDesign', json_build_object(
            'title', custom_stands_record.fresh_design_title,
            'subtitle', custom_stands_record.fresh_design_subtitle,
            'description', custom_stands_record.fresh_design_description
        ),
        'costSection', json_build_object(
            'title', custom_stands_record.cost_section_title,
            'subtitle', custom_stands_record.cost_section_subtitle,
            'description', custom_stands_record.cost_section_description
        ),
        'pointsTable', json_build_object(
            'title', custom_stands_record.points_table_title,
            'content', custom_stands_record.points_table_content
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the update_custom_stands_page function to handle alt text fields
CREATE OR REPLACE FUNCTION update_custom_stands_page(
    page_id UUID,
    page_data JSONB
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Update the custom stands page with the provided data
    UPDATE custom_stands_page SET
        meta_title = COALESCE(page_data->'meta'->>'title', meta_title),
        meta_description = COALESCE(page_data->'meta'->>'description', meta_description),
        hero_title = COALESCE(page_data->'hero'->>'title', hero_title),
        hero_subtitle = COALESCE(page_data->'hero'->>'subtitle', hero_subtitle),
        hero_background_image = COALESCE(page_data->'hero'->>'backgroundImage', hero_background_image),
        hero_background_image_alt = COALESCE(page_data->'hero'->>'backgroundImageAlt', hero_background_image_alt),
        benefits_title = COALESCE(page_data->'benefits'->>'title', benefits_title),
        benefits_image = COALESCE(page_data->'benefits'->>'image', benefits_image),
        benefits_image_alt = COALESCE(page_data->'benefits'->>'imageAlt', benefits_image_alt),
        benefits_content = COALESCE(page_data->'benefits'->>'content', benefits_content),
        stand_project_title = COALESCE(page_data->'StandProjectText'->>'title', stand_project_title),
        stand_project_highlight = COALESCE(page_data->'StandProjectText'->>'highlight', stand_project_highlight),
        stand_project_description = COALESCE(page_data->'StandProjectText'->>'description', stand_project_description),
        exhibition_benefits_title = COALESCE(page_data->'exhibitionBenefits'->>'title', exhibition_benefits_title),
        exhibition_benefits_subtitle = COALESCE(page_data->'exhibitionBenefits'->>'subtitle', exhibition_benefits_subtitle),
        exhibition_benefits_content = COALESCE(page_data->'exhibitionBenefits'->>'content', exhibition_benefits_content),
        exhibition_benefits_image = COALESCE(page_data->'exhibitionBenefits'->>'image', exhibition_benefits_image),
        exhibition_benefits_image_alt = COALESCE(page_data->'exhibitionBenefits'->>'imageAlt', exhibition_benefits_image_alt),
        bespoke_title = COALESCE(page_data->'bespoke'->>'title', bespoke_title),
        bespoke_subtitle = COALESCE(page_data->'bespoke'->>'subtitle', bespoke_subtitle),
        bespoke_description = COALESCE(page_data->'bespoke'->>'description', bespoke_description),
        fresh_design_title = COALESCE(page_data->'freshDesign'->>'title', fresh_design_title),
        fresh_design_subtitle = COALESCE(page_data->'freshDesign'->>'subtitle', fresh_design_subtitle),
        fresh_design_description = COALESCE(page_data->'freshDesign'->>'description', fresh_design_description),
        cost_section_title = COALESCE(page_data->'costSection'->>'title', cost_section_title),
        cost_section_subtitle = COALESCE(page_data->'costSection'->>'subtitle', cost_section_subtitle),
        cost_section_description = COALESCE(page_data->'costSection'->>'description', cost_section_description),
        points_table_title = COALESCE(page_data->'pointsTable'->>'title', points_table_title),
        points_table_content = COALESCE(page_data->'pointsTable'->>'content', points_table_content),
        updated_at = NOW()
    WHERE id = page_id;
    
    -- Return the updated data
    SELECT get_custom_stands_page_data() INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;