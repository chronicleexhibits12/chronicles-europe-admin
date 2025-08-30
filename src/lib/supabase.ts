import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/data/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to handle Supabase responses
export const handleSupabaseResponse = <T>(response: any) => {
  if (response.error) {
    console.error('Supabase error:', response.error)
    return { data: null, error: response.error.message }
  }
  return { data: response.data as T, error: null }
}