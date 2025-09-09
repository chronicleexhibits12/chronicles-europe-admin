import { useState, useEffect } from 'react'
import { FormSubmissionsService } from '@/data/formSubmissionsService'

// Define types directly in the hook file to avoid import issues
interface FormSubmission {
  id: string
  formType: string
  submissionData: Record<string, any>
  documents: { 
    url: string; 
    path: string; 
    file_name: string; 
    file_size: number; 
    file_type: string;
    field_name: string;
  }[] | null
  createdAt: string
  updatedAt: string
}

export const useFormSubmissions = () => {
  const [data, setData] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFormSubmissions = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: formSubmissions, error: fetchError } = await FormSubmissionsService.getFormSubmissions()
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(formSubmissions || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch form submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFormSubmissions()
  }, [])

  return { data, loading, error, refetch: fetchFormSubmissions }
}

export const useFormSubmission = (id: string) => {
  const [data, setData] = useState<FormSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFormSubmission = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: formSubmission, error: fetchError } = await FormSubmissionsService.getFormSubmissionById(id)
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(formSubmission)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch form submission')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchFormSubmission()
    }
  }, [id])

  return { data, loading, error, refetch: fetchFormSubmission }
}