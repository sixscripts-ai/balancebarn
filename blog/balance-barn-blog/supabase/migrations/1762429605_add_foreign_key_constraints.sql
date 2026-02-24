-- Migration: add_foreign_key_constraints
-- Created at: 1762429605

-- Add foreign key constraints for data integrity

-- blog_posts.author_id references admin_users(id)
ALTER TABLE blog_posts 
ADD CONSTRAINT fk_blog_posts_author 
FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE CASCADE;

-- blog_posts.category_id references categories(id)
ALTER TABLE blog_posts 
ADD CONSTRAINT fk_blog_posts_category 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- post_tags.post_id references blog_posts(id)
ALTER TABLE post_tags 
ADD CONSTRAINT fk_post_tags_post 
FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE;

-- post_tags.tag_id references tags(id)
ALTER TABLE post_tags 
ADD CONSTRAINT fk_post_tags_tag 
FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_post ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag_id);;