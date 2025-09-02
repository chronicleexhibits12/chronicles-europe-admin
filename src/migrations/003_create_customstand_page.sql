-- Create comprehensive custom_stands_page table with detailed columns for all sections
CREATE TABLE custom_stands_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- SEO Metadata
  meta_title TEXT,
  meta_description TEXT,
  slug TEXT DEFAULT 'custom-stands',
  
  -- Hero Section
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_background_image TEXT,
  
  -- Benefits Section
  benefits_title TEXT,
  benefits_image TEXT,
  benefits_content TEXT,
  
  -- Stand Project Text Section
  stand_project_title TEXT,
  stand_project_highlight TEXT,
  stand_project_description TEXT,
  
  -- Exhibition Benefits Section
  exhibition_benefits_title TEXT,
  exhibition_benefits_subtitle TEXT,
  exhibition_benefits_content TEXT,
  exhibition_benefits_image TEXT,
  
  -- Bespoke Section
  bespoke_title TEXT,
  bespoke_subtitle TEXT,
  bespoke_description TEXT,
  
  -- Fresh Design Section
  fresh_design_title TEXT,
  fresh_design_subtitle TEXT,
  fresh_design_description TEXT,
  
  -- Cost Section
  cost_section_title TEXT,
  cost_section_subtitle TEXT,
  cost_section_description TEXT,
  
  -- Points Table Section
  points_table_title TEXT,
  points_table_content TEXT,
  
  -- Meta Information
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert single comprehensive custom stands page record
INSERT INTO custom_stands_page (
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
  
  -- Stand Project Text Section
  stand_project_title,
  stand_project_highlight,
  stand_project_description,
  
  -- Exhibition Benefits Section
  exhibition_benefits_title,
  exhibition_benefits_subtitle,
  exhibition_benefits_content,
  exhibition_benefits_image,
  
  -- Bespoke Section
  bespoke_title,
  bespoke_subtitle,
  bespoke_description,
  
  -- Fresh Design Section
  fresh_design_title,
  fresh_design_subtitle,
  fresh_design_description,
  
  -- Cost Section
  cost_section_title,
  cost_section_subtitle,
  cost_section_description,
  
  -- Points Table Section
  points_table_title,
  points_table_content,
  
  is_active
) VALUES (
  -- SEO Metadata
  'Custom Exhibition Stands Design & Build Services',
  'Professional custom exhibition stand design and build services. Create unique, eye-catching displays that represent your brand perfectly at trade shows and exhibitions.',
  
  -- Hero Section
  'CUSTOM EXHIBITION STANDS',
  'DESIGN & BUILD',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
  
  -- Benefits Section
  'BENEFITS OF CUSTOM EXHIBITION STAND:',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
  '<ul><li><strong>Custom stand designs</strong> are tailored to your brand, accurately representing your company''s values.</li><li><strong>Bespoke exhibition booths</strong> are visually attractive, capturing visitors'' attention and creating a buzz on the show floor.</li><li>They feature <em>interactive elements</em>, live presentations, and product demonstrations, encouraging more visitor engagement.</li><li>Custom booths create <strong>unique experiences</strong>, forge relationships, and make your brand memorable.</li><li>These booths enhance visitor engagement with <em>interactive elements</em> and live demonstrations.</li></ul>',
  
  -- Stand Project Text Section
  'SOME OF OUR',
  'CUSTOM EXHIBITION STAND',
  'Check some of the designs aesthetically created and delivered in the best quality by our professional bespoke exhibition stand builders. The below pictures demonstrate our specially tailored exhibition stands to meet the <strong>client''s objectives</strong> and maximise the expo''s success.',
  
  -- Exhibition Benefits Section
  'Why Choose Our Exhibition Stands?',
  'Discover the advantages that make our stands unique and effective.',
  '<ul><li><strong>Tailor-made designs</strong> to match your brand identity with precision.</li><br><li><strong>High-quality materials</strong> ensuring durability and elegance throughout the event.</li><br><li><em>Eco-friendly and sustainable</em> production methods for responsible marketing.</li><br><li><strong>On-time delivery</strong> and hassle-free installation by our expert team.</li><br><li><strong>Cost-effective solutions</strong> without compromising on quality or impact.</li></ul>',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
  
  -- Bespoke Section
  'A BESPOKE EXHIBITION STAND:',
  'SETTING YOUR BRAND APART',
  'We are known for our adaptability and expertise in creating exhibition stand designs that set your brand''s story and connect the brand with the audience on an emotional level. Our experience has taught us that a well-designed exhibition stand can present your brand better and make a real difference on the show floor. As a bespoke exhibition stand design company, we tailor customized exhibition stands to communicate your brand''s message, core values, and set your brand apart from the competition. Exhibiting with these bespoke stands means ensuring your brand gets the attention it deserves.',
  
  -- Fresh Design Section
  'ARE YOU LOOKING FOR',
  'A FRESH STAND DESIGN FOR YOUR NEXT EVENT?',
  'Our team of professional exhibition stand designers will connect with your marketing team to understand your brand needs. Then, they will transform your vision into a perfect custom exhibition stand modelling your exact requirements. Our expert custom exhibition stand builders will do an in-depth study of your brand and then consider interactive elements, graphics, branded space, and formal goals. Our overall aim is to build a stand that perfectly represents your company''s values.',
  
  -- Cost Section
  'IS DESIGNING AND BUILDING',
  'CUSTOM EXHIBITION STAND COSTLY?',
  'We take pride in offering custom exhibition stand design and build services at the most competitive and cost-effective prices. We manage expenses wisely as we have in-house manufacturing units where we create high-quality portable stands, taking care of all costs related to printing, transportation, etc. We aim to create an exciting exhibition stand experience for your visitors while ensuring your investment delivers maximum ROI.',
  
  -- Points Table Section
  'Key Benefits of Our Custom Stands',
  '<ul><li><strong>Tailor-made designs</strong> to match your brand identity with our expert designers</li><br><li><strong>High-quality materials</strong> ensuring durability and elegant appearance</li><br><li><strong>Cost-effective solutions</strong> with maximum visual impact and ROI</li><br><li><strong>Easy setup and dismantle</strong> for convenience at trade shows</li></ul><br><p>Our custom stands are designed with your brand in mind, offering personalized solutions that highlight your unique identity. We ensure that every element reflects your brand''s core values and messaging.</p><br><p>We use premium materials to ensure durability while keeping the structure lightweight and portable. Our manufacturing process guarantees both quality and sustainability.</p><br><p>Whether you are showcasing at trade fairs, exhibitions, or corporate events, our stands are optimized to make a lasting impression and generate quality leads.</p>',
  
  true
);

