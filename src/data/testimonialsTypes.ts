// Testimonials Page Types
export interface TestimonialMeta {
  title?: string
  description?: string
  keywords?: string
}

export interface TestimonialHero {
  title?: string
  backgroundImage?: string
}

export interface TestimonialIntro {
  title?: string
  subtitle?: string
  description?: string
}

export interface TestimonialItem {
  id: string
  clientName: string
  companyName: string
  companyLogoUrl: string
  rating: number
  testimonialText: string
  isFeatured: boolean
  displayOrder: number
  // Removed isActive since it's always true
}

export interface TestimonialsPage {
  id: string
  meta?: TestimonialMeta
  hero?: TestimonialHero
  intro?: TestimonialIntro
  testimonials?: TestimonialItem[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}