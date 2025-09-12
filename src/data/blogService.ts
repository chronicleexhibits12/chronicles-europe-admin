import { supabase } from '@/lib/supabase'
import type { BlogPage, BlogPost } from './blogTypes'
import { basicRevalidate } from './simpleRevalidation'
import type { Database } from './databaseTypes'

export class BlogService {
  // Get blog page data
  static async getBlogPage(): Promise<{ data: BlogPage | null; error: string | null }> {
    try {
      const { data, error } = await (supabase as any)
        .from('blog_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (error) throw new Error(error.message)
      
      if (!data) {
        return { data: null, error: 'Blog page not found' }
      }
      
      // Transform database row to BlogPage interface
      const page: BlogPage = {
        id: data.id,
        meta: {
          title: data.meta_title,
          description: data.meta_description,
          keywords: data.meta_keywords
        },
        hero: {
          id: 'hero-1',
          title: data.hero_title,
          subtitle: data.hero_subtitle,
          backgroundImage: data.hero_background_image,
          backgroundImageAlt: data.hero_background_image_alt
        },
        description: data.description,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      return { data: page, error: null }
    } catch (error: any) {
      console.error('Error fetching blog page:', error)
      return { data: null, error: error.message || 'Failed to fetch blog page' }
    }
  }

  // Update blog page
  static async updateBlogPage(id: string, pageData: any): Promise<{ data: BlogPage | null; error: string | null }> {
    try {
      // Transform form data to database format
      const dbData: Record<string, any> = {
        meta_title: pageData.meta?.title,
        meta_description: pageData.meta?.description,
        meta_keywords: pageData.meta?.keywords,
        hero_title: pageData.hero?.title,
        hero_subtitle: pageData.hero?.subtitle,
        hero_background_image: pageData.hero?.backgroundImage,
        hero_background_image_alt: pageData.hero?.backgroundImageAlt,
        description: pageData.description,
        is_active: pageData.isActive,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await (supabase as any)
        .from('blog_page')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      // Transform database row to BlogPage interface
      const page: BlogPage = {
        id: data.id,
        meta: {
          title: data.meta_title,
          description: data.meta_description,
          keywords: data.meta_keywords
        },
        hero: {
          id: 'hero-1',
          title: data.hero_title,
          subtitle: data.hero_subtitle,
          backgroundImage: data.hero_background_image,
          backgroundImageAlt: data.hero_background_image_alt
        },
        description: data.description,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      // Trigger revalidation for the blog page
      await this.triggerRevalidation('/blog')
      
      return { data: page, error: null }
    } catch (error: any) {
      console.error('Error updating blog page:', error)
      return { data: null, error: error.message || 'Failed to update blog page' }
    }
  }

  // Get all blog posts
  static async getBlogPosts(): Promise<{ data: BlogPost[] | null; error: string | null }> {
    try {
      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw new Error(error.message)
      
      // Transform database rows to BlogPost interface
      const blogPosts: BlogPost[] = (data || []).map((row: Database['public']['Tables']['blog_posts']['Row']) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        publishedDate: row.published_date,
        featuredImage: row.featured_image,
        featuredImageAlt: row.featured_image_alt,
        category: row.category,
        author: row.author,
        readTime: row.read_time,
        tags: row.tags,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        metaKeywords: row.meta_keywords,
        sortOrder: row.sort_order,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
      
      return { data: blogPosts, error: null }
    } catch (error: any) {
      console.error('Error fetching blog posts:', error)
      return { data: null, error: error.message || 'Failed to fetch blog posts' }
    }
  }

  // Get blog post by ID
  static async getBlogPostById(id: string): Promise<{ data: BlogPost | null; error: string | null }> {
    try {
      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      
      if (!data) {
        return { data: null, error: 'Blog post not found' }
      }
      
      // Transform database row to BlogPost interface
      const blogPost: BlogPost = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        publishedDate: data.published_date,
        featuredImage: data.featured_image,
        featuredImageAlt: data.featured_image_alt,
        category: data.category,
        author: data.author,
        readTime: data.read_time,
        tags: data.tags,
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
        metaKeywords: data.meta_keywords,
        sortOrder: data.sort_order,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      return { data: blogPost, error: null }
    } catch (error: any) {
      console.error('Error fetching blog post:', error)
      return { data: null, error: error.message || 'Failed to fetch blog post' }
    }
  }

  // Create blog post
  static async createBlogPost(blogPostData: any): Promise<{ data: BlogPost | null; error: string | null }> {
    try {
      // Get the next sort order
      const { data: existingPosts, error: fetchError } = await supabase
        .from('blog_posts')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
      
      if (fetchError) throw new Error(fetchError.message)
      
      const nextSortOrder = existingPosts && existingPosts.length > 0 ? (existingPosts[0] as any).sort_order + 1 : 1

      // Transform form data to database format
      const dbData: Record<string, any> = {
        slug: blogPostData.slug,
        title: blogPostData.title,
        excerpt: blogPostData.excerpt,
        content: blogPostData.content,
        published_date: blogPostData.publishedDate,
        featured_image: blogPostData.featuredImage,
        featured_image_alt: blogPostData.featuredImageAlt,
        author: blogPostData.author,
        read_time: blogPostData.readTime,
        meta_title: blogPostData.metaTitle,
        meta_description: blogPostData.metaDescription,
        meta_keywords: blogPostData.metaKeywords,
        sort_order: blogPostData.sortOrder || nextSortOrder,
        is_active: blogPostData.isActive // Use the isActive value from form data instead of hardcoding to true
      }

      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .insert([dbData])
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      // Transform database row to BlogPost interface
      const blogPost: BlogPost = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        publishedDate: data.published_date,
        featuredImage: data.featured_image,
        featuredImageAlt: data.featured_image_alt,
        category: data.category,
        author: data.author,
        readTime: data.read_time,
        tags: data.tags,
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
        metaKeywords: data.meta_keywords,
        sortOrder: data.sort_order,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      // Trigger revalidation for the blog page
      await this.triggerRevalidation('/blog')
      
      return { data: blogPost, error: null }
    } catch (error: any) {
      console.error('Error creating blog post:', error)
      return { data: null, error: error.message || 'Failed to create blog post' }
    }
  }

  // Update blog post
  static async updateBlogPost(id: string, blogPostData: any): Promise<{ data: BlogPost | null; error: string | null }> {
    try {
      // Transform form data to database format
      const dbData: Record<string, any> = {
        slug: blogPostData.slug,
        title: blogPostData.title,
        excerpt: blogPostData.excerpt,
        content: blogPostData.content,
        published_date: blogPostData.publishedDate,
        featured_image: blogPostData.featuredImage,
        featured_image_alt: blogPostData.featuredImageAlt,
        author: blogPostData.author,
        read_time: blogPostData.readTime,
        meta_title: blogPostData.metaTitle,
        meta_description: blogPostData.metaDescription,
        meta_keywords: blogPostData.metaKeywords,
        sort_order: blogPostData.sortOrder,
        is_active: blogPostData.isActive,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      // Transform database row to BlogPost interface
      const blogPost: BlogPost = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        publishedDate: data.published_date,
        featuredImage: data.featured_image,
        featuredImageAlt: data.featured_image_alt,
        category: data.category,
        author: data.author,
        readTime: data.read_time,
        tags: data.tags,
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
        metaKeywords: data.meta_keywords,
        sortOrder: data.sort_order,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      // Trigger revalidation for the blog page and the specific blog post
      await this.triggerRevalidation('/blog')
      await this.triggerRevalidation(`/blog/${blogPost.slug}`)
      
      return { data: blogPost, error: null }
    } catch (error: any) {
      console.error('Error updating blog post:', error)
      return { data: null, error: error.message || 'Failed to update blog post' }
    }
  }

  // Delete blog post
  static async deleteBlogPost(id: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)

      // Trigger revalidation for the blog page
      await this.triggerRevalidation('/blog')
      
      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error deleting blog post:', error)
      return { data: false, error: error.message || 'Failed to delete blog post' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(file: File, folder: string = 'blog-images'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw new Error(error.message)

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path)

      return { data: publicUrlData.publicUrl, error: null }
    } catch (error: any) {
      console.error('Error uploading image:', error)
      return { data: null, error: error.message || 'Failed to upload image' }
    }
  }

  // Delete image from storage
  static async deleteImage(url: string): Promise<{ data: boolean; error: string | null }> {
    try {
      // Extract file path from URL
      const urlParts = url.split('/storage/v1/object/public/blog-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('blog-images')
        .remove([filePath])

      if (error) throw new Error(error.message)

      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error deleting image:', error)
      return { data: false, error: error.message || 'Failed to delete image' }
    }
  }

  // Trigger revalidation in Next.js website
  static async triggerRevalidation(path: string = '/'): Promise<{ success: boolean; error: string | null }> {
    // Use the simple revalidation approach
    return basicRevalidate(path)
  }
}