import { useState, useEffect } from 'react'
import { TradeShowsService } from '@/data/tradeShowsService'
import type { TradeShow, TradeShowsPage } from '@/data/tradeShowsTypes'

export function useTradeShows(page?: number, pageSize?: number) {
  const [data, setData] = useState<TradeShow[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTradeShows = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let tradeShows, fetchError, totalCount;
      
      // If page and pageSize are provided, use pagination
      if (page !== undefined && pageSize !== undefined) {
        const result = await TradeShowsService.getTradeShowsWithPagination(page, pageSize)
        tradeShows = result.data
        fetchError = result.error
        totalCount = result.totalCount
      } else {
        // Otherwise, fetch all posts
        const result = await TradeShowsService.getTradeShows()
        tradeShows = result.data
        fetchError = result.error
        totalCount = tradeShows?.length || 0
      }
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(tradeShows || [])
      setTotalCount(totalCount)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trade shows')
      console.error('Error in useTradeShows:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTradeShows()
  }, [page, pageSize])

  return { data, totalCount, loading, error, refetch: fetchTradeShows }
}

export function useTradeShow(id: string) {
  const [data, setData] = useState<TradeShow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTradeShow = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: tradeShow, error: fetchError } = await TradeShowsService.getTradeShowById(id)
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(tradeShow)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trade show')
      console.error('Error in useTradeShow:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchTradeShow()
    }
  }, [id])

  return { data, loading, error, refetch: fetchTradeShow }
}

export function useTradeShowsPage() {
  const [data, setData] = useState<TradeShowsPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTradeShowsPage = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: page, error: fetchError } = await TradeShowsService.getTradeShowsPage()
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(page)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trade shows page')
      console.error('Error in useTradeShowsPage:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTradeShowsPage()
  }, [])

  return { data, loading, error, refetch: fetchTradeShowsPage }
}