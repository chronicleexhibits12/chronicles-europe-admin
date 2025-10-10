import { supabase } from '@/lib/supabase'
import type { TradeShow, TradeShowsPage } from './tradeShowsTypes'
import { basicRevalidate } from './simpleRevalidation'
import type { Database } from './databaseTypes'

type TradeShowsRow = Database['public']['Tables']['trade_shows']['Row']
type TradeShowsPageRow = Database['public']['Tables']['trade_shows_page']['Row']

export class TradeShowsService {
  // Get all trade shows
  static async getTradeShows(): Promise<{ data: TradeShow[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('trade_shows')
        .select('*')
        .order('created_at', { ascending: false }) // Sort by created date, newest first

      if (error) throw new Error(error.message)
      
      // Transform database rows to TradeShow interface
      const tradeShows: TradeShow[] = (data || []).map((row: TradeShowsRow) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        startDate: row.start_date,
        endDate: row.end_date,
        location: row.location,
        country: row.country,
        city: row.city,
        category: row.category,
        logo: row.logo,
        logoAlt: row.logo_alt,
        organizer: row.organizer,
        website: row.website,
        venue: row.venue,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        metaKeywords: row.meta_keywords,
        sortOrder: row.sort_order,
        isActive: row.is_active,
        redirectUrl: row.redirect_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
      
      return { data: tradeShows, error: null }
    } catch (error: any) {
      console.error('Error fetching trade shows:', error)
      return { data: null, error: error.message || 'Failed to fetch trade shows' }
    }
  }

  // Get all trade shows with pagination
  static async getTradeShowsWithPagination(page: number = 1, pageSize: number = 10): Promise<{ data: TradeShow[] | null; error: string | null; totalCount: number }> {
    try {
      // Calculate the range for pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Get the total count first
      const { count: totalCount, error: countError } = await supabase
        .from('trade_shows')
        .select('*', { count: 'exact', head: true });

      if (countError) throw new Error(countError.message);

      // Get the paginated data, sorted by created date (newest first)
      const { data, error } = await supabase
        .from('trade_shows')
        .select('*')
        .order('created_at', { ascending: false }) // Sort by created date, newest first
        .range(from, to);

      if (error) throw new Error(error.message);
      
      // Transform database rows to TradeShow interface
      const tradeShows: TradeShow[] = (data || []).map((row: TradeShowsRow) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        startDate: row.start_date,
        endDate: row.end_date,
        location: row.location,
        country: row.country,
        city: row.city,
        category: row.category,
        logo: row.logo,
        logoAlt: row.logo_alt,
        organizer: row.organizer,
        website: row.website,
        venue: row.venue,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        metaKeywords: row.meta_keywords,
        sortOrder: row.sort_order,
        isActive: row.is_active,
        redirectUrl: row.redirect_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
      
      return { data: tradeShows, error: null, totalCount: totalCount || 0 };
    } catch (error: any) {
      console.error('Error fetching trade shows:', error);
      return { data: null, error: error.message || 'Failed to fetch trade shows', totalCount: 0 };
    }
  }

  // Get trade show by ID
  static async getTradeShowById(id: string): Promise<{ data: TradeShow | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('trade_shows')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      
      if (!data) {
        return { data: null, error: 'Trade show not found' }
      }
      
      const row = data as TradeShowsRow;
      
      // Transform database row to TradeShow interface
      const tradeShow: TradeShow = {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        startDate: row.start_date,
        endDate: row.end_date,
        location: row.location,
        country: row.country,
        city: row.city,
        category: row.category,
        logo: row.logo,
        logoAlt: row.logo_alt,
        organizer: row.organizer,
        website: row.website,
        venue: row.venue,
        metaTitle: row.meta_title,
        metaDescription: row.meta_description,
        metaKeywords: row.meta_keywords,
        sortOrder: row.sort_order,
        isActive: row.is_active,
        redirectUrl: row.redirect_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
      
      return { data: tradeShow, error: null }
    } catch (error: any) {
      console.error('Error fetching trade show:', error)
      return { data: null, error: error.message || 'Failed to fetch trade show' }
    }
  }

  // Create trade show
  static async createTradeShow(tradeShowData: any): Promise<{ data: TradeShow | null; error: string | null }> {
    try {
      // Transform form data to database format
      const dbData: Record<string, any> = {
        slug: tradeShowData.slug,
        title: tradeShowData.title,
        excerpt: tradeShowData.excerpt,
        content: tradeShowData.content,
        start_date: tradeShowData.startDate,
        end_date: tradeShowData.endDate,
        location: tradeShowData.location,
        country: tradeShowData.country,
        city: tradeShowData.city,
        organizer: tradeShowData.organizer,
        website: tradeShowData.website,
        logo: tradeShowData.logo,
        logo_alt: tradeShowData.logoAlt,
        meta_title: tradeShowData.metaTitle,
        meta_description: tradeShowData.metaDescription,
        meta_keywords: tradeShowData.metaKeywords,
        is_active: tradeShowData.isActive !== undefined ? tradeShowData.isActive : true, // Use provided value or default to true
        sort_order: tradeShowData.sortOrder || 0,
        redirect_url: tradeShowData.redirectUrl
      }

      const { data, error } = await (supabase as any)
        .from('trade_shows')
        .insert([dbData])
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      // Transform database row to TradeShow interface
      const tradeShow: TradeShow = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        startDate: data.start_date,
        endDate: data.end_date,
        location: data.location,
        country: data.country,
        city: data.city,
        category: null,
        logo: data.logo,
        logoAlt: data.logo_alt,
        organizer: data.organizer,
        website: data.website,
        venue: null,
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
        metaKeywords: data.meta_keywords,
        sortOrder: data.sort_order,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      // Trigger revalidation for the trade shows page
      await this.triggerRevalidation('/trade-shows')
      
      return { data: tradeShow, error: null }
    } catch (error: any) {
      console.error('Error creating trade show:', error)
      return { data: null, error: error.message || 'Failed to create trade show' }
    }
  }

  // Update trade show
  static async updateTradeShow(id: string, tradeShowData: any): Promise<{ data: TradeShow | null; error: string | null }> {
    try {
      // Transform form data to database format
      const dbData: Record<string, any> = {
        slug: tradeShowData.slug,
        title: tradeShowData.title,
        excerpt: tradeShowData.excerpt,
        content: tradeShowData.content,
        start_date: tradeShowData.startDate,
        end_date: tradeShowData.endDate,
        location: tradeShowData.location,
        country: tradeShowData.country,
        city: tradeShowData.city,
        organizer: tradeShowData.organizer,
        website: tradeShowData.website,
        logo: tradeShowData.logo,
        logo_alt: tradeShowData.logoAlt,
        meta_title: tradeShowData.metaTitle,
        meta_description: tradeShowData.metaDescription,
        meta_keywords: tradeShowData.metaKeywords,
        is_active: tradeShowData.isActive,
        redirect_url: tradeShowData.redirectUrl,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await (supabase as any)
        .from('trade_shows')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      // Transform database row to TradeShow interface
      const tradeShow: TradeShow = {
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        startDate: data.start_date,
        endDate: data.end_date,
        location: data.location,
        country: data.country,
        city: data.city,
        category: null,
        logo: data.logo,
        logoAlt: data.logo_alt,
        organizer: data.organizer,
        website: data.website,
        venue: null,
        metaTitle: data.meta_title,
        metaDescription: data.meta_description,
        metaKeywords: data.meta_keywords,
        sortOrder: data.sort_order,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      // Trigger revalidation for the trade shows page and the specific trade show
      await this.triggerRevalidation('/trade-shows')
      await this.triggerRevalidation(`/trade-shows/${tradeShow.slug}`)
      
      return { data: tradeShow, error: null }
    } catch (error: any) {
      console.error('Error updating trade show:', error)
      return { data: null, error: error.message || 'Failed to update trade show' }
    }
  }

  // Delete trade show
  static async deleteTradeShow(id: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await (supabase as any)
        .from('trade_shows')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)

      // Trigger revalidation for the trade shows page
      await this.triggerRevalidation('/trade-shows')
      
      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error deleting trade show:', error)
      return { data: false, error: error.message || 'Failed to delete trade show' }
    }
  }

  // Get trade shows page data
  static async getTradeShowsPage(): Promise<{ data: TradeShowsPage | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('trade_shows_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (error) throw new Error(error.message)
      
      if (!data) {
        return { data: null, error: 'Trade shows page not found' }
      }
      
      const row = data as TradeShowsPageRow;
      
      // Transform database row to TradeShowsPage interface
      const page: TradeShowsPage = {
        id: row.id,
        meta: {
          title: row.meta_title,
          description: row.meta_description,
          keywords: row.meta_keywords
        },
        hero: {
          id: 'hero-1',
          title: row.hero_title,
          subtitle: row.hero_subtitle,
          backgroundImage: row.hero_background_image,
          backgroundImageAlt: row.hero_background_image_alt
        },
        description: row.description,
        cities: row.cities || [], // Added cities array
        countries: row.countries || [], // Added countries array
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
      
      return { data: page, error: null }
    } catch (error: any) {
      console.error('Error fetching trade shows page:', error)
      return { data: null, error: error.message || 'Failed to fetch trade shows page' }
    }
  }

  // Update trade shows page
  static async updateTradeShowsPage(id: string, pageData: any): Promise<{ data: TradeShowsPage | null; error: string | null }> {
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
        cities: pageData.cities || [], // Added cities array
        countries: pageData.countries || [], // Added countries array
        is_active: pageData.isActive,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await (supabase as any)
        .from('trade_shows_page')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      const row = data as TradeShowsPageRow;
      
      // Transform database row to TradeShowsPage interface
      const page: TradeShowsPage = {
        id: row.id,
        meta: {
          title: row.meta_title,
          description: row.meta_description,
          keywords: row.meta_keywords
        },
        hero: {
          id: 'hero-1',
          title: row.hero_title,
          subtitle: row.hero_subtitle,
          backgroundImage: row.hero_background_image,
          backgroundImageAlt: row.hero_background_image_alt
        },
        description: row.description,
        cities: row.cities || [], // Added cities array
        countries: row.countries || [], // Added countries array
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
      
      // Trigger revalidation for the trade shows page
      await this.triggerRevalidation('/trade-shows')
      
      return { data: page, error: null }
    } catch (error: any) {
      console.error('Error updating trade shows page:', error)
      return { data: null, error: error.message || 'Failed to update trade shows page' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(file: File, folder: string = 'trade-shows-images'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('trade-shows-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw new Error(error.message)

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('trade-shows-images')
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
      const urlParts = url.split('/storage/v1/object/public/trade-shows-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('trade-shows-images')
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
    try {
      // Use the simple revalidation approach
      if (path === '/') {
        const result = await basicRevalidate('/top-trade-shows-in-europe');
        return result;
      }
      const result = await basicRevalidate(path);
      return result;
    } catch (error) {
      console.error('[TradeShowsService] Revalidation failed:', error);
      // Even if revalidation fails, we don't want to fail the save operation
      return { success: true, error: null };
    }
  }
}
