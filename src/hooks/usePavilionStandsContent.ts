import { useState, useEffect } from 'react'
import { PavilionStandsPageService } from '../data/pavilionStandsService'
import type { PavilionStandsPage } from '../data/pavilionStandsTypes'

export function usePavilionStandsPage() {
    const [data, setData] = useState<PavilionStandsPage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPavilionStandsPage = async () => {
        try {
            setLoading(true)
            setError(null)
            const result = await PavilionStandsPageService.getPavilionStandsPage()

            if (result.error) {
                setError(result.error)
                setData(null)
            } else {
                setData(result.data)
                setError(null)
            }
        } catch (err) {
            setError('Failed to fetch pavilion stands page')
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    const updatePavilionStandsPage = async (id: string, updateData: Partial<PavilionStandsPage>) => {
        try {
            const result = await PavilionStandsPageService.updatePavilionStandsPage(id, updateData)

            if (result.data && !result.error) {
                setData(result.data)
            }

            return result
        } catch (err) {
            return { data: null, error: 'Failed to update pavilion stands page' }
        }
    }

    const uploadImage = async (file: File) => {
        try {
            const result = await PavilionStandsPageService.uploadImage(file)
            return result
        } catch (err) {
            return { data: null, error: 'Failed to upload image' }
        }
    }

    const deleteImage = async (url: string) => {
        try {
            const result = await PavilionStandsPageService.deleteImage(url)
            return result
        } catch (err) {
            return { data: false, error: 'Failed to delete image' }
        }
    }

    useEffect(() => {
        fetchPavilionStandsPage()
    }, [])

    return {
        data,
        loading,
        error,
        refetch: fetchPavilionStandsPage,
        updatePavilionStandsPage,
        uploadImage,
        deleteImage
    }
}

export function usePavilionStandsContent() {
  const [content, setContent] = useState<PavilionStandsPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await PavilionStandsPageService.getPavilionStandsPage()
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

  const updateContent = async (newContent: Partial<PavilionStandsPage>) => {
    try {
      setError(null)
      if (!content?.id) {
        throw new Error('Content ID is required for update')
      }
      
      const { data, error: updateError } = await PavilionStandsPageService.updatePavilionStandsPage(content.id, newContent)
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