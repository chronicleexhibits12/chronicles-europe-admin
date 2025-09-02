// test-revalidation-detailed.js
// Detailed script to test revalidation endpoint

async function testRevalidation() {
  try {
    console.log('Testing revalidation endpoint...');
    console.log('URL:', 'https://chronicleseurope.vercel.app/api/revalidate');
    
    const response = await fetch('https://chronicleseurope.vercel.app/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 2d1657abdcf7199f3e2e2f8bde88c5b959134cae1d5430321b837e597c7ecfa9'
      },
      body: JSON.stringify({
        path: '/' // Test revalidating the home page
      })
    });

    console.log(`Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    
    // Log response headers
    console.log('Response Headers:');
    for (const [key, value] of response.headers) {
      console.log(`  ${key}: ${value}`);
    }
    
    // Try to read response body
    const text = await response.text();
    console.log('Response Body:', text);
    
    if (response.ok) {
      try {
        const data = JSON.parse(text);
        console.log('Success:', data);
      } catch (e) {
        console.log('Success (non-JSON response):', text);
      }
    } else {
      console.log('Error response:', text);
    }
  } catch (error) {
    console.error('Network error:', error.message);
    console.error('Error stack:', error.stack);
  }
}

// Run the test
testRevalidation();