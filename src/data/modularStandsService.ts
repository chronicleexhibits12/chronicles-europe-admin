import { supabase } from '../lib/supabase'
import type { ModularStandsPage } from './modularStandsTypes'
import type { Database } from './databaseTypes'
import { basicRevalidate } from './simpleRevalidation'

export class ModularStandsPageService {
  // Default data when table doesn't exist
  static getDefaultModularStandsPage(): ModularStandsPage {
    return {
      id: 'default',
      meta: {
        title: 'Modular Exhibition Stands Design & Build Services',
        description: 'Professional modular exhibition stand design and build services. Create flexible, cost-effective displays that can be reconfigured for multiple events and represent your brand perfectly at trade shows and exhibitions.'
      },
      hero: {
        title: 'MODULAR EXHIBITION STANDS',
        subtitle: 'DESIGN & BUILD',
        backgroundImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop'
      },
      benefits: {
        title: 'BENEFITS OF MODULAR EXHIBITION STANDS:',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=400&fit=crop',
        content: '<ul><li>Modular exhibition stands offer exceptional versatility with components that can be rearranged to create completely different layouts for each event.</li><li>These systems feature lightweight yet durable materials that make transportation and setup significantly easier than traditional custom builds.</li><li>Cost efficiency is a major advantage, as modular components can be reused across multiple events, dramatically reducing long-term exhibition expenses.</li><li>The quick assembly process means your team can focus on preparing marketing materials rather than spending hours on complex construction.</li><li>Storage is simplified with compact cases that protect components and make warehouse organization straightforward.</li></ul>'
      },
      pointsTable: {
        title: 'BENEFITS OF MODULAR EXHIBITION STANDS',
        content: '<ul><li>Rapid deployment systems that reduce setup time by up to 70% compared to traditional custom builds.</li><li>Reusable components that deliver significant cost savings over multiple events, with many clients seeing ROI within 2-3 exhibitions.</li><li>Flexible design options that can be easily modified to accommodate different products, messaging, or branding requirements.</li><li>Lightweight materials that simplify transportation and reduce shipping costs, particularly important for international exhibitions.</li><li>Durable construction that maintains professional appearance through years of repeated use across various environments.</li></ul><p>As pioneers in modular exhibition design since 2003, we\'ve refined our systems to offer the perfect balance of affordability, functionality, and visual impact. Our modular solutions incorporate the latest materials and technologies, ensuring your booth stands out while remaining easy to manage. Each system is designed with European logistics in mind, optimizing for the region\'s transportation networks and venue requirements.</p>'
      },
      portfolioSection: {
        standProjectTitle: 'SOME OF OUR',
        highlight: 'MODULAR EXHIBITION STANDS',
        description: '<p>Our portfolio showcases innovative modular designs that have helped brands across various industries make a lasting impression at trade shows throughout Europe. Each project demonstrates our commitment to combining functionality with striking visual appeal. From compact 10 square meter booths to expansive island displays, our modular solutions are engineered to maximize impact while minimizing setup complexity. These examples illustrate how our flexible systems can be adapted to different products, target audiences, and venue requirements while maintaining consistent brand messaging.</p>',
        portfolioTitle: 'OUR PORTFOLIO',
        portfolioSubtitle: 'Explore our extensive portfolio of exhibition stands and discover the quality and creativity we bring to every project.',
        ctaText: 'View All Projects',
        ctaLink: '/portfolio'
      },
      exhibitionBenefits: {
        title: 'BENEFITS OF MODULAR EXHIBITION STANDS:',
        subtitle: 'Discover why modular exhibition booths are the most practical and cost-effective solution for your brand in Europe.',
        content: '<ul><li>Economic efficiency through reusable components that eliminate the need for new builds at each event.</li><li>Time savings with streamlined setup processes that can be completed in hours rather than days.</li><li>Design flexibility allowing for easy updates to graphics and layout between exhibitions.</li><li>Storage convenience with compact packaging that requires minimal warehouse space.</li><li>Sustainability benefits through reduced waste and material consumption compared to traditional booth construction.</li></ul>',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop'
      },
      modularDiversity: {
        title: 'MODULAR',
        subtitle: 'DIVERSITY',
        content: '<ul><li>Our modular systems include various frame options from aluminum extrusions to hybrid constructions, accommodating different design aesthetics and structural requirements for diverse exhibition environments.</li><li>Multiple panel types are available including fabric graphics, direct print, and SEG (Silicone Edge Graphics) for maximum visual impact, allowing for complete brand customization.</li><li>Specialized components such as LED lighting systems, interactive displays, touchscreen technology integration, and modular flooring options enhance functionality and visitor engagement.</li><li>Accessories like literature racks, product display shelves, counter units, and branded signage elements can be easily added or repositioned to adapt to changing marketing needs.</li><li>Advanced connectivity solutions including integrated power distribution, data cabling, and wireless networking capabilities ensure modern booth requirements are met.</li></ul>'
      },
      fastestConstruction: {
        title: 'FASTEST CONSTRUCTION',
        subtitle: 'OF MODULAR BOOTHS IN EUROPE',
        description: '<p>Our modular exhibition systems can be assembled in a fraction of the time required for custom builds, with most standard booths ready in under 4 hours. This rapid deployment is particularly valuable for European trade shows where setup time is limited. Our experienced team can handle everything from initial design to final installation, storing your modular components between events to ensure they\'re always ready for your next exhibition. This approach saves you both time and money while ensuring consistent quality at every show.</p>'
      },
      experts: {
        title: 'EXPERTS IN',
        subtitle: 'MODULAR BOOTHS',
        description: '<p>With over two decades of experience in the European exhibition industry, our team specializes in creating modular booth solutions that align with your brand identity and marketing objectives. We serve clients across major European markets including Germany, France, UK, Italy, Spain, and the Nordics, providing comprehensive support from initial concept through to on-site execution. Our expertise includes customizing modular systems to meet specific industry requirements, integrating advanced technology solutions, and ensuring compliance with venue regulations. We provide end-to-end service including design, production, logistics, installation, and dismantling, allowing you to focus on your exhibition goals while we handle all the technical details. Our dedicated project managers and skilled installation teams ensure seamless execution at every venue, with multilingual support available for international exhibitions.</p>'
      },
      slug: 'modular-stands',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  // Get modular stands page data
  static async getModularStandsPage(): Promise<{ data: ModularStandsPage | null; error: string | null }> {
    try {
      const { data: response, error } = await supabase
        .from('modular_stands_page')
        .select('*')
        .eq('is_active', true)
        .single<Database['public']['Tables']['modular_stands_page']['Row']>()

      if (error) {
        // If table doesn't exist, return default data
        if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
          return { 
            data: this.getDefaultModularStandsPage(), 
            error: null 
          }
        }
        return { data: null, error: error.message }
      }

      if (!response) {
        return { data: null, error: 'No data found' }
      }

      // Transform database format to frontend format
      const transformedData: ModularStandsPage = {
        id: response.id,
        slug: response.slug || 'modular-stands',
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
        modularDiversity: {
          title: response.modular_diversity_title || '',
          subtitle: response.modular_diversity_subtitle || '',
          content: response.modular_diversity_content || ''
        },
        fastestConstruction: {
          title: response.fastest_construction_title || '',
          subtitle: response.fastest_construction_subtitle || '',
          description: response.fastest_construction_description || ''
        },
        experts: {
          title: response.experts_title || '',
          subtitle: response.experts_subtitle || '',
          description: response.experts_description || ''
        }
      }

      return { data: transformedData, error: null }
    } catch (error) {
      console.error('Error in getModularStandsPage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Update modular stands page data
  static async updateModularStandsPage(id: string, data: Partial<ModularStandsPage>): Promise<{ data: ModularStandsPage | null; error: string | null }> {
    try {
      // Transform frontend format to database format
      const updateData: Partial<Database['public']['Tables']['modular_stands_page']['Update']> = {}

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

      if (data.modularDiversity?.title !== undefined) {
        updateData.modular_diversity_title = data.modularDiversity.title
      }
      if (data.modularDiversity?.subtitle !== undefined) {
        updateData.modular_diversity_subtitle = data.modularDiversity.subtitle
      }
      if (data.modularDiversity?.content !== undefined) {
        updateData.modular_diversity_content = data.modularDiversity.content
      }

      if (data.fastestConstruction?.title !== undefined) {
        updateData.fastest_construction_title = data.fastestConstruction.title
      }
      if (data.fastestConstruction?.subtitle !== undefined) {
        updateData.fastest_construction_subtitle = data.fastestConstruction.subtitle
      }
      if (data.fastestConstruction?.description !== undefined) {
        updateData.fastest_construction_description = data.fastestConstruction.description
      }

      if (data.experts?.title !== undefined) {
        updateData.experts_title = data.experts.title
      }
      if (data.experts?.subtitle !== undefined) {
        updateData.experts_subtitle = data.experts.subtitle
      }
      if (data.experts?.description !== undefined) {
        updateData.experts_description = data.experts.description
      }

      const { error: updateError } = await (supabase as any)
        .from('modular_stands_page')
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
      return this.getModularStandsPage()
    } catch (error) {
      console.error('Error in updateModularStandsPage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Upload image to storage
  static async uploadImage(file: File, folder: string = 'modular-stands'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('modular-stands-images')
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
        .from('modular-stands-images')
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
      const urlParts = url.split('/storage/v1/object/public/modular-stands-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('modular-stands-images')
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
      const result = await basicRevalidate('/modular-booth-design-and-build');
      return result;
    } catch (error) {
      console.error('[ModularStandsPageService] Revalidation failed:', error);
      // Even if revalidation fails, we don't want to fail the save operation
      return { success: true, error: null };
    }
  }
}

// Export for backward compatibility
export const modularStandsService = ModularStandsPageService