-- Create comprehensive double_decker_stands_page table with detailed columns for all sections
CREATE TABLE double_decker_stands_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- SEO Metadata
  meta_title TEXT,
  meta_description TEXT,
  slug TEXT DEFAULT 'double-decker-stands',
  
  -- Hero Section
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_background_image TEXT,
  
  -- Benefits Section
  benefits_title TEXT,
  benefits_image TEXT,
  benefits_content TEXT,
  
  -- Points Table Section (Positioned after Benefits Section to match component order)
  points_table_title TEXT,
  points_table_content TEXT,
  
  -- Stand Project Text Section
  stand_project_title TEXT,
  stand_project_highlight TEXT,
  stand_project_description TEXT,
  
  -- Exhibition Benefits Section
  exhibition_benefits_title TEXT,
  exhibition_benefits_subtitle TEXT,
  exhibition_benefits_content TEXT,
  exhibition_benefits_image TEXT,
  
  -- Booth Partner Section
  booth_partner_title TEXT,
  booth_partner_subtitle TEXT,
  booth_partner_description TEXT,
  
  -- Bold Statement Section
  bold_statement_title TEXT,
  bold_statement_subtitle TEXT,
  bold_statement_description TEXT,
  
  -- Meta Information
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert single comprehensive double decker stands page record
INSERT INTO double_decker_stands_page (
  -- SEO Metadata
  meta_title,
  meta_description,
  
  -- Hero Section
  hero_title,
  hero_subtitle,
  hero_background_image,
  
  -- Benefits Section
  benefits_title,
  benefits_image,
  benefits_content,
  
  -- Points Table Section (Positioned after Benefits Section to match component order)
  points_table_title,
  points_table_content,
  
  -- Stand Project Text Section
  stand_project_title,
  stand_project_highlight,
  stand_project_description,
  
  -- Exhibition Benefits Section
  exhibition_benefits_title,
  exhibition_benefits_subtitle,
  exhibition_benefits_content,
  exhibition_benefits_image,
  
  -- Booth Partner Section
  booth_partner_title,
  booth_partner_subtitle,
  booth_partner_description,
  
  -- Bold Statement Section
  bold_statement_title,
  bold_statement_subtitle,
  bold_statement_description,
  
  is_active
) VALUES (
  -- SEO Metadata
  'Double Decker Exhibition Stands Design & Build Services',
  'Professional double decker exhibition stand design and build services. Create unique, eye-catching two-story displays that represent your brand perfectly at trade shows and exhibitions.',
  
  -- Hero Section
  'DOUBLE DECKER EXHIBITION STANDS',
  'DESIGN & BUILD',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
  
  -- Benefits Section
  'BENEFITS OF THE DOUBLE-DECKER EXHIBITION STAND:',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=400&fit=crop',
  '<ul><li>Double-decker exhibits are easy to spot on the show floor, and it can drive traffic to the stall.</li><li>These booths allow users to expand the usable space upwards. It provides a lot of branding, interactivity, and product displays as exhibitors have separate spaces for meetings and social gatherings.</li><li>Double-decker booths offer maximum customer engagement in a private atmosphere.</li><li>Double-decker stands offer great flexibility to use some creative ideas with captivating graphics and add value to the business.</li></ul>',
  
  -- Points Table Section
  'WHY CHOOSE DOUBLE-DECKER STANDS?',
  '<ul><li>Maximize your floor space without increasing costs.</li><li>Create private meeting areas on the upper deck.</li><li>Gain better visibility on the crowded show floor.</li><li>Showcase products with stunning two-level designs.</li></ul><p>At Chronicles, we design double-decker booths that not only expand the exhibiting space but also ensure your brand stands tall amidst the competition.</p><p>Our innovative booth designs help clients achieve maximum impact with functional, creative, and visually striking two-story exhibition stands.</p>',
  
  -- Stand Project Text Section
  'SOME OF OUR',
  'DOUBLE DECKER EXHIBITION STANDS',
  '<p>Check some of the designs aesthetically created and delivered in the best quality by our professional double decker exhibition stand builders. The below pictures demonstrate our specially tailored exhibition stands to meet the <strong>client''s objectives</strong> and maximise the expo''s success.</p>',
  
  -- Exhibition Benefits Section
  'Why Choose Our Exhibition Stands?',
  'Discover the advantages that make our stands unique and effective.',
  '<ul><li><strong>Tailor-made designs</strong> to match your brand identity.</li><li><strong>High-quality materials</strong> ensuring durability and elegance.</li><li><em>Eco-friendly and sustainable</em> production methods.</li><li><strong>On-time delivery</strong> and hassle-free installation.</li><li><strong>Cost-effective solutions</strong> without compromising on quality.</li></ul>',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
  
  -- Booth Partner Section
  'CHRONICLES',
  'YOUR IDEAL DOUBLE DECK BOOTH PARTNER',
  'Double Decker Trade Show Booths can be difficult to design and build, but nothing is difficult for Chronicles. We are one of the most trusted double-decker exhibition stand builders in Europe. We have been in the double-decker exhibition stand designing industry for the last 20+ years.',
  
  -- Bold Statement Section
  'MAKE A BOLD STATEMENT',
  'DOUBLE DECKER EXHIBITION STAND',
  'The double-decker booths designed by Chronicles not only increase the exhibiting space but also make a solid impression amidst the competition.',
  
  true
);

