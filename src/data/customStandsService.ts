import { supabase } from '@/lib/supabase'
import type { CustomStandsPage } from './customStandsTypes'
import type { Database } from './databaseTypes'
import { basicRevalidate } from './simpleRevalidation'

export class CustomStandsPageService {
  // Default data when table doesn't exist
  static getDefaultCustomStandsPage(): CustomStandsPage {
    return {
      id: 'default',
      meta: {
        title: 'Custom Exhibition Stands Design & Build Services',
        description: 'Professional custom exhibition stand design and build services. Create unique, eye-catching displays that represent your brand perfectly at trade shows and exhibitions.'
      },
      hero: {
        title: 'CUSTOM EXHIBITION STANDS',
        subtitle: 'DESIGN & BUILD',
        backgroundImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop'
      },
      benefits: {
        title: 'BENEFITS OF CUSTOM EXHIBITION STAND:',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
        content: '<ul><li><strong>Custom stand designs</strong> are tailored to your brand, accurately representing your company\'s values.</li><li><strong>Bespoke exhibition booths</strong> are visually attractive, capturing visitors\' attention and creating a buzz on the show floor.</li><li>They feature <em>interactive elements</em>, live presentations, and product demonstrations, encouraging more visitor engagement.</li></ul>'
      },
      standProjectText: {
        title: 'SOME OF OUR',
        highlight: 'CUSTOM EXHIBITION STAND',
        description: 'Check some of the designs aesthetically created and delivered in the best quality by our professional bespoke exhibition stand builders.'
      },
      exhibitionBenefits: {
        title: 'Why Choose Our Exhibition Stands?',
        subtitle: 'Discover the advantages that make our stands unique and effective.',
        content: '<ul><li><strong>Tailor-made designs</strong> to match your brand identity with precision.</li><li><strong>High-quality materials</strong> ensuring durability and elegance throughout the event.</li></ul>',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop'
      },
      bespoke: {
        title: 'A BESPOKE EXHIBITION STAND:',
        subtitle: 'SETTING YOUR BRAND APART',
        description: 'We are known for our adaptability and expertise in creating exhibition stand designs that set your brand\'s story and connect the brand with the audience on an emotional level.'
      },
      freshDesign: {
        title: 'ARE YOU LOOKING FOR',
        subtitle: 'A FRESH STAND DESIGN FOR YOUR NEXT EVENT?',
        description: 'Our team of professional exhibition stand designers will connect with your marketing team to understand your brand needs.'
      },
      costSection: {
        title: 'IS DESIGNING AND BUILDING',
        subtitle: 'CUSTOM EXHIBITION STAND COSTLY?',
        description: 'We take pride in offering custom exhibition stand design and build services at the most competitive and cost-effective prices.'
      },
      pointsTable: {
        title: 'Key Benefits of Our Custom Stands',
        content: '<ul><li><strong>Tailor-made designs</strong> to match your brand identity with our expert designers</li><li><strong>High-quality materials</strong> ensuring durability and elegant appearance</li><li><strong>Cost-effective solutions</strong> with maximum visual impact and ROI</li></ul>'
      },
      slug: 'custom-stands',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
  // Get custom stands page data
  static async getCustomStandsPage(): Promise<{ data: CustomStandsPage | null; error: string | null }> {
    try {
      const response = await supabase
        .from('custom_stands_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (response.error) {
        // If table doesn't exist, return default data
        if (response.error.code === 'PGRST116' || response.error.message.includes('relation') || response.error.message.includes('does not exist')) {
          return { 
            data: this.getDefaultCustomStandsPage(), 
            error: null 
          }
        }
        return { data: null, error: response.error.message }
      }

      // Transform database row to CustomStandsPage interface
      const row = response.data as Database['public']['Tables']['custom_stands_page']['Row']
      const customStandsPage: CustomStandsPage = {
        id: row.id,
        meta: {
          title: row.meta_title || undefined,
          description: row.meta_description || undefined
        },
        hero: {
          title: row.hero_title || undefined,
          subtitle: row.hero_subtitle || undefined,
          backgroundImage: row.hero_background_image || undefined
        },
        benefits: {
          title: row.benefits_title || undefined,
          image: row.benefits_image || undefined,
          content: row.benefits_content || undefined
        },
        standProjectText: {
          title: row.stand_project_title || undefined,
          highlight: row.stand_project_highlight || undefined,
          description: row.stand_project_description || undefined
        },
        exhibitionBenefits: {
          title: row.exhibition_benefits_title || undefined,
          subtitle: row.exhibition_benefits_subtitle || undefined,
          content: row.exhibition_benefits_content || undefined,
          image: row.exhibition_benefits_image || undefined
        },
        bespoke: {
          title: row.bespoke_title || undefined,
          subtitle: row.bespoke_subtitle || undefined,
          description: row.bespoke_description || undefined
        },
        freshDesign: {
          title: row.fresh_design_title || undefined,
          subtitle: row.fresh_design_subtitle || undefined,
          description: row.fresh_design_description || undefined
        },
        costSection: {
          title: row.cost_section_title || undefined,
          subtitle: row.cost_section_subtitle || undefined,
          description: row.cost_section_description || undefined
        },
        pointsTable: {
          title: row.points_table_title || undefined,
          content: row.points_table_content || undefined
        },
        slug: row.slug || 'custom-stands',
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }

      return { data: customStandsPage, error: null }
    } catch (error) {
      console.error('Error fetching custom stands page:', error)
      return { data: null, error: 'Failed to fetch custom stands page' }
    }
  }

  // Update custom stands page
  static async updateCustomStandsPage(id: string, data: Partial<CustomStandsPage>): Promise<{ data: CustomStandsPage | null; error: string | null }> {
    try {
      const updateData: Record<string, any> = {}

      // Meta section
      if (data.meta?.title !== undefined) {
        updateData.meta_title = data.meta.title
      }
      if (data.meta?.description !== undefined) {
        updateData.meta_description = data.meta.description
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

      // Benefits section
      if (data.benefits?.title !== undefined) {
        updateData.benefits_title = data.benefits.title
      }
      if (data.benefits?.image !== undefined) {
        updateData.benefits_image = data.benefits.image
      }
      if (data.benefits?.content !== undefined) {
        updateData.benefits_content = data.benefits.content
      }

      // Stand Project Text section
      if (data.standProjectText?.title !== undefined) {
        updateData.stand_project_title = data.standProjectText.title
      }
      if (data.standProjectText?.highlight !== undefined) {
        updateData.stand_project_highlight = data.standProjectText.highlight
      }
      if (data.standProjectText?.description !== undefined) {
        updateData.stand_project_description = data.standProjectText.description
      }

      // Exhibition Benefits section
      if (data.exhibitionBenefits?.title !== undefined) {
        updateData.exhibition_benefits_title = data.exhibitionBenefits.title
      }
      if (data.exhibitionBenefits?.subtitle !== undefined) {
        updateData.exhibition_benefits_subtitle = data.exhibitionBenefits.subtitle
      }
      if (data.exhibitionBenefits?.content !== undefined) {
        updateData.exhibition_benefits_content = data.exhibitionBenefits.content
      }
      if (data.exhibitionBenefits?.image !== undefined) {
        updateData.exhibition_benefits_image = data.exhibitionBenefits.image
      }

      // Bespoke section
      if (data.bespoke?.title !== undefined) {
        updateData.bespoke_title = data.bespoke.title
      }
      if (data.bespoke?.subtitle !== undefined) {
        updateData.bespoke_subtitle = data.bespoke.subtitle
      }
      if (data.bespoke?.description !== undefined) {
        updateData.bespoke_description = data.bespoke.description
      }

      // Fresh Design section
      if (data.freshDesign?.title !== undefined) {
        updateData.fresh_design_title = data.freshDesign.title
      }
      if (data.freshDesign?.subtitle !== undefined) {
        updateData.fresh_design_subtitle = data.freshDesign.subtitle
      }
      if (data.freshDesign?.description !== undefined) {
        updateData.fresh_design_description = data.freshDesign.description
      }

      // Cost Section
      if (data.costSection?.title !== undefined) {
        updateData.cost_section_title = data.costSection.title
      }
      if (data.costSection?.subtitle !== undefined) {
        updateData.cost_section_subtitle = data.costSection.subtitle
      }
      if (data.costSection?.description !== undefined) {
        updateData.cost_section_description = data.costSection.description
      }

      // Points Table section
      if (data.pointsTable?.title !== undefined) {
        updateData.points_table_title = data.pointsTable.title
      }
      if (data.pointsTable?.content !== undefined) {
        updateData.points_table_content = data.pointsTable.content
      }

      if (data.isActive !== undefined) {
        updateData.is_active = data.isActive
      }

      const { error } = await (supabase as any)
        .from('custom_stands_page')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        // If table doesn't exist, return error message
        if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
          return { data: null, error: 'Database table not found. Please run the migration first.' }
        }
        return { data: null, error: error.message }
      }

      // Return updated data
      return this.getCustomStandsPage()
    } catch (error) {
      console.error('Error updating custom stands page:', error)
      return { data: null, error: 'Failed to update custom stands page' }
    }
  }

  // Upload image to Supabase storage
  static async uploadImage(file: File, folder: string = 'custom-stands'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('custom-stands-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        // If bucket doesn't exist, return helpful error message
        if (error.message.includes('bucket') || error.message.includes('not found')) {
          return { data: null, error: 'Storage bucket not found. Please run the migration first.' }
        }
        return { data: null, error: error.message }
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('custom-stands-images')
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
      const urlParts = url.split('/storage/v1/object/public/custom-stands-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('custom-stands-images')
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
    return basicRevalidate('/custom-stands');
  }
}