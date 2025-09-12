export interface TradeShow {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  startDate: string | null
  endDate: string | null
  location: string | null
  country: string | null
  city: string | null
  category: string | null
  logo: string | null
  logoAlt: string | null
  organizer: string | null
  website: string | null
  venue: string | null
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TradeShowsPage {
  id: string
  meta: {
    title: string | null
    description: string | null
    keywords: string | null
  }
  hero: {
    id: string
    title: string | null
    subtitle: string | null
    backgroundImage: string | null
    backgroundImageAlt: string | null
  }
  description: string | null
  cities: string[] // Added cities array
  countries: string[] // Added countries array
  isActive: boolean
  createdAt: string
  updatedAt: string
}