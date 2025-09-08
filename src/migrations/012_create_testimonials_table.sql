-- Create comprehensive testimonials_page table with detailed columns for all sections
CREATE TABLE testimonials_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Meta Information
  meta_title TEXT DEFAULT 'Client Testimonials - Exhibition Stand Builder Europe | RADON SP. Z.O.O.',
  meta_description TEXT DEFAULT 'Read testimonials from our satisfied clients across Europe. Discover why RADON SP. Z.O.O. is the leading exhibition stand builder in Germany and beyond.',
  meta_keywords TEXT DEFAULT 'testimonials, client reviews, exhibition stand builder, Europe, RADON, customer feedback',
  
  -- Hero Section
  hero_title TEXT,
  hero_background_image TEXT,
  
  -- Intro Section
  intro_title TEXT,
  intro_subtitle TEXT,
  intro_description TEXT,
  
  -- Status and Timestamps
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table for individual testimonial entries
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES testimonials_page(id) ON DELETE CASCADE,
  
  -- Testimonial Content
  client_name TEXT,
  company_name TEXT,
  company_logo_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  testimonial_text TEXT,
  
  -- Display Options
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  
  -- Status and Timestamps
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert single comprehensive testimonials page record
INSERT INTO testimonials_page (
  -- Meta Information
  meta_title,
  meta_description,
  meta_keywords,
  
  -- Hero Section Data
  hero_title,
  hero_background_image,
  
  -- Intro Section Data
  intro_title,
  intro_subtitle,
  intro_description,
  
  is_active
) VALUES (
  -- Meta Information
  'Client Testimonials - Exhibition Stand Builder Europe | RADON SP. Z.O.O.',
  'Read testimonials from our satisfied clients across Europe. Discover why RADON SP. Z.O.O. is the leading exhibition stand builder in Germany and beyond.',
  'testimonials, client reviews, exhibition stand builder, Europe, RADON, customer feedback',
  
  -- Hero Section
  'CLIENT TESTIMONIALS',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=800&fit=crop&crop=center',
  
  -- Intro Section
  'WE HAVE LIST OF TRUSTED AND',
  'PROUD CLIENTS TO NARRATE',
  'WE HAVE LIST OF TRUSTED AND PROUD CLIENTS TO NARRATE WITH US',
  
  true
);

-- Insert sample testimonials
INSERT INTO testimonials (page_id, client_name, company_name, company_logo_url, rating, testimonial_text, is_featured, display_order) 
SELECT id, 'Marcos Drescher', 'Marcos Drescher', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', 5, 'Excellent service and professional approach. The team delivered exactly what we needed within the promised timeframe.', true, 1
FROM testimonials_page WHERE is_active = true;

INSERT INTO testimonials (page_id, client_name, company_name, company_logo_url, rating, testimonial_text, is_featured, display_order) 
SELECT id, 'Justin Kaufmann', 'OPTIMEDIA', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=60&fit=crop&crop=center', 5, 'Your service took a huge amount of worry and time off my small team, and let us focus on the things we''re good at. We approached Radon Exhibitions with very short deadline to initiate our stand design process. They immediately responded and finished the process of designing in a very short time. Their design execution was very quick and having fine quality. It was really comfortable to work with guys.', true, 2
FROM testimonials_page WHERE is_active = true;

INSERT INTO testimonials (page_id, client_name, company_name, company_logo_url, rating, testimonial_text, is_featured, display_order) 
SELECT id, 'Mark Biermann', 'AIRTECH', 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=120&h=60&fit=crop&crop=center', 4, 'Radon Exhibitions helped us with the exhibition stand design solution very quickly within a short span of time. Especially when we talk about exhibitions, we always need to go for flexible and supportive company which Radon Exhibitions proved it and we are very happy with their services. We will obviously recommend to others as well.', true, 3
FROM testimonials_page WHERE is_active = true;

INSERT INTO testimonials (page_id, client_name, company_name, company_logo_url, rating, testimonial_text, is_featured, display_order) 
SELECT id, 'Grant Hirsch', 'GFR', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&h=60&fit=crop&crop=center', 4, 'The design of stand was fresh and innovative, all our requests and changes were included without a problem, nothing seemed too much trouble and the stand was built on time and to a high quality. I would have no problem with using Radon Exhibitions for future exhibitions.', true, 4
FROM testimonials_page WHERE is_active = true;

INSERT INTO testimonials (page_id, client_name, company_name, company_logo_url, rating, testimonial_text, is_featured, display_order) 
SELECT id, 'Kiley Eisenberg', 'BOTANY WEAVING', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80', 5, 'We are happy with the services provided by the Radon Exhibitions and even they are very flexible in the last moment changes required by us. We will definitely recommend Radon Exhibitions to our business circle. We really appreciate Radon Exhibitions services and especially their immediate and 24/7 support.', true, 5
FROM testimonials_page WHERE is_active = true;

