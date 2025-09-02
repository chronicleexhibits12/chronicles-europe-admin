import { supabase } from '@/lib/supabase'
import type { HomePage } from './homeTypes'
import type { Database } from './databaseTypes'
import { basicRevalidate } from './simpleRevalidation'

export class HomePageService {
  // Get home page data
  static async getHomePage(): Promise<{ data: HomePage | null; error: string | null }> {
    try {
      const response = await supabase
        .from('home_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (response.error) {
        return { data: null, error: response.error.message }
      }

      // Transform database row to HomePage interface
      const row = response.data as Database['public']['Tables']['home_page']['Row']
      const homePage: HomePage = {
        id: row.id,
        hero: {
          backgroundImage: row.hero_background_image || undefined
        },
        mainSection: {
          title: row.main_title || undefined,
          subtitle: row.main_subtitle || undefined,
          htmlContent: row.main_html_content || undefined
        },
        exhibitionEurope: {
          title: row.exhibition_europe_title || undefined,
          subtitle: row.exhibition_europe_subtitle || undefined,
          boothImage: row.exhibition_europe_booth_image || undefined,
          htmlContent: row.exhibition_europe_html_content || undefined
        },
        exhibitionUSA: {
          title: row.exhibition_usa_title || undefined,
          htmlContent: row.exhibition_usa_html_content || undefined
        },
        solutions: {
          title: row.solutions_title || undefined,
          htmlContent: row.solutions_html_content || undefined,
          items: row.solutions_items || []
        },
        whyBest: {
          title: row.why_best_title || undefined,
          subtitle: row.why_best_subtitle || undefined,
          htmlContent: row.why_best_html_content || undefined
        },
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }

      return { data: homePage, error: null }
    } catch (error) {
      console.error('Error fetching home page:', error)
      return { data: null, error: 'Failed to fetch home page' }
    }
  }

  // Update home page
  static async updateHomePage(id: string, data: Partial<HomePage>): Promise<{ data: HomePage | null; error: string | null }> {
    try {
      const updateData: Record<string, any> = {}

      // Hero section
      if (data.hero?.backgroundImage !== undefined) {
        updateData.hero_background_image = data.hero.backgroundImage
      }

      // Main section
      if (data.mainSection?.title !== undefined) {
        updateData.main_title = data.mainSection.title
      }
      if (data.mainSection?.subtitle !== undefined) {
        updateData.main_subtitle = data.mainSection.subtitle
      }
      if (data.mainSection?.htmlContent !== undefined) {
        updateData.main_html_content = data.mainSection.htmlContent
      }

      // Exhibition Europe
      if (data.exhibitionEurope?.title !== undefined) {
        updateData.exhibition_europe_title = data.exhibitionEurope.title
      }
      if (data.exhibitionEurope?.subtitle !== undefined) {
        updateData.exhibition_europe_subtitle = data.exhibitionEurope.subtitle
      }
      if (data.exhibitionEurope?.boothImage !== undefined) {
        updateData.exhibition_europe_booth_image = data.exhibitionEurope.boothImage
      }
      if (data.exhibitionEurope?.htmlContent !== undefined) {
        updateData.exhibition_europe_html_content = data.exhibitionEurope.htmlContent
      }

      // Exhibition USA
      if (data.exhibitionUSA?.title !== undefined) {
        updateData.exhibition_usa_title = data.exhibitionUSA.title
      }
      if (data.exhibitionUSA?.htmlContent !== undefined) {
        updateData.exhibition_usa_html_content = data.exhibitionUSA.htmlContent
      }

      // Solutions
      if (data.solutions?.title !== undefined) {
        updateData.solutions_title = data.solutions.title
      }
      if (data.solutions?.htmlContent !== undefined) {
        updateData.solutions_html_content = data.solutions.htmlContent
      }
      if (data.solutions?.items !== undefined) {
        updateData.solutions_items = data.solutions.items
      }

      // Why Best
      if (data.whyBest?.title !== undefined) {
        updateData.why_best_title = data.whyBest.title
      }
      if (data.whyBest?.subtitle !== undefined) {
        updateData.why_best_subtitle = data.whyBest.subtitle
      }
      if (data.whyBest?.htmlContent !== undefined) {
        updateData.why_best_html_content = data.whyBest.htmlContent
      }

      if (data.isActive !== undefined) {
        updateData.is_active = data.isActive
      }

      const { error } = await (supabase as any)
        .from('home_page')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      // Return updated data
      return this.getHomePage()
    } catch (error) {
      console.error('Error updating home page:', error)
      return { data: null, error: 'Failed to update home page' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(file: File, folder: string = 'general'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('home-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return { data: null, error: error.message }
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('home-images')
        .getPublicUrl(data.path)

      return { data: publicUrlData.publicUrl, error: null }
    } catch (error) {
      console.error('Error uploading image:', error)
      return { data: null, error: 'Failed to upload image' }
    }
  }

  // Delete image from storage
  static async deleteImage(url: string): Promise<{ data: boolean; error: string | null }> {
    try {
      // Extract file path from URL
      const urlParts = url.split('/storage/v1/object/public/home-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('home-images')
        .remove([filePath])

      if (error) {
        return { data: false, error: error.message }
      }

      return { data: true, error: null }
    } catch (error) {
      console.error('Error deleting image:', error)
      return { data: false, error: 'Failed to delete image' }
    }
  }

  // Trigger revalidation in Next.js website - simplified version
  static async triggerRevalidation(): Promise<{ success: boolean; error: string | null }> {
    // Use the simple revalidation approach
    return basicRevalidate('/');
  }
}