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

  const updateContent = async (newContent: ModularStandsPage) => {
    try {
      setError(null)
      if (!newContent.id) {
        throw new Error('Content ID is required for update')
      }
      
      const { data, error: updateError } = await ModularStandsPageService.updateModularStandsPage(newContent.id, newContent)
      if (updateError) {
        setError(updateError)
        throw new Error(updateError)
      } else if (data) {
        setContent(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content')
      throw err
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
    refetch: fetchContent
  }
}