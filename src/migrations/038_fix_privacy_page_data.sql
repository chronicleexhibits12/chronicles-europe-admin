-- Fix privacy page data to ensure it exists and is active
-- This migration ensures there's at least one active privacy page record

-- First, check if the record with our known ID exists
-- If it exists but is inactive, activate it
UPDATE privacy_page 
SET is_active = true, 
    updated_at = NOW()
WHERE id = '11111111-1111-1111-1111-111111111111' 
AND is_active = false;

-- If the record doesn't exist at all, insert it
INSERT INTO privacy_page (
    id,
    title,
    meta_title,
    meta_description,
    meta_keywords,
    content,
    is_active
) 
SELECT 
    '11111111-1111-1111-1111-111111111111',
    'Privacy Policy',
    'Privacy Policy - Chronicles Europe',
    'Learn how Chronicles Europe collects, uses, and protects your personal information. Our privacy policy outlines your rights and our responsibilities.',
    'privacy policy, data protection, personal information, GDPR, privacy rights, data security',
    '<h1>Privacy Policy</h1><p><strong>Last Updated: October 8, 2025</strong></p><h2>1. Introduction</h2><p>Chronicles Europe ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website chronicleseurope.com (the "Site"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Site.</p><h2>2. Information We Collect</h2><p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p><p><strong>Personal Data</strong><br>Personally identifiable information, such as your name, shipping address, email address, telephone number, and any other information that identifies you as an individual, that you voluntarily give to us when choosing to participate in various activities related to the Site.</p><p><strong>Derivative Data</strong><br>Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</p><p><strong>Financial Data</strong><br>Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange products or services.</p><h2>3. Use of Your Information</h2><p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p><ul><li>Create and manage your account</li><li>Process transactions and send related information</li><li>Send you marketing communications</li><li>Respond to your comments, questions, and provide customer service</li><li>Monitor and analyze usage and trends</li><li>Improve the Site and enhance user experience</li><li>Enforce our terms and conditions</li><li>Protect against fraudulent, unauthorized, or illegal activity</li></ul><h2>4. Disclosure of Your Information</h2><p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p><p><strong>By Law or to Protect Rights</strong><br>If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</p><p><strong>Third-Party Service Providers</strong><br>We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</p><h2>5. Security of Your Information</h2><p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p><h2>6. Policy for Children</h2><p>We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us.</p><h2>7. Controls for Do-Not-Track Features</h2><p>Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.</p><h2>8. Options Regarding Your Information</h2><p>You may at any time review or change the information in your account or terminate your account by:</p><ul><li>Logging into your account settings and updating your user profile</li><li>Contacting us using the contact information provided below</li></ul><h2>9. Contact Us</h2><p>If you have questions or comments about this Privacy Policy, please contact us at:</p><p>Chronicles Europe<br>Email: privacy@chronicleseurope.com</p><h2>10. Changes to This Privacy Policy</h2><p>We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy.</p>',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM privacy_page WHERE id = '11111111-1111-1111-1111-111111111111'
);

-- Ensure at least one privacy page is active
-- If for some reason our specific record is missing or inactive, activate any existing record
UPDATE privacy_page 
SET is_active = true,
    updated_at = NOW()
WHERE is_active = false
AND id IN (
    SELECT id FROM privacy_page 
    ORDER BY created_at DESC 
    LIMIT 1
)
AND NOT EXISTS (
    SELECT 1 FROM privacy_page 
    WHERE id = '11111111-1111-1111-1111-111111111111' 
    AND is_active = true
);

-- If there are no active privacy pages at all, activate the most recently created one
UPDATE privacy_page 
SET is_active = true,
    updated_at = NOW()
WHERE is_active = false
AND NOT EXISTS (
    SELECT 1 FROM privacy_page 
    WHERE is_active = true
);