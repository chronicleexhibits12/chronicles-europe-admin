-- Create main_countries_page table with all sections in the order they appear on the main countries page
-- Sections order: Hero, Exhibition Stand Types, Portfolio Showcase, Build Section

CREATE TABLE main_countries_page (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- SEO Metadata
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    
    -- Hero Section (first section on page)
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_description TEXT,
    hero_background_image_url TEXT,
    hero_background_image_alt TEXT,
    
    -- Exhibition Stand Types Section (second section)
    -- Using JSONB for flexible structure
    exhibition_stand_types JSONB DEFAULT '[]',
    
    -- Portfolio Showcase Section (third section)
    portfolio_showcase_title TEXT,
    portfolio_showcase_description TEXT,
    portfolio_showcase_cta_text TEXT,
    portfolio_showcase_cta_link TEXT DEFAULT '/portfolio',
    
    -- Build Section (fourth section)
    build_section_title TEXT,
    build_section_highlight TEXT,
    build_section_description TEXT,
    
    -- Meta Information
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for performance
CREATE INDEX idx_main_countries_page_is_active ON main_countries_page(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE main_countries_page ENABLE ROW LEVEL SECURITY;

-- Policies for main_countries_page table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active main countries page content" ON main_countries_page
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all main countries page content" ON main_countries_page
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert main countries page content" ON main_countries_page
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update main countries page content" ON main_countries_page
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete main_countries_page content" ON main_countries_page
FOR DELETE TO authenticated
USING (true);

-- Create storage bucket for main countries page images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'main-countries-images',
  'main-countries-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for main-countries-images bucket
-- Allow public read access to main countries page images
CREATE POLICY "Allow public read access to main countries page images" ON storage.objects
FOR SELECT USING (bucket_id = 'main-countries-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload main countries page images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'main-countries-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Allow authenticated users to update main countries page images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'main-countries-images')
WITH CHECK (bucket_id = 'main-countries-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete main countries page images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'main-countries-images');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_main_countries_page_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_main_countries_page_updated_at 
BEFORE UPDATE ON main_countries_page 
FOR EACH ROW EXECUTE FUNCTION update_main_countries_page_updated_at_column();

-- Insert default data for main countries page
INSERT INTO main_countries_page (
    seo_title,
    seo_description,
    seo_keywords,
    hero_title,
    hero_subtitle,
    hero_description,
    hero_background_image_url,
    exhibition_stand_types,
    portfolio_showcase_title,
    portfolio_showcase_description,
    portfolio_showcase_cta_text,
    portfolio_showcase_cta_link,
    build_section_title,
    build_section_highlight,
    build_section_description,
    is_active
) VALUES (
    'Exhibition Stand Design & Build Services Across Europe | Chronicles',
    'Professional exhibition stand design and construction services across Europe for trade shows and events. Custom, modular, and double-decker stands in all major European destinations.',
    'exhibition stands, trade shows, Europe, booth design, event marketing, custom stands, modular stands, double decker stands',
    'EXHIBITION',
    'STANDS',
    'Expanding your business across Europe? We design and build world-class exhibition stands in all major European trade show destinations. Partner with us to create impactful brand experiences that drive results and elevate your market presence.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=800&fit=crop&crop=center',
    '[
        {
            "title": "CUSTOM EXHIBITION STANDS",
            "description": "Transform your brand vision into reality with our bespoke exhibition stands. Our expert designers craft unique, brand-aligned displays that capture attention and drive engagement. From innovative graphics to interactive elements, we ensure your booth becomes the centerpiece of any trade show, creating memorable experiences that convert visitors into customers.",
            "images": [
                "https://images.unsplash.com/photo-1611401267409-1c5bf5b76b31?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1560523160-754a9e25c68f?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop"
            ],
            "ctaText": "EXPLORE CUSTOM SOLUTIONS",
            "ctaLink": "/major-countries"
        },
        {
            "title": "MODULAR EXHIBITION STANDS",
            "description": "Smart, flexible, and cost-effective exhibition solutions that grow with your business. Our premium modular systems offer unlimited design possibilities while ensuring easy setup, transportation, and reuse. Perfect for businesses seeking professional impact without compromising on budget or convenience.",
            "images": [
                "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1572025442646-866d16c84a54?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1588421357574-87938a86fa28?q=80&w=1000&auto=format&fit=crop"
            ],
            "ctaText": "DISCOVER MODULAR OPTIONS",
            "ctaLink": "/major-countries"
        },
        {
            "title": "DOUBLE DECKER EXHIBITION STANDS",
            "description": "Maximize your exhibition impact with stunning two-story displays that command attention across the show floor. Our double-decker stands create premium brand experiences with expanded space for meetings, demonstrations, and hospitality areas, positioning your company as an industry leader.",
            "images": [
                "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop"
            ],
            "ctaText": "VIEW DOUBLE DECKER DESIGNS",
            "ctaLink": "/major-countries"
        },
        {
            "title": "PAVILION EXHIBITION STANDS",
            "description": "Showcase your heritage and values with sophisticated pavilion designs that tell your story. Our expert team creates immersive cultural and corporate pavilions that foster meaningful connections, whether representing countries, regions, or corporate identity on the global stage.",
            "images": [
                "https://images.unsplash.com/photo-1540317580384-e5d6509d5cc2?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1597314040917-99c7647ee8c6?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?q=80&w=1000&auto=format&fit=crop"
            ],
            "ctaText": "EXPLORE PAVILION SOLUTIONS",
            "ctaLink": "/major-countries"
        }
    ]'::jsonb,
    'DISCOVER OUR AWARD-WINNING EXHIBITION DESIGNS',
    'With decades of experience creating stunning exhibition experiences across Europe, we''ve earned the trust of leading brands worldwide. Explore our innovative portfolio showcasing cutting-edge designs that captivate audiences and deliver exceptional results for our clients.',
    'VIEW OUR PORTFOLIO',
    '/portfolio',
    'WE BUILD',
    'EXHIBITION STANDS',
    'Chronicle Exhibitions operates state-of-the-art manufacturing facilities and design studios across Europe and the UK. Our commitment to excellence ensures premium quality exhibition stands delivered on time, every time. Our in-house production facilities feature cutting-edge technology and advanced printing capabilities, enabling us to create captivating displays with real-time technologies, innovative creativity, and interactive experiences that make your brand the star of any show floor.',
    true
);