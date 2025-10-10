-- Add redirect_url column to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN redirect_url TEXT;

-- Add redirect_url column to trade_shows table
ALTER TABLE trade_shows 
ADD COLUMN redirect_url TEXT;

-- Add comment to describe the purpose of the redirect_url column
COMMENT ON COLUMN blog_posts.redirect_url IS 'URL to redirect to when accessing this blog post, instead of showing the standard page';
COMMENT ON COLUMN trade_shows.redirect_url IS 'URL to redirect to when accessing this trade show, instead of showing the standard page';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_redirect_url ON blog_posts(redirect_url);
CREATE INDEX IF NOT EXISTS idx_trade_shows_redirect_url ON trade_shows(redirect_url);