-- Create storage bucket for testimonials images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'testimonials-images',
  'testimonials-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Enable Row Level Security (RLS)
ALTER TABLE testimonials_page ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policies for testimonials_page table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active testimonials page content" ON testimonials_page
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all testimonials page content" ON testimonials_page
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert testimonials page content" ON testimonials_page
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update testimonials page content" ON testimonials_page
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete testimonials page content" ON testimonials_page
FOR DELETE TO authenticated
USING (true);

-- Policies for testimonials table
-- Allow public read access for active testimonials
CREATE POLICY "Allow public read access for active testimonials" ON testimonials
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all testimonials (including inactive)
CREATE POLICY "Allow authenticated users to read all testimonials" ON testimonials
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert testimonials
CREATE POLICY "Allow authenticated users to insert testimonials" ON testimonials
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update testimonials
CREATE POLICY "Allow authenticated users to update testimonials" ON testimonials
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete testimonials
CREATE POLICY "Allow authenticated users to delete testimonials" ON testimonials
FOR DELETE TO authenticated
USING (true);

-- Storage policies for testimonials-images bucket
-- Allow public read access to testimonials images
CREATE POLICY "Allow public read access to testimonials images" ON storage.objects
FOR SELECT USING (bucket_id = 'testimonials-images');

-- Allow authenticated users to upload testimonials images
CREATE POLICY "Allow authenticated users to upload testimonials images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'testimonials-images');

-- Allow authenticated users to update their uploaded testimonials images
CREATE POLICY "Allow authenticated users to update testimonials images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'testimonials-images')
WITH CHECK (bucket_id = 'testimonials-images');

-- Allow authenticated users to delete testimonials images
CREATE POLICY "Allow authenticated users to delete testimonials images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'testimonials-images');

-- Create indexes for better performance
CREATE INDEX idx_testimonials_page_is_active ON testimonials_page(is_active);
CREATE INDEX idx_testimonials_page_created_at ON testimonials_page(created_at);
CREATE INDEX idx_testimonials_is_active ON testimonials(is_active);
CREATE INDEX idx_testimonials_page_id ON testimonials(page_id);
CREATE INDEX idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX idx_testimonials_is_featured ON testimonials(is_featured);
CREATE INDEX idx_testimonials_created_at ON testimonials(created_at);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_testimonials_page_updated_at 
BEFORE UPDATE ON testimonials_page 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at 
BEFORE UPDATE ON testimonials 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get testimonials page data in structured format (single row)
CREATE OR REPLACE FUNCTION get_testimonials_page_data()
RETURNS JSON AS $$
DECLARE
    page_record RECORD;
    testimonials_array JSON;
    result JSON;
BEGIN
    -- Get the single active testimonials page record
    SELECT * INTO page_record
    FROM testimonials_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Get active testimonials for this page ordered by display_order
    SELECT json_agg(
        json_build_object(
            'id', t.id,
            'name', t.client_name,
            'company', t.company_name,
            'logo', t.company_logo_url,
            'rating', t.rating,
            'text', t.testimonial_text
        ) ORDER BY t.display_order
    ) INTO testimonials_array
    FROM testimonials t
    WHERE t.page_id = page_record.id AND t.is_active = true;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', page_record.meta_title,
            'description', page_record.meta_description,
            'keywords', page_record.meta_keywords
        ),
        'hero', json_build_object(
            'name', 'Chronicles Company Reviews',
            'company', 'Hero Section',
            'image', page_record.hero_background_image,
            'text', page_record.hero_title
        ),
        'intro', json_build_object(
            'title', page_record.intro_title,
            'subtitle', page_record.intro_subtitle,
            'text', page_record.intro_description
        ),
        'testimonials', COALESCE(testimonials_array, '[]'::json)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to update specific sections (for admin use)
CREATE OR REPLACE FUNCTION update_testimonials_section(
    section_name TEXT,
    section_data JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    page_id UUID;
BEGIN
    -- Get the testimonials page ID
    SELECT id INTO page_id FROM testimonials_page WHERE is_active = true LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Update based on section name
    CASE section_name
        WHEN 'meta' THEN
            UPDATE testimonials_page SET 
                meta_title = section_data->>'title',
                meta_description = section_data->>'description',
                meta_keywords = section_data->>'keywords'
            WHERE id = page_id;
            
        WHEN 'hero' THEN
            UPDATE testimonials_page SET 
                hero_title = section_data->>'text',
                hero_background_image = section_data->>'image'
            WHERE id = page_id;
            
        WHEN 'intro' THEN
            UPDATE testimonials_page SET 
                intro_title = section_data->>'title',
                intro_subtitle = section_data->>'subtitle',
                intro_description = section_data->>'text'
            WHERE id = page_id;
            
        ELSE
            RETURN FALSE;
    END CASE;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;