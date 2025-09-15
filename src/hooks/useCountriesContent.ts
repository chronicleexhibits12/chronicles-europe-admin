import { useState, useEffect } from 'react'
import { CountriesService } from '@/data/countriesService'
import type { Country } from '@/data/countriesTypes'

export function useCountries(page?: number, pageSize?: number) {
  const [data, setData] = useState<Country[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCountries = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let countries, fetchError, totalCount;
      
      // If page and pageSize are provided, use pagination
      if (page !== undefined && pageSize !== undefined) {
        const result = await CountriesService.getCountriesWithPagination(page, pageSize)
        countries = result.data
        fetchError = result.error
        totalCount = result.totalCount
      } else {
        // Otherwise, fetch all posts
        const result = await CountriesService.getCountries()
        countries = result.data
        fetchError = result.error
        totalCount = countries?.length || 0
      }
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(countries || [])
      setTotalCount(totalCount)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch countries')
      console.error('Error in useCountries:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [page, pageSize])

  return { data, totalCount, loading, error, refetch: fetchCountries }
}

export function useCountry(id: string) {
  const [data, setData] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCountry = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: country, error: fetchError } = await CountriesService.getCountryById(id)
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(country)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch country')
      console.error('Error in useCountry:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchCountry()
    }
  }, [id])

  return { data, loading, error, refetch: fetchCountry }
}