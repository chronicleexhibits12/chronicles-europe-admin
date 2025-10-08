import { supabase } from '@/lib/supabase'
import type { City } from './citiesTypes'
import { basicRevalidate } from './simpleRevalidation'
import { TradeShowsService } from './tradeShowsService'
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

  // Get all cities with pagination
  static async getCitiesWithPagination(page: number = 1, pageSize: number = 10): Promise<{ data: City[] | null; error: string | null; totalCount: number }> {
    try {
      // Calculate the range for pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      // Get the total count first
      const { count: totalCount, error: countError } = await supabase
        .from('cities')
        .select('*', { count: 'exact', head: true });

      if (countError) throw new Error(countError.message);

      // Get the paginated data
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name')
        .range(from, to);

      if (error) throw new Error(error.message);
      
      return { data: data as City[] || [], error: null, totalCount: totalCount || 0 };
    } catch (error: any) {
      console.error('Error fetching cities:', error);
      return { data: null, error: error.message || 'Failed to fetch cities', totalCount: 0 };
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

  // Create city
  static async createCity(cityData: any): Promise<{ data: City | null; error: string | null }> {
    try {
      // First check if a city with this name already exists
      const { data: existingCities, error: fetchError } = await this.getCities();
      if (fetchError) throw new Error(fetchError);
      
      const cityExists = existingCities?.some(city => 
        city.name.toLowerCase() === cityData.name.toLowerCase()
      );
      
      if (cityExists) {
        return { data: null, error: 'A city page with this name already exists' };
      }
      
      const { data, error } = await (supabase as any)
        .from('cities')
        .insert([cityData])
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      const city: City = {
        id: data.id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        name: data.name,
        city_slug: data.city_slug,
        country_slug: data.country_slug,
        is_active: data.is_active,
        trade_shows_heading: data.trade_shows_heading,
        seo_title: data.seo_title,
        seo_description: data.seo_description,
        seo_keywords: data.seo_keywords,
        hero_title: data.hero_title,
        hero_subtitle: data.hero_subtitle,
        hero_background_image_url: data.hero_background_image_url,
        hero_background_image_alt: data.hero_background_image_alt,
        why_choose_us_title: data.why_choose_us_title,
        why_choose_us_subtitle: data.why_choose_us_subtitle,
        why_choose_us_main_image_url: data.why_choose_us_main_image_url,
        why_choose_us_main_image_alt: data.why_choose_us_main_image_alt,
        why_choose_us_benefits_html: data.why_choose_us_benefits_html,
        what_we_do_title: data.what_we_do_title,
        what_we_do_subtitle: data.what_we_do_subtitle,
        what_we_do_description_html: data.what_we_do_description_html,
        portfolio_section_title: data.portfolio_section_title,
        portfolio_section_subtitle: data.portfolio_section_subtitle,
        portfolio_section_cta_text: data.portfolio_section_cta_text,
        portfolio_section_cta_link: data.portfolio_section_cta_link,
        exhibiting_experience_title: data.exhibiting_experience_title,
        exhibiting_experience_subtitle: data.exhibiting_experience_subtitle,
        exhibiting_experience_benefits_html: data.exhibiting_experience_benefits_html,
        exhibiting_experience_excellence_title: data.exhibiting_experience_excellence_title,
        exhibiting_experience_excellence_subtitle: data.exhibiting_experience_excellence_subtitle,
        exhibiting_experience_excellence_points_html: data.exhibiting_experience_excellence_points_html,
      }
      
      // Add the city name to the trade_shows_page cities array
      if (cityData.name) {
        await this.addCityToTradeShowsPage(cityData.name);
      }
      
      // Trigger revalidation for the new city page - using just city_slug
      if (cityData.city_slug) {
        await this.triggerRevalidation(`/${cityData.city_slug}`)
      }
      
      return { data: city, error: null }
    } catch (error: any) {
      console.error('Error creating city:', error)
      return { data: null, error: error.message || 'Failed to create city' }
    }
  }

  // Add city to trade_shows_page cities array
  static async addCityToTradeShowsPage(cityName: string): Promise<{ error: string | null }> {
    try {
      // Get current trade shows page data
      const { data: tradeShowsPage, error: fetchError } = await TradeShowsService.getTradeShowsPage();
      
      if (fetchError) throw new Error(fetchError);
      
      if (tradeShowsPage) {
        // Check if city already exists in the array (case-insensitive comparison)
        const cityExists = tradeShowsPage.cities.some(city => 
          city.toLowerCase() === cityName.toLowerCase()
        );
        
        if (!cityExists) {
          // Add new city to existing cities
          const updatedCities = [...tradeShowsPage.cities, cityName];
          
          // Update the trade shows page with the new cities list
          const { error: updateError } = await TradeShowsService.updateTradeShowsPage(tradeShowsPage.id, {
            ...tradeShowsPage,
            cities: updatedCities
          });
          
          if (updateError) throw new Error(updateError);
          
          // Trigger revalidation for the trade shows page
          await TradeShowsService.triggerRevalidation('/trade-shows');
        }
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Error adding city to trade shows page:', error);
      return { error: error.message || 'Failed to add city to trade shows page' };
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

      console.log('Updating city with data:', id, updateData); // Debug log

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
        // Trigger revalidation for the updated city page - using just city_slug
        await this.triggerRevalidation(`/${updatedCity.city_slug}`)
      }
      
      console.log('Updated city result:', data); // Debug log
      
      return { data: data as City, error: null }
    } catch (error: any) {
      console.error('Error updating city:', error)
      return { data: null, error: error.message || 'Failed to update city' }
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
      
      // Trigger revalidation for the deleted city page - using just city_slug
      if (cityToDelete.city_slug) {
        await this.triggerRevalidation(`/${cityToDelete.city_slug}`)
      }
      
      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error deleting city:', error)
      return { data: false, error: error.message || 'Failed to delete city' }
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
    try {
      // Use the simple revalidation approach
      const result = await basicRevalidate(path);
      return result;
    } catch (error) {
      console.error('[CitiesService] Revalidation failed:', error);
      // Even if revalidation fails, we don't want to fail the save operation
      return { success: true, error: null };
    }
  }
}
