-- Create comprehensive pavilion_design_page table with detailed columns for all sections
CREATE TABLE pavilion_design_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- SEO Metadata
  meta_title TEXT,
  meta_description TEXT,
  slug TEXT DEFAULT 'pavilion-design',
  
  -- Hero Section
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_background_image TEXT,
  
  -- Why Choose Section
  why_choose_title TEXT,
  why_choose_content TEXT,
  
  -- Benefits Section
  benefits_title TEXT,
  benefits_image TEXT,
  benefits_content TEXT,
  
  -- Stand Project Text Section
  stand_project_title TEXT,
  stand_project_highlight TEXT,
  stand_project_description TEXT,
  
  -- Advantages Section
  advantages_title TEXT,
  advantages_image TEXT,
  advantages_content TEXT,
  
  -- Our Expertise Section
  our_expertise_title TEXT,
  our_expertise_content TEXT,
  
  -- Company Info Section
  company_info_title TEXT,
  company_info_content TEXT,
  
  -- Meta Information
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert single comprehensive pavilion design page record
INSERT INTO pavilion_design_page (
  -- SEO Metadata
  meta_title,
  meta_description,
  
  -- Hero Section
  hero_title,
  hero_subtitle,
  hero_background_image,
  
  -- Why Choose Section
  why_choose_title,
  why_choose_content,
  
  -- Benefits Section
  benefits_title,
  benefits_image,
  benefits_content,
  
  -- Stand Project Text Section
  stand_project_title,
  stand_project_highlight,
  stand_project_description,
  
  -- Advantages Section
  advantages_title,
  advantages_image,
  advantages_content,
  
  -- Our Expertise Section
  our_expertise_title,
  our_expertise_content,
  
  -- Company Info Section
  company_info_title,
  company_info_content,
  
  is_active
) VALUES (
  -- SEO Metadata
  'Exhibition Pavilion Design & Build Services',
  'Professional exhibition pavilion design and build services. Create unique, eye-catching pavilion displays that represent your brand perfectly at trade shows and exhibitions.',
  
  -- Hero Section
  'EXHIBITION PAVILION DESIGN',
  'DESIGN & BUILD',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
  
  -- Why Choose Section
  'WHY TO CHOOSE US?',
  '<p>We have our manufacturing units in Germany and Poland which are equipped with modern machinery and printing technologies. So, with us, you''ll not have to worry about storage and on-time delivery part.</p><p>We have a team of expert, qualified, skilled, and experienced 3D designers, visualizers, and copywriters who design, build, and manufacture your expo pavilion on the basis of your marketing needs.</p><p>We also provide on-site supervision during the trade show. Even if you have an emergency, our team''s problem-solving capability will help you resolve that issue.</p>',
  
  -- Benefits Section
  'BENEFITS OF PAVILION EXHIBITION STANDS:',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop',
  '<ul><li>As pavilion booths bring together a group of different brands in one place so offer the best space for collaboration, engagement, and knowledge exchange.</li><li>Pavilion stands are cost-effective as small enterprises can gain exposure without bearing the cost of large stand-alone exhibitions.</li><li>Pavilion vendors offer greater visibility as multiple companies are sharing the same area which draws the attention of attendees.</li><li>Pavilion booth allows exhibitors to collectively use the shared spaces like meeting rooms, and storage space for storing their marketing materials.</li></ul>',
  
  -- Stand Project Text Section
  'SOME OF OUR',
  'EXHIBITION PAVILION DESIGNS',
  '<p>Check some of the designs aesthetically created and delivered in the best quality by our professional exhibition pavilion designers. The below pictures demonstrate our specially tailored pavilion designs to meet the <strong>client''s objectives</strong> and maximise the expo''s success.</p>',
  
  -- Advantages Section
  'ADVANTAGES OF CUSTOM EXHIBITION SOLUTIONS:',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
  '<ul><li>Custom-built pavilions provide unique brand identity and help companies stand out from competitors with distinctive design elements and innovative layouts.</li><li>Modular construction allows for easy reconfiguration and reuse across multiple events, maximizing return on investment and reducing long-term costs.</li><li>Advanced lighting systems and interactive technology integration create immersive experiences that engage visitors and generate quality leads.</li><li>Sustainable materials and eco-friendly construction methods align with corporate social responsibility goals while maintaining aesthetic appeal.</li></ul>',
  
  -- Our Expertise Section
  'OUR EXPERTISE & EXPERIENCE',
  '<p>With over two decades of experience in the exhibition industry, we have mastered the art of creating impactful pavilion designs that drive business results and enhance brand visibility.</p><p>Our team consists of certified architects, interior designers, and project managers who understand the nuances of different industries and can tailor solutions accordingly.</p><p>We utilize cutting-edge technology including 3D modeling, virtual reality previews, and advanced construction techniques to ensure precision in every project we undertake.</p><p>Our global presence spans across Europe, Asia, and the Middle East, allowing us to serve clients worldwide with consistent quality and local expertise.</p><p>We maintain strategic partnerships with leading material suppliers and logistics companies to ensure cost-effective solutions without compromising on quality standards.</p><p>Our post-installation support includes maintenance services, storage solutions, and modification capabilities to extend the lifecycle of your exhibition investments.</p>',
  
  -- Company Info Section
  'RADON SP Z.O.O. AND ITS STAND-BUILDING SERVICES',
  '<ul><li>As a premier exhibition stand builder in Europe, we offer a range of services and solutions in all the major exhibiting countries across Europe, including the Netherlands, Germany, Spain, and others.</li><li>We always aim to understand the client''s marketing goals and deliver a perfect exhibition position.</li><li>We use an integrated approach and methodology that ensures outstanding results every time we take up a project.</li><li>Since 2003, we have been providing project-only solutions with a deep understanding of client''s marketing goals.</li><li>Our team consists of certified architects, interior designers, and project managers who understand the nuances of different industries.</li><li>We maintain strategic partnerships with leading material suppliers and logistics companies to ensure cost-effective solutions without compromising on quality standards.</li></ul>',
  
  true
);

