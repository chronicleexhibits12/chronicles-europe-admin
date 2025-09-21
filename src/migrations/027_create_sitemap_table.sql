-- Create sitemap table
CREATE TABLE IF NOT EXISTS sitemap (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    priority DECIMAL(2,1) DEFAULT 0.5,
    changefreq TEXT DEFAULT 'monthly',
    lastmod TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on url for faster lookups
CREATE INDEX IF NOT EXISTS idx_sitemap_url ON sitemap(url);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_sitemap_is_active ON sitemap(is_active);

-- Insert default sitemap entries
INSERT INTO sitemap (url, priority, changefreq, is_active) VALUES
('/', 1.0, 'daily', true),
('/services', 0.9, 'weekly', true),
('/portfolio', 0.8, 'weekly', true),
('/review', 0.7, 'weekly', true),
('/top-trade-shows-in-europe', 0.8, 'weekly', true),
('/contact-us', 0.9, 'monthly', true),
('/request-free-design', 0.7, 'monthly', true),
('/request-quotation', 0.7, 'monthly', true),
('/about', 0.8, 'monthly', true),
('/privacy-policy', 0.3, 'yearly', true),
('/terms-conditions', 0.3, 'yearly', true)
ON CONFLICT (url) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at column
DROP TRIGGER IF EXISTS update_sitemap_updated_at ON sitemap;
CREATE TRIGGER update_sitemap_updated_at
    BEFORE UPDATE ON sitemap
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();