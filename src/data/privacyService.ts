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
        .single()

      if (response.error) {
        return { data: null, error: response.error.message }
      }

      // Transform database row to PrivacyPage interface
      const row = response.data as Database['public']['Tables']['privacy_page']['Row']
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
      return { data: null, error: 'Failed to fetch privacy page' }
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

      if (data.isActive !== undefined) {
        updateData.is_active = data.isActive
      }

      // First update the record
      const { error: updateError } = await (supabase as any)
        .from('privacy_page')
        .update(updateData as any)
        .eq('id', id)

      if (updateError) {
        return { data: null, error: updateError.message }
      }

      // Then fetch the updated record
      const { data: updatedData, error: fetchError } = await (supabase as any)
        .from('privacy_page')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        return { data: null, error: fetchError.message }
      }

      // Transform database row to PrivacyPage interface
      const row = updatedData as Database['public']['Tables']['privacy_page']['Row']
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
      return { data: null, error: 'Failed to update privacy page' }
    }
  }

  // Trigger revalidation in Next.js website - simplified version
  static async triggerRevalidation(): Promise<{ success: boolean; error: string | null }> {
    // Use the simple revalidation approach
    return basicRevalidate('/privacy-policy');
  }
}