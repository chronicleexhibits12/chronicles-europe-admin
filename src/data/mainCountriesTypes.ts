// Main Countries Page Types
export interface ExhibitionStandType {
  title: string
  description: string
  images: string[]
  ctaText: string
  ctaLink: string
}

export interface HeroSection {
  title?: string
  subtitle?: string
  description?: string
  backgroundImageUrl?: string
  backgroundImageAlt?: string
}

export interface PortfolioShowcase {
  title?: string
  description?: string
  ctaText?: string
  ctaLink?: string
}

export interface BuildSection {
  title?: string
  highlight?: string
  description?: string
}

export interface MainCountriesPage {
  id: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  hero?: HeroSection
  exhibitionStandTypes?: ExhibitionStandType[]
  portfolioShowcase?: PortfolioShowcase
  buildSection?: BuildSection
  isActive: boolean
  createdAt: string
  updatedAt: string
}