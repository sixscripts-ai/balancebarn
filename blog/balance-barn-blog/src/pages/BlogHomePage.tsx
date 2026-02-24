import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicNav } from '../components/Navigation'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'
import { BlogPost, Category, Tag, AdminUser } from '../types/blog'
import { Calendar, Eye, Clock, Search } from 'lucide-react'

export function BlogHomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [authors, setAuthors] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [postsRes, catsRes, tagsRes, authorsRes] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false }),
        supabase.from('categories').select('*'),
        supabase.from('tags').select('*'),
        supabase.from('admin_users').select('*'),
      ])

      setPosts(postsRes.data || [])
      setCategories(catsRes.data || [])
      setTags(tagsRes.data || [])
      setAuthors(authorsRes.data || [])
    } catch (error) {
      console.error('Failed to load blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || post.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getAuthorName = (authorId: string) => {
    return authors.find((a) => a.id === authorId)?.full_name || 'Unknown Author'
  }

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized'
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-background-light">
      <PublicNav />

      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">The Balance Barn Blog</h1>
          <p className="text-xl text-white/90">
            Expert bookkeeping insights and financial tips for small businesses
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" size={20} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-text-secondary">No posts found</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} hover className="flex flex-col">
                {post.cover_image_url && (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg -mx-6 -mt-6 mb-4"
                  />
                )}
                <div className="flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full">
                      {getCategoryName(post.category_id)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-text-primary mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-text-secondary mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-text-light mb-4">
                    <span className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{formatDate(post.published_at)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{post.views}</span>
                    </span>
                    {post.reading_time_minutes && (
                      <span className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{post.reading_time_minutes} min</span>
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-primary font-semibold hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
