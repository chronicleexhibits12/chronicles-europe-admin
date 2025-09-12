import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { GlobalLocations } from '@/data/globalLocationsTypes'

export const useGlobalLocations = () => {
  const [data, setData] = useState<GlobalLocations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGlobalLocations = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data: globalLocations, error: fetchError } = await supabase
        .from('global_locations')
        .select('*')
        .limit(1)
        .single()
      
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setData(globalLocations as GlobalLocations)
      }
    } catch (err) {
      setError('Failed to fetch global locations')
      console.error('Error in useGlobalLocations:', err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchGlobalLocations()
  }

  useEffect(() => {
    // Fetch initial data
    fetchGlobalLocations()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('global_locations_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'global_locations',
        },
        (payload) => {
          // Update the data when changes occur
          setData(payload.new as GlobalLocations)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'global_locations',
        },
        (payload) => {
          // Update the data when a new row is inserted
          setData(payload.new as GlobalLocations)
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { data, loading, error, refetch }
}