import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminNav } from '../components/Navigation'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'
import { BlogPost, Category } from '../types/blog'
import { Plus, Edit, Trash2, Eye, Calendar } from 'lucide-react'

export function PostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [postsRes, catsRes] = await Promise.all([
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*'),
      ])

      setPosts(postsRes.data || [])
      setCategories(catsRes.data || [])
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const { data, error } = await supabase.functions.invoke('blog-posts', {
        body: { action: 'delete', data: { id } },
      })

      if (error) throw error

      setPosts(posts.filter((p) => p.id !== id))
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post')
    }
  }

  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true
    return post.status === filter
  })

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized'
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-background-light">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Blog Posts</h1>
          <Button asLink to="/admin/posts/new">
            <Plus size={20} className="mr-2" />
            New Post
          </Button>
        </div>

        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-white text-text-secondary'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-md ${
              filter === 'published' ? 'bg-primary text-white' : 'bg-white text-text-secondary'
            }`}
          >
            Published ({posts.filter((p) => p.status === 'published').length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-md ${
              filter === 'draft' ? 'bg-primary text-white' : 'bg-white text-text-secondary'
            }`}
          >
            Drafts ({posts.filter((p) => p.status === 'draft').length})
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-4 py-2 rounded-md ${
              filter === 'scheduled' ? 'bg-primary text-white' : 'bg-white text-text-secondary'
            }`}
          >
            Scheduled ({posts.filter((p) => p.status === 'scheduled').length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-text-secondary mb-4">No posts found</p>
            <Button asLink to="/admin/posts/new">
              Create your first post
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-text-primary">{post.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.status === 'published'
                            ? 'bg-success/10 text-success'
                            : post.status === 'scheduled'
                            ? 'bg-info/10 text-info'
                            : 'bg-warning/10 text-warning'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    {post.excerpt && (
                      <p className="text-text-secondary mb-3 line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-text-light">
                      <span className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.created_at)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye size={14} />
                        <span>{post.views} views</span>
                      </span>
                      <span>{getCategoryName(post.category_id)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/admin/posts/edit/${post.id}`}
                      className="p-2 text-info hover:bg-info/10 rounded-md transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-error hover:bg-error/10 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
