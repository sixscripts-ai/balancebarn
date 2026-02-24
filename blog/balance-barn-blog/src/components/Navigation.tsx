import React from 'react'
import { Link } from 'react-router-dom'
import { Home, BookOpen, FolderOpen, Tag, User, LogOut, BarChart3 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './Button'

export function AdminNav() {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary">The Balance Barn</div>
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              <Link 
                to="/admin" 
                className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors px-3 py-2 rounded-md"
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/admin/posts" 
                className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors px-3 py-2 rounded-md"
              >
                <BookOpen size={18} />
                <span>Posts</span>
              </Link>
              <Link 
                to="/admin/categories" 
                className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors px-3 py-2 rounded-md"
              >
                <FolderOpen size={18} />
                <span>Categories</span>
              </Link>
              <Link 
                to="/admin/tags" 
                className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors px-3 py-2 rounded-md"
              >
                <Tag size={18} />
                <span>Tags</span>
              </Link>
              <Link 
                to="/admin/analytics" 
                className="flex items-center space-x-1 text-text-secondary hover:text-primary transition-colors px-3 py-2 rounded-md"
              >
                <BarChart3 size={18} />
                <span>Analytics</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-text-secondary hover:text-primary transition-colors">
              View Public Blog
            </Link>
            <a 
              href="https://thebalancebarn.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Main Website
            </a>
            {user && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-text-secondary">
                  <User size={18} />
                  <span className="text-sm">{user.email}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export function PublicNav() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary">The Balance Barn</div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-text-secondary hover:text-primary transition-colors">
              Blog Home
            </Link>
            <a 
              href="https://thebalancebarn.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Main Website
            </a>
            <Link to="/admin/login" className="text-text-secondary hover:text-primary transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
