export interface ServiceItem {
  id: string
  title: string
  descriptionHtml: string
}

export interface ServicesPage {
  id: string
  meta: {
    title?: string
    description?: string
    keywords?: string
  }
  hero: {
    title?: string
    subtitle?: string
    backgroundImage?: string
    backgroundImageAlt?: string
  }
  intro: {
    title?: string
    descriptionHtml?: string
  }
  services: ServiceItem[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}