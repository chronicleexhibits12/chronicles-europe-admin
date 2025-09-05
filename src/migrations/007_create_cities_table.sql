-- Create cities table with all sections in the order they appear on the city detail page
-- Sections order: Hero, Why Choose Us, What We Do, Solutions (from home), Portfolio (static), Exhibiting Experience, Trade Shows (dynamic)

CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Basic city information
    country_slug TEXT NOT NULL,
    city_slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    
    -- Add is_active column for RLS policies
    is_active BOOLEAN DEFAULT true,
    
    -- SEO Metadata
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    
    -- Hero Section (first section on page)
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_background_image_url TEXT,
    
    -- Why Choose Us Section (second section)
    why_choose_us_title TEXT,
    why_choose_us_subtitle TEXT,
    why_choose_us_main_image_url TEXT,
    why_choose_us_benefits_html TEXT, -- Combined HTML content for all benefits
    
    -- What We Do Section (third section)
    what_we_do_title TEXT,
    what_we_do_subtitle TEXT,
    what_we_do_description_html TEXT,
    
    -- Solutions Section (fourth section - from home data, not city-specific)
    -- This section uses shared data from home page, so no specific columns needed
    
    -- Portfolio Section (fifth section - static)
    -- This section is static with dynamic title, so minimal columns needed
    portfolio_title_template TEXT, -- Template for "Our Portfolio in {city_name}"
    
    -- Exhibiting Experience Section (sixth section)
    exhibiting_experience_title TEXT,
    exhibiting_experience_subtitle TEXT,
    exhibiting_experience_benefits_html TEXT, -- Combined HTML for all benefits
    exhibiting_experience_excellence_title TEXT,
    exhibiting_experience_excellence_subtitle TEXT,
    exhibiting_experience_excellence_points_html TEXT, -- Combined HTML for all points
    
    -- Trade Shows Section (seventh section - dynamic)
    -- This section is dynamically populated based on city, so no specific columns needed
    
    -- Indexes for performance
    CONSTRAINT unique_country_city UNIQUE (country_slug, city_slug)
);

-- Create indexes for common queries
CREATE INDEX idx_cities_country_slug ON cities (country_slug);
CREATE INDEX idx_cities_city_slug ON cities (city_slug);
CREATE INDEX idx_cities_name ON cities (name);
CREATE INDEX idx_cities_is_active ON cities(is_active);

-- Set up Row Level Security (RLS)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Policies for cities table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active cities" ON cities
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all cities" ON cities
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert cities" ON cities
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update cities" ON cities
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete cities" ON cities
FOR DELETE TO authenticated
USING (true);

-- Create storage bucket for city images with proper configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'city-images',
  'city-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for city-images bucket
