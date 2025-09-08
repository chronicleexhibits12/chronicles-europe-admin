-- Create comprehensive services table with all page content in a single table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Meta Information for SEO
  meta_title TEXT DEFAULT 'Our Services - Exhibition Stand Solutions | RADON SP. Z.O.O.',
  meta_description TEXT DEFAULT 'Discover our comprehensive range of exhibition stand services including design, construction, installation, and project management across Europe.',
  meta_keywords TEXT DEFAULT 'exhibition services, stand design, booth construction, trade show services, project management, Europe',
  
  -- Hero Section
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_background_image TEXT,
  hero_background_image_alt TEXT DEFAULT 'Services header image',
  
  -- Intro Section
  intro_title TEXT,
  intro_description TEXT,
  
  -- Individual Service Fields (for when is_service = true)
  service_title TEXT,
  service_description_html TEXT, -- HTML content for rich formatting
  is_service BOOLEAN DEFAULT false, -- Flag to distinguish page content from service entries
  
  -- Status and Timestamps
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert single comprehensive services page record
INSERT INTO services (
  -- Meta Information
  meta_title,
  meta_description,
  meta_keywords,
  
  -- Hero Section Data
  hero_title,
  hero_subtitle,
  hero_background_image,
  hero_background_image_alt,
  
  -- Intro Section Data
  intro_title,
  intro_description,
  
  -- Service flags
  is_service,
  is_active
) VALUES (
  -- Meta Information
  'Our Services - Exhibition Stand Solutions | RADON SP. Z.O.O.',
  'Discover our comprehensive range of exhibition stand services including design, construction, installation, and project management across Europe.',
  'exhibition services, stand design, booth construction, trade show services, project management, Europe',
  
  -- Hero Section
  'OUR SERVICES',
  'PROFESSIONAL EXHIBITION SOLUTIONS',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
  'Services header image',
  
  -- Intro Section
  'Our Services',
  '<p>Our vast range of capabilities and allegiance to innovation allow us to tailor and execute custom booths suited to specific business goals.</p>',
  
  -- Service flags
  false,
  true
);

-- Insert individual service records with HTML content
INSERT INTO services (service_title, service_description_html, is_service, is_active) 
VALUES 
('Graphic Production', '<p>We have digital graphic specialists who are adept at figuring out the best way to design the imagery for your brands stall so that all.</p>', true, true),
('Project Management', '<p>All of our project managers are skilled in using the leading project management systems to ensure that your event goes without a hitch. They are also adept.</p>', true, true),
('Installation, Dismantle & Shipping', '<p>From setting up your booth to taking it down without any hassles, let our dedicated team of professionals take care of the transportation, storage.</p>', true, true),
('Trade Show Booth Design', '<p>The trade show booth is where your concept comes to life, so we arrange a wide array of different booth sizes that you can choose from.</p>', true, true),
('Booth Construction & Custom Fabrication', '<p>When clients have precise requirements and a detailed brief to be followed to the T, booth construction and.</p>', true, true),
('On Site Supervision', '<p>We offer you on site supervision and storage for your booth and equipment so that you can remain hassle free and only worry about pulling off a great presentation.</p>', true, true);

-- Create storage bucket for services images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'services-images',
  'services-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Enable Row Level Security (RLS)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policies for services table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active services content" ON services
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all services content" ON services
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert services content" ON services
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update services content" ON services
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete services content" ON services
FOR DELETE TO authenticated
USING (true);

-- Storage policies for services-images bucket
-- Allow public read access to services images
CREATE POLICY "Allow public read access to services images" ON storage.objects
FOR SELECT USING (bucket_id = 'services-images');

-- Allow authenticated users to upload services images
CREATE POLICY "Allow authenticated users to upload services images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'services-images');

-- Allow authenticated users to update their uploaded services images
CREATE POLICY "Allow authenticated users to update services images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'services-images')
WITH CHECK (bucket_id = 'services-images');

-- Allow authenticated users to delete services images
CREATE POLICY "Allow authenticated users to delete services images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'services-images');

-- Create indexes for better performance
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_services_created_at ON services(created_at);
CREATE INDEX idx_services_is_service ON services(is_service);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_services_updated_at 
BEFORE UPDATE ON services 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get services page data in structured format (single row)
CREATE OR REPLACE FUNCTION get_services_page_data()
RETURNS JSON AS $$
DECLARE
    page_record RECORD;
    services_array JSON;
    result JSON;
BEGIN
    -- Get the single active page record (where is_service = false)
    SELECT * INTO page_record
    FROM services 
    WHERE is_active = true AND is_service = false
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Get active services (where is_service = true)
    SELECT json_agg(
        json_build_object(
            'id', s.id,
            'title', s.service_title,
            'descriptionHtml', s.service_description_html
        ) ORDER BY s.created_at
    ) INTO services_array
    FROM services s
    WHERE s.is_active = true AND s.is_service = true;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', page_record.meta_title,
            'description', page_record.meta_description,
            'keywords', page_record.meta_keywords
        ),
        'hero', json_build_object(
            'title', page_record.hero_title,
            'subtitle', page_record.hero_subtitle,
            'backgroundImage', page_record.hero_background_image,
            'backgroundImageAlt', page_record.hero_background_image_alt
        ),
        'intro', json_build_object(
            'title', page_record.intro_title,
            'descriptionHtml', page_record.intro_description
        ),
        'services', COALESCE(services_array, '[]'::json)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- This migration file is kept for consistency but no longer creates database tables
-- since the services page now uses static data instead of database content

-- No database tables are created for services since we're using static data
-- The migration is intentionally left minimal to maintain migration sequence consistency
