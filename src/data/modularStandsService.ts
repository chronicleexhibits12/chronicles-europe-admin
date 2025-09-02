import { supabase } from '../lib/supabase'
import type { ModularStandsPage, ModularStandsPageData } from './modularStandsTypes'

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
      standProjectText: {
        title: 'SOME OF OUR',
        highlight: 'MODULAR EXHIBITION STANDS',
        description: '<p>Our portfolio showcases innovative modular designs that have helped brands across various industries make a lasting impression at trade shows throughout Europe. Each project demonstrates our commitment to combining functionality with striking visual appeal. From compact 10 square meter booths to expansive island displays, our modular solutions are engineered to maximize impact while minimizing setup complexity. These examples illustrate how our flexible systems can be adapted to different products, target audiences, and venue requirements while maintaining consistent brand messaging.</p>'
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
      const response = await supabase
        .from('modular_stands_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (response.error) {
        // If table doesn't exist, return default data
        if (response.error.code === 'PGRST116' || response.error.message.includes('relation') || response.error.message.includes('does not exist')) {
          return { 
            data: this.getDefaultModularStandsPage(), 
            error: null 
          }
        }
        return { data: null, error: response.error.message }
      }

      if (!response.data) {
        return { data: null, error: 'No data found' }
      }

      // Transform database format to frontend format
      const transformedData: ModularStandsPage = {
        id: response.data.id,
        slug: response.data.slug || 'modular-stands',
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
        modularDiversity: {
          title: response.data.modular_diversity_title || '',
          subtitle: response.data.modular_diversity_subtitle || '',
          content: response.data.modular_diversity_content || ''
        },
        fastestConstruction: {
          title: response.data.fastest_construction_title || '',
          subtitle: response.data.fastest_construction_subtitle || '',
          description: response.data.fastest_construction_description || ''
        },
        experts: {
          title: response.data.experts_title || '',
          subtitle: response.data.experts_subtitle || '',
          description: response.data.experts_description || ''
        }
      }

      return { data: transformedData, error: null }
    } catch (error) {
      console.error('Error in getModularStandsPage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Update modular stands page data
  static async updateModularStandsPage(id: string, content: ModularStandsPage): Promise<{ data: ModularStandsPage | null; error: string | null }> {
    try {
      // Transform frontend format to database format
      const updateData: Partial<ModularStandsPageData> = {}

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

      if (content.modularDiversity) {
        updateData.modular_diversity_title = content.modularDiversity.title
        updateData.modular_diversity_subtitle = content.modularDiversity.subtitle
        updateData.modular_diversity_content = content.modularDiversity.content
      }

      if (content.fastestConstruction) {
        updateData.fastest_construction_title = content.fastestConstruction.title
        updateData.fastest_construction_subtitle = content.fastestConstruction.subtitle
        updateData.fastest_construction_description = content.fastestConstruction.description
      }

      if (content.experts) {
        updateData.experts_title = content.experts.title
        updateData.experts_subtitle = content.experts.subtitle
        updateData.experts_description = content.experts.description
      }

      const { error } = await (supabase as any)
        .from('modular_stands_page')
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
      console.error('Error in updateModularStandsPage:', error)
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

      const { data: publicUrlData } = supabase.storage
        .from('modular-stands-images')
        .getPublicUrl(fileName)

      return { data: publicUrlData.publicUrl, error: null }
    } catch (error) {
      console.error('Error in uploadImage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}

// Export for backward compatibility
export const modularStandsService = ModularStandsPageService