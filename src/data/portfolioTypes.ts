export interface PortfolioItem {
  image: string
  featured?: boolean // Make featured optional for backward compatibility
}

export interface PortfolioHero {
  title: string
  backgroundImage: string
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
  seo: PortfolioSEO
  isActive: boolean
  createdAt: string
  updatedAt: string
}