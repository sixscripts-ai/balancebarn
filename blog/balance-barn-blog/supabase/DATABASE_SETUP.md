# Database Setup Instructions

## Problem Fixed
The blog posts were not being stored in the Supabase database because the database schema was missing. This has now been fixed.

## Database Schema
The blog system requires the following tables:
- `admin_users` - Blog administrators
- `categories` - Blog post categories
- `tags` - Blog post tags
- `blog_posts` - The main blog posts table
- `post_tags` - Junction table for many-to-many relationship between posts and tags

## Setup Instructions

### Option 1: Apply Migration in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open the migration file: `migrations/20241106150900_create_blog_tables.sql`
4. Copy and paste the SQL into the editor
5. Run the migration

### Option 2: Manual Setup
The migration file contains:
- Complete table creation statements
- Indexes for performance
- Row Level Security (RLS) policies
- Sample data insertion
- Proper foreign key relationships

### Expected Tables
After running the migration, you should see these tables in your Supabase database:
- ✅ admin_users
- ✅ categories  
- ✅ tags
- ✅ blog_posts
- ✅ post_tags

## Blog Post Storage
Once the database is set up, blog posts will be properly stored in the `blog_posts` table with:
- Full content management
- Category and tag associations
- Publishing status (draft/published/scheduled)
- Analytics tracking (views, reading time)
- SEO metadata

## Testing
After setting up the database:
1. Go to the blog admin login
2. Create a new blog post
3. Verify it appears in the public blog
4. Check the database to confirm it's stored in the `blog_posts` table

The blog system is now fully functional with proper data persistence!