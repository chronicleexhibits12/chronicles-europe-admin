-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_type VARCHAR(50) NOT NULL,
    submission_data JSONB NOT NULL,
    documents JSONB, -- Store file metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type ON form_submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);

-- Disable Row Level Security (RLS) completely
ALTER TABLE form_submissions DISABLE ROW LEVEL SECURITY;

-- Remove any existing policies
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON form_submissions;
DROP POLICY IF EXISTS "Allow insert access for all users" ON form_submissions;
DROP POLICY IF EXISTS "Allow update access for authenticated users" ON form_submissions;
DROP POLICY IF EXISTS "Allow delete access for authenticated users" ON form_submissions;

-- Grant all permissions to all roles
GRANT ALL ON form_submissions TO PUBLIC;

-- Create storage bucket for form uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'form-uploads',
  'form-uploads',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Remove any existing storage policies
DROP POLICY IF EXISTS "Allow public read access to form uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all users to upload form files" ON storage.objects;
DROP POLICY IF EXISTS "Allow all users to update form files" ON storage.objects;
DROP POLICY IF EXISTS "Allow all users to delete form files" ON storage.objects;

-- Grant all storage permissions to all users
GRANT ALL ON storage.objects TO PUBLIC;

-- Function to process and store uploaded files
-- This function will be called when a form with file uploads is submitted
CREATE OR REPLACE FUNCTION process_form_file_upload(
    file_name TEXT,
    file_data BYTEA,
    form_type TEXT,
    submission_id UUID
)
RETURNS TEXT AS $$
DECLARE
    file_path TEXT;
    upload_result storage.objects%ROWTYPE;
BEGIN
    -- Create a unique file path using form type and submission ID
    file_path := form_type || '/' || submission_id::TEXT || '/' || file_name;
    
    -- Upload the file to storage
    -- In practice, this would be handled by the client-side SDK
    -- This is a placeholder for documentation purposes
    RETURN file_path;
END;
$$ LANGUAGE plpgsql;

-- Function to generate public URL for uploaded files
CREATE OR REPLACE FUNCTION get_form_file_url(file_path TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Return the public URL for the file
    -- This is a placeholder for documentation purposes
    RETURN 'https://your-supabase-url.supabase.co/storage/v1/object/public/form-uploads/' || file_path;
END;
$$ LANGUAGE plpgsql;

-- Workflow documentation:
-- 1. User selects files from their PC using file input fields
-- 2. User fills out the form with their information
-- 3. When user submits the form:
--    a. Form data is validated on the client side
--    b. Files are uploaded to the 'form-uploads' bucket using Supabase storage SDK
--    c. File metadata (name, size, type, path) is stored in the documents JSONB field
--    d. Form submission data is inserted into the form_submissions table
-- 4. Files are stored in the bucket with the path structure: form_type/submission_id/filename
-- 5. Files can be accessed publicly via the generated URLs