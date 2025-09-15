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

export const useBlogPosts = (page?: number, pageSize?: number) => {
  const [data, setData] = useState<BlogPost[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let blogPosts, fetchError, totalCount;
      
      // If page and pageSize are provided, use pagination
      if (page !== undefined && pageSize !== undefined) {
        const result = await BlogService.getBlogPostsWithPagination(page, pageSize)
        blogPosts = result.data
        fetchError = result.error
        totalCount = result.totalCount
      } else {
        // Otherwise, fetch all posts
        const result = await BlogService.getBlogPosts()
        blogPosts = result.data
        fetchError = result.error
        totalCount = blogPosts?.length || 0
      }
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(blogPosts || [])
      setTotalCount(totalCount)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blog posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogPosts()
  }, [page, pageSize])

  return { data, totalCount, loading, error, refetch: fetchBlogPosts }
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