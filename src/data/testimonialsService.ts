import { supabase } from '@/lib/supabase'
import type { TestimonialsPage, TestimonialItem } from './testimonialsTypes'
import { basicRevalidate } from './simpleRevalidation'

export class TestimonialsPageService {
  // Get testimonials page data
  static async getTestimonialsPage(): Promise<{ data: TestimonialsPage | null; error: string | null }> {
    try {
      // First get the testimonials page
      const pageResponse: any = await (supabase as any)
        .from('testimonials_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (pageResponse.error) {
        return { data: null, error: pageResponse.error.message }
      }

      // Transform database row to TestimonialsPage interface
      const pageRow = pageResponse.data
      
      // Get associated testimonials
      const testimonialsResponse: any = await (supabase as any)
        .from('testimonials')
        .select('*')
        .eq('page_id', pageRow.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      let testimonials: TestimonialItem[] = []
      if (!testimonialsResponse.error && testimonialsResponse.data) {
        testimonials = testimonialsResponse.data.map((row: any) => ({
          id: row.id,
          clientName: row.client_name || '',
          companyName: row.company_name || '',
          companyLogoUrl: row.company_logo_url || '',
          rating: row.rating || 0,
          testimonialText: row.testimonial_text || '',
          isFeatured: row.is_featured || false,
          displayOrder: row.display_order || 0
          // Removed isActive since it's always true
        }))
      }

      const testimonialsPage: TestimonialsPage = {
        id: pageRow.id,
        meta: {
          title: pageRow.meta_title || undefined,
          description: pageRow.meta_description || undefined,
          keywords: pageRow.meta_keywords || undefined
        },
        hero: {
          title: pageRow.hero_title || undefined,
          backgroundImage: pageRow.hero_background_image || undefined
        },
        intro: {
          title: pageRow.intro_title || undefined,
          subtitle: pageRow.intro_subtitle || undefined,
          description: pageRow.intro_description || undefined
        },
        testimonials,
        // Always set isActive to true for testimonials page
        isActive: true,
        createdAt: pageRow.created_at,
        updatedAt: pageRow.updated_at
      }

      return { data: testimonialsPage, error: null }
    } catch (error) {
      console.error('Error fetching testimonials page:', error)
      return { data: null, error: 'Failed to fetch testimonials page' }
    }
  }

  // Update testimonials page
  static async updateTestimonialsPage(id: string, data: Partial<TestimonialsPage>): Promise<{ data: TestimonialsPage | null; error: string | null }> {
    try {
      const updateData: any = {}

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
      if (data.hero?.backgroundImage !== undefined) {
        updateData.hero_background_image = data.hero.backgroundImage
      }

      // Intro section
      if (data.intro?.title !== undefined) {
        updateData.intro_title = data.intro.title
      }
      if (data.intro?.subtitle !== undefined) {
        updateData.intro_subtitle = data.intro.subtitle
      }
      if (data.intro?.description !== undefined) {
        updateData.intro_description = data.intro.description
      }

      // Remove the isActive update since testimonials page should always be active
      // if (data.isActive !== undefined) {
      //   updateData.is_active = data.isActive
      // }

      const updateResponse: any = await (supabase as any)
        .from('testimonials_page')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (updateResponse.error) {
        return { data: null, error: updateResponse.error.message }
      }

      // Return updated data
      return this.getTestimonialsPage()
    } catch (error) {
      console.error('Error updating testimonials page:', error)
      return { data: null, error: 'Failed to update testimonials page' }
    }
  }

  // Update testimonials
  static async updateTestimonials(pageId: string, testimonials: TestimonialItem[]): Promise<{ data: TestimonialItem[] | null; error: string | null }> {
    try {
      // First, get existing testimonials for this page
      const selectResponse: any = await (supabase as any)
        .from('testimonials')
        .select('id')
        .eq('page_id', pageId)

      if (selectResponse.error) {
        return { data: null, error: selectResponse.error.message }
      }

      const existingTestimonials = selectResponse.data
      const existingIds = existingTestimonials?.map((t: any) => t.id) || []
      const newTestimonials = testimonials.filter(t => !existingIds.includes(t.id))
      const updatedTestimonials = testimonials.filter(t => existingIds.includes(t.id))
      const deletedIds = existingIds.filter((id: string) => !testimonials.some(t => t.id === id))

      // Delete testimonials that are no longer in the list
      if (deletedIds.length > 0) {
        const deleteResponse: any = await (supabase as any)
          .from('testimonials')
          .delete()
          .in('id', deletedIds)

        if (deleteResponse.error) {
          return { data: null, error: deleteResponse.error.message }
        }
      }

      // Update existing testimonials with sequential display order
      for (let i = 0; i < updatedTestimonials.length; i++) {
        const testimonial = updatedTestimonials[i];
        const updateData: any = {
          client_name: testimonial.clientName,
          company_name: testimonial.companyName,
          company_logo_url: testimonial.companyLogoUrl,
          rating: testimonial.rating,
          testimonial_text: testimonial.testimonialText,
          is_featured: testimonial.isFeatured,
          display_order: i, // Sequential display order
          // isActive is always true as per requirements
          is_active: true
        }

        const updateResponse: any = await (supabase as any)
          .from('testimonials')
          .update(updateData)
          .eq('id', testimonial.id)

        if (updateResponse.error) {
          return { data: null, error: updateResponse.error.message }
        }
      }

      // Insert new testimonials with sequential display order
      if (newTestimonials.length > 0) {
        // Calculate starting display order for new testimonials
        const startIndex = updatedTestimonials.length;
        
        const newTestimonialsData: any[] = newTestimonials.map((testimonial, index) => ({
          page_id: pageId,
          client_name: testimonial.clientName,
          company_name: testimonial.companyName,
          company_logo_url: testimonial.companyLogoUrl,
          rating: testimonial.rating,
          testimonial_text: testimonial.testimonialText,
          is_featured: testimonial.isFeatured,
          display_order: startIndex + index, // Sequential display order
          // isActive is always true as per requirements
          is_active: true
        }))

        const insertResponse: any = await (supabase as any)
          .from('testimonials')
          .insert(newTestimonialsData)

        if (insertResponse.error) {
          return { data: null, error: insertResponse.error.message }
        }
      }

      // Return updated testimonials with proper sequential ordering
      const fetchResponse: any = await (supabase as any)
        .from('testimonials')
        .select('*')
        .eq('page_id', pageId)
        .order('display_order', { ascending: true })

      if (fetchResponse.error) {
        return { data: null, error: fetchResponse.error.message }
      }

      // Map the data and ensure isActive is always true and displayOrder is sequential
      const result: TestimonialItem[] = fetchResponse.data.map((row: any, index: number) => ({
        id: row.id,
        clientName: row.client_name || '',
        companyName: row.company_name || '',
        companyLogoUrl: row.company_logo_url || '',
        rating: row.rating || 0,
        testimonialText: row.testimonial_text || '',
        isFeatured: row.is_featured || false,
        displayOrder: index // Sequential display order
        // Removed isActive since it's always true
      }))

      return { data: result, error: null }
    } catch (error) {
      console.error('Error updating testimonials:', error)
      return { data: null, error: 'Failed to update testimonials' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(file: File, folder: string = 'general'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const uploadResponse: any = await (supabase as any).storage
        .from('testimonials-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadResponse.error) {
        return { data: null, error: uploadResponse.error.message }
      }

      // Get public URL
      const publicUrlResponse: any = (supabase as any).storage
        .from('testimonials-images')
        .getPublicUrl(uploadResponse.data.path)

      return { data: publicUrlResponse.data.publicUrl, error: null }
    } catch (error) {
      console.error('Error uploading image:', error)
      return { data: null, error: 'Failed to upload image' }
    }
  }

  // Delete image from storage
  static async deleteImage(url: string): Promise<{ data: boolean; error: string | null }> {
    try {
      // Extract file path from URL
      const urlParts = url.split('/storage/v1/object/public/testimonials-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const deleteResponse: any = await (supabase as any).storage
        .from('testimonials-images')
        .remove([filePath])

      if (deleteResponse.error) {
        return { data: false, error: deleteResponse.error.message }
      }

      return { data: true, error: null }
    } catch (error) {
      console.error('Error deleting image:', error)
      return { data: false, error: 'Failed to delete image' }
    }
  }

  // Trigger revalidation in Next.js website
  static async triggerRevalidation(): Promise<{ success: boolean; error: string | null }> {
    // Use the simple revalidation approach
    return basicRevalidate('/testimonials');
  }
}
