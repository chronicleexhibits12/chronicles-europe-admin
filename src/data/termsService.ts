import { supabase } from '@/lib/supabase'
import type { TermsPage } from './termsTypes'
import type { Database } from './databaseTypes'
import { basicRevalidate } from './simpleRevalidation'

export class TermsPageService {
  // Get terms page data
  static async getTermsPage(): Promise<{ data: TermsPage | null; error: string | null }> {
    try {
      const response = await supabase
        .from('terms_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (response.error) {
        return { data: null, error: response.error.message }
      }

      // Transform database row to TermsPage interface
      const row = response.data as Database['public']['Tables']['terms_page']['Row']
      const termsPage: TermsPage = {
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

      return { data: termsPage, error: null }
    } catch (error) {
      console.error('Error fetching terms page:', error)
      return { data: null, error: 'Failed to fetch terms page' }
    }
  }

  // Update terms page
  static async updateTermsPage(id: string, data: Partial<TermsPage>): Promise<{ data: TermsPage | null; error: string | null }> {
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

      const { error } = await (supabase as any)
        .from('terms_page')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      // Return updated data
      return this.getTermsPage()
    } catch (error) {
      console.error('Error updating terms page:', error)
      return { data: null, error: 'Failed to update terms page' }
    }
  }

  // Trigger revalidation in Next.js website - simplified version
  static async triggerRevalidation(): Promise<{ success: boolean; error: string | null }> {
    // Use the simple revalidation approach
    return basicRevalidate('/terms-and-conditions');
  }
}