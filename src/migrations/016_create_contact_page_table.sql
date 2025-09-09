-- Create comprehensive contact page table with all page content in a single table
CREATE TABLE contact_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Meta Information for SEO
  meta_title TEXT DEFAULT 'Contact Us - Exhibition Stand Solutions | RADON SP. Z.O.O.',
  meta_description TEXT DEFAULT 'Get in touch with RADON SP. Z.O.O. for exhibition stand design, construction, and project management services across Europe.',
  meta_keywords TEXT DEFAULT 'contact us, exhibition services, stand design, booth construction, trade show services, project management, Europe',
  
  -- Hero Section
  hero_title TEXT,
  hero_background_image TEXT,
  hero_background_image_alt TEXT DEFAULT 'Contact Us header image',
  
  -- Contact Info Section
  contact_info_title TEXT,
  contact_info_address TEXT,
  contact_info_full_address TEXT,
  contact_info_phone_1 TEXT,
  contact_info_phone_2 TEXT,
  contact_info_email TEXT,
  
  -- Form Fields Configuration (stored as JSON for flexibility)
  form_fields JSONB,
  
  -- Other Offices Section
  other_offices_title TEXT,
  other_offices JSONB, -- Array of office objects
  
  -- Support Section
  support_title TEXT,
  support_description TEXT,
  support_items JSONB, -- Array of support item objects
  
  -- Map Section
  map_embed_url TEXT,
  
  -- Status and Timestamps
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert single comprehensive contact page record
INSERT INTO contact_page (
  -- Meta Information
  meta_title,
  meta_description,
  meta_keywords,
  
  -- Hero Section Data
  hero_title,
  hero_background_image,
  hero_background_image_alt,
  
  -- Contact Info Section
  contact_info_title,
  contact_info_address,
  contact_info_full_address,
  contact_info_phone_1,
  contact_info_phone_2,
  contact_info_email,
  
  -- Form Fields Configuration
  form_fields,
  
  -- Other Offices Section
  other_offices_title,
  other_offices,
  
  -- Support Section
  support_title,
  support_description,
  support_items,
  
  -- Map Section
  map_embed_url,
  
  -- Status
  is_active
) VALUES (
  -- Meta Information
  'Contact Us - Exhibition Stand Solutions | RADON SP. Z.O.O.',
  'Get in touch with RADON SP. Z.O.O. for exhibition stand design, construction, and project management services across Europe.',
  'contact us, exhibition services, stand design, booth construction, trade show services, project management, Europe',
  
  -- Hero Section
  'CONTACT US',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80',
  'Contact Us header image',
  
  -- Contact Info Section
  'Contact Us',
  'RADON SP. Z.O.O.',
  'Ul. Gorzowska 2B, 65 - 127 Nefana Góra, Poland',
  '+4 678 789 4774',
  '+48 531 904 068',
  'enquiry@radonexhibitions.pl',
  
  -- Form Fields Configuration
  '[
    {"name": "firstName", "type": "text", "placeholder": "Your Name*", "required": true},
    {"name": "email", "type": "email", "placeholder": "Email ID*", "required": true},
    {"name": "phone", "type": "tel", "placeholder": "Phone Number", "required": false},
    {"name": "country", "type": "text", "placeholder": "Your Country*", "required": true},
    {"name": "additionalInfo", "type": "textarea", "placeholder": "Additional Information*", "required": true}
  ]'::JSONB,
  
  -- Other Offices Section
  'OTHER OFFICES',
  '[
    {
      "name": "Chronicle Exhibits DUBAI",
      "address": "Street 5 Lootah Warehouses - WH#11 - 11th St - Mina Jebel Ali - Industrial Area 1 - Dubai - United Arab Emirates",
      "phone": "+971 54 347 4645",
      "email": "info@chronicleexhibits.ae",
      "website": "chronicleexhibits.com"
    },
    {
      "name": "Chronicle Exhibits GERMANY",
      "address": "Mühlenkamp 55, 22303 Hamburg, Germany",
      "phone": "+49 40 1234 5678",
      "email": "info@chronicleexhibits.de",
      "website": "chronicleexhibits.com"
    }
  ]'::JSONB,
  
  -- Support Section
  'SUPPORT',
  'Your exhibition''s success is our commitment. We are here to provide dedicated support for you and your clients, ensuring a seamless experience.',
  '[
    {
      "icon": "design",
      "title": "GET FREE DESIGN",
      "description": "Receive free initially crafted exhibition stand design just for your brand and get ready to stand out at the next event."
    },
    {
      "icon": "submit",
      "title": "SUBMIT YOUR DESIGN",
      "description": "Already have a design? Submit your exhibition stand services for your seamless experience. From design to installation, we have got you covered."
    },
    {
      "icon": "phone",
      "title": "GET PHONE CALL",
      "description": "Ready for quickest service? Call your exhibition stand requirements to us, we are here to support your exhibition stand requirements delivered on time."
    }
  ]'::JSONB,
  
  -- Map Section
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2432.5!2d15.2!3d52.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDI0JzAwLjAiTiAxNcKwMTInMDAuMCJF!5e0!3m2!1sen!2spl!4v1234567890',
  
  -- Status
  true
);

