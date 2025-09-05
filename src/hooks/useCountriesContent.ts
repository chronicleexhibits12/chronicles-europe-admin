import { useState, useEffect } from 'react'
import { CountriesService } from '@/data/countriesService'
import type { Country } from '@/data/countriesTypes'

export function useCountries() {
  const [data, setData] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCountries = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: countries, error: fetchError } = await CountriesService.getCountries()
      
      if (fetchError) {
        throw new Error(fetchError)
      }
      
      setData(countries || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch countries')
      console.error('Error in useCountries:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  return { data, loading, error, refetch: fetchCountries }
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