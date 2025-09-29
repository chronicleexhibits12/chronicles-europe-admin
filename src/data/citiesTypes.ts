export interface City {
  id: string
  created_at: string
  updated_at: string
  
  // Basic city information
  country_slug: string
  city_slug: string
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
  hero_background_image_alt: string | null
  
  // Why Choose Us Section
  why_choose_us_title: string | null
  why_choose_us_subtitle: string | null
  why_choose_us_main_image_url: string | null
  why_choose_us_main_image_alt: string | null
  why_choose_us_benefits_html: string | null
  
  // What We Do Section
  what_we_do_title: string | null
  what_we_do_subtitle: string | null
  what_we_do_description_html: string | null
  
  // Portfolio Section
  portfolio_section_title: string | null
  portfolio_section_subtitle: string | null
  portfolio_section_cta_text: string | null
  portfolio_section_cta_link: string | null
  
  // Exhibiting Experience Section
  exhibiting_experience_title: string | null
  exhibiting_experience_subtitle: string | null
  exhibiting_experience_benefits_html: string | null
  exhibiting_experience_excellence_title: string | null
  exhibiting_experience_excellence_subtitle: string | null
  exhibiting_experience_excellence_points_html: string | null
}