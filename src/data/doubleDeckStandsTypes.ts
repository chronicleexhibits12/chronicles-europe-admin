// Double Decker Stands Page Types
export interface DoubleDeckStandsMeta {
  title?: string
  description?: string
}

export interface DoubleDeckStandsHero {
  title?: string
  subtitle?: string
  backgroundImage?: string
  // Add button title field
  buttonTitle?: string
}

export interface DoubleDeckStandsBenefits {
  title?: string
  image?: string
  content?: string // Rich text content
}

export interface DoubleDeckStandsPointsTable {
  title?: string
  content?: string // Rich text content
}

export interface DoubleDeckStandsStandProjectText {
  title?: string
  highlight?: string
  description?: string
}

export interface DoubleDeckStandsExhibitionBenefits {
  title?: string
  subtitle?: string
  content?: string // Rich text content
  image?: string
}

export interface DoubleDeckStandsBoothPartner {
  title?: string
  subtitle?: string
  description?: string
}

export interface DoubleDeckStandsBoldStatement {
  title?: string
  subtitle?: string
  description?: string
}

// Add the new Portfolio interface
export interface DoubleDeckStandsPortfolio {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

export interface DoubleDeckStandsPage {
  id: string
  meta?: DoubleDeckStandsMeta
  hero?: DoubleDeckStandsHero
  benefits?: DoubleDeckStandsBenefits
  pointsTable?: DoubleDeckStandsPointsTable
  standProjectText?: DoubleDeckStandsStandProjectText
  exhibitionBenefits?: DoubleDeckStandsExhibitionBenefits
  boothPartner?: DoubleDeckStandsBoothPartner
  boldStatement?: DoubleDeckStandsBoldStatement
  // Add the portfolio section
  portfolio?: DoubleDeckStandsPortfolio
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Database interface matching SQL schema
export interface DoubleDeckStandsPageData {
  id: string
  slug: string
  meta_title: string | null
  meta_description: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_background_image: string | null
  // Add hero button title field
  hero_button_title: string | null
  benefits_title: string | null
  benefits_image: string | null
  benefits_content: string | null
  points_table_title: string | null
  points_table_content: string | null
  stand_project_title: string | null
  stand_project_highlight: string | null
  stand_project_description: string | null
  exhibition_benefits_title: string | null
  exhibition_benefits_subtitle: string | null
  exhibition_benefits_content: string | null
  exhibition_benefits_image: string | null
  booth_partner_title: string | null
  booth_partner_subtitle: string | null
  booth_partner_description: string | null
  bold_statement_title: string | null
  bold_statement_subtitle: string | null
  bold_statement_description: string | null
  // Add portfolio fields
  portfolio_section_title: string | null
  portfolio_section_subtitle: string | null
  portfolio_section_cta_text: string | null
  portfolio_section_cta_link: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}