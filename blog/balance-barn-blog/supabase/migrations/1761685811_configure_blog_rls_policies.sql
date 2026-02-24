-- Migration: configure_blog_rls_policies
-- Created at: 1761685811

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Public read access for categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admin insert categories" ON categories
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Admin update categories" ON categories
  FOR UPDATE
  USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Admin delete categories" ON categories
  FOR DELETE
  USING (auth.role() IN ('anon', 'service_role'));

-- Tags Policies
CREATE POLICY "Public read access for tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Admin insert tags" ON tags
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Admin update tags" ON tags
  FOR UPDATE
  USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Admin delete tags" ON tags
  FOR DELETE
  USING (auth.role() IN ('anon', 'service_role'));

-- Blog Posts Policies
CREATE POLICY "Public read published posts" ON blog_posts
  FOR SELECT 
  USING (status = 'published' OR auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Admin insert posts" ON blog_posts
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Admin update posts" ON blog_posts
  FOR UPDATE
  USING (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Admin delete posts" ON blog_posts
  FOR DELETE
  USING (auth.role() IN ('anon', 'service_role'));

-- Post Tags Policies
CREATE POLICY "Public read post tags" ON post_tags
  FOR SELECT USING (true);

CREATE POLICY "Admin insert post tags" ON post_tags
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Admin delete post tags" ON post_tags
  FOR DELETE
  USING (auth.role() IN ('anon', 'service_role'));

-- Admin Users Policies
CREATE POLICY "Public read admin profiles" ON admin_users
  FOR SELECT USING (true);

CREATE POLICY "Admin insert profiles" ON admin_users
  FOR INSERT
  WITH CHECK (auth.role() IN ('anon', 'service_role'));

CREATE POLICY "Admin update own profile" ON admin_users
  FOR UPDATE
  USING (auth.role() IN ('anon', 'service_role'));

-- Create indexes for better query performance
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);;