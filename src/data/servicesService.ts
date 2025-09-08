import { supabase } from '@/lib/supabase'
import type { ServicesPage, ServiceItem } from './servicesTypes'
import { basicRevalidate } from './simpleRevalidation'

export class ServicesPageService {
  // Get services page data
  static async getServicesPage(): Promise<{ data: ServicesPage | null; error: string | null }> {
    try {
      // Since we're using a single row for page content and multiple rows for services,
      // we need to fetch them separately
      const { data: pageData, error: pageError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .eq('is_service', false)
        .single()

      if (pageError) {
        return { data: null, error: pageError.message }
      }

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .eq('is_service', true)
        .order('created_at', { ascending: true })

      if (servicesError) {
        return { data: null, error: servicesError.message }
      }

      // Transform database rows to ServicesPage interface
      const pageRow: any = pageData;
      const servicesRows: any[] = servicesData;

      const servicesPage: ServicesPage = {
        id: pageRow.id,
        meta: {
          title: pageRow.meta_title || undefined,
          description: pageRow.meta_description || undefined,
          keywords: pageRow.meta_keywords || undefined
        },
        hero: {
          title: pageRow.hero_title || undefined,
          subtitle: pageRow.hero_subtitle || undefined,
          backgroundImage: pageRow.hero_background_image || undefined,
          backgroundImageAlt: pageRow.hero_background_image_alt || undefined
        },
        intro: {
          title: pageRow.intro_title || undefined,
          descriptionHtml: pageRow.intro_description || undefined
        },
        services: servicesRows.map(row => ({
          id: row.id,
          title: row.service_title || '',
          descriptionHtml: row.service_description_html || ''
        })),
        isActive: pageRow.is_active,
        createdAt: pageRow.created_at,
        updatedAt: pageRow.updated_at
      }

      return { data: servicesPage, error: null }
    } catch (error) {
      console.error('Error fetching services page:', error)
      return { data: null, error: 'Failed to fetch services page' }
    }
  }

  // Update services page
  static async updateServicesPage(id: string, data: Partial<ServicesPage>): Promise<{ data: ServicesPage | null; error: string | null }> {
    try {
      const updateData: Record<string, any> = {
        is_service: false // Ensure we're only updating the page content, not service items
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

      // Hero section
      if (data.hero?.title !== undefined) {
        updateData.hero_title = data.hero.title
      }
      if (data.hero?.subtitle !== undefined) {
        updateData.hero_subtitle = data.hero.subtitle
      }
      if (data.hero?.backgroundImage !== undefined) {
        updateData.hero_background_image = data.hero.backgroundImage
      }
      if (data.hero?.backgroundImageAlt !== undefined) {
        updateData.hero_background_image_alt = data.hero.backgroundImageAlt
      }

      // Intro section
      if (data.intro?.title !== undefined) {
        updateData.intro_title = data.intro.title
      }
      if (data.intro?.descriptionHtml !== undefined) {
        updateData.intro_description = data.intro.descriptionHtml
      }

      if (data.isActive !== undefined) {
        updateData.is_active = data.isActive
      }

      const { error } = await (supabase as any)
        .from('services')
        .update(updateData)
        .eq('id', id)
        .eq('is_service', false)

      if (error) {
        return { data: null, error: error.message }
      }

      // Return updated data
      return this.getServicesPage()
    } catch (error) {
      console.error('Error updating services page:', error)
      return { data: null, error: 'Failed to update services page' }
    }
  }

  // Create a new service item
  static async createServiceItem(serviceData: Omit<ServiceItem, 'id'>): Promise<{ data: ServiceItem | null; error: string | null }> {
    try {
      const insertData = {
        service_title: serviceData.title,
        service_description_html: serviceData.descriptionHtml,
        is_service: true,
        is_active: true
      }

      const { data: insertedData, error } = await (supabase as any)
        .from('services')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      if (!insertedData) {
        return { data: null, error: 'No data returned from insert operation' }
      }

      const serviceItem: ServiceItem = {
        id: insertedData.id,
        title: insertedData.service_title || '',
        descriptionHtml: insertedData.service_description_html || ''
      }

      return { data: serviceItem, error: null }
    } catch (error) {
      console.error('Error creating service item:', error)
      return { data: null, error: 'Failed to create service item' }
    }
  }

  // Update a service item
  static async updateServiceItem(id: string, serviceData: Partial<ServiceItem>): Promise<{ data: ServiceItem | null; error: string | null }> {
    try {
      const updateData: Record<string, any> = {
        is_service: true // Ensure we're only updating service items
      }

      if (serviceData.title !== undefined) {
        updateData.service_title = serviceData.title
      }
      if (serviceData.descriptionHtml !== undefined) {
        updateData.service_description_html = serviceData.descriptionHtml
      }

      const { data: updatedDataResult, error } = await (supabase as any)
        .from('services')
        .update(updateData)
        .eq('id', id)
        .eq('is_service', true)
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message }
      }

      if (!updatedDataResult) {
        return { data: null, error: 'No data returned from update operation' }
      }

      const serviceItem: ServiceItem = {
        id: updatedDataResult.id,
        title: updatedDataResult.service_title || '',
        descriptionHtml: updatedDataResult.service_description_html || ''
      }

      return { data: serviceItem, error: null }
    } catch (error) {
      console.error('Error updating service item:', error)
      return { data: null, error: 'Failed to update service item' }
    }
  }

  // Delete a service item
  static async deleteServiceItem(id: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
        .eq('is_service', true)

      if (error) {
        return { data: false, error: error.message }
      }

      return { data: true, error: null }
    } catch (error) {
      console.error('Error deleting service item:', error)
      return { data: false, error: 'Failed to delete service item' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(file: File, folder: string = 'services'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('services-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        return { data: null, error: error.message }
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('services-images')
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
      const urlParts = url.split('/storage/v1/object/public/services-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('services-images')
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
    // Use the simple revalidation approach
    return basicRevalidate('/services')
  }
}