export interface PortfolioItem {
  image: string
  featured?: boolean // Make featured optional for backward compatibility
}

export interface PortfolioHero {
  title: string
  backgroundImage: string
  backgroundImageAlt?: string // Add alt text for hero background image
}

export interface PortfolioSection {
  title: string
  subtitle: string
}

export interface PortfolioSEO {
  title: string
  description: string
  keywords: string
}

export interface PortfolioPage {
  id: string
  hero: PortfolioHero
  portfolio: PortfolioSection
  items: PortfolioItem[]
  itemsAlt?: string[] // Add alt texts for portfolio items
  seo: PortfolioSEO
  isActive: boolean
  createdAt: string
  updatedAt: string
}