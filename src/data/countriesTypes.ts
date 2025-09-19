export interface ProcessStep {
  id: string
  icon: string
  title: string
  description: string
}

export interface Country {
  id: string
  created_at: string
  updated_at: string
  
  // Basic country information
  slug: string
  name: string
  
  // Active status for RLS
  is_active: boolean
  
  // SEO Metadata
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string | null
  
  // Hero Section
  hero_title: string | null
  hero_subtitle: string | null
  hero_background_image_url: string | null
  
  // Why Choose Us Section
  why_choose_us_title: string | null
  why_choose_us_subtitle: string | null
  why_choose_us_main_image_url: string | null
  why_choose_us_benefits_html: string | null
  
  // What We Do Section
  what_we_do_title: string | null
  what_we_do_subtitle: string | null
  what_we_do_description_html: string | null
  
  // Company Info Section
  company_info_title: string | null
  company_info_content_html: string | null
  
  // Best Company Section
  best_company_title: string | null
  best_company_subtitle: string | null
  best_company_content_html: string | null
  
  // Process Section
  process_section_title: string | null
  process_section_subtitle_html: string | null
  process_section_steps: ProcessStep[] | null
  
  // Cities Section
  cities_section_title: string | null
  cities_section_subtitle: string | null
  
  // Portfolio Section
  portfolio_section_title: string | null
  portfolio_section_subtitle: string | null
  portfolio_section_cta_text: string | null
  portfolio_section_cta_link: string | null
  
  // Selected Cities (JSONB array of city slugs)
  selected_cities: string[]
}