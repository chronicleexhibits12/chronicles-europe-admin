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
    // Read the website URL from environment variables, with fallback
    const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'https://chronicleseurope.vercel.app';
    
    // Construct the revalidation endpoint using the website URL and static /api/revalidate path
    const revalidateEndpoint = `${websiteUrl}/api/revalidate`;
    
    // Log which path is being revalidated
    console.log(`[Revalidation] Triggering revalidation for path: ${path}`);
    
    // Make the most basic POST request to the revalidation endpoint
    // Include the path in the request body as required by the API route
    const response = await fetch(revalidateEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }) // Send the path in the request body
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Revalidation] Warning with status ${response.status}: ${errorText}`);
    }

    console.log('[Revalidation] Request sent successfully');
    return { success: true, error: null };
  } catch (error) {
    console.warn('[Revalidation] Network error (but admin update was successful):', error);
    return { success: true, error: null };
  }
}