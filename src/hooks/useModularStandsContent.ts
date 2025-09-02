import { useState, useEffect } from 'react'
import { ModularStandsPageService } from '../data/modularStandsService'
import type { ModularStandsPage } from '../data/modularStandsTypes'

export function useModularStandsContent() {
  const [content, setContent] = useState<ModularStandsPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await ModularStandsPageService.getModularStandsPage()
      if (fetchError) {
        setError(fetchError)
      } else {
        setContent(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (newContent: Partial<ModularStandsPage>) => {
    try {
      setError(null)
      if (!content?.id) {
        throw new Error('Content ID is required for update')
      }
      
      const { data, error: updateError } = await ModularStandsPageService.updateModularStandsPage(content.id, newContent)
      if (updateError) {
        setError(updateError)
        throw new Error(updateError)
      } else if (data) {
        setContent(data)
      }
      return { data, error: updateError }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content')
      throw err
    }
  }

  const uploadImage = async (file: File, folder: string = 'modular-stands') => {
    try {
      const { data, error: uploadError } = await ModularStandsPageService.uploadImage(file, folder)
      
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
      const { error: deleteError } = await ModularStandsPageService.deleteImage(url)
      
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
    updateContent,
    uploadImage,
    deleteImage,
    refetch: fetchContent
  }
}