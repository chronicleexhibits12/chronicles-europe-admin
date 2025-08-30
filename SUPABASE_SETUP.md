# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be ready

## 2. Get Your Credentials

1. Go to Project Settings > API
2. Copy your Project URL and anon/public key
3. Update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Create Database Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Create home_content table
CREATE TABLE home_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_home_content_updated_at 
    BEFORE UPDATE ON home_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO home_content (title, subtitle, description, is_active) VALUES
('Welcome to Our Platform', 'Your Success Starts Here', 'Discover amazing features and tools that will help you achieve your goals.', true),
('Featured Content', 'Highlighted Section', 'This is a featured content section that showcases important information.', true);
```

## 4. Set Row Level Security (Optional)

If you want to add authentication later:

```sql
-- Enable RLS
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON home_content
    FOR SELECT USING (true);

-- Allow authenticated users to modify
CREATE POLICY "Allow authenticated users to modify" ON home_content
    FOR ALL USING (auth.role() = 'authenticated');
```

## 5. Test Connection

After setting up your `.env` file, restart your development server:

```bash
npm run dev
```

Navigate to `/admin/home` to see the Home Admin panel.

## Project Structure

```
src/
├── admin/
│   └── home/
│       └── HomeAdmin.tsx     # Home admin interface
├── data/
│   ├── types.ts              # TypeScript interfaces
│   └── homeService.ts        # Supabase service functions
├── hooks/
│   └── useHomeContent.ts     # React hook for home content
└── lib/
    └── supabase.ts           # Supabase client configuration
```

## Usage

The `HomeService` class provides methods to:
- `getHomeContent()` - Get all home content
- `getActiveHomeContent()` - Get only active content
- `createHomeContent()` - Create new content
- `updateHomeContent()` - Update existing content
- `deleteHomeContent()` - Delete content

Use the `useHomeContent()` hook in your React components for easy state management.