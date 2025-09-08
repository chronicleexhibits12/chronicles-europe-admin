import { useState, useEffect } from 'react'
import { BlogService } from '@/data/blogService'
import type { BlogPage, BlogPost } from '@/data/blogTypes'

export const useBlogPage = () => {
  const [data, setData] = useState<BlogPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogPage = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: blogPage, error: fetchError } = await BlogService.getBlogPage()
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(blogPage)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blog page')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogPage()
  }, [])

  return { data, loading, error, refetch: fetchBlogPage }
}

export const useBlogPosts = () => {
  const [data, setData] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: blogPosts, error: fetchError } = await BlogService.getBlogPosts()
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(blogPosts || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blog posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  return { data, loading, error, refetch: fetchBlogPosts }
}

export const useBlogPost = (id: string) => {
  const [data, setData] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogPost = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: blogPost, error: fetchError } = await BlogService.getBlogPostById(id)
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(blogPost)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blog post')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchBlogPost()
    }
  }, [id])

  return { data, loading, error, refetch: fetchBlogPost }
}