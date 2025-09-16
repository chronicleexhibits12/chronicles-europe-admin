-- Add portfolio title, description, and CTA fields to pavilion_design_page table
ALTER TABLE pavilion_design_page 
ADD COLUMN portfolio_section_title TEXT,
ADD COLUMN portfolio_section_subtitle TEXT,
ADD COLUMN portfolio_section_cta_text TEXT,
ADD COLUMN portfolio_section_cta_link TEXT,
-- Add hero section button title field
ADD COLUMN hero_button_title TEXT;

-- Update existing pavilion design record with default portfolio section values
UPDATE pavilion_design_page 
SET 
  portfolio_section_title = 'OUR PORTFOLIO',
  portfolio_section_subtitle = 'Explore our extensive portfolio of exhibition stands and discover the quality and creativity we bring to every project.',
  portfolio_section_cta_text = 'View All Projects',
  portfolio_section_cta_link = '/portfolio',
  hero_button_title = 'REQUEST FOR QUOTATION'
WHERE portfolio_section_title IS NULL;

-- Create or replace function to get pavilion design page data in structured format (single row)
CREATE OR REPLACE FUNCTION get_pavilion_design_page_data()
RETURNS JSON AS $$
DECLARE
    pavilion_design_record RECORD;
    result JSON;
BEGIN
    -- Get the single active pavilion design page record
    SELECT * INTO pavilion_design_record
    FROM pavilion_design_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', pavilion_design_record.meta_title,
            'description', pavilion_design_record.meta_description
        ),
        'hero', json_build_object(
            'title', pavilion_design_record.hero_title,
            'subtitle', pavilion_design_record.hero_subtitle,
            'backgroundImage', pavilion_design_record.hero_background_image,
            'buttonTitle', pavilion_design_record.hero_button_title
        ),
        'whyChoose', json_build_object(
            'title', pavilion_design_record.why_choose_title,
            'content', pavilion_design_record.why_choose_content
        ),
        'benefits', json_build_object(
            'title', pavilion_design_record.benefits_title,
            'image', pavilion_design_record.benefits_image,
            'content', pavilion_design_record.benefits_content
        ),
        'StandProjectText', json_build_object(
            'title', pavilion_design_record.stand_project_title,
            'highlight', pavilion_design_record.stand_project_highlight,
            'description', pavilion_design_record.stand_project_description
        ),
        'advantages', json_build_object(
            'title', pavilion_design_record.advantages_title,
            'image', pavilion_design_record.advantages_image,
            'content', pavilion_design_record.advantages_content
        ),
        'ourExpertise', json_build_object(
            'title', pavilion_design_record.our_expertise_title,
            'content', pavilion_design_record.our_expertise_content
        ),
        'companyInfo', json_build_object(
            'title', pavilion_design_record.company_info_title,
            'content', pavilion_design_record.company_info_content
        ),
        'portfolio', json_build_object(
            'title', pavilion_design_record.portfolio_section_title,
            'subtitle', pavilion_design_record.portfolio_section_subtitle,
            'ctaText', pavilion_design_record.portfolio_section_cta_text,
            'ctaLink', pavilion_design_record.portfolio_section_cta_link
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the update_pavilion_design_page function to handle the new portfolio fields
CREATE OR REPLACE FUNCTION update_pavilion_design_page(
    page_id UUID,
    page_data JSONB
)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Update the pavilion design page with the provided data
    UPDATE pavilion_design_page SET
        meta_title = COALESCE(page_data->'meta'->>'title', meta_title),
        meta_description = COALESCE(page_data->'meta'->>'description', meta_description),
        hero_title = COALESCE(page_data->'hero'->>'title', hero_title),
        hero_subtitle = COALESCE(page_data->'hero'->>'subtitle', hero_subtitle),
        hero_background_image = COALESCE(page_data->'hero'->>'backgroundImage', hero_background_image),
        hero_button_title = COALESCE(page_data->'hero'->>'buttonTitle', hero_button_title),
        why_choose_title = COALESCE(page_data->'whyChoose'->>'title', why_choose_title),
        why_choose_content = COALESCE(page_data->'whyChoose'->>'content', why_choose_content),
        benefits_title = COALESCE(page_data->'benefits'->>'title', benefits_title),
        benefits_image = COALESCE(page_data->'benefits'->>'image', benefits_image),
        benefits_content = COALESCE(page_data->'benefits'->>'content', benefits_content),
        stand_project_title = COALESCE(page_data->'StandProjectText'->>'title', stand_project_title),
        stand_project_highlight = COALESCE(page_data->'StandProjectText'->>'highlight', stand_project_highlight),
        stand_project_description = COALESCE(page_data->'StandProjectText'->>'description', stand_project_description),
        advantages_title = COALESCE(page_data->'advantages'->>'title', advantages_title),
        advantages_image = COALESCE(page_data->'advantages'->>'image', advantages_image),
        advantages_content = COALESCE(page_data->'advantages'->>'content', advantages_content),
        our_expertise_title = COALESCE(page_data->'ourExpertise'->>'title', our_expertise_title),
        our_expertise_content = COALESCE(page_data->'ourExpertise'->>'content', our_expertise_content),
        company_info_title = COALESCE(page_data->'companyInfo'->>'title', company_info_title),
        company_info_content = COALESCE(page_data->'companyInfo'->>'content', company_info_content),
        portfolio_section_title = COALESCE(page_data->'portfolio'->>'title', portfolio_section_title),
        portfolio_section_subtitle = COALESCE(page_data->'portfolio'->>'subtitle', portfolio_section_subtitle),
        portfolio_section_cta_text = COALESCE(page_data->'portfolio'->>'ctaText', portfolio_section_cta_text),
        portfolio_section_cta_link = '/portfolio', -- Fixed to /portfolio as requested
        updated_at = NOW()
    WHERE id = page_id;
    
    -- Return the updated data
    SELECT get_pavilion_design_page_data() INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;