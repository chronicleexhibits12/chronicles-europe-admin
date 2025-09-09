import { supabase } from '@/lib/supabase'

// Define types directly in the service file to avoid import issues
interface FormSubmission {
  id: string
  formType: string
  submissionData: Record<string, any>
  documents: DocumentMetadata[] | null
  createdAt: string
  updatedAt: string
}

interface DocumentMetadata {
  url: string
  path: string
  file_name: string
  file_size: number
  file_type: string
  field_name: string
}

// Service for managing form submissions
export class FormSubmissionsService {
  // Get all form submissions
  static async getFormSubmissions(): Promise<{ data: FormSubmission[] | null; error: string | null }> {
    try {
      const { data, error } = await (supabase as any)
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      
      // Transform database rows to FormSubmission interface
      const formSubmissions: FormSubmission[] = (data || []).map((row: any) => ({
        id: row.id,
        formType: row.form_type,
        submissionData: row.submission_data,
        documents: row.documents,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
      
      return { data: formSubmissions, error: null }
    } catch (error: any) {
      console.error('Error fetching form submissions:', error)
      return { data: null, error: error.message || 'Failed to fetch form submissions' }
    }
  }

  // Get form submission by ID
  static async getFormSubmissionById(id: string): Promise<{ data: FormSubmission | null; error: string | null }> {
    try {
      const { data, error } = await (supabase as any)
        .from('form_submissions')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      
      if (!data) {
        return { data: null, error: 'Form submission not found' }
      }
      
      // Transform database row to FormSubmission interface
      const formSubmission: FormSubmission = {
        id: data.id,
        formType: data.form_type,
        submissionData: data.submission_data,
        documents: data.documents,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
      
      return { data: formSubmission, error: null }
    } catch (error: any) {
      console.error('Error fetching form submission:', error)
      return { data: null, error: error.message || 'Failed to fetch form submission' }
    }
  }

  // Delete form submission
  static async deleteFormSubmission(id: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await (supabase as any)
        .from('form_submissions')
        .delete()
        .eq('id', id)

      if (error) throw new Error(error.message)

      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error deleting form submission:', error)
      return { data: false, error: error.message || 'Failed to delete form submission' }
    }
  }

  // Delete document from storage
  static async deleteDocument(filePath: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await (supabase as any)
        .storage
        .from('form-uploads')
        .remove([filePath])

      if (error) throw new Error(error.message)

      return { data: true, error: null }
    } catch (error: any) {
      console.error('Error deleting document:', error)
      return { data: false, error: error.message || 'Failed to delete document' }
    }
  }

  // Get public URL for uploaded document
  static getDocumentUrl(filePath: string): string {
    const { data } = (supabase as any).storage
      .from('form-uploads')
      .getPublicUrl(filePath)
    
    return data.publicUrl
  }
}