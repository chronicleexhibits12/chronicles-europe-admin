import { supabase } from '@/lib/supabase'
import type { Country, ProcessStep } from './countriesTypes'
import { basicRevalidate } from './simpleRevalidation'

// Define the Supabase country type (what Supabase returns)
interface SupabaseCountry {
  id: string
  created_at: string
  updated_at: string
  slug: string
  name: string
  is_active: boolean
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_background_image_url: string | null
  why_choose_us_title: string | null
  why_choose_us_subtitle: string | null
  why_choose_us_main_image_url: string | null
  why_choose_us_benefits_html: string | null
  what_we_do_title: string | null
  what_we_do_subtitle: string | null
  what_we_do_description_html: string | null
  company_info_title: string | null
  company_info_content_html: string | null
  best_company_title: string | null
  best_company_subtitle: string | null
  best_company_content_html: string | null
  process_section_title: string | null
  process_section_steps: ProcessStep[] | null
  cities_section_title: string | null
  cities_section_subtitle: string | null
  selected_cities: any
}

export class CountriesService {
  // Get all countries
  static async getCountries(): Promise<{ data: Country[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name')

      if (error) throw new Error(error.message)
      
      // Parse the selected_cities and process_section_steps JSONB fields
      const countries = data?.map((country: SupabaseCountry) => ({
        ...country,
        selected_cities: Array.isArray(country.selected_cities) ? country.selected_cities : [],
        process_section_steps: country.process_section_steps || []
      })) || []
      
      return { data: countries, error: null }
    } catch (error: any) {
      console.error('Error fetching countries:', error)
      return { data: null, error: error.message || 'Failed to fetch countries' }
    }
  }

  // Get country by ID
  static async getCountryById(id: string): Promise<{ data: Country | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      
      // Parse the selected_cities and process_section_steps JSONB fields
      const country = data ? {
        ...(data as SupabaseCountry),
        selected_cities: Array.isArray((data as SupabaseCountry).selected_cities) ? (data as SupabaseCountry).selected_cities : [],
        process_section_steps: (data as SupabaseCountry).process_section_steps || []
      } : null
      
      return { data: country as Country, error: null }
    } catch (error: any) {
      console.error('Error fetching country:', error)
      return { data: null, error: error.message || 'Failed to fetch country' }
    }
  }

  // Get country by slug
  static async getCountryBySlug(slug: string): Promise<{ data: Country | null; error: string | null }> {
    try {
      console.log('Fetching country by slug:', slug); // Debug log
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw new Error(error.message)
      
      // Parse the selected_cities and process_section_steps JSONB fields
      const country = data ? {
        ...(data as SupabaseCountry),
        selected_cities: Array.isArray((data as SupabaseCountry).selected_cities) ? (data as SupabaseCountry).selected_cities : [],
        process_section_steps: Array.isArray((data as SupabaseCountry).process_section_steps) ? (data as SupabaseCountry).process_section_steps : []
      } : null
      
      console.log('Fetched country by slug:', slug, country); // Debug log
      
      return { data: country as Country, error: null }
    } catch (error: any) {
      console.error('Error fetching country by slug:', error)
      return { data: null, error: error.message || 'Failed to fetch country' }
    }
  }

  // Create country
  static async createCountry(countryData: any): Promise<{ data: Country | null; error: string | null }> {
    try {
      // Ensure is_active is set to true by default
      const countryDataWithActive = {
        ...countryData,
        is_active: true
      };

      const { data, error } = await (supabase as any)
        .from('countries')
        .insert([countryDataWithActive])
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      // Parse the selected_cities and process_section_steps JSONB fields
      const country = data ? {
        ...(data as SupabaseCountry),
        selected_cities: Array.isArray((data as SupabaseCountry).selected_cities) ? (data as SupabaseCountry).selected_cities : [],
        process_section_steps: (data as SupabaseCountry).process_section_steps || []
      } : null
      
      // Trigger revalidation for the new country page
      if (countryData.slug) {
        await this.triggerRevalidation(`/${countryData.slug}`)
      }
      
      return { data: country as Country, error: null }
    } catch (error: any) {
      console.error('Error creating country:', error)
      return { data: null, error: error.message || 'Failed to create country' }
    }
  }

  // Update country
  static async updateCountry(id: string, countryData: any): Promise<{ data: Country | null; error: string | null }> {
    try {
      // Add updated_at timestamp
      const updateData = {
        ...countryData,
        updated_at: new Date().toISOString()
      }

      console.log('Updating country with data:', id, updateData); // Debug log

      const { data, error } = await (supabase as any)
        .from('countries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      // Parse the selected_cities and process_section_steps JSONB fields
      const country = data ? {
        ...(data as SupabaseCountry),
        selected_cities: Array.isArray((data as SupabaseCountry).selected_cities) ? (data as SupabaseCountry).selected_cities : [],
        process_section_steps: (data as SupabaseCountry).process_section_steps || []
      } : null
      
      console.log('Updated country result:', country); // Debug log
      
      // Get the updated country to get slug for revalidation
      const { data: updatedCountry } = await this.getCountryById(id)
      if (updatedCountry) {
        await this.triggerRevalidation(`/${updatedCountry.slug}`)
      }
      
      return { data: country as Country, error: null }
    } catch (error: any) {
      console.error('Error updating country:', error)
      return { data: null, error: error.message || 'Failed to update country' }
    }
  }

  // Delete country
  static async deleteCountry(id: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await (supabase as any)
        .from('countries')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)
      
      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error deleting country:', error)
      return { data: false, error: error.message || 'Failed to delete country' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(file: File, folder: string = 'country-images'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('country-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw new Error(error.message)

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('country-images')
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
      const urlParts = url.split('/storage/v1/object/public/country-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('country-images')
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