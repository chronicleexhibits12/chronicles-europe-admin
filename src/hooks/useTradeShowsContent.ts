import { useState, useEffect } from 'react'
import { TradeShowsService } from '@/data/tradeShowsService'
import type { TradeShow, TradeShowsPage } from '@/data/tradeShowsTypes'

export function useTradeShows() {
  const [data, setData] = useState<TradeShow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTradeShows = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: tradeShows, error: fetchError } = await TradeShowsService.getTradeShows()
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(tradeShows || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch trade shows')
      console.error('Error in useTradeShows:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTradeShows()
  }, [])

  return { data, loading, error, refetch: fetchTradeShows }
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