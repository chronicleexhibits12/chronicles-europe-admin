import { useState, useEffect } from 'react'
import { CitiesService } from '@/data/citiesService'
import type { City } from '@/data/citiesTypes'

export function useCities(page?: number, pageSize?: number) {
  const [data, setData] = useState<City[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCities = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let cities, fetchError, totalCount;
      
      // If page and pageSize are provided, use pagination
      if (page !== undefined && pageSize !== undefined) {
        const result = await CitiesService.getCitiesWithPagination(page, pageSize)
        cities = result.data
        fetchError = result.error
        totalCount = result.totalCount
      } else {
        // Otherwise, fetch all posts
        const result = await CitiesService.getCities()
        cities = result.data
        fetchError = result.error
        totalCount = cities?.length || 0
      }
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(cities || [])
      setTotalCount(totalCount)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cities')
      console.error('Error in useCities:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCities()
  }, [page, pageSize])

  return { data, totalCount, loading, error, refetch: fetchCities }
}

export function useCity(id: string) {
  const [data, setData] = useState<City | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCity = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: city, error: fetchError } = await CitiesService.getCityById(id)
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(city)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch city')
      console.error('Error in useCity:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchCity()
    }
  }, [id])

  return { data, loading, error, refetch: fetchCity }
}