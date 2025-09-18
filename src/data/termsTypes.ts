// Terms Page Types
export interface TermsMeta {
  title: string
  description: string
  keywords: string
}

export interface TermsPage {
  id: string
  title: string
  meta: TermsMeta
  content: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}