-- Create storage bucket for pavilion design images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pavilion-design-images',
  'pavilion-design-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Enable Row Level Security (RLS)
ALTER TABLE pavilion_design_page ENABLE ROW LEVEL SECURITY;

-- Policies for pavilion_design_page table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active pavilion design page content" ON pavilion_design_page
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all pavilion design page content" ON pavilion_design_page
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert pavilion design page content" ON pavilion_design_page
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update pavilion design page content" ON pavilion_design_page
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete pavilion design page content" ON pavilion_design_page
FOR DELETE TO authenticated
USING (true);

-- Storage policies for pavilion-design-images bucket
-- Allow public read access to pavilion design images
CREATE POLICY "Allow public read access to pavilion design images" ON storage.objects
FOR SELECT USING (bucket_id = 'pavilion-design-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload pavilion design images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'pavilion-design-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Allow authenticated users to update pavilion design images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'pavilion-design-images')
WITH CHECK (bucket_id = 'pavilion-design-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete pavilion design images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'pavilion-design-images');

-- Create indexes for better performance
CREATE INDEX idx_pavilion_design_page_is_active ON pavilion_design_page(is_active);
CREATE INDEX idx_pavilion_design_page_created_at ON pavilion_design_page(created_at);
CREATE INDEX idx_pavilion_design_page_slug ON pavilion_design_page(slug);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pavilion_design_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_pavilion_design_page_updated_at 
BEFORE UPDATE ON pavilion_design_page 
FOR EACH ROW EXECUTE FUNCTION update_pavilion_design_updated_at_column();

-- Create function to get pavilion design page data in structured format (single row)
CREATE OR REPLACE FUNCTION get_pavilion_design_page_data()
RETURNS JSON AS $$
DECLARE
    pavilion_record RECORD;
    result JSON;
BEGIN
    -- Get the single active pavilion design page record
    SELECT * INTO pavilion_record
    FROM pavilion_design_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', pavilion_record.meta_title,
            'description', pavilion_record.meta_description
        ),
        'hero', json_build_object(
            'title', pavilion_record.hero_title,
            'subtitle', pavilion_record.hero_subtitle,
            'backgroundImage', pavilion_record.hero_background_image
        ),
        'whyChoose', json_build_object(
            'title', pavilion_record.why_choose_title,
            'content', pavilion_record.why_choose_content
        ),
        'benefits', json_build_object(
            'title', pavilion_record.benefits_title,
            'image', pavilion_record.benefits_image,
            'content', pavilion_record.benefits_content
        ),
        'StandProjectText', json_build_object(
            'title', pavilion_record.stand_project_title,
            'highlight', pavilion_record.stand_project_highlight,
            'description', pavilion_record.stand_project_description
        ),
        'advantages', json_build_object(
            'title', pavilion_record.advantages_title,
            'image', pavilion_record.advantages_image,
            'content', pavilion_record.advantages_content
        ),
        'ourExpertise', json_build_object(
            'title', pavilion_record.our_expertise_title,
            'content', pavilion_record.our_expertise_content
        ),
        'companyInfo', json_build_object(
            'title', pavilion_record.company_info_title,
            'content', pavilion_record.company_info_content
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;