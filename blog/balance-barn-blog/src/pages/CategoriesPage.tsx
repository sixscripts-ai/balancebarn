import React, { useEffect, useState } from 'react'
import { AdminNav } from '../components/Navigation'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { supabase } from '../lib/supabase'
import { Category } from '../types/blog'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' })

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const { data } = await supabase.from('categories').select('*').order('name')
      setCategories(data || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
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
        const { data, error } = await supabase.functions.invoke('blog-categories', {
          body: { action: 'update', data: { id: editingId, ...formData } },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (error) throw error

        setCategories(categories.map((c) => (c.id === editingId ? data.data : c)))
      } else {
        const { data, error } = await supabase.functions.invoke('blog-categories', {
          body: { action: 'create', data: formData },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })

        if (error) throw error

        setCategories([...categories, data.data])
      }

      resetForm()
    } catch (error) {
      console.error('Failed to save category:', error)
      alert('Failed to save category')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      // Get session for authentication token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('You must be logged in')
        return
      }

      const { error } = await supabase.functions.invoke('blog-categories', {
        body: { action: 'delete', data: { id } },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (error) throw error

      setCategories(categories.filter((c) => c.id !== id))
    } catch (error) {
      console.error('Failed to delete category:', error)
      alert('Failed to delete category')
    }
  }

  function startEdit(category: Category) {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    })
    setShowForm(true)
  }

  function resetForm() {
    setFormData({ name: '', slug: '', description: '' })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-background-light">
      <AdminNav />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Categories</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus size={20} className="mr-2" />
            New Category
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {editingId ? 'Edit Category' : 'New Category'}
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

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
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
            <p className="text-text-secondary">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-text-secondary mb-4">No categories yet</p>
            <Button onClick={() => setShowForm(true)}>Create your first category</Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <Card key={category.id} hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary">{category.name}</h3>
                    <p className="text-sm text-text-light">/{category.slug}</p>
                    {category.description && (
                      <p className="text-text-secondary mt-2">{category.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => startEdit(category)}
                      className="p-2 text-info hover:bg-info/10 rounded-md transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
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
