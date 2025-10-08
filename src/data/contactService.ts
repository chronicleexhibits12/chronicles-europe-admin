import { supabase } from '@/lib/supabase'
import type { ContactPage } from './contactTypes'
import type { Database } from './databaseTypes'
import { basicRevalidate } from './simpleRevalidation'

export class ContactPageService {
  // Get contact page data
  static async getContactPage(): Promise<{ data: ContactPage | null; error: string | null }> {
    try {
      const response = await supabase
        .from('contact_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (response.error) {
        return { data: null, error: response.error.message }
      }

      // Transform database row to ContactPage interface
      const row = response.data as Database['public']['Tables']['contact_page']['Row']
      const contactPage: ContactPage = {
        id: row.id,
        meta: {
          title: row.meta_title || '',
          description: row.meta_description || '',
          keywords: row.meta_keywords || ''
        },
        hero: {
          title: row.hero_title || ''
        },
        contactInfo: {
          title: row.contact_info_title || '',
          address: row.contact_info_address || '',
          fullAddress: row.contact_info_full_address || '',
          phone: [row.contact_info_phone_1 || '', row.contact_info_phone_2 || ''],
          email: row.contact_info_email || ''
        },
        formFields: row.form_fields || [],
        otherOffices: {
          title: row.other_offices_title || '',
          offices: row.other_offices || []
        },
        support: {
          title: row.support_title || '',
          description: row.support_description || '',
          items: row.support_items || []
        },
        map: {
          embedUrl: row.map_embed_url || ''
        },
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }

      return { data: contactPage, error: null }
    } catch (error) {
      console.error('Error fetching contact page:', error)
      return { data: null, error: 'Failed to fetch contact page' }
    }
  }

  // Update contact page
  static async updateContactPage(id: string, data: Partial<ContactPage>): Promise<{ data: ContactPage | null; error: string | null }> {
    try {
      const updateData: Record<string, any> = {}

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

      // Hero section
      if (data.hero?.title !== undefined) {
        updateData.hero_title = data.hero.title
      }

      // Contact Info section
      if (data.contactInfo?.title !== undefined) {
        updateData.contact_info_title = data.contactInfo.title
      }
      if (data.contactInfo?.address !== undefined) {
        updateData.contact_info_address = data.contactInfo.address
      }
      if (data.contactInfo?.fullAddress !== undefined) {
        updateData.contact_info_full_address = data.contactInfo.fullAddress
      }
      if (data.contactInfo?.phone !== undefined) {
        updateData.contact_info_phone_1 = data.contactInfo.phone[0] || ''
        updateData.contact_info_phone_2 = data.contactInfo.phone[1] || ''
      }
      if (data.contactInfo?.email !== undefined) {
        updateData.contact_info_email = data.contactInfo.email
      }

      // Form Fields
      if (data.formFields !== undefined) {
        updateData.form_fields = data.formFields
      }

      // Other Offices section
      if (data.otherOffices?.title !== undefined) {
        updateData.other_offices_title = data.otherOffices.title
      }
      if (data.otherOffices?.offices !== undefined) {
        updateData.other_offices = data.otherOffices.offices
      }

      // Support section
      if (data.support?.title !== undefined) {
        updateData.support_title = data.support.title
      }
      if (data.support?.description !== undefined) {
        updateData.support_description = data.support.description
      }
      if (data.support?.items !== undefined) {
        updateData.support_items = data.support.items
      }

      // Map section
      if (data.map?.embedUrl !== undefined) {
        updateData.map_embed_url = data.map.embedUrl
      }

      if (data.isActive !== undefined) {
        updateData.is_active = data.isActive
      }

      const { error } = await (supabase as any)
        .from('contact_page')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      // Return updated data
      return this.getContactPage()
    } catch (error) {
      console.error('Error updating contact page:', error)
      return { data: null, error: 'Failed to update contact page' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(file: File, folder: string = 'contact'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('contact-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return { data: null, error: error.message }
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('contact-images')
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
      const urlParts = url.split('/storage/v1/object/public/contact-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('contact-images')
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

  // Trigger revalidation in Next.js website - simplified version
  static async triggerRevalidation(): Promise<{ success: boolean; error: string | null }> {
    try {
      // Use the simple revalidation approach
      const result = await basicRevalidate('/contact');
      return result;
    } catch (error) {
      console.error('[ContactPageService] Revalidation failed:', error);
      // Even if revalidation fails, we don't want to fail the save operation
      return { success: true, error: null };
    }
  }
}