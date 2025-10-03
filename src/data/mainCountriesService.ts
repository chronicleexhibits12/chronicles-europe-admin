import { supabase } from '@/lib/supabase'
import type { MainCountriesPage, ExhibitionStandType } from './mainCountriesTypes'
import type { Database } from './databaseTypes'
import { basicRevalidate } from './simpleRevalidation'

export class MainCountriesService {
  // Get main countries page data
  static async getMainCountriesPage(): Promise<{ data: MainCountriesPage | null; error: string | null }> {
    try {
      const response = await supabase
        .from('main_countries_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (response.error) {
        return { data: null, error: response.error.message }
      }

      // Transform database row to MainCountriesPage interface
      const row = response.data as Database['public']['Tables']['main_countries_page']['Row']
      const mainCountriesPage: MainCountriesPage = {
        id: row.id,
        seoTitle: row.seo_title || undefined,
        seoDescription: row.seo_description || undefined,
        seoKeywords: row.seo_keywords || undefined,
        hero: {
          title: row.hero_title || undefined,
          subtitle: row.hero_subtitle || undefined,
          description: row.hero_description || undefined,
          backgroundImageUrl: row.hero_background_image_url || undefined,
          backgroundImageAlt: row.hero_background_image_alt || undefined
        },
        exhibitionStandTypes: row.exhibition_stand_types as ExhibitionStandType[] || [],
        portfolioShowcase: {
          title: row.portfolio_showcase_title || undefined,
          description: row.portfolio_showcase_description || undefined,
          ctaText: row.portfolio_showcase_cta_text || undefined,
          ctaLink: '/portfolio' // Fixed CTA link
        },
        buildSection: {
          title: row.build_section_title || undefined,
          highlight: row.build_section_highlight || undefined,
          description: row.build_section_description || undefined
        },
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }

      // Set fixed CTA links for exhibition stand types
      if (mainCountriesPage.exhibitionStandTypes) {
        mainCountriesPage.exhibitionStandTypes = mainCountriesPage.exhibitionStandTypes.map(type => ({
          ...type,
          ctaLink: '/major-countries' // Fixed CTA link
        }));
      }

      return { data: mainCountriesPage, error: null }
    } catch (error) {
      console.error('Error fetching main countries page:', error)
      return { data: null, error: 'Failed to fetch main countries page' }
    }
  }

  // Update main countries page
  static async updateMainCountriesPage(id: string, data: Partial<MainCountriesPage>): Promise<{ data: MainCountriesPage | null; error: string | null }> {
    try {
      const updateData: Record<string, any> = {}

      // SEO Metadata
      if (data.seoTitle !== undefined) {
        updateData.seo_title = data.seoTitle
      }
      if (data.seoDescription !== undefined) {
        updateData.seo_description = data.seoDescription
      }
      if (data.seoKeywords !== undefined) {
        updateData.seo_keywords = data.seoKeywords
      }

      // Hero section
      if (data.hero?.title !== undefined) {
        updateData.hero_title = data.hero.title
      }
      if (data.hero?.subtitle !== undefined) {
        updateData.hero_subtitle = data.hero.subtitle
      }
      if (data.hero?.description !== undefined) {
        updateData.hero_description = data.hero.description
      }
      if (data.hero?.backgroundImageUrl !== undefined) {
        updateData.hero_background_image_url = data.hero.backgroundImageUrl
      }
      if (data.hero?.backgroundImageAlt !== undefined) {
        updateData.hero_background_image_alt = data.hero.backgroundImageAlt
      }

      // Exhibition Stand Types
      if (data.exhibitionStandTypes !== undefined) {
        // Remove ctaLink from each exhibition stand type as it's fixed
        const exhibitionStandTypes = data.exhibitionStandTypes.map(type => {
          const { ctaLink, ...rest } = type;
          return rest;
        });
        updateData.exhibition_stand_types = exhibitionStandTypes;
      }

      // Portfolio Showcase
      if (data.portfolioShowcase?.title !== undefined) {
        updateData.portfolio_showcase_title = data.portfolioShowcase.title
      }
      if (data.portfolioShowcase?.description !== undefined) {
        updateData.portfolio_showcase_description = data.portfolioShowcase.description
      }
      if (data.portfolioShowcase?.ctaText !== undefined) {
        updateData.portfolio_showcase_cta_text = data.portfolioShowcase.ctaText
      }
      // Note: portfolio_showcase_cta_link is not updated as it's fixed to '/portfolio'

      // Build Section
      if (data.buildSection?.title !== undefined) {
        updateData.build_section_title = data.buildSection.title
      }
      if (data.buildSection?.highlight !== undefined) {
        updateData.build_section_highlight = data.buildSection.highlight
      }
      if (data.buildSection?.description !== undefined) {
        updateData.build_section_description = data.buildSection.description
      }

      if (data.isActive !== undefined) {
        updateData.is_active = data.isActive
      }

      const { error } = await (supabase as any)
        .from('main_countries_page')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      // Return updated data
      return this.getMainCountriesPage()
    } catch (error) {
      console.error('Error updating main countries page:', error)
      return { data: null, error: 'Failed to update main countries page' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(file: File): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `main-countries/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('main-countries-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return { data: null, error: error.message }
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('main-countries-images')
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
      const urlParts = url.split('/storage/v1/object/public/main-countries-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('main-countries-images')
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

  // Trigger revalidation for ISR
  static async triggerRevalidation(): Promise<void> {
    try {
      await basicRevalidate('/major-exhibiting-country')
    } catch (error) {
      console.error('Error triggering revalidation:', error)
    }
  }
}