// Common/Shared Types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: any
}

export interface UploadResult {
  data: string | null
  error: string | null
}

export interface DeleteResult {
  data: boolean
  error: string | null
}