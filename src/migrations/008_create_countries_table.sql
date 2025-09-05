-- Create countries table with all sections in the order they appear on the country detail page
-- Sections order: Hero, Why Choose Us, What We Do, Company Info, Best Company, Process Section, Cities Section

CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Basic country information
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    
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
    
    -- Company Info Section (fourth section)
    company_info_title TEXT,
    company_info_content_html TEXT,
    
    -- Best Company Section (fifth section)
    best_company_title TEXT,
    best_company_subtitle TEXT,
    best_company_content_html TEXT,
    
    -- Process Section (sixth section)
    process_section_title TEXT,
    process_section_steps JSONB DEFAULT '[]', -- JSON array for process steps instead of HTML
    
    -- Cities Section (seventh section)
    cities_section_title TEXT,
    cities_section_subtitle TEXT,
    
    -- Selected Cities for this country (JSON array of city IDs or slugs)
    selected_cities JSONB DEFAULT '[]',
    
    -- Meta Information
    is_active BOOLEAN DEFAULT true,
    
    -- Indexes for performance
    CONSTRAINT unique_country_slug UNIQUE (slug)
);

-- Create indexes for common queries
CREATE INDEX idx_countries_slug ON countries (slug);
CREATE INDEX idx_countries_name ON countries (name);
CREATE INDEX idx_countries_is_active ON countries (is_active);

-- Create storage bucket for country images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'country-images',
  'country-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Policies for countries table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active countries" ON countries
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all countries" ON countries
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert countries" ON countries
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update countries" ON countries
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete countries" ON countries
FOR DELETE TO authenticated
USING (true);

-- Storage policies for country-images bucket
-- Allow public read access to country images
CREATE POLICY "Allow public read access to country images" ON storage.objects
FOR SELECT USING (bucket_id = 'country-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload country images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'country-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Allow authenticated users to update country images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'country-images')
WITH CHECK (bucket_id = 'country-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete country images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'country-images');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_countries_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_countries_updated_at 
BEFORE UPDATE ON countries 
FOR EACH ROW EXECUTE FUNCTION update_countries_updated_at_column();

-- Function to get country data by slug
CREATE OR REPLACE FUNCTION get_country_by_slug(
    slug_param TEXT
)
RETURNS SETOF countries
LANGUAGE sql
STABLE
AS $$
    SELECT * FROM countries
    WHERE slug = slug_param
    AND is_active = true
    LIMIT 1;
$$;

-- Function to get all available countries for static generation
CREATE OR REPLACE FUNCTION get_available_countries()
RETURNS TABLE(slug TEXT)
LANGUAGE sql
STABLE
AS $$
    SELECT slug FROM countries WHERE is_active = true;
$$;

-- Insert sample data for France
INSERT INTO countries (
    slug,
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
    company_info_title,
    company_info_content_html,
    best_company_title,
    best_company_subtitle,
    best_company_content_html,
    process_section_title,
    process_section_steps,
    cities_section_title,
    cities_section_subtitle,
    selected_cities
) VALUES (
    'france',
    'France',
    true,
    'Exhibition Stand Design & Build Solutions in France | Chronicles',
    'Professional exhibition stand design and construction services in France for trade shows and events. Custom, modular, and double-decker stands.',
    'exhibition stands, trade shows, France, booth design, event marketing',
    'EXHIBITION STAND DESIGN AND BUILD IN',
    'FRANCE',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=800&fit=crop&crop=center',
    'Why Choose Us for Exhibition Stands in',
    'France?',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=400&fit=crop',
    '<p>We are more than just exhibition stand builders in France<br>we are your gateway to success</p><p>In-house production and storage facilities in Europe</p><p>Experienced project managers with multilingual capabilities</p><p>Competitive pricing with no compromise on quality</p><p>One-stop shop for complete exhibition participation</p>',
    'WHAT WE DO?',
    'WE DO?',
    '<p>We offer our clients a wide range of trade show booth designs in France from custom and modular exhibition booths to country pavilion and double-decker exhibition booths.</p>',
    'DISTINGUISHED EXHIBITION STAND BUILDER IN FRANCE',
    '<p>At RADON SP Z O.O., we work with a client-centric approach to offer incredible exhibition stand construction and experience services in France. Our team of highly experienced exhibition stand designers in France are equipped with in-depth knowledge of local regulations, venue requirements, and cultural nuances to ensure that your exhibition stand not only meets but exceeds expectations.</p><p>We understand that most exhibitors face discomfort from various terminologies and need guidance and are limited by budgets, construction and venue limitations and are time constrained - that''s it! We have expertise at all levels to deliver significant optimization, efficiency and delivery activities with an unparalleled combination of value, expertise and commitment.</p><p>Our future and team are ready for further iterations of your organization and what you construct we add experience comprehensive information where we get for re-connections that help enhance our team service delivery such a record service throughout your entire exhibition journey.</p><p>We offer high-quality materials and rely on the latest tools and machinery to boost construction in France and deliver to best construction we are thingshex. etc. bench here</p><p>As exhibitors in France, the record we have now covers combining technology with extensive such as innovation and throughout experience - that''s it! From making to service your information to product today.</p>',
    'BEST EXHIBITION STAND DESIGN COMPANY IN FRANCE FOR',
    'EXCEPTIONAL EXPERIENCE',
    '<p>We are dedicated to designing a unique brand experience that fully showcases your brand essence and enhances your presence. As we have been delivering quality construction services for 20+ years, we have now become an exhibition stand contractor that delivers exceptional results.</p><p>Our team has successfully delivered quality services to 1000+ clients and completed 4000+ projects across 50+ exhibition events globally. Our professional team is here to provide customized exhibition services to help you convey your brand message effectively. We have a state-of-the-art manufacturing unit that allows us to deliver booth building projects with quick turnaround time.</p><p>Our team puts the latest of their skills and experience to work on creative solutions to meet your exhibition floor. Get in touch with the most trusted exhibition stand design company in France to deliver a distinct and unparalleled experience at your next trade show in France.</p>',
    'The Art And Science Behind Our Exhibition Stand Design & Build Process',
    '[
        {"id": "1", "icon": "💡", "title": "Brief", "description": "Understanding your specific requirements and exhibition goals through detailed briefing sessions."},
        {"id": "2", "icon": "✏️", "title": "3D Visuals", "description": "Creating realistic 3D visualizations to help you envision your exhibition stand before construction."},
        {"id": "3", "icon": "🏭", "title": "Production", "description": "Professional manufacturing in our state-of-the-art facilities with quality control at every step."},
        {"id": "4", "icon": "🚚", "title": "Logistics", "description": "Seamless transportation and delivery to ensure your stand arrives on time and in perfect condition."},
        {"id": "5", "icon": "🔧", "title": "Installation", "description": "Expert installation team ensures proper setup and functionality of all stand components."},
        {"id": "6", "icon": "🎯", "title": "Show Support", "description": "Round-the-clock support throughout your exhibition to address any issues immediately."}
    ]'::jsonb,
    'EXHIBITION STANDS IN',
    'FRANCE',
    '["paris", "reims"]'::jsonb
);

