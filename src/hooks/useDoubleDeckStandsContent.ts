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

  const updateContent = async (updatedContent: DoubleDeckStandsPage) => {
    if (!content?.id) {
      setError('No content ID available for update')
      return { success: false, error: 'No content ID available for update' }
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
        return { success: false, error: updateError }
      }
      
      if (data) {
        setContent(data)
      }
      
      return { success: true, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update content'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (file: File, path: string = 'double-decker-stands') => {
    try {
      const { data, error: uploadError } = await DoubleDeckStandsPageService.uploadImage(file, path)
      
      if (uploadError) {
        setError(uploadError)
        return { success: false, error: uploadError, url: null }
      }
      
      return { success: true, error: null, url: data }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image'
      setError(errorMessage)
      return { success: false, error: errorMessage, url: null }
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
    refetch: fetchContent
  }
}