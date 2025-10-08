-- Create privacy_page table
CREATE TABLE IF NOT EXISTS privacy_page (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    meta_keywords TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE privacy_page ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to active privacy pages" 
ON privacy_page FOR SELECT 
TO public 
USING (is_active = true);

-- Grant permissions
GRANT SELECT ON privacy_page TO anon;
GRANT ALL ON privacy_page TO authenticated;

-- Insert default privacy page data
INSERT INTO privacy_page (
    id,
    title,
    meta_title,
    meta_description,
    meta_keywords,
    content
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Privacy Policy',
    'Privacy Policy - Chronicles Europe',
    'Learn how Chronicles Europe collects, uses, and protects your personal information. Our privacy policy outlines your rights and our responsibilities.',
    'privacy policy, data protection, personal information, GDPR, privacy rights, data security',
    '<h1>Privacy Policy</h1><p><strong>Last Updated: September 18, 2025</strong></p><h2>1. Introduction</h2><p>Chronicles Europe ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website chronicleseurope.com (the "Site"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Site.</p><h2>2. Information We Collect</h2><p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p><p><strong>Personal Data</strong><br>Personally identifiable information, such as your name, shipping address, email address, telephone number, and any other information that identifies you as an individual, that you voluntarily give to us when choosing to participate in various activities related to the Site.</p><p><strong>Derivative Data</strong><br>Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</p><p><strong>Financial Data</strong><br>Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange products or services.</p><h2>3. Use of Your Information</h2><p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p><ul><li>Create and manage your account</li><li>Process transactions and send related information</li><li>Send you marketing communications</li><li>Respond to your comments, questions, and provide customer service</li><li>Monitor and analyze usage and trends</li><li>Improve the Site and enhance user experience</li><li>Enforce our terms and conditions</li><li>Protect against fraudulent, unauthorized, or illegal activity</li></ul><h2>4. Disclosure of Your Information</h2><p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p><p><strong>By Law or to Protect Rights</strong><br>If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</p><p><strong>Third-Party Service Providers</strong><br>We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</p><h2>5. Security of Your Information</h2><p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p><h2>6. Policy for Children</h2><p>We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us.</p><h2>7. Controls for Do-Not-Track Features</h2><p>Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.</p><h2>8. Options Regarding Your Information</h2><p>You may at any time review or change the information in your account or terminate your account by:</p><ul><li>Logging into your account settings and updating your user profile</li><li>Contacting us using the contact information provided below</li></ul><h2>9. Contact Us</h2><p>If you have questions or comments about this Privacy Policy, please contact us at:</p><p>Chronicles Europe<br>Email: privacy@chronicleseurope.com</p><h2>10. Changes to This Privacy Policy</h2><p>We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy.</p>'
);

-- Create function to get privacy page data
CREATE OR REPLACE FUNCTION get_privacy_page_data()
RETURNS JSON
LANGUAGE sql
AS $$
    SELECT row_to_json(privacy_page) 
    FROM privacy_page 
    WHERE is_active = true 
    LIMIT 1;
$$;

-- Create or replace trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_privacy_page_updated_at ON privacy_page;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_privacy_page_updated_at 
    BEFORE UPDATE ON privacy_page 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();