-- Insert sample data for Germany
INSERT INTO countries (
    slug,
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
    company_info_title,
    company_info_content_html,
    best_company_title,
    best_company_subtitle,
    best_company_content_html,
    process_section_title,
    process_section_steps,
    cities_section_title,
    cities_section_subtitle,
    selected_cities
) VALUES (
    'germany',
    'Germany',
    true,
    'Exhibition Stand Design & Build Solutions in Germany | Chronicles',
    'Professional exhibition stand design and construction services in Germany for trade shows and events. Custom, modular, and double-decker stands.',
    'exhibition stands, trade shows, Germany, booth design, event marketing',
    'EXHIBITION STAND DESIGN AND BUILD IN',
    'GERMANY',
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1920&h=800&fit=crop&crop=center',
    'Why Choose Us for Exhibition Stands in',
    'Germany?',
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=500&h=400&fit=crop',
    '<p>Leading exhibition stand builders in Germany<br>Your trusted partner for success in German trade shows</p><p>Local expertise with European manufacturing<br>Understanding German market requirements and regulations</p><p>German-speaking project managers<br>Seamless communication throughout your project</p><p>Competitive German market pricing<br>Best value for money without compromising quality</p><p>Complete exhibition services in Germany<br>From design to dismantling - we handle everything</p>',
    'WHAT WE DO?',
    'WE DO?',
    '<p>We offer our clients a wide range of trade show booth designs in Germany from custom and modular exhibition booths to country pavilion and double-decker exhibition booths.</p>',
    'PREMIER EXHIBITION STAND BUILDER IN GERMANY',
    '<p>At RADON SP Z O.O., we specialize in delivering exceptional exhibition stand construction services in Germany. Our team combines deep understanding of German trade show culture with cutting-edge design and construction expertise to create stands that make lasting impressions.</p><p>Germany hosts some of Europe''s most prestigious trade shows, and we understand the unique requirements of German exhibition venues. Our experienced team navigates local regulations, venue specifications, and cultural preferences to ensure your exhibition stand performs exceptionally.</p><p>We pride ourselves on German precision and efficiency, delivering projects that meet the highest standards of quality and punctuality. Our comprehensive approach covers every aspect of your exhibition participation in Germany.</p><p>With state-of-the-art manufacturing facilities and a dedicated German market team, we provide cost-effective solutions that maximize your exhibition ROI in Germany''s competitive trade show environment.</p><p>From concept to completion, we ensure your brand message resonates with German audiences through innovative design and flawless execution.</p>',
    'BEST EXHIBITION STAND DESIGN COMPANY IN GERMANY FOR',
    'OUTSTANDING RESULTS',
    '<p>We are committed to creating exceptional brand experiences that capture the attention of German trade show visitors. With over 18 years of experience in the German exhibition market, we have established ourselves as a premier exhibition stand contractor.</p><p>Our portfolio includes successful projects for 800+ clients across 3500+ projects in Germany''s leading exhibition venues. Our German-focused team delivers customized exhibition solutions that effectively communicate your brand message to German audiences.</p><p>With our advanced manufacturing capabilities and deep understanding of German exhibition standards, we deliver projects with remarkable efficiency and quality. Partner with Germany''s most trusted exhibition stand design company.</p>',
    'Our Proven Exhibition Stand Design & Build Process in Germany',
    '[
        {"id": "1", "icon": "💡", "title": "Briefing", "description": "Comprehensive briefing sessions tailored to German exhibition standards and audience preferences."},
        {"id": "2", "icon": "✏️", "title": "3D Design", "description": "Detailed 3D renderings that meet German exhibition venue specifications and regulations."},
        {"id": "3", "icon": "🏭", "title": "Manufacturing", "description": "High-quality manufacturing with German-level precision and attention to detail."},
        {"id": "4", "icon": "🚚", "title": "Logistics", "description": "Specialized transportation solutions for major German exhibition centers."},
        {"id": "5", "icon": "🔧", "title": "Installation", "description": "Expert installation team familiar with German venue requirements and safety standards."},
        {"id": "6", "icon": "🎯", "title": "Show Support", "description": "24/7 German-language support throughout your exhibition period."}
    ]'::jsonb,
    'EXHIBITION STANDS IN',
    'GERMANY',
    '[]'::jsonb
);