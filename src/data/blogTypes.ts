export interface BlogPage {
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
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  publishedDate: string | null
  featuredImage: string | null
  featuredImageAlt: string | null
  category: string | null
  author: string | null
  readTime: string | null
  tags: string[] | null
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  sortOrder: number
  isActive: boolean
  redirectUrl: string | null
  createdAt: string
  updatedAt: string
}