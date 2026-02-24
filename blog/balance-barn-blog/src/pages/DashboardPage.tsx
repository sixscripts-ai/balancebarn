import React, { useEffect, useState } from 'react'
import { AdminNav } from '../components/Navigation'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'
import { BookOpen, FolderOpen, Tag, Eye } from 'lucide-react'

export function DashboardPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalTags: 0,
    totalViews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const [postsRes, catsRes, tagsRes] = await Promise.all([
        supabase.from('blog_posts').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('tags').select('*'),
      ])

      const posts = postsRes.data || []
      const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0)

      setStats({
        totalPosts: posts.length,
        publishedPosts: posts.filter((p) => p.status === 'published').length,
        draftPosts: posts.filter((p) => p.status === 'draft').length,
        totalCategories: catsRes.data?.length || 0,
        totalTags: tagsRes.data?.length || 0,
        totalViews,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Posts', value: stats.totalPosts, icon: BookOpen, color: 'text-primary' },
    { label: 'Published', value: stats.publishedPosts, icon: BookOpen, color: 'text-success' },
    { label: 'Drafts', value: stats.draftPosts, icon: BookOpen, color: 'text-warning' },
    { label: 'Categories', value: stats.totalCategories, icon: FolderOpen, color: 'text-info' },
    { label: 'Tags', value: stats.totalTags, icon: Tag, color: 'text-accent' },
    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'text-text-primary' },
  ]

  return (
    <div className="min-h-screen bg-background-light">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading statistics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((stat) => (
              <Card key={stat.label} className="flex items-center space-x-4">
                <div className={`${stat.color}`}>
                  <stat.icon size={40} />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