-- Create storage bucket for custom stands images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'custom-stands-images',
  'custom-stands-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Enable Row Level Security (RLS)
ALTER TABLE custom_stands_page ENABLE ROW LEVEL SECURITY;

-- Policies for custom_stands_page table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active custom stands page content" ON custom_stands_page
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all custom stands page content" ON custom_stands_page
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert custom stands page content" ON custom_stands_page
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update custom stands page content" ON custom_stands_page
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete custom stands page content" ON custom_stands_page
FOR DELETE TO authenticated
USING (true);

-- Storage policies for custom-stands-images bucket
-- Allow public read access to custom stands images
CREATE POLICY "Allow public read access to custom stands images" ON storage.objects
FOR SELECT USING (bucket_id = 'custom-stands-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload custom stands images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'custom-stands-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Allow authenticated users to update custom stands images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'custom-stands-images')
WITH CHECK (bucket_id = 'custom-stands-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete custom stands images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'custom-stands-images');

-- Create indexes for better performance
CREATE INDEX idx_custom_stands_page_is_active ON custom_stands_page(is_active);
CREATE INDEX idx_custom_stands_page_created_at ON custom_stands_page(created_at);
CREATE INDEX idx_custom_stands_page_slug ON custom_stands_page(slug);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_custom_stands_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_custom_stands_page_updated_at 
BEFORE UPDATE ON custom_stands_page 
FOR EACH ROW EXECUTE FUNCTION update_custom_stands_updated_at_column();

-- Create function to get custom stands page data in structured format (single row)
CREATE OR REPLACE FUNCTION get_custom_stands_page_data()
RETURNS JSON AS $$
DECLARE
    custom_stands_record RECORD;
    result JSON;
BEGIN
    -- Get the single active custom stands page record
    SELECT * INTO custom_stands_record
    FROM custom_stands_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', custom_stands_record.meta_title,
            'description', custom_stands_record.meta_description
        ),
        'hero', json_build_object(
            'title', custom_stands_record.hero_title,
            'subtitle', custom_stands_record.hero_subtitle,
            'backgroundImage', custom_stands_record.hero_background_image
        ),
        'benefits', json_build_object(
            'title', custom_stands_record.benefits_title,
            'image', custom_stands_record.benefits_image,
            'content', custom_stands_record.benefits_content
        ),
        'StandProjectText', json_build_object(
            'title', custom_stands_record.stand_project_title,
            'highlight', custom_stands_record.stand_project_highlight,
            'description', custom_stands_record.stand_project_description
        ),
        'exhibitionBenefits', json_build_object(
            'title', custom_stands_record.exhibition_benefits_title,
            'subtitle', custom_stands_record.exhibition_benefits_subtitle,
            'content', custom_stands_record.exhibition_benefits_content,
            'image', custom_stands_record.exhibition_benefits_image
        ),
        'bespoke', json_build_object(
            'title', custom_stands_record.bespoke_title,
            'subtitle', custom_stands_record.bespoke_subtitle,
            'description', custom_stands_record.bespoke_description
        ),
        'freshDesign', json_build_object(
            'title', custom_stands_record.fresh_design_title,
            'subtitle', custom_stands_record.fresh_design_subtitle,
            'description', custom_stands_record.fresh_design_description
        ),
        'costSection', json_build_object(
            'title', custom_stands_record.cost_section_title,
            'subtitle', custom_stands_record.cost_section_subtitle,
            'description', custom_stands_record.cost_section_description
        ),
        'pointsTable', json_build_object(
            'title', custom_stands_record.points_table_title,
            'content', custom_stands_record.points_table_content
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;