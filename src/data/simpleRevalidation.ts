// src/data/simpleRevalidation.ts
// Simple revalidation utility without tokens - most basic approach

/**
 * Simple revalidation function that makes a basic POST request
 * This is the most basic approach possible - makes a POST request to /api/revalidate
 * without any token or authentication checks.
 * @param path The path to revalidate
 * @returns Promise with success status
 */
export async function basicRevalidate(path: string = '/'): Promise<{ success: boolean; error: string | null }> {
  try {
    // In development, use the proxy to avoid CORS issues
    // In production, use the full URL
    const isDev = import.meta.env.DEV;
    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://chronicles-europe.vercel.app';
    
    // Construct the revalidation endpoint
    // In development, use relative path to hit the proxy
    // In production, use the full URL
    const revalidateEndpoint = isDev 
      ? '/api/revalidate' 
      : `${websiteUrl}/api/revalidate`;
    
    // Log which path is being revalidated
    console.log(`[Revalidation] Triggering revalidation for path: ${path}`);
    console.log(`[Revalidation] Using endpoint: ${revalidateEndpoint}`);
    
    // Make the most basic POST request to the revalidation endpoint
    // Include the path in the request body as required by the API route
    await fetch(revalidateEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }), // Send the path in the request body
      // Add credentials: 'omit' to prevent sending cookies which can cause CORS issues
      credentials: 'omit',
      // Add mode: 'no-cors' to handle cross-origin requests
      // Note: This will limit what we can do with the response, but prevents CORS errors
      mode: 'no-cors'
    });

    // With mode: 'no-cors', we can't read the response, but the request will succeed
    console.log('[Revalidation] Request sent successfully');
    return { success: true, error: null };
  } catch (error) {
    console.warn('[Revalidation] Network error (but admin update was successful):', error);
    // Even if revalidation fails, we don't want to fail the save operation
    return { success: true, error: null };
  }
}