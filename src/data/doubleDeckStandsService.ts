import { supabase } from '../lib/supabase'
import type { DoubleDeckStandsPage, DoubleDeckStandsPageData } from './doubleDeckStandsTypes'

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
      standProjectText: {
        title: 'SOME OF OUR',
        highlight: 'DOUBLE DECKER EXHIBITION STANDS',
        description: 'Check some of the designs aesthetically created and delivered in the best quality by our professional double decker exhibition stand builders. The below pictures demonstrate our specially tailored exhibition stands to meet the client\'s objectives and maximise the expo\'s success.'
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
      const response = await supabase
        .from('double_decker_stands_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (response.error) {
        // If table doesn't exist, return default data
        if (response.error.code === 'PGRST116' || response.error.message.includes('relation') || response.error.message.includes('does not exist')) {
          return { 
            data: this.getDefaultDoubleDeckStandsPage(), 
            error: null 
          }
        }
        return { data: null, error: response.error.message }
      }

      if (!response.data) {
        return { data: null, error: 'No data found' }
      }

      // Transform database format to frontend format
      const transformedData: DoubleDeckStandsPage = {
        id: response.data.id,
        slug: response.data.slug || 'double-decker-stands',
        isActive: response.data.is_active,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at,
        meta: {
          title: response.data.meta_title || '',
          description: response.data.meta_description || ''
        },
        hero: {
          title: response.data.hero_title || '',
          subtitle: response.data.hero_subtitle || '',
          backgroundImage: response.data.hero_background_image || ''
        },
        benefits: {
          title: response.data.benefits_title || '',
          image: response.data.benefits_image || '',
          content: response.data.benefits_content || ''
        },
        pointsTable: {
          title: response.data.points_table_title || '',
          content: response.data.points_table_content || ''
        },
        standProjectText: {
          title: response.data.stand_project_title || '',
          highlight: response.data.stand_project_highlight || '',
          description: response.data.stand_project_description || ''
        },
        exhibitionBenefits: {
          title: response.data.exhibition_benefits_title || '',
          subtitle: response.data.exhibition_benefits_subtitle || '',
          content: response.data.exhibition_benefits_content || '',
          image: response.data.exhibition_benefits_image || ''
        },
        boothPartner: {
          title: response.data.booth_partner_title || '',
          subtitle: response.data.booth_partner_subtitle || '',
          description: response.data.booth_partner_description || ''
        },
        boldStatement: {
          title: response.data.bold_statement_title || '',
          subtitle: response.data.bold_statement_subtitle || '',
          description: response.data.bold_statement_description || ''
        }
      }

      return { data: transformedData, error: null }
    } catch (error) {
      console.error('Error in getDoubleDeckStandsPage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Update double decker stands page data
  static async updateDoubleDeckStandsPage(id: string, content: DoubleDeckStandsPage): Promise<{ data: DoubleDeckStandsPage | null; error: string | null }> {
    try {
      // Transform frontend format to database format
      const updateData: Partial<DoubleDeckStandsPageData> = {}

      if (content.meta) {
        updateData.meta_title = content.meta.title
        updateData.meta_description = content.meta.description
      }

      if (content.hero) {
        updateData.hero_title = content.hero.title
        updateData.hero_subtitle = content.hero.subtitle
        updateData.hero_background_image = content.hero.backgroundImage
      }

      if (content.benefits) {
        updateData.benefits_title = content.benefits.title
        updateData.benefits_image = content.benefits.image
        updateData.benefits_content = content.benefits.content
      }

      if (content.pointsTable) {
        updateData.points_table_title = content.pointsTable.title
        updateData.points_table_content = content.pointsTable.content
      }

      if (content.standProjectText) {
        updateData.stand_project_title = content.standProjectText.title
        updateData.stand_project_highlight = content.standProjectText.highlight
        updateData.stand_project_description = content.standProjectText.description
      }

      if (content.exhibitionBenefits) {
        updateData.exhibition_benefits_title = content.exhibitionBenefits.title
        updateData.exhibition_benefits_subtitle = content.exhibitionBenefits.subtitle
        updateData.exhibition_benefits_content = content.exhibitionBenefits.content
        updateData.exhibition_benefits_image = content.exhibitionBenefits.image
      }

      if (content.boothPartner) {
        updateData.booth_partner_title = content.boothPartner.title
        updateData.booth_partner_subtitle = content.boothPartner.subtitle
        updateData.booth_partner_description = content.boothPartner.description
      }

      if (content.boldStatement) {
        updateData.bold_statement_title = content.boldStatement.title
        updateData.bold_statement_subtitle = content.boldStatement.subtitle
        updateData.bold_statement_description = content.boldStatement.description
      }

      const { error } = await (supabase as any)
        .from('double_decker_stands_page')
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
      return { data: content, error: null }
    } catch (error) {
      console.error('Error in updateDoubleDeckStandsPage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Upload image to storage
  static async uploadImage(file: File, path: string): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${path}/${fileName}`

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

      const { data: publicUrlData } = supabase.storage
        .from('double-decker-stands-images')
        .getPublicUrl(fileName)

      return { data: publicUrlData.publicUrl, error: null }
    } catch (error) {
      console.error('Error in uploadImage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Export for backward compatibility
export const doubleDeckStandsService = DoubleDeckStandsPageService