import { supabase } from '@/lib/supabase'
import type { GlobalLocations } from './globalLocationsTypes'
import { basicRevalidate } from './simpleRevalidation'
import type { Database } from './databaseTypes'

export class GlobalLocationsService {
  // Get global locations (should only be one row)
  static async getGlobalLocations(): Promise<{ data: GlobalLocations | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('global_locations')
        .select('*')
        .limit(1)
        .single()

      if (error) throw new Error(error.message)
      
      return { data: data as GlobalLocations, error: null }
    } catch (error: any) {
      console.error('Error fetching global locations:', error)
      return { data: null, error: error.message || 'Failed to fetch global locations' }
    }
  }

  // Update global locations
  static async updateGlobalLocations(
    id: string, 
    locationsData: Partial<GlobalLocations>
  ): Promise<{ data: GlobalLocations | null; error: string | null }> {
    try {
      const updateData: Database['public']['Tables']['global_locations']['Update'] = {
        ...locationsData,
        updated_at: new Date().toISOString()
      }
      
      const { data, error } = await (supabase as any)
        .from('global_locations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      
      return { data: data as GlobalLocations, error: null }
    } catch (error: any) {
      console.error('Error updating global locations:', error)
      return { data: null, error: error.message || 'Failed to update global locations' }
    }
  }

  // Add a city to the global locations
  static async addCity(cityName: string): Promise<{ data: GlobalLocations | null; error: string | null }> {
    try {
      // Get current global locations
      const { data: globalLocations, error: fetchError } = await this.getGlobalLocations()
      
      if (fetchError) throw new Error(fetchError)
      
      if (globalLocations) {
        // Check if city already exists (case-insensitive comparison)
        const cityExists = globalLocations.cities.some(city => 
          city.toLowerCase() === cityName.toLowerCase()
        )
        
        if (!cityExists) {
          // Add new city to existing cities
          const updatedCities = [...globalLocations.cities, cityName]
          
          // Update the global locations with the new city list
          const { data: updatedData, error: updateError } = await this.updateGlobalLocations(
            globalLocations.id, 
            { cities: updatedCities }
          )
          
          if (updateError) throw new Error(updateError)
          
          return { data: updatedData, error: null }
        } else {
          return { data: globalLocations, error: 'City already exists' }
        }
      }
      
      return { data: null, error: 'Global locations not found' }
    } catch (error: any) {
      console.error('Error adding city to global locations:', error)
      return { data: null, error: error.message || 'Failed to add city to global locations' }
    }
  }

  // Remove a city from the global locations
  static async removeCity(cityName: string): Promise<{ data: GlobalLocations | null; error: string | null }> {
    try {
      // Get current global locations
      const { data: globalLocations, error: fetchError } = await this.getGlobalLocations()
      
      if (fetchError) throw new Error(fetchError)
      
      if (globalLocations) {
        // Remove city from existing cities (case-insensitive comparison)
        const updatedCities = globalLocations.cities.filter(city => 
          city.toLowerCase() !== cityName.toLowerCase()
        )
        
        // Update the global locations with the new city list
        const { data: updatedData, error: updateError } = await this.updateGlobalLocations(
          globalLocations.id, 
          { cities: updatedCities }
        )
        
        if (updateError) throw new Error(updateError)
        
        return { data: updatedData, error: null }
      }
      
      return { data: null, error: 'Global locations not found' }
    } catch (error: any) {
      console.error('Error removing city from global locations:', error)
      return { data: null, error: error.message || 'Failed to remove city from global locations' }
    }
  }

  // Add a country to the global locations
  static async addCountry(countryName: string): Promise<{ data: GlobalLocations | null; error: string | null }> {
    try {
      // Get current global locations
      const { data: globalLocations, error: fetchError } = await this.getGlobalLocations()
      
      if (fetchError) throw new Error(fetchError)
      
      if (globalLocations) {
        // Check if country already exists (case-insensitive comparison)
        const countryExists = globalLocations.countries.some(country => 
          country.toLowerCase() === countryName.toLowerCase()
        )
        
        if (!countryExists) {
          // Add new country to existing countries
          const updatedCountries = [...globalLocations.countries, countryName]
          
          // Update the global locations with the new country list
          const { data: updatedData, error: updateError } = await this.updateGlobalLocations(
            globalLocations.id, 
            { countries: updatedCountries }
          )
          
          if (updateError) throw new Error(updateError)
          
          return { data: updatedData, error: null }
        } else {
          return { data: globalLocations, error: 'Country already exists' }
        }
      }
      
      return { data: null, error: 'Global locations not found' }
    } catch (error: any) {
      console.error('Error adding country to global locations:', error)
      return { data: null, error: error.message || 'Failed to add country to global locations' }
    }
  }

  // Remove a country from the global locations
  static async removeCountry(countryName: string): Promise<{ data: GlobalLocations | null; error: string | null }> {
    try {
      // Get current global locations
      const { data: globalLocations, error: fetchError } = await this.getGlobalLocations()
      
      if (fetchError) throw new Error(fetchError)
      
      if (globalLocations) {
        // Remove country from existing countries (case-insensitive comparison)
        const updatedCountries = globalLocations.countries.filter(country => 
          country.toLowerCase() !== countryName.toLowerCase()
        )
        
        // Update the global locations with the new country list
        const { data: updatedData, error: updateError } = await this.updateGlobalLocations(
          globalLocations.id, 
          { countries: updatedCountries }
        )
        
        if (updateError) throw new Error(updateError)
        
        return { data: updatedData, error: null }
      }
      
      return { data: null, error: 'Global locations not found' }
    } catch (error: any) {
      console.error('Error removing country from global locations:', error)
      return { data: null, error: error.message || 'Failed to remove country from global locations' }
    }
  }

  // Trigger revalidation in Next.js website
  static async triggerRevalidation(path: string = '/'): Promise<{ success: boolean; error: string | null }> {
    try {
      // Use the simple revalidation approach
      const result = await basicRevalidate(path);
      return result;
    } catch (error) {
      console.error('[GlobalLocationsService] Revalidation failed:', error);
      // Even if revalidation fails, we don't want to fail the save operation
      return { success: true, error: null };
    }
  }
}