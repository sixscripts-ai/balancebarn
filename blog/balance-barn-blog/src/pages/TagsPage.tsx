import React, { useEffect, useState } from 'react'
import { AdminNav } from '../components/Navigation'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'
import { Tag } from '../types/blog'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

export function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '' })

  useEffect(() => {
    loadTags()
  }, [])

  async function loadTags() {
    try {
      const { data } = await supabase.from('tags').select('*').order('name')
      setTags(data || [])
    } catch (error) {
      console.error('Failed to load tags:', error)
    } finally {
      setLoading(false)
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function handleNameChange(name: string) {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      // Get session for authentication token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('You must be logged in')
        return
      }

      if (editingId) {
        const { data, error } = await supabase.functions.invoke('blog-tags', {
          body: { action: 'update', data: { id: editingId, ...formData } },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (error) throw error

        setTags(tags.map((t) => (t.id === editingId ? data.data : t)))
      } else {
        const { data, error } = await supabase.functions.invoke('blog-tags', {
          body: { action: 'create', data: formData },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (error) throw error

        setTags([...tags, data.data])
      }

      resetForm()
    } catch (error) {
      console.error('Failed to save tag:', error)
      alert('Failed to save tag')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this tag?')) return

    try {
      // Get session for authentication token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('You must be logged in')
        return
      }

      const { error } = await supabase.functions.invoke('blog-tags', {
        body: { action: 'delete', data: { id } },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (error) throw error

      setTags(tags.filter((t) => t.id !== id))
    } catch (error) {
      console.error('Failed to delete tag:', error)
      alert('Failed to delete tag')
    }
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.id)
    setFormData({
      name: tag.name,
      slug: tag.slug,
    })
    setShowForm(true)
  }

  function resetForm() {
    setFormData({ name: '', slug: '' })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-background-light">
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Tags</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={20} className="mr-2" />
            New Tag
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {editingId ? 'Edit Tag' : 'New Tag'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <Button type="submit">
                  <Save size={18} className="mr-2" />
                  Save
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X size={18} className="mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading tags...</p>
          </div>
        ) : tags.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-text-secondary mb-4">No tags yet</p>
            <Button onClick={() => setShowForm(true)}>Create your first tag</Button>
          </Card>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Card key={tag.id} hover className="inline-flex items-center space-x-3">
                <div>
                  <h3 className="font-semibold text-text-primary">{tag.name}</h3>
                  <p className="text-xs text-text-light">/{tag.slug}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => startEdit(tag)}
                    className="p-1.5 text-info hover:bg-info/10 rounded-md transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="p-1.5 text-error hover:bg-error/10 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
