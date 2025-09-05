import { useState, useEffect } from 'react'
import { CitiesService } from '@/data/citiesService'
import type { City } from '@/data/citiesTypes'

export function useCities() {
  const [data, setData] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCities = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: cities, error: fetchError } = await CitiesService.getCities()
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(cities || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cities')
      console.error('Error in useCities:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCities()
  }, [])

  return { data, loading, error, refetch: fetchCities }
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