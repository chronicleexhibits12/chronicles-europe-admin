-- Add process_section_subtitle_html column to countries table
ALTER TABLE countries 
ADD COLUMN IF NOT EXISTS process_section_subtitle_html TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN countries.process_section_subtitle_html IS 'HTML content for the subtitle in the Process Section of the country page';

-- Update existing countries with sample subtitle content for France
UPDATE countries 
SET process_section_subtitle_html = '<p>Our proven 6-step process ensures seamless exhibition stand design and construction in France, from initial concept to post-show support.</p><p>Each step is carefully executed by our experienced team to deliver exceptional results that exceed your expectations.</p>'
WHERE slug = 'france' AND process_section_subtitle_html IS NULL;

-- Update existing countries with sample subtitle content for Germany
UPDATE countries 
SET process_section_subtitle_html = '<p>Our streamlined 6-step approach guarantees successful exhibition stand execution in Germany, covering everything from design to dismantling.</p><p>With deep understanding of German trade show requirements, we deliver stands that make lasting impressions.</p>'
WHERE slug = 'germany' AND process_section_subtitle_html IS NULL;

-- Update any other existing countries with default content
UPDATE countries 
SET process_section_subtitle_html = '<p>Our comprehensive 6-step process ensures your exhibition stand is designed and built to the highest standards, delivering exceptional results that showcase your brand effectively.</p><p>Each phase is meticulously planned and executed by our expert team to guarantee success at your trade show.</p>'
WHERE process_section_subtitle_html IS NULL;