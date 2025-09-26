// Frontend types for Modular Stands page
export interface ModularStandsPortfolio {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

// Merged interface for Portfolio Section containing both stand project text and portfolio fields
export interface ModularStandsPortfolioSection {
  // Stand Project Text Fields
  standProjectTitle?: string
  highlight?: string
  description?: string
  // Portfolio Fields
  portfolioTitle?: string
  portfolioSubtitle?: string
  ctaText?: string
  ctaLink?: string
}

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
    // Add button title field
    buttonTitle?: string
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
  // Merged standProjectText and portfolio into portfolioSection
  portfolioSection?: ModularStandsPortfolioSection
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
  // Add hero button title field
  hero_button_title: string | null
  benefits_title: string
  benefits_image: string
  benefits_content: string
  points_table_title: string
  points_table_content: string
  // Merged stand project text and portfolio fields
  stand_project_title: string | null
  stand_project_highlight: string | null
  stand_project_description: string | null
  portfolio_section_title: string | null
  portfolio_section_subtitle: string | null
  portfolio_section_cta_text: string | null
  portfolio_section_cta_link: string | null
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