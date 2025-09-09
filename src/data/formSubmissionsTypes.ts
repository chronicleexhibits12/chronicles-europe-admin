export interface FormSubmission {
  id: string
  formType: string
  submissionData: Record<string, any>
  documents: DocumentMetadata[] | null
  createdAt: string
  updatedAt: string
}

export interface DocumentMetadata {
  name: string
  path: string
  size: number
  type: string
}