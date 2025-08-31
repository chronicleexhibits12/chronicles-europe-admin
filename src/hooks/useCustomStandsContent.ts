import { useState, useEffect } from 'react'
import { CustomStandsPageService } from '@/data/customStandsService'
import type { CustomStandsPage } from '@/data/customStandsTypes'

export function useCustomStandsPage() {
    const [data, setData] = useState<CustomStandsPage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCustomStandsPage = async () => {
        try {
            setLoading(true)
            setError(null)
            const result = await CustomStandsPageService.getCustomStandsPage()

            if (result.error) {
                setError(result.error)
                setData(null)
            } else {
                setData(result.data)
                setError(null)
            }
        } catch (err) {
            setError('Failed to fetch custom stands page')
            setData(null)
        } finally {
            setLoading(false)
        }
    }

    const updateCustomStandsPage = async (id: string, updateData: Partial<CustomStandsPage>) => {
        try {
            const result = await CustomStandsPageService.updateCustomStandsPage(id, updateData)

            if (result.data && !result.error) {
                setData(result.data)
            }

            return result
        } catch (err) {
            return { data: null, error: 'Failed to update custom stands page' }
        }
    }

    const uploadImage = async (file: File, folder?: string) => {
        try {
            const result = await CustomStandsPageService.uploadImage(file, folder)
            return result
        } catch (err) {
            return { data: null, error: 'Failed to upload image' }
        }
    }

    const deleteImage = async (url: string) => {
        try {
            const result = await CustomStandsPageService.deleteImage(url)
            return result
        } catch (err) {
            return { data: false, error: 'Failed to delete image' }
        }
    }

    useEffect(() => {
        fetchCustomStandsPage()
    }, [])

    return {
        data,
        loading,
        error,
        refetch: fetchCustomStandsPage,
        updateCustomStandsPage,
        uploadImage,
        deleteImage
    }
}

export function useCustomStandsContent() {
  const [content, setContent] = useState<CustomStandsPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, error: fetchError } = await CustomStandsPageService.getCustomStandsPage()
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

  const updateContent = async (newContent: CustomStandsPage) => {
    try {
      setError(null)
      if (!newContent.id) {
        throw new Error('Content ID is required for update')
      }
      
      const { data, error: updateError } = await CustomStandsPageService.updateCustomStandsPage(newContent.id, newContent)
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