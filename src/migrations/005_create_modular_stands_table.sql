-- Create comprehensive modular_stands_page table with detailed columns for all sections
CREATE TABLE modular_stands_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- SEO Metadata
  meta_title TEXT,
  meta_description TEXT,
  slug TEXT DEFAULT 'modular-stands',
  
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
  
  -- Modular Diversity Section
  modular_diversity_title TEXT,
  modular_diversity_subtitle TEXT,
  modular_diversity_content TEXT,
  
  -- Fastest Construction Section
  fastest_construction_title TEXT,
  fastest_construction_subtitle TEXT,
  fastest_construction_description TEXT,
  
  -- Experts Section
  experts_title TEXT,
  experts_subtitle TEXT,
  experts_description TEXT,
  
  -- Meta Information
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert single comprehensive modular stands page record
INSERT INTO modular_stands_page (
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
  
  -- Points Table Section
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
  
  -- Modular Diversity Section
  modular_diversity_title,
  modular_diversity_subtitle,
  modular_diversity_content,
  
  -- Fastest Construction Section
  fastest_construction_title,
  fastest_construction_subtitle,
  fastest_construction_description,
  
  -- Experts Section
  experts_title,
  experts_subtitle,
  experts_description,
  
  is_active
) VALUES (
  -- SEO Metadata
  'Modular Exhibition Stands Design & Build Services',
  'Professional modular exhibition stand design and build services. Create flexible, cost-effective displays that can be reconfigured for multiple events and represent your brand perfectly at trade shows and exhibitions.',
  
  -- Hero Section
  'MODULAR EXHIBITION STANDS',
  'DESIGN & BUILD',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
  
  -- Benefits Section
  'BENEFITS OF MODULAR EXHIBITION STANDS:',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=400&fit=crop',
  '<ul><li>Modular exhibition stands offer exceptional versatility with components that can be rearranged to create completely different layouts for each event.</li><li>These systems feature lightweight yet durable materials that make transportation and setup significantly easier than traditional custom builds.</li><li>Cost efficiency is a major advantage, as modular components can be reused across multiple events, dramatically reducing long-term exhibition expenses.</li><li>The quick assembly process means your team can focus on preparing marketing materials rather than spending hours on complex construction.</li><li>Storage is simplified with compact cases that protect components and make warehouse organization straightforward.</li></ul>',
  
  -- Points Table Section
  'BENEFITS OF MODULAR EXHIBITION STANDS',
  '<ul><li>Rapid deployment systems that reduce setup time by up to 70% compared to traditional custom builds.</li><li>Reusable components that deliver significant cost savings over multiple events, with many clients seeing ROI within 2-3 exhibitions.</li><li>Flexible design options that can be easily modified to accommodate different products, messaging, or branding requirements.</li><li>Lightweight materials that simplify transportation and reduce shipping costs, particularly important for international exhibitions.</li><li>Durable construction that maintains professional appearance through years of repeated use across various environments.</li></ul><p>As pioneers in modular exhibition design since 2003, we''ve refined our systems to offer the perfect balance of affordability, functionality, and visual impact. Our modular solutions incorporate the latest materials and technologies, ensuring your booth stands out while remaining easy to manage. Each system is designed with European logistics in mind, optimizing for the region''s transportation networks and venue requirements.</p>',
  
  -- Stand Project Text Section
  'SOME OF OUR',
  'MODULAR EXHIBITION STANDS',
  '<p>Our portfolio showcases innovative modular designs that have helped brands across various industries make a lasting impression at trade shows throughout Europe. Each project demonstrates our commitment to combining functionality with striking visual appeal. From compact 10 square meter booths to expansive island displays, our modular solutions are engineered to maximize impact while minimizing setup complexity. These examples illustrate how our flexible systems can be adapted to different products, target audiences, and venue requirements while maintaining consistent brand messaging.</p>',
  
  -- Exhibition Benefits Section
  'BENEFITS OF MODULAR EXHIBITION STANDS:',
  'Discover why modular exhibition booths are the most practical and cost-effective solution for your brand in Europe.',
  '<ul><li>Economic efficiency through reusable components that eliminate the need for new builds at each event.</li><li>Time savings with streamlined setup processes that can be completed in hours rather than days.</li><li>Design flexibility allowing for easy updates to graphics and layout between exhibitions.</li><li>Storage convenience with compact packaging that requires minimal warehouse space.</li><li>Sustainability benefits through reduced waste and material consumption compared to traditional booth construction.</li></ul>',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
  
  -- Modular Diversity Section
  'MODULAR',
  'DIVERSITY',
  '<ul><li>Our modular systems include various frame options from aluminum extrusions to hybrid constructions, accommodating different design aesthetics and structural requirements for diverse exhibition environments.</li><li>Multiple panel types are available including fabric graphics, direct print, and SEG (Silicone Edge Graphics) for maximum visual impact, allowing for complete brand customization.</li><li>Specialized components such as LED lighting systems, interactive displays, touchscreen technology integration, and modular flooring options enhance functionality and visitor engagement.</li><li>Accessories like literature racks, product display shelves, counter units, and branded signage elements can be easily added or repositioned to adapt to changing marketing needs.</li><li>Advanced connectivity solutions including integrated power distribution, data cabling, and wireless networking capabilities ensure modern booth requirements are met.</li></ul>',
  
  -- Fastest Construction Section
  'FASTEST CONSTRUCTION',
  'OF MODULAR BOOTHS IN EUROPE',
  '<p>Our modular exhibition systems can be assembled in a fraction of the time required for custom builds, with most standard booths ready in under 4 hours. This rapid deployment is particularly valuable for European trade shows where setup time is limited. Our experienced team can handle everything from initial design to final installation, storing your modular components between events to ensure they''re always ready for your next exhibition. This approach saves you both time and money while ensuring consistent quality at every show.</p>',
  
  -- Experts Section
  'EXPERTS IN',
  'MODULAR BOOTHS',
  '<p>With over two decades of experience in the European exhibition industry, our team specializes in creating modular booth solutions that align with your brand identity and marketing objectives. We serve clients across major European markets including Germany, France, UK, Italy, Spain, and the Nordics, providing comprehensive support from initial concept through to on-site execution. Our expertise includes customizing modular systems to meet specific industry requirements, integrating advanced technology solutions, and ensuring compliance with venue regulations. We provide end-to-end service including design, production, logistics, installation, and dismantling, allowing you to focus on your exhibition goals while we handle all the technical details. Our dedicated project managers and skilled installation teams ensure seamless execution at every venue, with multilingual support available for international exhibitions.</p>',
  
  true
);

