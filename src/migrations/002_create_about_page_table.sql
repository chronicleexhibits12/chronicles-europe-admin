-- Create comprehensive about_page table with detailed columns for all sections
CREATE TABLE about_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Meta Information
  meta_title TEXT DEFAULT 'About Us - Exhibition Stand Builder Europe | RADON SP. Z.O.O.',
  meta_description TEXT DEFAULT 'Learn about RADON SP. Z.O.O., leading exhibition stand builder in Europe with 20+ years experience. Discover our team, services, and success stories.',
  meta_keywords TEXT DEFAULT 'about us, exhibition stand builder, Europe, RADON, team, experience, services',
  
  -- Hero Section
  hero_title TEXT,
  hero_background_image TEXT,
  
  -- Company Info Section
  company_years_in_business TEXT,
  company_years_label TEXT,
  company_who_we_are_title TEXT,
  company_description TEXT,
  company_quotes TEXT[],
  
  -- Facts Section
  facts_title TEXT,
  facts_description TEXT,
  
  -- Company Stats (stored as JSONB array)
  company_stats JSONB,
  
  -- Team Info Section
  team_title TEXT,
  team_description TEXT,
  team_image TEXT,
  
  -- Services (stored as JSONB array)
  services JSONB,
  
  -- Status and Timestamps
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert single comprehensive about page record
INSERT INTO about_page (
  -- Meta Information
  meta_title,
  meta_description,
  meta_keywords,
  
  -- Hero Section Data
  hero_title,
  hero_background_image,
  
  -- Company Info Section Data
  company_years_in_business,
  company_years_label,
  company_who_we_are_title,
  company_description,
  company_quotes,
  
  -- Facts Section Data
  facts_title,
  facts_description,
  
  -- Company Stats Data
  company_stats,
  
  -- Team Info Section Data
  team_title,
  team_description,
  team_image,
  
  -- Services Data
  services,
  
  is_active
) VALUES (
  -- Meta Information
  'About Us - Exhibition Stand Builder Europe | RADON SP. Z.O.O.',
  'Learn about RADON SP. Z.O.O., leading exhibition stand builder in Europe with 20+ years experience. Discover our team, services, and success stories.',
  'about us, exhibition stand builder, Europe, RADON, team, experience, services',
  
  -- Hero Section
  'ABOUT US',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=800&fit=crop&crop=center',
  
  -- Company Info Section
  '25+',
  'YEARS',
  'WHO WE ARE?',
  'RADON SP. Z.O.O. is one of the leading Exhibition stand builder in Europe. For last 20 years we have been serving industries in participating in Exhibitions and empowering company''s brand image. Our team of experts are specialized in creating hassle-free creative stand designs for Exhibitions across Germany & Europe.<br/><br/>RADON SP. Z.O.O. is one of the leading Exhibition stand builder in Europe. For last 20 years we have been serving industries in participating in Exhibitions and empowering company''s brand image. Our team of experts are specialized in creating hassle-free creative stand designs for Exhibitions across Germany & Europe.',
  ARRAY['Our service is available at single point of contact, hence no third-party involvement.', 'We are global exhibition stand design manufacturer. Explore the boundless creative opportunities with us.'],
  
  -- Facts Section
  'FACT & FIGURES!',
  'Some facts about us is worth mentioning here before you choose our solution. Our designing teams are committed to provide you a range of creative solutions to stand out in Exhibition and encourage maximum engagement during show.',
  
  -- Company Stats
  '[{
      "id": "stat-1",
      "value": 20,
      "label": "YEAR IN INDUSTRY",
      "description": "Years of expertise",
      "icon": "✓",
      "order": 1
    },
    {
      "id": "stat-2",
      "value": 4650,
      "label": "PROJECTS WORLDWIDE",
      "description": "Successful projects",
      "icon": "★",
      "order": 2
    },
    {
      "id": "stat-3",
      "value": 1000,
      "label": "HAPPY CLIENTS",
      "description": "Satisfied customers",
      "icon": "👤",
      "order": 3
    },
    {
      "id": "stat-4",
      "value": 1121,
      "label": "TRADE SHOW WORLDWIDE",
      "description": "Combined team experience",
      "icon": "🌍",
      "order": 4
    }
  ]'::jsonb,
  
  -- Team Info Section
  'MEET OUR TEAM',
  'Our team is the backbone of our success and outstanding outcomes. We serves best and that happy and celebrated when we accomplish your Exhibition goal. For us, satisfaction comes with client''s success.',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&crop=faces',
  
  -- Services
  '[{
      "id": "service-1",
      "title": "MARKETING EXPERTS",
      "description": "The sales and marketing team is responsible for sending the right message to prospects who are involved in the decision-making process within the target company. They track market developments, create strategies, set up sales plans, and maintain customer relations.",
      "image": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop&crop=center",
      "isReversed": true,
      "order": 1
    },
    {
      "id": "service-2",
      "title": "PROJECT MANAGEMENT",
      "description": "This department Plans and use the company''s resources, tools & techniques for the specific task, event. They create a timeline and plan for every assignment. They also ensure that the given assignment is completed within time frame without compromising on quality.",
      "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face",
      "isReversed": false,
      "order": 2
    },
    {
      "id": "service-3",
      "title": "DESIGN AND PLANNING",
      "description": "The effect of CAD and 3D MAX technology and the designing skills of our creative team of designers brings creativity.",
      "image": "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=600&fit=crop&crop=center",
      "isReversed": true,
      "order": 3
    },
    {
      "id": "service-4",
      "title": "FABRICATION AND INSTALLATION",
      "description": "Implementation is the step-wise process of putting a decision into action and our experts provide the hassle-free installation with perfection.",
      "image": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop&crop=center",
      "isReversed": false,
      "order": 4
    },
    {
      "id": "service-5",
      "title": "LOGISTICS",
      "description": "Our Logistic department is one of the strong factor of Radon sp. z.o.o. A huge manufacturing plant in Poland and our worldwide presence makes all operations very smooth and easy from carrying to transporting to the final venue. We have a massive storage area to store all components.",
      "image": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=600&fit=crop&crop=center",
      "isReversed": true,
      "order": 5
    }
  ]'::jsonb,
  
  true
);

-- Create storage bucket for about page images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'about-images',
  'about-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Enable Row Level Security (RLS)
ALTER TABLE about_page ENABLE ROW LEVEL SECURITY;

-- Policies for about_page table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active about page content" ON about_page
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all about page content" ON about_page
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert about page content" ON about_page
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update about page content" ON about_page
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete about page content" ON about_page
FOR DELETE TO authenticated
USING (true);

-- Storage policies for about-images bucket
-- Allow public read access to about images
CREATE POLICY "Allow public read access to about images" ON storage.objects
FOR SELECT USING (bucket_id = 'about-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload about images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'about-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Allow authenticated users to update about images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'about-images')
WITH CHECK (bucket_id = 'about-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete about images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'about-images');

-- Create indexes for better performance
CREATE INDEX idx_about_page_is_active ON about_page(is_active);
CREATE INDEX idx_about_page_created_at ON about_page(created_at);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_about_page_updated_at 
BEFORE UPDATE ON about_page 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get about page data in structured format (single row)
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
            'backgroundImage', about_record.hero_background_image
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
            'teamImage', about_record.team_image
        ),
        'services', about_record.services
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to update specific sections (for admin use)
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
                hero_background_image = section_data->>'backgroundImage'
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
                team_image = section_data->>'teamImage'
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