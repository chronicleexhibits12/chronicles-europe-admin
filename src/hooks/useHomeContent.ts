import { useState, useEffect } from 'react'
import { HomePageService } from '@/data/homeService'
import type { HomePage } from '@/data/homeTypes'
import type { ApiResponse } from '@/data/commonTypes'

export function useHomePage() {
  const [state, setState] = useState<ApiResponse<HomePage>>({
    data: null,
    error: null,
    loading: true
  })

  const fetchHomePage = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    const result = await HomePageService.getHomePage()
    
    setState({
      data: result.data,
      error: result.error,
      loading: false
    })
  }

  const updateHomePage = async (id: string, data: Partial<HomePage>) => {
    setState(prev => ({ ...prev, loading: true }))
    
    const result = await HomePageService.updateHomePage(id, data)
    
    setState({
      data: result.data,
      error: result.error,
      loading: false
    })
    
    return result
  }

  const uploadImage = async (file: File, folder?: string) => {
    return await HomePageService.uploadImage(file, folder)
  }

  const deleteImage = async (url: string) => {
    return await HomePageService.deleteImage(url)
  }

  useEffect(() => {
    fetchHomePage()
  }, [])

  return {
    ...state,
    refetch: fetchHomePage,
    updateHomePage,
    uploadImage,
    deleteImage
  }
}