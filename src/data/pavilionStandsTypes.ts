// Frontend types for Pavilion Stands page
export interface PavilionStandsPortfolio {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

export interface PavilionStandsPage {
  id: string
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  meta: {
    title: string
    description: string
  }
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
    // Add background image alt text field
    backgroundImageAlt?: string
    // Add button title field
    buttonTitle?: string
  }
  whyChoose: {
    title: string
    content: string
  }
  benefits: {
    title: string
    image: string
    // Add image alt text field
    imageAlt?: string
    content: string
  }
  standProjectText: {
    title: string
    highlight: string
    description: string
  }
  advantages: {
    title: string
    image: string
    // Add image alt text field
    imageAlt?: string
    content: string
  }
  ourExpertise: {
    title: string
    content: string
  }
  companyInfo: {
    title: string
    content: string
  }
  // Add portfolio section
  portfolio?: PavilionStandsPortfolio
}

// Database types for Pavilion Stands page (matches database schema)
export interface PavilionStandsPageData {
  id: string
  slug: string
  is_active: boolean
  created_at: string
  updated_at: string
  meta_title: string
  meta_description: string
  hero_title: string
  hero_subtitle: string
  hero_background_image: string
  // Add hero background image alt text field
  hero_background_image_alt: string | null
  // Add hero button title field
  hero_button_title: string | null
  why_choose_title: string
  why_choose_content: string
  benefits_title: string
  benefits_image: string
  // Add benefits image alt text field
  benefits_image_alt: string | null
  benefits_content: string
  stand_project_title: string
  stand_project_highlight: string
  stand_project_description: string
  advantages_title: string
  advantages_image: string
  // Add advantages image alt text field
  advantages_image_alt: string | null
  advantages_content: string
  our_expertise_title: string
  our_expertise_content: string
  company_info_title: string
  company_info_content: string
  // Add portfolio fields
  portfolio_section_title: string | null
  portfolio_section_subtitle: string | null
  portfolio_section_cta_text: string | null
  portfolio_section_cta_link: string | null
}