import { supabase } from '../lib/supabase'
import type { DoubleDeckStandsPage } from './doubleDeckStandsTypes'
import type { Database } from './databaseTypes'
import { basicRevalidate } from './simpleRevalidation'

export class DoubleDeckStandsPageService {
  // Default data when table doesn't exist
  static getDefaultDoubleDeckStandsPage(): DoubleDeckStandsPage {
    return {
      id: 'default',
      meta: {
        title: 'Double Decker Exhibition Stands Design & Build Services',
        description: 'Professional double decker exhibition stand design and build services. Create unique, eye-catching two-story displays that represent your brand perfectly at trade shows and exhibitions.'
      },
      hero: {
        title: 'DOUBLE DECKER EXHIBITION STANDS',
        subtitle: 'DESIGN & BUILD',
        backgroundImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop'
      },
      benefits: {
        title: 'BENEFITS OF THE DOUBLE-DECKER EXHIBITION STAND:',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=400&fit=crop',
        content: '<ul><li>Double-decker exhibits are easy to spot on the show floor, and it can drive traffic to the stall.</li><li>These booths allow users to expand the usable space upwards. It provides a lot of branding, interactivity, and product displays as exhibitors have separate spaces for meetings and social gatherings.</li><li>Double-decker booths offer maximum customer engagement in a private atmosphere.</li><li>Double-decker stands offer great flexibility to use some creative ideas with captivating graphics and add value to the business.</li></ul>'
      },
      pointsTable: {
        title: 'WHY CHOOSE DOUBLE-DECKER STANDS?',
        content: '<ul><li>Maximize your floor space without increasing costs.</li><li>Create private meeting areas on the upper deck.</li><li>Gain better visibility on the crowded show floor.</li><li>Showcase products with stunning two-level designs.</li></ul><p>At Chronicles, we design double-decker booths that not only expand the exhibiting space but also ensure your brand stands tall amidst the competition.</p><p>Our innovative booth designs help clients achieve maximum impact with functional, creative, and visually striking two-story exhibition stands.</p>'
      },
      portfolioSection: {
        standProjectTitle: 'SOME OF OUR',
        highlight: 'DOUBLE DECKER EXHIBITION STANDS',
        description: 'Check some of the designs aesthetically created and delivered in the best quality by our professional double decker exhibition stand builders. The below pictures demonstrate our specially tailored exhibition stands to meet the client\'s objectives and maximise the expo\'s success.',
        portfolioTitle: 'OUR PORTFOLIO',
        portfolioSubtitle: 'Explore our extensive portfolio of exhibition stands and discover the quality and creativity we bring to every project.',
        ctaText: 'View All Projects',
        ctaLink: '/portfolio'
      },
      exhibitionBenefits: {
        title: 'Why Choose Our Exhibition Stands?',
        subtitle: 'Discover the advantages that make our stands unique and effective.',
        content: '<ul><li><strong>Tailor-made designs</strong> to match your brand identity.</li><li><strong>High-quality materials</strong> ensuring durability and elegance.</li><li><em>Eco-friendly and sustainable</em> production methods.</li><li><strong>On-time delivery</strong> and hassle-free installation.</li><li><strong>Cost-effective solutions</strong> without compromising on quality.</li></ul>',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop'
      },
      boothPartner: {
        title: 'CHRONICLES',
        subtitle: 'YOUR IDEAL DOUBLE DECK BOOTH PARTNER',
        description: 'Double Decker Trade Show Booths can be difficult to design and build, but nothing is difficult for Chronicles. We are one of the most trusted double-decker exhibition stand builders in Europe. We have been in the double-decker exhibition stand designing industry for the last 20+ years.'
      },
      boldStatement: {
        title: 'MAKE A BOLD STATEMENT',
        subtitle: 'DOUBLE DECKER EXHIBITION STAND',
        description: 'The double-decker booths designed by Chronicles not only increase the exhibiting space but also make a solid impression amidst the competition.'
      },
      slug: 'double-decker-stands',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  // Get double decker stands page data
  static async getDoubleDeckStandsPage(): Promise<{ data: DoubleDeckStandsPage | null; error: string | null }> {
    try {
      const { data: response, error } = await supabase
        .from('double_decker_stands_page')
        .select('*')
        .eq('is_active', true)
        .single<Database['public']['Tables']['double_decker_stands_page']['Row']>()

      if (error) {
        // If table doesn't exist, return default data
        if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
          return { 
            data: this.getDefaultDoubleDeckStandsPage(), 
            error: null 
          }
        }
        return { data: null, error: error.message }
      }

      if (!response) {
        return { data: null, error: 'No data found' }
      }

      // Transform database format to frontend format
      const transformedData: DoubleDeckStandsPage = {
        id: response.id,
        slug: response.slug || 'double-decker-stands',
        isActive: response.is_active,
        createdAt: response.created_at,
        updatedAt: response.updated_at,
        meta: {
          title: response.meta_title || '',
          description: response.meta_description || ''
        },
        hero: {
          title: response.hero_title || '',
          subtitle: response.hero_subtitle || '',
          backgroundImage: response.hero_background_image || '',
          // Add button title field
          buttonTitle: response.hero_button_title || undefined
        },
        benefits: {
          title: response.benefits_title || '',
          image: response.benefits_image || '',
          content: response.benefits_content || ''
        },
        pointsTable: {
          title: response.points_table_title || '',
          content: response.points_table_content || ''
        },
        portfolioSection: {
          standProjectTitle: response.stand_project_title || '',
          highlight: response.stand_project_highlight || '',
          description: response.stand_project_description || '',
          portfolioTitle: response.portfolio_section_title || undefined,
          portfolioSubtitle: response.portfolio_section_subtitle || undefined,
          ctaText: response.portfolio_section_cta_text || undefined,
          ctaLink: response.portfolio_section_cta_link || undefined
        },
        exhibitionBenefits: {
          title: response.exhibition_benefits_title || '',
          subtitle: response.exhibition_benefits_subtitle || '',
          content: response.exhibition_benefits_content || '',
          image: response.exhibition_benefits_image || ''
        },
        boothPartner: {
          title: response.booth_partner_title || '',
          subtitle: response.booth_partner_subtitle || '',
          description: response.booth_partner_description || ''
        },
        boldStatement: {
          title: response.bold_statement_title || '',
          subtitle: response.bold_statement_subtitle || '',
          description: response.bold_statement_description || ''
        }
      }

      return { data: transformedData, error: null }
    } catch (error) {
      console.error('Error in getDoubleDeckStandsPage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Update double decker stands page data
  static async updateDoubleDeckStandsPage(id: string, data: Partial<DoubleDeckStandsPage>): Promise<{ data: DoubleDeckStandsPage | null; error: string | null }> {
    try {
      // Transform frontend format to database format
      const updateData: Partial<Database['public']['Tables']['double_decker_stands_page']['Update']> = {}

      if (data.meta?.title !== undefined) {
        updateData.meta_title = data.meta.title
      }
      if (data.meta?.description !== undefined) {
        updateData.meta_description = data.meta.description
      }

      if (data.hero?.title !== undefined) {
        updateData.hero_title = data.hero.title
      }
      if (data.hero?.subtitle !== undefined) {
        updateData.hero_subtitle = data.hero.subtitle
      }
      if (data.hero?.backgroundImage !== undefined) {
        updateData.hero_background_image = data.hero.backgroundImage
      }
      // Add hero button title
      if (data.hero?.buttonTitle !== undefined) {
        updateData.hero_button_title = data.hero.buttonTitle
      }

      if (data.benefits?.title !== undefined) {
        updateData.benefits_title = data.benefits.title
      }
      if (data.benefits?.image !== undefined) {
        updateData.benefits_image = data.benefits.image
      }
      if (data.benefits?.content !== undefined) {
        updateData.benefits_content = data.benefits.content
      }

      if (data.pointsTable?.title !== undefined) {
        updateData.points_table_title = data.pointsTable.title
      }
      if (data.pointsTable?.content !== undefined) {
        updateData.points_table_content = data.pointsTable.content
      }

      // Portfolio Section (merged standProjectText and portfolio)
      if (data.portfolioSection?.standProjectTitle !== undefined) {
        updateData.stand_project_title = data.portfolioSection.standProjectTitle
      }
      if (data.portfolioSection?.highlight !== undefined) {
        updateData.stand_project_highlight = data.portfolioSection.highlight
      }
      if (data.portfolioSection?.description !== undefined) {
        updateData.stand_project_description = data.portfolioSection.description
      }
      if (data.portfolioSection?.portfolioTitle !== undefined) {
        updateData.portfolio_section_title = data.portfolioSection.portfolioTitle
      }
      if (data.portfolioSection?.portfolioSubtitle !== undefined) {
        updateData.portfolio_section_subtitle = data.portfolioSection.portfolioSubtitle
      }
      if (data.portfolioSection?.ctaText !== undefined) {
        updateData.portfolio_section_cta_text = data.portfolioSection.ctaText
      }
      // Fixed ctaLink to /portfolio as requested
      updateData.portfolio_section_cta_link = '/portfolio'

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

      if (data.boothPartner?.title !== undefined) {
        updateData.booth_partner_title = data.boothPartner.title
      }
      if (data.boothPartner?.subtitle !== undefined) {
        updateData.booth_partner_subtitle = data.boothPartner.subtitle
      }
      if (data.boothPartner?.description !== undefined) {
        updateData.booth_partner_description = data.boothPartner.description
      }

      if (data.boldStatement?.title !== undefined) {
        updateData.bold_statement_title = data.boldStatement.title
      }
      if (data.boldStatement?.subtitle !== undefined) {
        updateData.bold_statement_subtitle = data.boldStatement.subtitle
      }
      if (data.boldStatement?.description !== undefined) {
        updateData.bold_statement_description = data.boldStatement.description
      }

      const { error: updateError } = await (supabase as any)
        .from('double_decker_stands_page')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        // If table doesn't exist, return error message
        if (updateError.code === 'PGRST116' || updateError.message.includes('relation') || updateError.message.includes('does not exist')) {
          return { data: null, error: 'Database table not found. Please run the migration first.' }
        }
        return { data: null, error: updateError.message }
      }

      // Return updated data by fetching the latest data
      return this.getDoubleDeckStandsPage()
    } catch (error) {
      console.error('Error in updateDoubleDeckStandsPage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Upload image to storage
  static async uploadImage(file: File, folder: string = 'double-decker-stands'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('double-decker-stands-images')
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
        .from('double-decker-stands-images')
        .getPublicUrl(data.path)

      return { data: publicUrlData.publicUrl, error: null }
    } catch (error) {
      console.error('Error in uploadImage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Delete image from storage
  static async deleteImage(url: string): Promise<{ data: boolean; error: string | null }> {
    try {
      // Extract file path from URL
      const urlParts = url.split('/storage/v1/object/public/double-decker-stands-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('double-decker-stands-images')
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
    return basicRevalidate('/double-decker-exhibition-stands');
  }
}

// Export for backward compatibility
export const doubleDeckStandsService = DoubleDeckStandsPageService