import { supabase } from '@/lib/supabase'
import type { PortfolioPage, PortfolioItem } from './portfolioTypes'
import type { Database } from './databaseTypes'

export class PortfolioService {
  // Get portfolio page data
  static async getPortfolioPage(): Promise<{ data: PortfolioPage | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('portfolio_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      if (!data) {
        return { data: null, error: 'No portfolio data found' }
      }

      // Transform the data to match our PortfolioPage interface
      const rowData = data as Database['public']['Tables']['portfolio_page']['Row']
      
      // Ensure all items have the featured property set to false for consistency
      const items = (rowData.portfolio_items as PortfolioItem[]) || []
      const normalizedItems = items.map(item => ({
        ...item,
        featured: false // Always set to false since we're not using this feature
      }))
      
      const portfolioPage: PortfolioPage = {
        id: rowData.id,
        hero: {
          title: rowData.hero_title || '',
          backgroundImage: rowData.hero_background_image || '',
          backgroundImageAlt: rowData.hero_background_image_alt || undefined
        },
        portfolio: {
          title: rowData.portfolio_title || '',
          subtitle: rowData.portfolio_subtitle || ''
        },
        items: normalizedItems,
        itemsAlt: (rowData.portfolio_items_alt as string[]) || undefined,
        seo: {
          title: rowData.seo_title || '',
          description: rowData.seo_description || '',
          keywords: rowData.seo_keywords || ''
        },
        isActive: rowData.is_active,
        createdAt: rowData.created_at,
        updatedAt: rowData.updated_at
      }

      return { data: portfolioPage, error: null }
    } catch (error) {
      console.error('Error fetching portfolio page:', error)
      return { data: null, error: 'Failed to fetch portfolio page' }
    }
  }

  // Update portfolio page
  static async updatePortfolioPage(
    data: Partial<PortfolioPage>
  ): Promise<{ data: PortfolioPage | null; error: string | null }> {
    try {
      // Get the current portfolio page ID
      const { data: currentData, error: fetchError } = await this.getPortfolioPage()
      
      if (fetchError) {
        return { data: null, error: fetchError }
      }
      
      if (!currentData) {
        return { data: null, error: 'No portfolio data found' }
      }

      const updateData: Database['public']['Tables']['portfolio_page']['Update'] = {}

      // Hero section
      if (data.hero) {
        updateData.hero_title = data.hero.title
        updateData.hero_background_image = data.hero.backgroundImage
        if (data.hero.backgroundImageAlt !== undefined) {
          updateData.hero_background_image_alt = data.hero.backgroundImageAlt
        }
      }

      // Portfolio section
      if (data.portfolio) {
        updateData.portfolio_title = data.portfolio.title
        updateData.portfolio_subtitle = data.portfolio.subtitle
      }

      // Portfolio items - ensure featured is set to false for all items
      if (data.items) {
        const normalizedItems = data.items.map(item => ({
          ...item,
          featured: false // Always set to false since we're not using this feature
        }))
        updateData.portfolio_items = normalizedItems
      }

      // Portfolio items alt texts
      if (data.itemsAlt !== undefined) {
        updateData.portfolio_items_alt = data.itemsAlt
      }

      // SEO data
      if (data.seo) {
        updateData.seo_title = data.seo.title
        updateData.seo_description = data.seo.description
        updateData.seo_keywords = data.seo.keywords
      }

      const { error } = await (supabase as any)
        .from('portfolio_page')
        .update(updateData)
        .eq('id', currentData.id)

      if (error) {
        return { data: null, error: error.message }
      }

      // Return updated data
      return this.getPortfolioPage()
    } catch (error) {
      console.error('Error updating portfolio page:', error)
      return { data: null, error: 'Failed to update portfolio page' }
    }
  }

  // Add a new portfolio item
  static async addPortfolioItem(
    item: PortfolioItem
  ): Promise<{ data: PortfolioPage | null; error: string | null }> {
    try {
      // First get the current portfolio data
      const { data: currentPortfolio, error: fetchError } = await this.getPortfolioPage()
      
      if (fetchError) {
        return { data: null, error: fetchError }
      }
      
      if (!currentPortfolio) {
        return { data: null, error: 'No portfolio data found' }
      }

      // Add the new item to the beginning of the array with featured set to false
      const newItem = {
        ...item,
        featured: false // Always set to false since we're not using this feature
      }
      const updatedItems = [newItem, ...currentPortfolio.items]

      // Update the portfolio with the new items array
      return this.updatePortfolioPage({ items: updatedItems })
    } catch (error) {
      console.error('Error adding portfolio item:', error)
      return { data: null, error: 'Failed to add portfolio item' }
    }
  }

  // Update a portfolio item
  static async updatePortfolioItem(
    index: number,
    item: PortfolioItem
  ): Promise<{ data: PortfolioPage | null; error: string | null }> {
    try {
      // First get the current portfolio data
      const { data: currentPortfolio, error: fetchError } = await this.getPortfolioPage()
      
      if (fetchError) {
        return { data: null, error: fetchError }
      }
      
      if (!currentPortfolio) {
        return { data: null, error: 'No portfolio data found' }
      }

      // Update the item at the specified index with featured set to false
      const updatedItem = {
        ...item,
        featured: false // Always set to false since we're not using this feature
      }
      const updatedItems = [...currentPortfolio.items]
      updatedItems[index] = updatedItem

      // Update the portfolio with the new items array
      return this.updatePortfolioPage({ items: updatedItems })
    } catch (error) {
      console.error('Error updating portfolio item:', error)
      return { data: null, error: 'Failed to update portfolio item' }
    }
  }

  // Delete a portfolio item
  static async deletePortfolioItem(
    index: number
  ): Promise<{ data: PortfolioPage | null; error: string | null }> {
    try {
      // First get the current portfolio data
      const { data: currentPortfolio, error: fetchError } = await this.getPortfolioPage()
      
      if (fetchError) {
        return { data: null, error: fetchError }
      }
      
      if (!currentPortfolio) {
        return { data: null, error: 'No portfolio data found' }
      }

      // Remove the item at the specified index
      const updatedItems = currentPortfolio.items.filter((_, i) => i !== index)
      
      // Remove the corresponding alt text at the same index
      const currentItemsAlt = currentPortfolio.itemsAlt || []
      const updatedItemsAlt = currentItemsAlt.filter((_, i) => i !== index)

      // Update the portfolio with both updated items array and updated alt texts array
      return this.updatePortfolioPage({ items: updatedItems, itemsAlt: updatedItemsAlt })
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
      return { data: null, error: 'Failed to delete portfolio item' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(
    file: File
  ): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `portfolio/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return { data: null, error: error.message }
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(data.path)

      return { data: publicUrlData.publicUrl, error: null }
    } catch (error) {
      console.error('Error uploading image:', error)
      return { data: null, error: 'Failed to upload image' }
    }
  }

  // Delete image from storage
  static async deleteImage(
    url: string
  ): Promise<{ data: boolean; error: string | null }> {
    try {
      // Extract file path from URL
      const urlParts = url.split('/storage/v1/object/public/portfolio-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('portfolio-images')
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
}