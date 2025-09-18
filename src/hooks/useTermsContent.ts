import { useState, useEffect } from 'react'
import { TermsPageService } from '@/data/termsService'
import type { TermsPage } from '@/data/termsTypes'
import type { ApiResponse } from '@/data/commonTypes'

export function useTermsPage() {
  const [state, setState] = useState<ApiResponse<TermsPage>>({
    data: null,
    error: null,
    loading: true
  })

  const fetchTermsPage = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    const result = await TermsPageService.getTermsPage()
    
    setState({
      data: result.data,
      error: result.error,
      loading: false
    })
  }

  const updateTermsPage = async (id: string, data: Partial<TermsPage>) => {
    setState(prev => ({ ...prev, loading: true }))
    
    const result = await TermsPageService.updateTermsPage(id, data)
    
    setState({
      data: result.data,
      error: result.error,
      loading: false
    })
    
    return result
  }

  useEffect(() => {
    fetchTermsPage()
  }, [])

  return {
    ...state,
    refetch: fetchTermsPage,
    updateTermsPage
  }
}