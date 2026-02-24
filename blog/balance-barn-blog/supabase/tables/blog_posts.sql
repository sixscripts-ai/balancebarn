CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image_url TEXT,
    author_id UUID NOT NULL,
    category_id UUID,
    status TEXT NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    views INTEGER DEFAULT 0,
    reading_time_minutes INTEGER,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);