export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image_url: string | null
  author_id: string
  category_id: string | null
  status: 'draft' | 'published' | 'scheduled'
  published_at: string | null
  scheduled_for: string | null
  views: number
  reading_time_minutes: number | null
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface PostTag {
  post_id: string
  tag_id: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  created_at: string
}

export interface BlogPostWithDetails extends BlogPost {
  author?: AdminUser
  category?: Category
  tags?: Tag[]
}
