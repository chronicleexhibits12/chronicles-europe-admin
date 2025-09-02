import { supabase } from '../lib/supabase'
import type { PavilionStandsPage } from './pavilionStandsTypes'
import type { Database } from './databaseTypes'

type PavilionStandsPageRow = Database['public']['Tables']['pavilion_design_page']['Row']

export class PavilionStandsPageService {
  // Default data when table doesn't exist
  static getDefaultPavilionStandsPage(): PavilionStandsPage {
    return {
      id: 'default',
      meta: {
        title: 'Exhibition Pavilion Design & Build Services',
        description: 'Professional exhibition pavilion design and build services. Create unique, eye-catching pavilion displays that represent your brand perfectly at trade shows and exhibitions.'
      },
      hero: {
        title: 'EXHIBITION PAVILION DESIGN',
        subtitle: 'DESIGN & BUILD',
        backgroundImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop'
      },
      whyChoose: {
        title: 'WHY TO CHOOSE US?',
        content: '<p>We have our manufacturing units in Germany and Poland which are equipped with modern machinery and printing technologies. So, with us, you\'ll not have to worry about storage and on-time delivery part.</p><p>We have a team of expert, qualified, skilled, and experienced 3D designers, visualizers, and copywriters who design, build, and manufacture your expo pavilion on the basis of your marketing needs.</p><p>We also provide on-site supervision during the trade show. Even if you have an emergency, our team\'s problem-solving capability will help you resolve that issue.</p>'
      },
      benefits: {
        title: 'BENEFITS OF PAVILION EXHIBITION STANDS:',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop',
        content: '<ul><li>As pavilion booths bring together a group of different brands in one place so offer the best space for collaboration, engagement, and knowledge exchange.</li><li>Pavilion stands are cost-effective as small enterprises can gain exposure without bearing the cost of large stand-alone exhibitions.</li><li>Pavilion vendors offer greater visibility as multiple companies are sharing the same area which draws the attention of attendees.</li><li>Pavilion booth allows exhibitors to collectively use the shared spaces like meeting rooms, and storage space for storing their marketing materials.</li></ul>'
      },
      standProjectText: {
        title: 'SOME OF OUR',
        highlight: 'EXHIBITION PAVILION DESIGNS',
        description: '<p>Check some of the designs aesthetically created and delivered in the best quality by our professional exhibition pavilion designers. The below pictures demonstrate our specially tailored pavilion designs to meet the <strong>client\'s objectives</strong> and maximise the expo\'s success.</p>'
      },
      advantages: {
        title: 'ADVANTAGES OF CUSTOM EXHIBITION SOLUTIONS:',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
        content: '<ul><li>Custom-built pavilions provide unique brand identity and help companies stand out from competitors with distinctive design elements and innovative layouts.</li><li>Modular construction allows for easy reconfiguration and reuse across multiple events, maximizing return on investment and reducing long-term costs.</li><li>Advanced lighting systems and interactive technology integration create immersive experiences that engage visitors and generate quality leads.</li><li>Sustainable materials and eco-friendly construction methods align with corporate social responsibility goals while maintaining aesthetic appeal.</li></ul>'
      },
      ourExpertise: {
        title: 'OUR EXPERTISE & EXPERIENCE',
        content: '<p>With over two decades of experience in the exhibition industry, we have mastered the art of creating impactful pavilion designs that drive business results and enhance brand visibility.</p><p>Our team consists of certified architects, interior designers, and project managers who understand the nuances of different industries and can tailor solutions accordingly.</p><p>We utilize cutting-edge technology including 3D modeling, virtual reality previews, and advanced construction techniques to ensure precision in every project we undertake.</p><p>Our global presence spans across Europe, Asia, and the Middle East, allowing us to serve clients worldwide with consistent quality and local expertise.</p><p>We maintain strategic partnerships with leading material suppliers and logistics companies to ensure cost-effective solutions without compromising on quality standards.</p><p>Our post-installation support includes maintenance services, storage solutions, and modification capabilities to extend the lifecycle of your exhibition investments.</p>'
      },
      companyInfo: {
        title: 'RADON SP Z.O.O. AND ITS STAND-BUILDING SERVICES',
        content: '<ul><li>As a premier exhibition stand builder in Europe, we offer a range of services and solutions in all the major exhibiting countries across Europe, including the Netherlands, Germany, Spain, and others.</li><li>We always aim to understand the client\'s marketing goals and deliver a perfect exhibition position.</li><li>We use an integrated approach and methodology that ensures outstanding results every time we take up a project.</li><li>Since 2003, we have been providing project-only solutions with a deep understanding of client\'s marketing goals.</li><li>Our team consists of certified architects, interior designers, and project managers who understand the nuances of different industries.</li><li>We maintain strategic partnerships with leading material suppliers and logistics companies to ensure cost-effective solutions without compromising on quality standards.</li></ul>'
      },
      slug: 'pavilion-stands',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  // Get pavilion stands page data
  static async getPavilionStandsPage(): Promise<{ data: PavilionStandsPage | null; error: string | null }> {
    try {
      const response = await supabase
        .from('pavilion_design_page')
        .select('*')
        .eq('is_active', true)
        .single()

      if (response.error) {
        // If table doesn't exist, return default data
        if (response.error.code === 'PGRST116' || response.error.message.includes('relation') || response.error.message.includes('does not exist')) {
          return { 
            data: this.getDefaultPavilionStandsPage(), 
            error: null 
          }
        }
        return { data: null, error: response.error.message }
      }

      // Transform database row to PavilionStandsPage interface
      const row = response.data as PavilionStandsPageRow
      const pavilionStandsPage: PavilionStandsPage = {
        id: row.id,
        meta: {
          title: row.meta_title || '',
          description: row.meta_description || ''
        },
        hero: {
          title: row.hero_title || '',
          subtitle: row.hero_subtitle || '',
          backgroundImage: row.hero_background_image || ''
        },
        whyChoose: {
          title: row.why_choose_title || '',
          content: row.why_choose_content || ''
        },
        benefits: {
          title: row.benefits_title || '',
          image: row.benefits_image || '',
          content: row.benefits_content || ''
        },
        standProjectText: {
          title: row.stand_project_title || '',
          highlight: row.stand_project_highlight || '',
          description: row.stand_project_description || ''
        },
        advantages: {
          title: row.advantages_title || '',
          image: row.advantages_image || '',
          content: row.advantages_content || ''
        },
        ourExpertise: {
          title: row.our_expertise_title || '',
          content: row.our_expertise_content || ''
        },
        companyInfo: {
          title: row.company_info_title || '',
          content: row.company_info_content || ''
        },
        slug: row.slug || 'pavilion-stands',
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }

      return { data: pavilionStandsPage, error: null }
    } catch (error) {
      console.error('Error in getPavilionStandsPage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Update pavilion stands page data
  static async updatePavilionStandsPage(id: string, data: Partial<PavilionStandsPage>): Promise<{ data: PavilionStandsPage | null; error: string | null }> {
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

      // Why Choose section
      if (data.whyChoose?.title !== undefined) {
        updateData.why_choose_title = data.whyChoose.title
      }
      if (data.whyChoose?.content !== undefined) {
        updateData.why_choose_content = data.whyChoose.content
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

      // Advantages section
      if (data.advantages?.title !== undefined) {
        updateData.advantages_title = data.advantages.title
      }
      if (data.advantages?.image !== undefined) {
        updateData.advantages_image = data.advantages.image
      }
      if (data.advantages?.content !== undefined) {
        updateData.advantages_content = data.advantages.content
      }

      // Our Expertise section
      if (data.ourExpertise?.title !== undefined) {
        updateData.our_expertise_title = data.ourExpertise.title
      }
      if (data.ourExpertise?.content !== undefined) {
        updateData.our_expertise_content = data.ourExpertise.content
      }

      // Company Info section
      if (data.companyInfo?.title !== undefined) {
        updateData.company_info_title = data.companyInfo.title
      }
      if (data.companyInfo?.content !== undefined) {
        updateData.company_info_content = data.companyInfo.content
      }

      const { error } = await (supabase as any)
        .from('pavilion_design_page')
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

      // Return updated data by fetching the latest data
      return this.getPavilionStandsPage()
    } catch (error) {
      console.error('Error in updatePavilionStandsPage:', error)
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Upload image to storage
  static async uploadImage(file: File, folder: string = 'pavilion-stands'): Promise<{ data: string | null; error: string | null }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('pavilion-design-images')
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
        .from('pavilion-design-images')
        .getPublicUrl(data.path)

      return { data: publicUrlData.publicUrl, error: null }
    } catch (error) {
      console.error('Error in uploadImage:', error)
      return { data: null, error: 'Failed to upload image' }
    }
  }

  // Delete image from storage
  static async deleteImage(url: string): Promise<{ data: boolean; error: string | null }> {
    try {
      // Extract file path from URL
      const urlParts = url.split('/storage/v1/object/public/pavilion-design-images/')
      if (urlParts.length < 2) {
        return { data: false, error: 'Invalid image URL' }
      }

      const filePath = urlParts[1]

      const { error } = await supabase.storage
        .from('pavilion-design-images')
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

  // Trigger revalidation in Next.js website
  static async triggerRevalidation(): Promise<{ success: boolean; error: string | null }> {
    try {
      // Get the revalidation endpoint from environment variables
      const revalidateEndpoint = import.meta.env.VITE_NEXTJS_REVALIDATE_ENDPOINT;
      const revalidateToken = import.meta.env.VITE_NEXTJS_REVALIDATE_TOKEN;

      // If no endpoint is configured, skip revalidation
      if (!revalidateEndpoint) {
        console.log('No revalidation endpoint configured, skipping revalidation');
        return { success: true, error: null };
      }

      // Call the revalidation endpoint
      const response = await fetch(revalidateEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(revalidateToken && { 'Authorization': `Bearer ${revalidateToken}` })
        },
        body: JSON.stringify({
          path: '/pavilion-stands', // Path to revalidate
          // You can add more paths here if needed
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Revalidation failed with status ${response.status}: ${errorText}`);
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error triggering revalidation:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export for backward compatibility
export const pavilionStandsService = PavilionStandsPageService