import { supabase } from '@/lib/supabase'
import type { PrivacyPage } from './privacyTypes'
import type { Database } from './databaseTypes'
import { basicRevalidate } from './simpleRevalidation'

export class PrivacyPageService {
  // Get privacy page data
  static async getPrivacyPage(): Promise<{ data: PrivacyPage | null; error: string | null }> {
    try {
      const response = await supabase
        .from('privacy_page')
        .select('*')
        .eq('is_active', true)
        .limit(1)

      if (response.error) {
        console.error('Supabase error fetching privacy page:', response.error)
        return { data: null, error: response.error.message }
      }

      // Check if we have any data
      if (!response.data || response.data.length === 0) {
        // Let's also check if there are any records at all (active or inactive)
        const allRecordsResponse = await supabase
          .from('privacy_page')
          .select('*')
          .limit(5)
          
        if (allRecordsResponse.data && allRecordsResponse.data.length > 0) {
          console.warn('Privacy page records exist but none are active:', allRecordsResponse.data)
          return { data: null, error: 'No active privacy page found. Please activate a privacy page record.' }
        } else {
          console.warn('No privacy page records exist in the database')
          return { data: null, error: 'No privacy page records found. Please create a privacy page record.' }
        }
      }

      // Get the first item from the array
      const row = response.data[0] as Database['public']['Tables']['privacy_page']['Row']
      const privacyPage: PrivacyPage = {
        id: row.id,
        title: row.title || '',
        meta: {
          title: row.meta_title || '',
          description: row.meta_description || '',
          keywords: row.meta_keywords || ''
        },
        content: row.content || '',
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }

      return { data: privacyPage, error: null }
    } catch (error) {
      console.error('Error fetching privacy page:', error)
      return { data: null, error: 'Failed to fetch privacy page: ' + (error as Error).message }
    }
  }

  // Update privacy page
  static async updatePrivacyPage(id: string, data: Partial<PrivacyPage>): Promise<{ data: PrivacyPage | null; error: string | null }> {
    try {
      const updateData: Record<string, any> = {}

      // Title
      if (data.title !== undefined) {
        updateData.title = data.title
      }

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

      // Content
      if (data.content !== undefined) {
        updateData.content = data.content
      }

      // isActive - ensure it remains true unless explicitly set to false
      if (data.isActive !== undefined) {
        updateData.is_active = data.isActive
      } else {
        // Don't change the is_active status if not specified
        // This prevents accidentally setting it to false
      }

      console.log('Updating privacy page with data:', updateData)
      
      // Update the record
      const { error: updateError } = await (supabase as any)
        .from('privacy_page')
        .update(updateData)
        .eq('id', id)

      if (updateError) {
        console.error('Error updating privacy page:', updateError)
        return { data: null, error: updateError.message }
      }

      // Fetch the updated record
      const { data: updatedData, error: fetchError } = await supabase
        .from('privacy_page')
        .select('*')
        .eq('id', id)
        .limit(1)

      if (fetchError) {
        console.error('Error fetching updated privacy page:', fetchError)
        return { data: null, error: fetchError.message }
      }

      // Check if we have any data
      if (!updatedData || updatedData.length === 0) {
        console.error('No privacy page found after update')
        return { data: null, error: 'No privacy page found after update' }
      }

      // Get the first item from the array
      const row = updatedData[0] as Database['public']['Tables']['privacy_page']['Row']
      const privacyPage: PrivacyPage = {
        id: row.id,
        title: row.title || '',
        meta: {
          title: row.meta_title || '',
          description: row.meta_description || '',
          keywords: row.meta_keywords || ''
        },
        content: row.content || '',
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }

      return { data: privacyPage, error: null }
    } catch (error) {
      console.error('Error updating privacy page:', error)
      return { data: null, error: 'Failed to update privacy page: ' + (error as Error).message }
    }
  }

  // Trigger revalidation in Next.js website - simplified version
  static async triggerRevalidation(): Promise<{ success: boolean; error: string | null }> {
    try {
      // Use the simple revalidation approach
      const result = await basicRevalidate('/privacy-policy');
      return result;
    } catch (error) {
      console.error('[PrivacyPageService] Revalidation failed:', error);
      // Even if revalidation fails, we don't want to fail the save operation
      return { success: true, error: null };
    }
  }
}