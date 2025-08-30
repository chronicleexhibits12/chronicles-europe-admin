export function checkEnvironment() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const issues: string[] = []

  if (!supabaseUrl) {
    issues.push('VITE_SUPABASE_URL is not set in .env file')
  } else if (!supabaseUrl.startsWith('https://')) {
    issues.push('VITE_SUPABASE_URL should start with https://')
  }

  if (!supabaseAnonKey) {
    issues.push('VITE_SUPABASE_ANON_KEY is not set in .env file')
  } else if (supabaseAnonKey.length < 100) {
    issues.push('VITE_SUPABASE_ANON_KEY seems too short (should be a long JWT token)')
  }

  return {
    isValid: issues.length === 0,
    issues,
    config: {
      supabaseUrl: supabaseUrl || 'Not set',
      hasAnonKey: !!supabaseAnonKey
    }
  }
}