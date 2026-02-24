import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PublicNav } from '../components/Navigation'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'
import { BlogPost, Category, Tag, AdminUser } from '../types/blog'
import { Calendar, Eye, Clock, ArrowLeft, Tag as TagIcon } from 'lucide-react'

export function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [author, setAuthor] = useState<AdminUser | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug])

  async function loadPost() {
    try {
      const { data: postData } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()

      if (!postData) {
        setLoading(false)
        return
      }

      setPost(postData)

      await supabase.functions.invoke('blog-posts', {
        body: { action: 'increment-views', data: { id: postData.id } },
      })

      const [authorRes, categoryRes, postTagsRes, relatedRes] = await Promise.all([
        supabase.from('admin_users').select('*').eq('id', postData.author_id).maybeSingle(),
        postData.category_id
          ? supabase.from('categories').select('*').eq('id', postData.category_id).maybeSingle()
          : null,
        supabase.from('post_tags').select('tag_id').eq('post_id', postData.id),
        supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .neq('id', postData.id)
          .limit(3),
      ])

      setAuthor(authorRes.data)
      if (categoryRes) setCategory(categoryRes.data)

      if (postTagsRes.data && postTagsRes.data.length > 0) {
        const tagIds = postTagsRes.data.map((pt) => pt.tag_id)
        const { data: tagsData } = await supabase.from('tags').select('*').in('id', tagIds)
        setTags(tagsData || [])
      }

      setRelatedPosts(relatedRes.data || [])
    } catch (error) {
      console.error('Failed to load post:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light">
        <PublicNav />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-text-secondary">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background-light">
        <PublicNav />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center py-12">
            <h1 className="text-2xl font-bold text-text-primary mb-4">Post Not Found</h1>
            <p className="text-text-secondary mb-6">
              The post you are looking for does not exist or has been removed.
            </p>
            <Link to="/" className="text-primary font-semibold hover:underline">
              Back to Blog Home
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light">
      <PublicNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="inline-flex items-center space-x-2 text-primary hover:underline mb-8">
          <ArrowLeft size={18} />
          <span>Back to Blog</span>
        </Link>

        <article>
          <header className="mb-8">
            {category && (
              <span className="inline-block px-3 py-1 text-sm font-semibold text-primary bg-primary/10 rounded-full mb-4">
                {category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-6">
              {author && (
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {author.full_name.charAt(0)}
                  </div>
                  <span className="font-medium">{author.full_name}</span>
                </div>
              )}
              <span className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>{formatDate(post.published_at)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye size={16} />
                <span>{post.views} views</span>
              </span>
              {post.reading_time_minutes && (
                <span className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{post.reading_time_minutes} min read</span>
                </span>
              )}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center space-x-1 px-3 py-1 text-sm bg-background-light text-text-secondary rounded-full"
                  >
                    <TagIcon size={14} />
                    <span>{tag.name}</span>
                  </span>
                ))}
              </div>
            )}
          </header>

          {post.cover_image_url && (
            <div className="mb-8">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}

          <Card>
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-text-primary prose-headings:font-bold
                prose-p:text-text-primary prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-text-primary
                prose-ul:text-text-primary prose-ol:text-text-primary
                prose-blockquote:border-l-primary prose-blockquote:text-text-secondary
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded
                prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Card>
        </article>

        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} hover>
                  {relatedPost.cover_image_url && (
                    <img
                      src={relatedPost.cover_image_url}
                      alt={relatedPost.title}
                      className="w-full h-32 object-cover rounded-lg -mx-6 -mt-6 mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <Link
                    to={`/blog/${relatedPost.slug}`}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Read More
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
