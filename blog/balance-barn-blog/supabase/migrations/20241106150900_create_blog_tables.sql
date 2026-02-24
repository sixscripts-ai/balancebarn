-- Blog Management System Database Setup
-- This script creates all necessary tables for the Balance Barn Blog System

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  author_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  reading_time_minutes INTEGER,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Enable RLS (Row Level Security)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY IF NOT EXISTS "Public read access for published posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY IF NOT EXISTS "Public read access for categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public read access for tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Public read access for post_tags" ON post_tags
  FOR SELECT USING (true);

-- Create policies for admin access (allowing full access)
CREATE POLICY IF NOT EXISTS "Admin full access for admin_users" ON admin_users
  FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Admin full access for categories" ON categories
  FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Admin full access for tags" ON tags
  FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Admin full access for blog_posts" ON blog_posts
  FOR ALL USING (true);

CREATE POLICY IF NOT EXISTS "Admin full access for post_tags" ON post_tags
  FOR ALL USING (true);

-- Insert sample data
INSERT INTO admin_users (email, full_name) VALUES 
('admin@balancebarn.com', 'Admin User'),
('zrtaxpyk@minimax.com', 'System Admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name, slug, description) VALUES 
('Business Finance', 'business-finance', 'Articles about business financial management'),
('Bookkeeping Tips', 'bookkeeping-tips', 'Practical bookkeeping advice and tips'),
('Tax Preparation', 'tax-preparation', 'Tax-related content and preparation guides')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tags (name, slug) VALUES 
('Small Business', 'small-business'),
('Bookkeeping', 'bookkeeping'),
('Taxes', 'taxes'),
('Finance', 'finance'),
('QuickBooks', 'quickbooks')
ON CONFLICT (slug) DO NOTHING;

-- Create a sample blog post
INSERT INTO blog_posts (
  title, slug, content, excerpt, status, published_at, author_id
) 
SELECT 
  'Welcome to The Balance Barn Blog',
  'welcome-to-the-balance-barn-blog',
  '<h2>Welcome to The Balance Barn Blog</h2><p>We''re excited to share our expertise in bookkeeping and financial management with you. Our blog will feature practical tips, industry insights, and guides to help you manage your business finances more effectively.</p><h3>What to Expect</h3><ul><li>Weekly bookkeeping tips</li><li>Tax preparation guides</li><li>Small business financial advice</li><li>Industry news and updates</li></ul><p>Stay tuned for our upcoming posts!</p>',
  'Welcome to The Balance Barn blog where we share expert bookkeeping insights and financial tips for small businesses.',
  'published',
  NOW(),
  au.id
FROM admin_users au 
WHERE au.email = 'admin@balancebarn.com'
ON CONFLICT (slug) DO NOTHING;

-- Add the sample post to tags
INSERT INTO post_tags (post_id, tag_id)
SELECT bp.id, t.id 
FROM blog_posts bp, tags t 
WHERE bp.slug = 'welcome-to-the-balance-barn-blog' 
  AND t.slug IN ('small-business', 'bookkeeping')
ON CONFLICT (post_id, tag_id) DO NOTHING;