-- Create storage bucket for modular stands images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'modular-stands-images',
  'modular-stands-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Enable Row Level Security (RLS)
ALTER TABLE modular_stands_page ENABLE ROW LEVEL SECURITY;

-- Policies for modular_stands_page table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active modular stands page content" ON modular_stands_page
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all modular stands page content" ON modular_stands_page
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert modular stands page content" ON modular_stands_page
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update modular stands page content" ON modular_stands_page
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete modular stands page content" ON modular_stands_page
FOR DELETE TO authenticated
USING (true);

-- Storage policies for modular-stands-images bucket
-- Allow public read access to modular stands images
CREATE POLICY "Allow public read access to modular stands images" ON storage.objects
FOR SELECT USING (bucket_id = 'modular-stands-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload modular stands images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'modular-stands-images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Allow authenticated users to update modular stands images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'modular-stands-images')
WITH CHECK (bucket_id = 'modular-stands-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated users to delete modular stands images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'modular-stands-images');

-- Create indexes for better performance
CREATE INDEX idx_modular_stands_page_is_active ON modular_stands_page(is_active);
CREATE INDEX idx_modular_stands_page_created_at ON modular_stands_page(created_at);
CREATE INDEX idx_modular_stands_page_slug ON modular_stands_page(slug);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modular_stands_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_modular_stands_page_updated_at 
BEFORE UPDATE ON modular_stands_page 
FOR EACH ROW EXECUTE FUNCTION update_modular_stands_updated_at_column();

-- Create function to get modular stands page data in structured format (single row)
CREATE OR REPLACE FUNCTION get_modular_stands_page_data()
RETURNS JSON AS $$
DECLARE
    modular_stands_record RECORD;
    result JSON;
BEGIN
    -- Get the single active modular stands page record
    SELECT * INTO modular_stands_record
    FROM modular_stands_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', modular_stands_record.meta_title,
            'description', modular_stands_record.meta_description
        ),
        'hero', json_build_object(
            'title', modular_stands_record.hero_title,
            'subtitle', modular_stands_record.hero_subtitle,
            'backgroundImage', modular_stands_record.hero_background_image
        ),
        'benefits', json_build_object(
            'title', modular_stands_record.benefits_title,
            'image', modular_stands_record.benefits_image,
            'content', modular_stands_record.benefits_content
        ),
        'pointsTable', json_build_object(
            'title', modular_stands_record.points_table_title,
            'content', modular_stands_record.points_table_content
        ),
        'StandProjectText', json_build_object(
            'title', modular_stands_record.stand_project_title,
            'highlight', modular_stands_record.stand_project_highlight,
            'description', modular_stands_record.stand_project_description
        ),
        'exhibitionBenefits', json_build_object(
            'title', modular_stands_record.exhibition_benefits_title,
            'subtitle', modular_stands_record.exhibition_benefits_subtitle,
            'content', modular_stands_record.exhibition_benefits_content,
            'image', modular_stands_record.exhibition_benefits_image
        ),
        'modularDiversity', json_build_object(
            'title', modular_stands_record.modular_diversity_title,
            'subtitle', modular_stands_record.modular_diversity_subtitle,
            'content', modular_stands_record.modular_diversity_content
        ),
        'fastestConstruction', json_build_object(
            'title', modular_stands_record.fastest_construction_title,
            'subtitle', modular_stands_record.fastest_construction_subtitle,
            'description', modular_stands_record.fastest_construction_description
        ),
        'experts', json_build_object(
            'title', modular_stands_record.experts_title,
            'subtitle', modular_stands_record.experts_subtitle,
            'description', modular_stands_record.experts_description
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;