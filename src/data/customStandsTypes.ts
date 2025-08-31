// Custom Stands Page Types
export interface CustomStandsMeta {
  title?: string
  description?: string
}

export interface CustomStandsHero {
  title?: string
  subtitle?: string
  backgroundImage?: string
}

export interface CustomStandsBenefits {
  title?: string
  image?: string
  content?: string // Rich text content
}

export interface CustomStandsStandProjectText {
  title?: string
  highlight?: string
  description?: string
}

export interface CustomStandsExhibitionBenefits {
  title?: string
  subtitle?: string
  content?: string // Rich text content
  image?: string
}

export interface CustomStandsBespoke {
  title?: string
  subtitle?: string
  description?: string
}

export interface CustomStandsFreshDesign {
  title?: string
  subtitle?: string
  description?: string
}

export interface CustomStandsCostSection {
  title?: string
  subtitle?: string
  description?: string
}

export interface CustomStandsPointsTable {
  title?: string
  content?: string // Rich text content
}

export interface CustomStandsPage {
  id: string
  meta?: CustomStandsMeta
  hero?: CustomStandsHero
  benefits?: CustomStandsBenefits
  standProjectText?: CustomStandsStandProjectText
  exhibitionBenefits?: CustomStandsExhibitionBenefits
  bespoke?: CustomStandsBespoke
  freshDesign?: CustomStandsFreshDesign
  costSection?: CustomStandsCostSection
  pointsTable?: CustomStandsPointsTable
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Database interface matching SQL schema
export interface CustomStandsPageData {
  id: string
  slug: string
  meta_title: string | null
  meta_description: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_background_image: string | null
  benefits_title: string | null
  benefits_image: string | null
  benefits_content: string | null
  stand_project_title: string | null
  stand_project_highlight: string | null
  stand_project_description: string | null
  exhibition_benefits_title: string | null
  exhibition_benefits_subtitle: string | null
  exhibition_benefits_content: string | null
  exhibition_benefits_image: string | null
  bespoke_title: string | null
  bespoke_subtitle: string | null
  bespoke_description: string | null
  fresh_design_title: string | null
  fresh_design_subtitle: string | null
  fresh_design_description: string | null
  cost_section_title: string | null
  cost_section_subtitle: string | null
  cost_section_description: string | null
  points_table_title: string | null
  points_table_content: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}