import { supabase } from '@/lib/supabase'

/**
 * Validates that a redirect URL exists in the blog_posts table
 * @param slug The slug to validate
 * @returns True if the slug exists in blog_posts, false otherwise
 */
export async function validateBlogPostSlug(slug: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Error validating blog post slug:', error)
      return false
    }
    
    return !!data
  } catch (error) {
    console.error('Error validating blog post slug:', error)
    return false
  }
}

/**
 * Validates that a redirect URL exists in the trade_shows table
 * @param slug The slug to validate
 * @returns True if the slug exists in trade_shows, false otherwise
 */
export async function validateTradeShowSlug(slug: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('trade_shows')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Error validating trade show slug:', error)
      return false
    }
    
    return !!data
  } catch (error) {
    console.error('Error validating trade show slug:', error)
    return false
  }
}

/**
 * Validates a redirect URL based on its format
 * @param redirectUrl The redirect URL to validate
 * @returns True if the URL is valid, false otherwise
 */
export function validateRedirectUrlFormat(redirectUrl: string): boolean {
  // Check if it's a valid URL format
  try {
    new URL(redirectUrl)
    return true
  } catch {
    // If it's not a full URL, check if it's a valid relative path
    return redirectUrl.startsWith('/') && redirectUrl.length > 1
  }
}

/**
 * Validates that a redirect URL exists in the specified table
 * @param redirectUrl The redirect URL to validate
 * @param table The table to check ('blog_posts' or 'trade_shows')
 * @returns True if the URL exists in the table, false otherwise
 */
export async function validateRedirectUrlExists(redirectUrl: string, table: 'blog_posts' | 'trade_shows'): Promise<boolean> {
  // If it's a full URL, we can't validate it against our tables
  try {
    new URL(redirectUrl)
    // For external URLs, we assume they're valid
    return true
  } catch {
    // It's a relative path, check if it's a valid slug
  }
  
  // For relative paths, extract the slug and validate it
  if (redirectUrl.startsWith('/blog/')) {
    const slug = redirectUrl.replace('/blog/', '')
    return validateBlogPostSlug(slug)
  } else if (redirectUrl.startsWith('/trade-shows/')) {
    const slug = redirectUrl.replace('/trade-shows/', '')
    return validateTradeShowSlug(slug)
  }
  
  // For other relative paths, we can't validate them
  return true
}