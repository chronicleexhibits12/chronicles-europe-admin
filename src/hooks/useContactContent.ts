import { useState, useEffect } from 'react'
import { ContactPageService } from '@/data/contactService'
import type { ContactPage } from '@/data/contactTypes'

export const useContactPage = () => {
  const [data, setData] = useState<ContactPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await ContactPageService.getContactPage()
        if (result.data) {
          setData(result.data)
          setError(null)
        } else {
          setError(result.error || 'Failed to fetch contact page')
        }
      } catch (err) {
        setError('Failed to fetch contact page')
        console.error('Error fetching contact page:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const updateContactPage = async (id: string, updates: Partial<ContactPage>) => {
    try {
      const result = await ContactPageService.updateContactPage(id, updates)
      if (result.data) {
        setData(result.data)
        setError(null)
      }
      return result
    } catch (err) {
      setError('Failed to update contact page')
      console.error('Error updating contact page:', err)
      return { data: null, error: 'Failed to update contact page' }
    }
  }

  const uploadImage = async (file: File, folder?: string) => {
    try {
      const result = await ContactPageService.uploadImage(file, folder)
      return result
    } catch (err) {
      console.error('Error uploading image:', err)
      return { data: null, error: 'Failed to upload image' }
    }
  }

  return {
    data,
    loading,
    error,
    updateContactPage,
    uploadImage
  }
}