import { supabase } from '@/lib/supabase'
import type { City } from './citiesTypes'
import { basicRevalidate } from './simpleRevalidation'
import { CountriesService } from './countriesService'

export class CitiesService {
  // Get all cities
  static async getCities(): Promise<{ data: City[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name')

      if (error) throw new Error(error.message)
      
      return { data: data as City[] || [], error: null }
    } catch (error: any) {
      console.error('Error fetching cities:', error)
      return { data: null, error: error.message || 'Failed to fetch cities' }
    }
  }

  // Get city by ID
  static async getCityById(id: string): Promise<{ data: City | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      
      return { data: data as City, error: null }
    } catch (error: any) {
      console.error('Error fetching city:', error)
      return { data: null, error: error.message || 'Failed to fetch city' }
    }
  }

  // Create city with default is_active = true
  static async createCity(cityData: any): Promise<{ data: City | null; error: string | null }> {
    try {
      // Ensure is_active is set to true by default
      const cityDataWithActive = {
        ...cityData,
        is_active: true
      };

      const { data, error } = await (supabase as any)
        .from('cities')
        .insert([cityDataWithActive])
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      // Trigger revalidation for the new city page
      if (cityData.country_slug && cityData.city_slug) {
        await this.triggerRevalidation(`/${cityData.country_slug}/${cityData.city_slug}`)
      }
      
      return { data: data as City, error: null }
    } catch (error: any) {
      console.error('Error creating city:', error)
      return { data: null, error: error.message || 'Failed to create city' }
    }
  }

  // Update city
  static async updateCity(id: string, cityData: any): Promise<{ data: City | null; error: string | null }> {
    try {
      // Add updated_at timestamp
      const updateData = {
        ...cityData,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await (supabase as any)
        .from('cities')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      // Get the updated city to get country and city slugs for revalidation
      const { data: updatedCity } = await this.getCityById(id)
      if (updatedCity) {
        await this.triggerRevalidation(`/${updatedCity.country_slug}/${updatedCity.city_slug}`)
      }
      
      return { data: data as City, error: null }
    } catch (error: any) {
      console.error('Error updating city:', error)
      return { data: null, error: error.message || 'Failed to update city' }
    }
  }

  // Delete city and remove it from all countries that reference it
  static async deleteCity(id: string): Promise<{ data: boolean; error: string | null }> {
    try {
      // First, get the city to be deleted to get its slug
      const { data: cityToDelete, error: fetchError } = await this.getCityById(id)
      if (fetchError) throw new Error(fetchError)
      if (!cityToDelete) throw new Error('City not found')

      // Delete the city
      const { error } = await (supabase as any)
        .from('cities')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)

      // Remove this city from all countries that reference it
      await this.removeCityFromCountries(cityToDelete.city_slug)
      
      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error deleting city:', error)
      return { data: false, error: error.message || 'Failed to delete city' }
    }
  }

  // Remove a city from all countries that reference it
  static async removeCityFromCountries(citySlug: string): Promise<{ data: boolean; error: string | null }> {
    try {
      // Get all countries
      const { data: countries, error: countriesError } = await CountriesService.getCountries()
      if (countriesError) throw new Error(countriesError)

      // For each country, check if it references this city and remove it
      if (countries) {
        for (const country of countries) {
          if (country.selected_cities && country.selected_cities.includes(citySlug)) {
            // Remove the city from the selected_cities array
            const updatedCities = country.selected_cities.filter((slug: string) => slug !== citySlug)
            
            // Update the country with the new selected_cities array
            const { error: updateError } = await CountriesService.updateCountry(country.id, {
              ...country,
              selected_cities: updatedCities
            })
            
            if (updateError) {
              console.error(`Error updating country ${country.id}:`, updateError)
              // Continue with other countries even if one fails
            }
          }
        }
      }
      
      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error removing city from countries:', error)
      return { data: false, error: error.message || 'Failed to remove city from countries' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(file: File, folder: string = 'city-images'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('city-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw new Error(error.message)

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('city-images')
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
      const urlParts = url.split('/storage/v1/object/public/city-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('city-images')
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