import { supabase } from '@/lib/supabase'
import type { AboutPage } from './aboutTypes'
import type { Database } from './databaseTypes'
import { basicRevalidate } from './simpleRevalidation'

export class AboutPageService {
  // Get about page data
  static async getAboutPage(): Promise<{ data: AboutPage | null; error: string | null }> {
    try {
      const response = await supabase
        .from('about_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (response.error) {
        return { data: null, error: response.error.message }
      }

      // Transform database row to AboutPage interface
      const row = response.data as Database['public']['Tables']['about_page']['Row']
      const aboutPage: AboutPage = {
        id: row.id,
        meta: {
          title: row.meta_title || undefined,
          description: row.meta_description || undefined,
          keywords: row.meta_keywords || undefined
        },
        hero: {
          title: row.hero_title || undefined,
          backgroundImage: row.hero_background_image || undefined,
          backgroundImageAlt: row.hero_background_image_alt || undefined
        },
        companyInfo: {
          yearsInBusiness: row.company_years_in_business || undefined,
          yearsLabel: row.company_years_label || undefined,
          whoWeAreTitle: row.company_who_we_are_title || undefined,
          description: row.company_description || undefined,
          quotes: row.company_quotes || []
        },
        factsSection: {
          title: row.facts_title || undefined,
          description: row.facts_description || undefined
        },
        companyStats: row.company_stats || [],
        teamInfo: {
          title: row.team_title || undefined,
          description: row.team_description || undefined,
          teamImage: row.team_image || undefined,
          teamImageAlt: row.team_image_alt || undefined
        },
        services: row.services || [],
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }

      return { data: aboutPage, error: null }
    } catch (error) {
      console.error('Error fetching about page:', error)
      return { data: null, error: 'Failed to fetch about page' }
    }
  }

  // Update about page
  static async updateAboutPage(id: string, data: Partial<AboutPage>): Promise<{ data: AboutPage | null; error: string | null }> {
    try {
      const updateData: Record<string, any> = {}

      // Meta section
      if (data.meta?.title !== undefined) {
        updateData.meta_title = data.meta.title
      }
      if (data.meta?.description !== undefined) {
        updateData.meta_description = data.meta.description
      }
      if (data.meta?.keywords !== undefined) {
        updateData.meta_keywords = data.meta.keywords
      }

      // Hero section
      if (data.hero?.title !== undefined) {
        updateData.hero_title = data.hero.title
      }
      if (data.hero?.backgroundImage !== undefined) {
        updateData.hero_background_image = data.hero.backgroundImage
      }
      if (data.hero?.backgroundImageAlt !== undefined) {
        updateData.hero_background_image_alt = data.hero.backgroundImageAlt
      }

      // Company Info
      if (data.companyInfo?.yearsInBusiness !== undefined) {
        updateData.company_years_in_business = data.companyInfo.yearsInBusiness
      }
      if (data.companyInfo?.yearsLabel !== undefined) {
        updateData.company_years_label = data.companyInfo.yearsLabel
      }
      if (data.companyInfo?.whoWeAreTitle !== undefined) {
        updateData.company_who_we_are_title = data.companyInfo.whoWeAreTitle
      }
      if (data.companyInfo?.description !== undefined) {
        updateData.company_description = data.companyInfo.description
      }
      if (data.companyInfo?.quotes !== undefined) {
        updateData.company_quotes = data.companyInfo.quotes
      }

      // Facts Section
      if (data.factsSection?.title !== undefined) {
        updateData.facts_title = data.factsSection.title
      }
      if (data.factsSection?.description !== undefined) {
        updateData.facts_description = data.factsSection.description
      }

      // Company Stats
      if (data.companyStats !== undefined) {
        updateData.company_stats = data.companyStats || []
      }

      // Team Info
      if (data.teamInfo?.title !== undefined) {
        updateData.team_title = data.teamInfo.title
      }
      if (data.teamInfo?.description !== undefined) {
        updateData.team_description = data.teamInfo.description
      }
      if (data.teamInfo?.teamImage !== undefined) {
        updateData.team_image = data.teamInfo.teamImage
      }
      if (data.teamInfo?.teamImageAlt !== undefined) {
        updateData.team_image_alt = data.teamInfo.teamImageAlt
      }

      // Services
      if (data.services !== undefined) {
        updateData.services = data.services
      }

      if (data.isActive !== undefined) {
        updateData.is_active = data.isActive
      }

      const { error } = await (supabase as any)
        .from('about_page')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      // Return updated data
      return this.getAboutPage()
    } catch (error) {
      console.error('Error updating about page:', error)
      return { data: null, error: 'Failed to update about page' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(file: File, folder: string = 'general'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('about-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return { data: null, error: error.message }
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('about-images')
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
      const urlParts = url.split('/storage/v1/object/public/about-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('about-images')
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
    return basicRevalidate('/about');
  }
}