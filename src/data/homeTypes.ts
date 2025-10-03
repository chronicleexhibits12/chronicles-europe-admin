// Home Page Types
export interface HomeMeta {
  title?: string
  description?: string
  keywords?: string
}

export interface SolutionItem {
  title: string
  description: string
  image: string
  imageAlt?: string
}

export interface HeroSection {
  backgroundImage?: string
  backgroundImageAlt?: string
}

export interface MainSection {
  title?: string
  subtitle?: string
  htmlContent?: string
}

export interface ExhibitionEurope {
  title?: string
  subtitle?: string
  boothImage?: string
  boothImageAlt?: string
  htmlContent?: string
}

export interface ExhibitionUSA {
  title?: string
  htmlContent?: string
  ctaText?: string
}

export interface Solutions {
  title?: string
  htmlContent?: string
  items?: SolutionItem[]
}

export interface WhyBest {
  title?: string
  subtitle?: string
  htmlContent?: string
}

export interface PortfolioSection {
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

export interface TestimonialsSection {
  title?: string
}

export interface HomePage {
  id: string
  meta?: HomeMeta
  hero: HeroSection
  mainSection: MainSection
  exhibitionEurope: ExhibitionEurope
  exhibitionUSA: ExhibitionUSA
  solutions: Solutions
  whyBest: WhyBest
  portfolioSection?: PortfolioSection
  testimonialsSection?: TestimonialsSection
  isActive: boolean
  createdAt: string
  updatedAt: string
}