-- Create comprehensive home_page table with detailed columns for all sections
CREATE TABLE home_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Hero Section
  hero_background_image TEXT,
  
  -- Main Section
  main_title TEXT,
  main_subtitle TEXT,
  main_html_content TEXT,
  
  -- Exhibition Europe Section
  exhibition_europe_title TEXT,
  exhibition_europe_subtitle TEXT,
  exhibition_europe_booth_image TEXT,
  exhibition_europe_html_content TEXT,
  
  -- Exhibition USA Section
  exhibition_usa_title TEXT,
  exhibition_usa_html_content TEXT,
  
  -- Solutions Section
  solutions_title TEXT,
  solutions_html_content TEXT,
  solutions_items JSONB, -- Array of solution items with title, description, image
  
  -- Why Best Section
  why_best_title TEXT,
  why_best_subtitle TEXT,
  why_best_html_content TEXT,
  
  -- Meta Information
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert single comprehensive home page record
INSERT INTO home_page (
  -- Hero Section Data
  hero_background_image,
  
  -- Main Section Data
  main_title,
  main_subtitle,
  main_html_content,
  
  -- Exhibition Europe Section Data
  exhibition_europe_title,
  exhibition_europe_subtitle,
  exhibition_europe_booth_image,
  exhibition_europe_html_content,
  
  -- Exhibition USA Section Data
  exhibition_usa_title,
  exhibition_usa_html_content,
  
  -- Solutions Section Data
  solutions_title,
  solutions_html_content,
  solutions_items,
  
  -- Why Best Section Data
  why_best_title,
  why_best_subtitle,
  why_best_html_content,
  
  is_active
) VALUES (
  -- Hero Section
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
  -- Main Section
  'YOUR EXHIBITION STAND BUILDER',
  'IN EUROPE',
  '<p>Transform your trade show presence with our <strong>comprehensive exhibition stand solutions</strong> across Europe. We specialize in creating <em>impactful brand experiences</em> that drive results and elevate your market presence.</p>',
  
  -- Exhibition Europe Section
  'EXHIBITION STAND SERVICES',
  'ACROSS EUROPE',
  'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  '<p>As a <strong>leading exhibition stand builder</strong>, we offer complete exhibition stand design and fabrication services across Europe. From initial concept to final installation, we cover all aspects you need for <em>stress-free exhibition participation</em>.</p>',
  
  -- Exhibition USA Section
  'YOUR TRADE SHOW BOOTH BUILDER IN USA',
  '<p>Welcome to <strong>Chronicle Exhibit LLC</strong>, your prominent partner for custom trade show booth displays and exhibits. With <em>13+ years</em> worth of experience and an excellent team, we have been providing exclusive <a href="/custom-stands">custom trade show booth design services</a> across the United States of America.</p>

<p>As Chronicle Exhibit LLC, we are aware that exhibitions and trade shows serve as a fantastic opportunity for companies like you to display your products and services to potential customers. For this reason, we offer locally attractive custom trade show booth designs that can make your brand stand out from the crowd.</p>',
  
  -- Solutions Section
  'EXHIBITION STAND SOLUTIONS',
  '<p>Discover our comprehensive range of <strong>exhibition stand solutions</strong> designed to meet every business need and budget. From innovative custom designs to flexible modular systems, we create impactful displays that drive engagement and deliver results.</p>',
  '[
    {
      "title": "Custom Exhibition Stands",
      "description": "Custom stand designs are tailored to your brand, accurately representing your company''s unique...",
      "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      "title": "Modular Exhibition Stands",
      "description": "Modular booths are the most user-friendly and can be assembled, disassembled and transported in a fast...",
      "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      "title": "Double Decker Exhibition Stands",
      "description": "Double-decker exhibits are easy to spot on the show floor, and in turn drive traffic and ...",
      "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
    },
    {
      "title": "Exhibition Pavilion Design",
      "description": "All pavilion booths bring together a group of different brands in one place, or offer the best space...",
      "image": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80"
    }
  ]'::jsonb,
  
  -- Why Best Section
  'WHY WE ARE ONE OF THE',
  'BEST EXHIBITION STAND DESIGN COMPANIES?',
  '<p>Like a successful <strong>exhibition stand construction company</strong> in Europe, RADON SP Z O.O. has provided valuable exhibition stand design and build services for the last <em>20+ years</em>. We have accomplished <strong>4000+ projects</strong> by participating in more than 1200 trade shows.</p>

<p>We aim to give you a great trade show booth that attracts your audience and achieves the results you want. Our <a href="/portfolio">top-notch turnkey solution</a> has provided a stress-free exhibiting experience to numerous companies to the present date.</p>

<p>Our comprehensive services include all the essential aspects such as <strong>installation, designing, logistics, and dismantling</strong>. In case you encounter any issues during the trade show, we provide world-class on-site supervision with our team members present throughout the entire event.</p>

<p>You just have to arrive at the venue, showcase your deals, and simply leave after the event gets over. We will manage the rest with our <em>expertise and experience</em>. Our own design studio helps us deliver the best-customized services in the market.</p>

<p>Our skilled team first collaborates with your representative to understand your promotional activity''s goals and needs. Then our qualified graphic designer creates a perfect design that meets your business objectives. Contact us if you''re looking for the <strong>best exhibition stand designer</strong> with adequate resources to deliver excellence.</p>',
  
  true
);

-- Create storage bucket for home page images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'home-images',
  'home-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Enable Row Level Security (RLS)
ALTER TABLE home_page ENABLE ROW LEVEL SECURITY;

-- Policies for home_page table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active home page content" ON home_page
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all home page content" ON home_page
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert home page content" ON home_page
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update home page content" ON home_page
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete home page content" ON home_page
FOR DELETE TO authenticated
USING (true);

-- Storage policies for home-images bucket
-- Allow public read access to home images
CREATE POLICY "Allow public read access to home images" ON storage.objects
FOR SELECT USING (bucket_id = 'home-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload home images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'home-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Allow authenticated users to update home images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'home-images')
WITH CHECK (bucket_id = 'home-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete home images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'home-images');

-- Create indexes for better performance
CREATE INDEX idx_home_page_is_active ON home_page(is_active);
CREATE INDEX idx_home_page_created_at ON home_page(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_home_page_updated_at 
BEFORE UPDATE ON home_page 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get home page data in structured format (single row)
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
                'htmlContent', home_record.exhibition_usa_html_content
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
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to update specific sections (for admin use)
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
                exhibition_usa_html_content = section_data->>'htmlContent'
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
            
        ELSE
            RETURN FALSE;
    END CASE;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;