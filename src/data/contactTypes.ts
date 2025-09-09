// Contact Page Types
export interface ContactFormField {
  name: string
  placeholder: string
  required: boolean
}

export interface ContactOffice {
  name: string
  address: string
  phone: string
  email: string
  website: string
}

export interface ContactSupportItem {
  icon: string
  title: string
  description: string
}

export interface ContactMeta {
  title: string
  description: string
  keywords: string
}

export interface ContactHero {
  title: string
}

export interface ContactInfo {
  title: string
  address: string
  fullAddress: string
  phone: string[]
  email: string
}

export interface ContactOtherOffices {
  title: string
  offices: ContactOffice[]
}

export interface ContactSupport {
  title: string
  description: string
  items: ContactSupportItem[]
}

export interface ContactMap {
  embedUrl: string
}

export interface ContactPage {
  id: string
  meta: ContactMeta
  hero: ContactHero
  contactInfo: ContactInfo
  formFields: ContactFormField[]
  otherOffices: ContactOtherOffices
  support: ContactSupport
  map: ContactMap
  isActive: boolean
  createdAt: string
  updatedAt: string
}