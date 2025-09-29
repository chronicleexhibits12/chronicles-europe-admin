-- Migration to add alt text fields for images in modular_stands_page and double_decker_stands_page tables

-- Add alt text columns for images in modular_stands_page
ALTER TABLE modular_stands_page 
ADD COLUMN hero_background_image_alt TEXT,
ADD COLUMN benefits_image_alt TEXT,
ADD COLUMN exhibition_benefits_image_alt TEXT;

-- Add alt text columns for images in double_decker_stands_page
ALTER TABLE double_decker_stands_page 
ADD COLUMN hero_background_image_alt TEXT,
ADD COLUMN benefits_image_alt TEXT,
ADD COLUMN exhibition_benefits_image_alt TEXT;

-- Update the get_modular_stands_page_data function to include alt text fields
CREATE OR REPLACE FUNCTION get_modular_stands_page_data()
RETURNS JSON AS $$
DECLARE
    modular_stands_record RECORD;
    result JSON;
BEGIN
    -- Get the single active modular stands page record
    SELECT * INTO modular_stands_record
    FROM modular_stands_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', modular_stands_record.meta_title,
            'description', modular_stands_record.meta_description
        ),
        'hero', json_build_object(
            'title', modular_stands_record.hero_title,
            'subtitle', modular_stands_record.hero_subtitle,
            'backgroundImage', modular_stands_record.hero_background_image,
            'backgroundImageAlt', modular_stands_record.hero_background_image_alt,
            'buttonTitle', modular_stands_record.hero_button_title
        ),
        'benefits', json_build_object(
            'title', modular_stands_record.benefits_title,
            'content', modular_stands_record.benefits_content,
            'image', modular_stands_record.benefits_image,
            'imageAlt', modular_stands_record.benefits_image_alt
        ),
        'pointsTable', json_build_object(
            'title', modular_stands_record.points_table_title,
            'content', modular_stands_record.points_table_content
        ),
        'StandProjectText', json_build_object(
            'title', modular_stands_record.stand_project_title,
            'highlight', modular_stands_record.stand_project_highlight,
            'description', modular_stands_record.stand_project_description
        ),
        'exhibitionBenefits', json_build_object(
            'title', modular_stands_record.exhibition_benefits_title,
            'subtitle', modular_stands_record.exhibition_benefits_subtitle,
            'content', modular_stands_record.exhibition_benefits_content,
            'image', modular_stands_record.exhibition_benefits_image,
            'imageAlt', modular_stands_record.exhibition_benefits_image_alt
        ),
        'modularDiversity', json_build_object(
            'title', modular_stands_record.modular_diversity_title,
            'subtitle', modular_stands_record.modular_diversity_subtitle,
            'content', modular_stands_record.modular_diversity_content
        ),
        'fastestConstruction', json_build_object(
            'title', modular_stands_record.fastest_construction_title,
            'subtitle', modular_stands_record.fastest_construction_subtitle,
            'description', modular_stands_record.fastest_construction_description
        ),
        'experts', json_build_object(
            'title', modular_stands_record.experts_title,
            'subtitle', modular_stands_record.experts_subtitle,
            'description', modular_stands_record.experts_description
        ),
        'portfolio', json_build_object(
            'title', modular_stands_record.portfolio_section_title,
            'subtitle', modular_stands_record.portfolio_section_subtitle,
            'ctaText', modular_stands_record.portfolio_section_cta_text,
            'ctaLink', modular_stands_record.portfolio_section_cta_link
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the update_modular_stands_page function to handle alt text fields
CREATE OR REPLACE FUNCTION update_modular_stands_page(
    page_id UUID,
    page_data JSONB
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Update the modular stands page with the provided data
    UPDATE modular_stands_page SET
        meta_title = COALESCE(page_data->'meta'->>'title', meta_title),
        meta_description = COALESCE(page_data->'meta'->>'description', meta_description),
        hero_title = COALESCE(page_data->'hero'->>'title', hero_title),
        hero_subtitle = COALESCE(page_data->'hero'->>'subtitle', hero_subtitle),
        hero_background_image = COALESCE(page_data->'hero'->>'backgroundImage', hero_background_image),
        hero_background_image_alt = COALESCE(page_data->'hero'->>'backgroundImageAlt', hero_background_image_alt),
        hero_button_title = COALESCE(page_data->'hero'->>'buttonTitle', hero_button_title),
        benefits_title = COALESCE(page_data->'benefits'->>'title', benefits_title),
        benefits_content = COALESCE(page_data->'benefits'->>'content', benefits_content),
        benefits_image = COALESCE(page_data->'benefits'->>'image', benefits_image),
        benefits_image_alt = COALESCE(page_data->'benefits'->>'imageAlt', benefits_image_alt),
        points_table_title = COALESCE(page_data->'pointsTable'->>'title', points_table_title),
        points_table_content = COALESCE(page_data->'pointsTable'->>'content', points_table_content),
        stand_project_title = COALESCE(page_data->'StandProjectText'->>'title', stand_project_title),
        stand_project_highlight = COALESCE(page_data->'StandProjectText'->>'highlight', stand_project_highlight),
        stand_project_description = COALESCE(page_data->'StandProjectText'->>'description', stand_project_description),
        exhibition_benefits_title = COALESCE(page_data->'exhibitionBenefits'->>'title', exhibition_benefits_title),
        exhibition_benefits_subtitle = COALESCE(page_data->'exhibitionBenefits'->>'subtitle', exhibition_benefits_subtitle),
        exhibition_benefits_content = COALESCE(page_data->'exhibitionBenefits'->>'content', exhibition_benefits_content),
        exhibition_benefits_image = COALESCE(page_data->'exhibitionBenefits'->>'image', exhibition_benefits_image),
        exhibition_benefits_image_alt = COALESCE(page_data->'exhibitionBenefits'->>'imageAlt', exhibition_benefits_image_alt),
        modular_diversity_title = COALESCE(page_data->'modularDiversity'->>'title', modular_diversity_title),
        modular_diversity_subtitle = COALESCE(page_data->'modularDiversity'->>'subtitle', modular_diversity_subtitle),
        modular_diversity_content = COALESCE(page_data->'modularDiversity'->>'content', modular_diversity_content),
        fastest_construction_title = COALESCE(page_data->'fastestConstruction'->>'title', fastest_construction_title),
        fastest_construction_subtitle = COALESCE(page_data->'fastestConstruction'->>'subtitle', fastest_construction_subtitle),
        fastest_construction_description = COALESCE(page_data->'fastestConstruction'->>'description', fastest_construction_description),
        experts_title = COALESCE(page_data->'experts'->>'title', experts_title),
        experts_subtitle = COALESCE(page_data->'experts'->>'subtitle', experts_subtitle),
        experts_description = COALESCE(page_data->'experts'->>'description', experts_description),
        portfolio_section_title = COALESCE(page_data->'portfolio'->>'title', portfolio_section_title),
        portfolio_section_subtitle = COALESCE(page_data->'portfolio'->>'subtitle', portfolio_section_subtitle),
        portfolio_section_cta_text = COALESCE(page_data->'portfolio'->>'ctaText', portfolio_section_cta_text),
        portfolio_section_cta_link = '/portfolio', -- Fixed to /portfolio as requested
        updated_at = NOW()
    WHERE id = page_id;
    
    -- Return the updated data
    SELECT get_modular_stands_page_data() INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the get_double_decker_stands_page_data function to include alt text fields
CREATE OR REPLACE FUNCTION get_double_decker_stands_page_data()
RETURNS JSON AS $$
DECLARE
    double_decker_stands_record RECORD;
    result JSON;
BEGIN
    -- Get the single active double decker stands page record
    SELECT * INTO double_decker_stands_record
    FROM double_decker_stands_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', double_decker_stands_record.meta_title,
            'description', double_decker_stands_record.meta_description
        ),
        'hero', json_build_object(
            'title', double_decker_stands_record.hero_title,
            'subtitle', double_decker_stands_record.hero_subtitle,
            'backgroundImage', double_decker_stands_record.hero_background_image,
            'backgroundImageAlt', double_decker_stands_record.hero_background_image_alt,
            'buttonTitle', double_decker_stands_record.hero_button_title
        ),
        'benefits', json_build_object(
            'title', double_decker_stands_record.benefits_title,
            'image', double_decker_stands_record.benefits_image,
            'imageAlt', double_decker_stands_record.benefits_image_alt,
            'content', double_decker_stands_record.benefits_content
        ),
        'pointsTable', json_build_object(
            'title', double_decker_stands_record.points_table_title,
            'content', double_decker_stands_record.points_table_content
        ),
        'StandProjectText', json_build_object(
            'title', double_decker_stands_record.stand_project_title,
            'highlight', double_decker_stands_record.stand_project_highlight,
            'description', double_decker_stands_record.stand_project_description
        ),
        'exhibitionBenefits', json_build_object(
            'title', double_decker_stands_record.exhibition_benefits_title,
            'subtitle', double_decker_stands_record.exhibition_benefits_subtitle,
            'content', double_decker_stands_record.exhibition_benefits_content,
            'image', double_decker_stands_record.exhibition_benefits_image,
            'imageAlt', double_decker_stands_record.exhibition_benefits_image_alt
        ),
        'boothPartner', json_build_object(
            'title', double_decker_stands_record.booth_partner_title,
            'subtitle', double_decker_stands_record.booth_partner_subtitle,
            'description', double_decker_stands_record.booth_partner_description
        ),
        'boldStatement', json_build_object(
            'title', double_decker_stands_record.bold_statement_title,
            'subtitle', double_decker_stands_record.bold_statement_subtitle,
            'description', double_decker_stands_record.bold_statement_description
        ),
        'portfolio', json_build_object(
            'title', double_decker_stands_record.portfolio_section_title,
            'subtitle', double_decker_stands_record.portfolio_section_subtitle,
            'ctaText', double_decker_stands_record.portfolio_section_cta_text,
            'ctaLink', double_decker_stands_record.portfolio_section_cta_link
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the update_double_decker_stands_page function to handle alt text fields
CREATE OR REPLACE FUNCTION update_double_decker_stands_page(
    page_id UUID,
    page_data JSONB
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Update the double decker stands page with the provided data
    UPDATE double_decker_stands_page SET
        meta_title = COALESCE(page_data->'meta'->>'title', meta_title),
        meta_description = COALESCE(page_data->'meta'->>'description', meta_description),
        hero_title = COALESCE(page_data->'hero'->>'title', hero_title),
        hero_subtitle = COALESCE(page_data->'hero'->>'subtitle', hero_subtitle),
        hero_background_image = COALESCE(page_data->'hero'->>'backgroundImage', hero_background_image),
        hero_background_image_alt = COALESCE(page_data->'hero'->>'backgroundImageAlt', hero_background_image_alt),
        hero_button_title = COALESCE(page_data->'hero'->>'buttonTitle', hero_button_title),
        benefits_title = COALESCE(page_data->'benefits'->>'title', benefits_title),
        benefits_image = COALESCE(page_data->'benefits'->>'image', benefits_image),
        benefits_image_alt = COALESCE(page_data->'benefits'->>'imageAlt', benefits_image_alt),
        benefits_content = COALESCE(page_data->'benefits'->>'content', benefits_content),
        points_table_title = COALESCE(page_data->'pointsTable'->>'title', points_table_title),
        points_table_content = COALESCE(page_data->'pointsTable'->>'content', points_table_content),
        stand_project_title = COALESCE(page_data->'StandProjectText'->>'title', stand_project_title),
        stand_project_highlight = COALESCE(page_data->'StandProjectText'->>'highlight', stand_project_highlight),
        stand_project_description = COALESCE(page_data->'StandProjectText'->>'description', stand_project_description),
        exhibition_benefits_title = COALESCE(page_data->'exhibitionBenefits'->>'title', exhibition_benefits_title),
        exhibition_benefits_subtitle = COALESCE(page_data->'exhibitionBenefits'->>'subtitle', exhibition_benefits_subtitle),
        exhibition_benefits_content = COALESCE(page_data->'exhibitionBenefits'->>'content', exhibition_benefits_content),
        exhibition_benefits_image = COALESCE(page_data->'exhibitionBenefits'->>'image', exhibition_benefits_image),
        exhibition_benefits_image_alt = COALESCE(page_data->'exhibitionBenefits'->>'imageAlt', exhibition_benefits_image_alt),
        booth_partner_title = COALESCE(page_data->'boothPartner'->>'title', booth_partner_title),
        booth_partner_subtitle = COALESCE(page_data->'boothPartner'->>'subtitle', booth_partner_subtitle),
        booth_partner_description = COALESCE(page_data->'boothPartner'->>'description', booth_partner_description),
        bold_statement_title = COALESCE(page_data->'boldStatement'->>'title', bold_statement_title),
        bold_statement_subtitle = COALESCE(page_data->'boldStatement'->>'subtitle', bold_statement_subtitle),
        bold_statement_description = COALESCE(page_data->'boldStatement'->>'description', bold_statement_description),
        portfolio_section_title = COALESCE(page_data->'portfolio'->>'title', portfolio_section_title),
        portfolio_section_subtitle = COALESCE(page_data->'portfolio'->>'subtitle', portfolio_section_subtitle),
        portfolio_section_cta_text = COALESCE(page_data->'portfolio'->>'ctaText', portfolio_section_cta_text),
        portfolio_section_cta_link = '/portfolio', -- Fixed to /portfolio as requested
        updated_at = NOW()
    WHERE id = page_id;
    
    -- Return the updated data
    SELECT get_double_decker_stands_page_data() INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;