-- Create storage bucket for contact page images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'contact-images',
  'contact-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_page ENABLE ROW LEVEL SECURITY;

-- Policies for contact_page table
-- Allow public read access for active content
CREATE POLICY "Allow public read access for active contact content" ON contact_page
FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all content (including inactive)
CREATE POLICY "Allow authenticated users to read all contact content" ON contact_page
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new content
CREATE POLICY "Allow authenticated users to insert contact content" ON contact_page
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update contact content" ON contact_page
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete content
CREATE POLICY "Allow authenticated users to delete contact content" ON contact_page
FOR DELETE TO authenticated
USING (true);

-- Storage policies for contact-images bucket
-- Allow public read access to contact images
CREATE POLICY "Allow public read access to contact images" ON storage.objects
FOR SELECT USING (bucket_id = 'contact-images');

-- Allow authenticated users to upload contact images
CREATE POLICY "Allow authenticated users to upload contact images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'contact-images');

-- Allow authenticated users to update their uploaded contact images
CREATE POLICY "Allow authenticated users to update contact images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'contact-images')
WITH CHECK (bucket_id = 'contact-images');

-- Allow authenticated users to delete contact images
CREATE POLICY "Allow authenticated users to delete contact images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'contact-images');

-- Create indexes for better performance
CREATE INDEX idx_contact_page_is_active ON contact_page(is_active);
CREATE INDEX idx_contact_page_created_at ON contact_page(created_at);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_page_updated_at 
BEFORE UPDATE ON contact_page 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get contact page data in structured format (single row)
CREATE OR REPLACE FUNCTION get_contact_page_data()
RETURNS JSON AS $$
DECLARE
    page_record RECORD;
    result JSON;
BEGIN
    -- Get the single active page record
    SELECT * INTO page_record
    FROM contact_page 
    WHERE is_active = true
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Structure the data according to TypeScript interfaces
    SELECT json_build_object(
        'meta', json_build_object(
            'title', page_record.meta_title,
            'description', page_record.meta_description,
            'keywords', page_record.meta_keywords
        ),
        'hero', json_build_object(
            'title', page_record.hero_title,
            'backgroundImage', page_record.hero_background_image
        ),
        'contactInfo', json_build_object(
            'title', page_record.contact_info_title,
            'address', page_record.contact_info_address,
            'fullAddress', page_record.contact_info_full_address,
            'phone', ARRAY[page_record.contact_info_phone_1, page_record.contact_info_phone_2],
            'email', page_record.contact_info_email
        ),
        'formFields', page_record.form_fields,
        'otherOffices', json_build_object(
            'title', page_record.other_offices_title,
            'offices', page_record.other_offices
        ),
        'support', json_build_object(
            'title', page_record.support_title,
            'description', page_record.support_description,
            'items', page_record.support_items
        ),
        'map', json_build_object(
            'embedUrl', page_record.map_embed_url
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;