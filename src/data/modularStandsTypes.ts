// Frontend types for Modular Stands page
export interface ModularStandsPage {
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
  benefits: {
    title: string
    image: string
    content: string
  }
  pointsTable: {
    title: string
    content: string
  }
  standProjectText: {
    title: string
    highlight: string
    description: string
  }
  exhibitionBenefits: {
    title: string
    subtitle: string
    content: string
    image: string
  }
  modularDiversity: {
    title: string
    subtitle: string
    content: string
  }
  fastestConstruction: {
    title: string
    subtitle: string
    description: string
  }
  experts: {
    title: string
    subtitle: string
    description: string
  }
}

// Database types for Modular Stands page (matches database schema)
export interface ModularStandsPageData {
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
  benefits_title: string
  benefits_image: string
  benefits_content: string
  points_table_title: string
  points_table_content: string
  stand_project_title: string
  stand_project_highlight: string
  stand_project_description: string
  exhibition_benefits_title: string
  exhibition_benefits_subtitle: string
  exhibition_benefits_content: string
  exhibition_benefits_image: string
  modular_diversity_title: string
  modular_diversity_subtitle: string
  modular_diversity_content: string
  fastest_construction_title: string
  fastest_construction_subtitle: string
  fastest_construction_description: string
  experts_title: string
  experts_subtitle: string
  experts_description: string
}