-- Allow public read access to city images
CREATE POLICY "Allow public read access to city images" ON storage.objects
FOR SELECT USING (bucket_id = 'city-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload city images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'city-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Allow authenticated users to update city images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'city-images')
WITH CHECK (bucket_id = 'city-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete city images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'city-images');

-- Function to get city data by country and city slug
CREATE OR REPLACE FUNCTION get_city_by_country_and_slug(
    country_slug_param TEXT,
    city_slug_param TEXT
)
RETURNS SETOF cities
LANGUAGE sql
STABLE
AS $$
    SELECT * FROM cities
    WHERE country_slug = country_slug_param
    AND city_slug = city_slug_param
    LIMIT 1;
$$;

-- Function to get all available cities for static generation
CREATE OR REPLACE FUNCTION get_available_cities()
RETURNS TABLE(country_slug TEXT, city_slug TEXT)
LANGUAGE sql
STABLE
AS $$
    SELECT country_slug, city_slug FROM cities;
$$;

-- Insert sample data for Paris
INSERT INTO cities (
    country_slug,
    city_slug,
    name,
    is_active,
    seo_title,
    seo_description,
    seo_keywords,
    hero_title,
    hero_subtitle,
    hero_background_image_url,
    why_choose_us_title,
    why_choose_us_subtitle,
    why_choose_us_main_image_url,
    why_choose_us_benefits_html,
    what_we_do_title,
    what_we_do_subtitle,
    what_we_do_description_html,
    portfolio_title_template,
    exhibiting_experience_title,
    exhibiting_experience_subtitle,
    exhibiting_experience_benefits_html,
    exhibiting_experience_excellence_title,
    exhibiting_experience_excellence_subtitle,
    exhibiting_experience_excellence_points_html
) VALUES (
    'france',
    'paris',
    'PARIS',
    true,
    'Exhibition Stand Design & Build Solutions in Paris | Chronicles',
    'Professional exhibition stand design and construction services in Paris for trade shows and events. Custom, modular, and double-decker stands.',
    'exhibition stands, trade shows, Paris, booth design, event marketing',
    'EXHIBITION STAND DESIGN & BUILD SOLUTIONS IN',
    'PARIS',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1920&h=800&fit=crop&crop=center',
    'Why Choose Us for Exhibition Stands in',
    'Paris?',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=400&fit=crop',
    '<p>With 15+ years worth of experience we are confident from our displays and exhibits. With 15+ years worth of experience we are confident from our displays and exhibits as our experience team can handle their own designing, building, and delivering process well within the deadline. All of the exhibitions are well-organized and thoroughly inspected for safety.</p><p>At Chronicles CORP LTD, we are aware that exhibitions and trade shows have now a fantastic opportunity for companies to display their products and services to potential customers. For this reason, we offer booth attendance custom-made show ideas that make your business stand out from the rest.</p><p>As exhibition trade show booth builders, we have accomplished 1000+ trade show booth displays design and building projects successfully. Our team of experienced professionals will handle all your display with efficiency and satisfaction.</p>',
    'WHAT WE DO?',
    'WE DO?',
    '<p>We specialize in creating exceptional exhibition stands for trade shows in Paris. From concept to completion, we deliver custom, modular, and double-decker stands that showcase your brand effectively in this global business hub.</p>',
    'Our Portfolio in {city_name}',
    'DISCOVER THE EXTRAORDINARY EXHIBITING EXPERIENCE',
    'WITH US',
    '<p>Emphasis on strong collaboration and clear communication to understand objectives clearly.</p><p>Utilization of interactive technologies like touch screens, augmented reality, virtual reality, and merged digital displays for effective trade show booths.</p><p>High-quality finishing is achieved through machine-level production in our own manufacturing facility.</p><p>Comprehensive end-to-end services include logistics, installation, designing, and dismantling for a stress-free exhibiting experience.</p><p>Commitment to environmental ethics and sustainable practices with an expert team.</p><p>Skilled team members were present throughout the event to promptly resolve technical faults.</p><p>Cost-effective solutions as a single-source service provider, eliminating middlemen commissions.</p>',
    'FROM CONCEPT TO SHOWCASE: WE DELIVER',
    'EXCELLENCE!',
    '<p>Refined skills with over 1,000 satisfied clients for maximum client satisfaction.</p><p>Leading exhibition stand contractor in Paris, with over 4,500 successful global projects embracing the latest trends.</p><p>Global manufacturer offering comprehensive services at local pricing.</p><p>Expertise and experience to build impactful, large-size exhibition stands.</p>'
);

-- Insert sample data for Reims
INSERT INTO cities (
    country_slug,
    city_slug,
    name,
    is_active,
    seo_title,
    seo_description,
    seo_keywords,
    hero_title,
    hero_subtitle,
    hero_background_image_url,
    why_choose_us_title,
    why_choose_us_subtitle,
    why_choose_us_main_image_url,
    why_choose_us_benefits_html,
    what_we_do_title,
    what_we_do_subtitle,
    what_we_do_description_html,
    portfolio_title_template,
    exhibiting_experience_title,
    exhibiting_experience_subtitle,
    exhibiting_experience_benefits_html,
    exhibiting_experience_excellence_title,
    exhibiting_experience_excellence_subtitle,
    exhibiting_experience_excellence_points_html
) VALUES (
    'france',
    'reims',
    'REIMS',
    true,
    'Exhibition Stand Design & Build Solutions in Reims | Chronicles',
    'Professional exhibition stand design and construction services in Reims for trade shows and events. Custom, modular, and double-decker stands.',
    'exhibition stands, trade shows, Reims, booth design, event marketing',
    'EXHIBITION STAND DESIGN & BUILD SOLUTIONS IN',
    'REIMS',
    'https://images.unsplash.com/photo-1595568672959-606e76bc841e?w=1920&h=800&fit=crop&crop=center',
    'Why Choose Us for Exhibition Stands in',
    'Reims?',
    'https://images.unsplash.com/photo-1578322956407-eec75ad3ba41?w=500&h=400&fit=crop',
    '<p>With 15+ years worth of experience we are confident from our displays and exhibits. With 15+ years worth of experience we are confident from our displays and exhibits as our experience team can handle their own designing, building, and delivering process well within the deadline. All of the exhibitions are well-organized and thoroughly inspected for safety.</p><p>At Chronicles CORP LTD, we are aware that exhibitions and trade shows have now a fantastic opportunity for companies to display their products and services to potential customers. For this reason, we offer booth attendance custom-made show ideas that make your business stand out from the rest.</p><p>As exhibition trade show booth builders, we have accomplished 1000+ trade show booth displays design and building projects successfully. Our team of experienced professionals will handle all your display with efficiency and satisfaction.</p>',
    'WHAT WE DO?',
    'WE DO?',
    '<p>We deliver exceptional exhibition stands for trade shows and events in Reims. Our comprehensive services include custom-designed stands, modular solutions, and complete exhibition support tailored to the unique characteristics of Reims venues.</p>',
    'Our Portfolio in {city_name}',
    'DISCOVER THE EXTRAORDINARY EXHIBITING EXPERIENCE',
    'WITH US',
    '<p>Emphasis on strong collaboration and clear communication to understand objectives clearly.</p><p>Utilization of interactive technologies like touch screens, augmented reality, virtual reality, and merged digital displays for effective trade show booths.</p><p>High-quality finishing is achieved through machine-level production in our own manufacturing facility.</p><p>Comprehensive end-to-end services include logistics, installation, designing, and dismantling for a stress-free exhibiting experience.</p><p>Commitment to environmental ethics and sustainable practices with an expert team.</p><p>Skilled team members were present throughout the event to promptly resolve technical faults.</p><p>Cost-effective solutions as a single-source service provider, eliminating middlemen commissions.</p>',
    'FROM CONCEPT TO SHOWCASE: WE DELIVER',
    'EXCELLENCE!',
    '<p>Refined skills with over 1,000 satisfied clients for maximum client satisfaction.</p><p>Leading exhibition stand contractor in Reims, with over 4,500 successful global projects embracing the latest trends.</p><p>Global manufacturer offering comprehensive services at local pricing.</p><p>Expertise and experience to build impactful, large-size exhibition stands.</p>'
);