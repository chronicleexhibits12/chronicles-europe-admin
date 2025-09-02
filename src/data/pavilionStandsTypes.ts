// Frontend types for Pavilion Stands page
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
  }
  whyChoose: {
    title: string
    content: string
  }
  benefits: {
    title: string
    image: string
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
  why_choose_title: string
  why_choose_content: string
  benefits_title: string
  benefits_image: string
  benefits_content: string
  stand_project_title: string
  stand_project_highlight: string
  stand_project_description: string
  advantages_title: string
  advantages_image: string
  advantages_content: string
  our_expertise_title: string
  our_expertise_content: string
  company_info_title: string
  company_info_content: string
}