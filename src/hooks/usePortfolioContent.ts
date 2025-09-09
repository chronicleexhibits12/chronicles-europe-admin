import { useState, useEffect } from 'react'
import { PortfolioService } from '@/data/portfolioService'
import type { PortfolioPage } from '@/data/portfolioTypes'

export const usePortfolioPage = () => {
  const [data, setData] = useState<PortfolioPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const { data, error } = await PortfolioService.getPortfolioPage()
        
        if (error) {
          setError(error)
        } else {
          setData(data)
        }
      } catch (err) {
        setError('Failed to fetch portfolio data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}