// Home Page Types
export interface SolutionItem {
  title: string
  description: string
  image: string
}

export interface HeroSection {
  backgroundImage?: string
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
  htmlContent?: string
}

export interface ExhibitionUSA {
  title?: string
  htmlContent?: string
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

export interface HomePage {
  id: string
  hero: HeroSection
  mainSection: MainSection
  exhibitionEurope: ExhibitionEurope
  exhibitionUSA: ExhibitionUSA
  solutions: Solutions
  whyBest: WhyBest
  isActive: boolean
  createdAt: string
  updatedAt: string
}