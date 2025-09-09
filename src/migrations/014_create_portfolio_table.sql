-- Create comprehensive portfolio table with detailed columns for all sections
CREATE TABLE portfolio_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Hero Section
  hero_title TEXT,
  hero_background_image TEXT,
  
  -- Portfolio Items
  portfolio_items JSONB, -- Array of portfolio items with image URLs
  
  -- Meta Information
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- SEO Fields
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT
);

-- Insert single comprehensive portfolio page record
INSERT INTO portfolio_page (
  -- Hero Section Data
  hero_title,
  hero_background_image,
  
  -- Portfolio Items Data
  portfolio_items,
  
  -- SEO Data
  seo_title,
  seo_description,
  seo_keywords,
  
  is_active
) VALUES (
  -- Hero Section
  'PORTFOLIO',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
  -- Portfolio Items
  '[
    {
      "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=700&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=550&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=800&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=650&fit=crop",
      "featured": true
    },
    {
      "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      "featured": true
    },
    {
      "image": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=750&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=580&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=720&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=900&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800&h=620&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?w=800&h=680&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=780&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&h=520&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=660&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=820&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=590&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=740&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=560&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800&h=760&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?w=800&h=640&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=800&h=700&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1532618500676-2e0cbf7ba8b8?w=800&h=850&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&h=580&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=720&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=670&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=630&fit=crop",
      "featured": false
    },
    {
      "image": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=810&fit=crop",
      "featured": false
    }
  ]'::jsonb,
  
  -- SEO Data
  'Our Portfolio - Chronicle Exhibition Organizing LLC',
  'Explore our extensive portfolio of exhibition stands and discover the quality and creativity we bring to every project.',
  'portfolio, exhibition stands, trade show booths, custom displays',
  
  true
);

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-images',
  'portfolio-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_page ENABLE ROW LEVEL SECURITY;

-- Policies for portfolio_page table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active portfolio page content" ON portfolio_page
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all portfolio page content" ON portfolio_page
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert portfolio page content" ON portfolio_page
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update portfolio page content" ON portfolio_page
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete portfolio page content" ON portfolio_page
FOR DELETE TO authenticated
USING (true);

-- Storage policies for portfolio-images bucket
-- Allow public read access to portfolio images
CREATE POLICY "Allow public read access to portfolio images" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload portfolio images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Allow authenticated users to update portfolio images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'portfolio-images')
WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete portfolio images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'portfolio-images');

-- Create indexes for better performance
CREATE INDEX idx_portfolio_page_is_active ON portfolio_page(is_active);
CREATE INDEX idx_portfolio_page_created_at ON portfolio_page(created_at);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_portfolio_page_updated_at 
BEFORE UPDATE ON portfolio_page 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get portfolio page data in structured format (single row)
CREATE OR REPLACE FUNCTION get_portfolio_page_data()
RETURNS JSON AS $$
DECLARE
    portfolio_record RECORD;
    result JSON;
BEGIN
    -- Get the single active portfolio page record
    SELECT * INTO portfolio_record
    FROM portfolio_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'hero', json_build_object(
            'title', portfolio_record.hero_title,
            'backgroundImage', portfolio_record.hero_background_image
        ),
        'items', portfolio_record.portfolio_items,
        'seo', json_build_object(
            'title', portfolio_record.seo_title,
            'description', portfolio_record.seo_description,
            'keywords', portfolio_record.seo_keywords
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to update portfolio data (for admin use)
CREATE OR REPLACE FUNCTION update_portfolio_data(
    hero_data JSONB DEFAULT NULL,
    items_data JSONB DEFAULT NULL,
    seo_data JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    portfolio_id UUID;
BEGIN
    -- Get the portfolio page ID
    SELECT id INTO portfolio_id FROM portfolio_page WHERE is_active = true LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Update hero section if provided
    IF hero_data IS NOT NULL THEN
        UPDATE portfolio_page SET 
            hero_title = hero_data->>'title',
            hero_background_image = hero_data->>'backgroundImage'
        WHERE id = portfolio_id;
    END IF;
    
    -- Update items if provided
    IF items_data IS NOT NULL THEN
        UPDATE portfolio_page SET 
            portfolio_items = items_data
        WHERE id = portfolio_id;
    END IF;
    
    -- Update SEO data if provided
    IF seo_data IS NOT NULL THEN
        UPDATE portfolio_page SET 
            seo_title = seo_data->>'title',
            seo_description = seo_data->>'description',
            seo_keywords = seo_data->>'keywords'
        WHERE id = portfolio_id;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;