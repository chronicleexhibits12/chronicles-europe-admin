import { useState, useEffect, useCallback } from 'react'
import { PrivacyPageService } from '@/data/privacyService'
import type { PrivacyPage } from '@/data/privacyTypes'
import type { ApiResponse } from '@/data/commonTypes'

export function usePrivacyPage() {
  const [state, setState] = useState<ApiResponse<PrivacyPage>>({
    data: null,
    error: null,
    loading: true
  })

  const fetchPrivacyPage = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    console.log('Fetching privacy page data...')
    const result = await PrivacyPageService.getPrivacyPage()
    console.log('Privacy page fetch result:', result)
    
    setState({
      data: result.data,
      error: result.error,
      loading: false
    })
  }, [])

  const updatePrivacyPage = useCallback(async (id: string, data: Partial<PrivacyPage>) => {
    // Don't set loading to true during update to avoid UI flicker
    
    console.log('Updating privacy page with data:', data)
    const result = await PrivacyPageService.updatePrivacyPage(id, data)
    console.log('Privacy page update result:', result)
    
    setState(prev => ({
      data: result.data || prev.data,
      error: result.error,
      loading: false
    }))
    
    return result
  }, [])

  useEffect(() => {
    fetchPrivacyPage()
  }, [fetchPrivacyPage])

  return {
    ...state,
    refetch: fetchPrivacyPage,
    updatePrivacyPage
  }
}