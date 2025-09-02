import { useState, useEffect } from 'react'
import { DoubleDeckStandsPageService } from '../data/doubleDeckStandsService'
import type { DoubleDeckStandsPage } from '../data/doubleDeckStandsTypes'

export function useDoubleDeckStandsContent() {
  const [content, setContent] = useState<DoubleDeckStandsPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await DoubleDeckStandsPageService.getDoubleDeckStandsPage()
      
      if (fetchError) {
        setError(fetchError)
        return
      }
      
      setContent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (updatedContent: Partial<DoubleDeckStandsPage>) => {
    if (!content?.id) {
      setError('No content ID available for update')
      return { data: null, error: 'No content ID available for update' }
    }

    try {
      setSaving(true)
      setError(null)
      
      const { data, error: updateError } = await DoubleDeckStandsPageService.updateDoubleDeckStandsPage(
        content.id, 
        updatedContent
      )
      
      if (updateError) {
        setError(updateError)
        return { data: null, error: updateError }
      }
      
      if (data) {
        setContent(data)
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update content'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (file: File, path: string = 'double-decker-stands') => {
    try {
      const { data, error: uploadError } = await DoubleDeckStandsPageService.uploadImage(file, path)
      
      if (uploadError) {
        setError(uploadError)
        return { data: null, error: uploadError }
      }
      
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  const deleteImage = async (url: string) => {
    try {
      const { error: deleteError } = await DoubleDeckStandsPageService.deleteImage(url)
      
      if (deleteError) {
        setError(deleteError)
        return { data: false, error: deleteError }
      }
      
      return { data: true, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete image'
      setError(errorMessage)
      return { data: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  return {
    content,
    loading,
    error,
    saving,
    updateContent,
    uploadImage,
    deleteImage,
    refetch: fetchContent
  }
}