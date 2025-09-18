-- Create terms_page table
CREATE TABLE IF NOT EXISTS terms_page (
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
ALTER TABLE terms_page ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to active terms pages" 
ON terms_page FOR SELECT 
TO public 
USING (is_active = true);

-- Grant permissions
GRANT SELECT ON terms_page TO anon;
GRANT ALL ON terms_page TO authenticated;

-- Insert default terms page data
INSERT INTO terms_page (
    id,
    title,
    meta_title,
    meta_description,
    meta_keywords,
    content
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Terms and Conditions',
    'Terms and Conditions - Chronicles Europe',
    'Read the terms and conditions governing the use of Chronicles Europe website and services. Understand your rights and responsibilities as a user.',
    'terms and conditions, user agreement, website terms, service terms, legal agreement',
    '<h1>Terms and Conditions</h1><p><strong>Last Updated: September 18, 2025</strong></p><h2>1. Introduction</h2><p>Welcome to Chronicles Europe. These terms and conditions outline the rules and regulations for the use of Chronicles Europe''s Website, located at chronicleseurope.com. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Chronicles Europe if you do not agree to all of the terms and conditions stated on this page.</p><h2>2. Intellectual Property Rights</h2><p>Unless otherwise stated, Chronicles Europe and/or its licensors own the intellectual property rights for all material on Chronicles Europe. All intellectual property rights are reserved. You may access this from Chronicles Europe for your own personal use subjected to restrictions set in these terms and conditions.</p><p>You must not:</p><ul><li>Republish material from Chronicles Europe</li><li>Sell, rent, or sub-license material from Chronicles Europe</li><li>Reproduce, duplicate, or copy material from Chronicles Europe</li><li>Redistribute content from Chronicles Europe</li></ul><h2>3. User Comments</h2><p>This Agreement shall begin on the date hereof. Certain parts of this website offer the opportunity for users to post and exchange opinions and information in certain areas of the website. Chronicles Europe does not filter, edit, publish, or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Chronicles Europe, its agents, and/or affiliates.</p><p>Chronicles Europe reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive, or causes breach of these Terms.</p><h2>4. Hyperlinking to Our Content</h2><p>The following organizations may link to our Website without prior written approval:</p><ul><li>Government agencies</li><li>Search engines</li><li>News organizations</li><li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses</li><li>System-wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site</li></ul><h2>5. iFrames</h2><p>Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.</p><h2>6. Content Liability</h2><p>We shall not be held responsible for any content that appears on your Website. You agree to protect and defend us against all claims that are rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene, or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</p><h2>7. Reservation of Rights</h2><p>We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</p><h2>8. Removal of Links from Our Website</h2><p>If you find any link on our Website that is offensive for any reason, you are free to contact and inform us at any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.</p><h2>9. Disclaimer</h2><p>To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p><ul><li>Limit or exclude our or your liability for death or personal injury</li><li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation</li><li>Limit any of our or your liabilities in any way that is not permitted under applicable law</li><li>Exclude any of our or your liabilities that may not be excluded under applicable law</li></ul><p>The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort (including negligence), and for breach of statutory duty.</p><h2>10. Service Description</h2><p>Chronicles Europe provides exhibition stand design and construction services across Europe. Our services include but are not limited to:</p><ul><li>Custom exhibition stand design and build</li><li>Modular exhibition stand solutions</li><li>Double decker exhibition stands</li><li>Exhibition pavilion design and construction</li><li>Project management and on-site supervision</li><li>Graphic production and installation</li></ul><h2>11. Service Agreement</h2><p>By engaging our services, you agree to the following:</p><ul><li>All project specifications and requirements must be provided in writing</li><li>Changes to project scope may result in additional charges</li><li>Payment terms are as specified in the service agreement</li><li>All designs and materials remain our property until full payment is received</li><li>We are not liable for delays caused by force majeure events</li></ul><h2>12. Governing Law</h2><p>These terms and conditions are governed by and construed in accordance with the laws of Poland, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p><h2>13. Contact Information</h2><p>If you have any questions about these Terms and Conditions, please contact us at:</p><p>Chronicles Europe<br>Email: terms@chronicleseurope.com<br>Phone: +48 531 904 068</p>'
);

-- Create function to get terms page data
CREATE OR REPLACE FUNCTION get_terms_page_data()
RETURNS JSON
LANGUAGE sql
AS $$
    SELECT row_to_json(terms_page) 
    FROM terms_page 
    WHERE is_active = true 
    LIMIT 1;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_terms_page_updated_at 
    BEFORE UPDATE ON terms_page 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();