-- Create storage bucket for double decker stands images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'double-decker-stands-images',
  'double-decker-stands-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Enable Row Level Security (RLS)
ALTER TABLE double_decker_stands_page ENABLE ROW LEVEL SECURITY;

-- Policies for double_decker_stands_page table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active double decker stands page content" ON double_decker_stands_page
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all double decker stands page content" ON double_decker_stands_page
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert double decker stands page content" ON double_decker_stands_page
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update double decker stands page content" ON double_decker_stands_page
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete double decker stands page content" ON double_decker_stands_page
FOR DELETE TO authenticated
USING (true);

-- Storage policies for double-decker-stands-images bucket
-- Allow public read access to double decker stands images
CREATE POLICY "Allow public read access to double decker stands images" ON storage.objects
FOR SELECT USING (bucket_id = 'double-decker-stands-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload double decker stands images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'double-decker-stands-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Allow authenticated users to update double decker stands images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'double-decker-stands-images')
WITH CHECK (bucket_id = 'double-decker-stands-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete double decker stands images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'double-decker-stands-images');

-- Create indexes for better performance
CREATE INDEX idx_double_decker_stands_page_is_active ON double_decker_stands_page(is_active);
CREATE INDEX idx_double_decker_stands_page_created_at ON double_decker_stands_page(created_at);
CREATE INDEX idx_double_decker_stands_page_slug ON double_decker_stands_page(slug);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_double_decker_stands_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_double_decker_stands_page_updated_at 
BEFORE UPDATE ON double_decker_stands_page 
FOR EACH ROW EXECUTE FUNCTION update_double_decker_stands_updated_at_column();

-- Create function to get double decker stands page data in structured format (single row)
CREATE OR REPLACE FUNCTION get_double_decker_stands_page_data()
RETURNS JSON AS $$
DECLARE
    double_decker_stands_record RECORD;
    result JSON;
BEGIN
    -- Get the single active double decker stands page record
    SELECT * INTO double_decker_stands_record
    FROM double_decker_stands_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', double_decker_stands_record.meta_title,
            'description', double_decker_stands_record.meta_description
        ),
        'hero', json_build_object(
            'title', double_decker_stands_record.hero_title,
            'subtitle', double_decker_stands_record.hero_subtitle,
            'backgroundImage', double_decker_stands_record.hero_background_image
        ),
        'benefits', json_build_object(
            'title', double_decker_stands_record.benefits_title,
            'image', double_decker_stands_record.benefits_image,
            'content', double_decker_stands_record.benefits_content
        ),
        'pointsTable', json_build_object(
            'title', double_decker_stands_record.points_table_title,
            'content', double_decker_stands_record.points_table_content
        ),
        'StandProjectText', json_build_object(
            'title', double_decker_stands_record.stand_project_title,
            'highlight', double_decker_stands_record.stand_project_highlight,
            'description', double_decker_stands_record.stand_project_description
        ),
        'exhibitionBenefits', json_build_object(
            'title', double_decker_stands_record.exhibition_benefits_title,
            'subtitle', double_decker_stands_record.exhibition_benefits_subtitle,
            'content', double_decker_stands_record.exhibition_benefits_content,
            'image', double_decker_stands_record.exhibition_benefits_image
        ),
        'boothPartner', json_build_object(
            'title', double_decker_stands_record.booth_partner_title,
            'subtitle', double_decker_stands_record.booth_partner_subtitle,
            'description', double_decker_stands_record.booth_partner_description
        ),
        'boldStatement', json_build_object(
            'title', double_decker_stands_record.bold_statement_title,
            'subtitle', double_decker_stands_record.bold_statement_subtitle,
            'description', double_decker_stands_record.bold_statement_description
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;