// About Page Types
export interface AboutMeta {
  title?: string
  description?: string
  keywords?: string
}

export interface AboutHero {
  title?: string
  backgroundImage?: string
}

export interface AboutCompanyInfo {
  yearsInBusiness?: string
  yearsLabel?: string
  whoWeAreTitle?: string
  description?: string
  quotes?: string[]
}

export interface AboutFactsSection {
  title?: string
  description?: string
}

export interface AboutCompanyStat {
  id: string
  value: number
  label: string
  description: string
  icon: string
  order: number
}

export interface AboutTeamInfo {
  title?: string
  description?: string
  teamImage?: string
}

export interface AboutService {
  id: string
  title: string
  description: string
  image: string
  isReversed: boolean
  order: number
}

export interface AboutPage {
  id: string
  meta?: AboutMeta
  hero?: AboutHero
  companyInfo?: AboutCompanyInfo
  factsSection?: AboutFactsSection
  companyStats?: AboutCompanyStat[]
  teamInfo?: AboutTeamInfo
  services?: AboutService[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}