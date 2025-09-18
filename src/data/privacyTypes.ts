// Privacy Page Types
export interface PrivacyMeta {
  title: string
  description: string
  keywords: string
}

export interface PrivacyPage {
  id: string
  title: string
  meta: PrivacyMeta
  content: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}