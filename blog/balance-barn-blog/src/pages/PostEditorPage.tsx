import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { AdminNav } from '../components/Navigation'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'
import { Category, Tag } from '../types/blog'
import { useAuth } from '../contexts/AuthContext'
import { Upload, Save, Eye, Calendar } from 'lucide-react'

const Quill = ReactQuill as any
const Picker = DatePicker as any

export function PostEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    cover_image_url: '',
    category_id: '',
    status: 'draft' as 'draft' | 'published',
    meta_title: '',
    meta_description: '',
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [scheduledFor, setScheduledFor] = useState<Date | null>(null)
  const [publishAction, setPublishAction] = useState<'publish' | 'schedule'>('publish')

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    try {
      const [catsRes, tagsRes] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('tags').select('*'),
      ])

      setCategories(catsRes.data || [])
      setTags(tagsRes.data || [])

      if (id && id !== 'new') {
        const { data: post } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .maybeSingle()

        if (post) {
          setFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt || '',
            cover_image_url: post.cover_image_url || '',
            category_id: post.category_id || '',
            status: post.status,
            meta_title: post.meta_title || '',
            meta_description: post.meta_description || '',
          })

          if (post.scheduled_for) {
            setScheduledFor(new Date(post.scheduled_for))
            setPublishAction('schedule')
          }

          const { data: postTags } = await supabase
            .from('post_tags')
            .select('tag_id')
            .eq('post_id', id)

          if (postTags) {
            setSelectedTags(postTags.map((pt) => pt.tag_id))
          }
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function handleTitleChange(title: string) {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }))
  }

  function calculateReadingTime(content: string) {
    const wordsPerMinute = 200
    const text = content.replace(/<[^>]*>/g, '')
    const wordCount = text.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Data = reader.result as string

        // Get session for authentication token
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          alert('You must be logged in to upload images')
          return
        }

        const { data, error } = await supabase.functions.invoke('blog-image-upload', {
          body: {
            imageData: base64Data,
            fileName: file.name,
          },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (error) throw error

        setFormData((prev) => ({
          ...prev,
          cover_image_url: data.data.publicUrl,
        }))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(status: 'draft' | 'published' | 'scheduled') {
    if (!formData.title || !formData.content) {
      alert('Title and content are required')
      return
    }

    if (status === 'scheduled' && !scheduledFor) {
      alert('Please select a scheduled date and time')
      return
    }

    if (status === 'scheduled' && scheduledFor && scheduledFor <= new Date()) {
      alert('Scheduled date must be in the future')
      return
    }

    if (!user) {
      alert('You must be logged in')
      return
    }

    setLoading(true)
    try {
      // Ensure slug is always populated
      const finalSlug = formData.slug || generateSlug(formData.title)
      
      const postData = {
        ...formData,
        slug: finalSlug,
        status,
        author_id: user.id,
        reading_time_minutes: calculateReadingTime(formData.content),
        published_at: status === 'published' ? new Date().toISOString() : null,
        scheduled_for: status === 'scheduled' && scheduledFor ? scheduledFor.toISOString() : null,
      }

      // Get session for authentication token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('You must be logged in')
        return
      }

      if (id && id !== 'new') {
        const { data, error } = await supabase.functions.invoke('blog-posts', {
          body: { action: 'update', data: { id, ...postData } },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (error) throw error
      } else {
        const { data, error } = await supabase.functions.invoke('blog-posts', {
          body: { action: 'create', data: postData },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (error) throw error

        const newPostId = data.data.id

        for (const tagId of selectedTags) {
          await supabase.functions.invoke('blog-tags', {
            body: { action: 'assign-to-post', data: { post_id: newPostId, tag_id: tagId } },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          })
        }
      }

      navigate('/admin/posts')
    } catch (error) {
      console.error('Failed to save post:', error)
      alert('Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light">
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">
            {id === 'new' ? 'Create New Post' : 'Edit Post'}
          </h1>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => navigate('/admin/posts')}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => handleSubmit('draft')} disabled={loading}>
              <Save size={18} className="mr-2" />
              Save Draft
            </Button>
            {publishAction === 'publish' ? (
              <Button onClick={() => handleSubmit('published')} disabled={loading}>
                <Eye size={18} className="mr-2" />
                Publish Now
              </Button>
            ) : (
              <Button onClick={() => handleSubmit('scheduled')} disabled={loading}>
                <Calendar size={18} className="mr-2" />
                Schedule Post
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="post-url-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Content
                </label>
                <Quill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  className="bg-white"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'image'],
                      ['clean'],
                    ],
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Brief summary of the post"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Cover Image</h3>
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={18} className="mr-2" />
                {uploading ? 'Uploading...' : 'Upload Cover Image'}
              </Button>
              {formData.cover_image_url && (
                <div>
                  <img
                    src={formData.cover_image_url}
                    alt="Cover preview"
                    className="max-w-md rounded-md border border-border"
                  />
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Category
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setSelectedTags((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((t) => t !== tag.id)
                            : [...prev, tag.id]
                        )
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTags.includes(tag.id)
                          ? 'bg-primary text-white'
                          : 'bg-background-light text-text-secondary'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Publishing Options</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Action
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="publishAction"
                      value="publish"
                      checked={publishAction === 'publish'}
                      onChange={() => setPublishAction('publish')}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Publish Immediately</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="publishAction"
                      value="schedule"
                      checked={publishAction === 'schedule'}
                      onChange={() => setPublishAction('schedule')}
                      className="text-primary focus:ring-primary"
                    />
                    <span>Schedule for Later</span>
                  </label>
                </div>
              </div>

              {publishAction === 'schedule' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Scheduled Date & Time
                  </label>
                  <Picker
                    selected={scheduledFor}
                    onChange={(date: Date | null) => setScheduledFor(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    placeholderText="Select date and time"
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {scheduledFor && (
                    <p className="text-sm text-text-secondary mt-2">
                      Post will be published on {scheduledFor.toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-text-primary mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="SEO title for search engines"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={2}
                  placeholder="SEO description for search engines"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
