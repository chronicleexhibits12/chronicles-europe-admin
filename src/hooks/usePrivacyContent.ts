import { useState, useEffect } from 'react'
import { PrivacyPageService } from '@/data/privacyService'
import type { PrivacyPage } from '@/data/privacyTypes'
import type { ApiResponse } from '@/data/commonTypes'

export function usePrivacyPage() {
  const [state, setState] = useState<ApiResponse<PrivacyPage>>({
    data: null,
    error: null,
    loading: true
  })

  const fetchPrivacyPage = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    const result = await PrivacyPageService.getPrivacyPage()
    
    setState({
      data: result.data,
      error: result.error,
      loading: false
    })
  }

  const updatePrivacyPage = async (id: string, data: Partial<PrivacyPage>) => {
    setState(prev => ({ ...prev, loading: true }))
    
    const result = await PrivacyPageService.updatePrivacyPage(id, data)
    
    setState({
      data: result.data,
      error: result.error,
      loading: false
    })
    
    return result
  }

  useEffect(() => {
    fetchPrivacyPage()
  }, [])

  return {
    ...state,
    refetch: fetchPrivacyPage,
    updatePrivacyPage
  }
}