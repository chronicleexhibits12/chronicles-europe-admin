import { useState, useEffect } from 'react'
import { MainCountriesService } from '@/data/mainCountriesService'
import type { MainCountriesPage } from '@/data/mainCountriesTypes'

export const useMainCountriesContent = () => {
  const [data, setData] = useState<MainCountriesPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMainCountriesPage = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: mainCountriesPage, error: fetchError } = await MainCountriesService.getMainCountriesPage()
      
      if (fetchError) {
        setError(fetchError)
      } else {
        setData(mainCountriesPage)
      }
    } catch (err) {
      setError('Failed to fetch main countries page content')
      console.error('Error fetching main countries page:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateMainCountriesPage = async (id: string, updates: Partial<MainCountriesPage>) => {
    try {
      const { data: updatedData, error: updateError } = await MainCountriesService.updateMainCountriesPage(id, updates)
      
      if (updateError) {
        setError(updateError)
        return { data: null, error: updateError }
      } else {
        setData(updatedData)
        // Trigger revalidation after successful update
        const revalidationResult = await MainCountriesService.triggerRevalidation()
        if (revalidationResult.error) {
          console.warn('[MainCountries] Revalidation warning:', revalidationResult.error)
        }
        return { data: updatedData, error: null }
      }
    } catch (err) {
      const errorMessage = 'Failed to update main countries page'
      setError(errorMessage)
      console.error('Error updating main countries page:', err)
      return { data: null, error: errorMessage }
    }
  }

  const uploadImage = async (file: File) => {
    try {
      const { data: imageUrl, error: uploadError } = await MainCountriesService.uploadImage(file)
      
      if (uploadError) {
        setError(uploadError)
        return { data: null, error: uploadError }
      } else {
        return { data: imageUrl, error: null }
      }
    } catch (err) {
      const errorMessage = 'Failed to upload image'
      setError(errorMessage)
      console.error('Error uploading image:', err)
      return { data: null, error: errorMessage }
    }
  }

  const deleteImage = async (url: string) => {
    try {
      const { data: success, error: deleteError } = await MainCountriesService.deleteImage(url)
      
      if (deleteError) {
        setError(deleteError)
        return { data: false, error: deleteError }
      } else {
        return { data: success, error: null }
      }
    } catch (err) {
      const errorMessage = 'Failed to delete image'
      setError(errorMessage)
      console.error('Error deleting image:', err)
      return { data: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchMainCountriesPage()
  }, [])

  return {
    data,
    loading,
    error,
    fetchMainCountriesPage,
    updateMainCountriesPage,
    uploadImage,
    deleteImage
  }
}