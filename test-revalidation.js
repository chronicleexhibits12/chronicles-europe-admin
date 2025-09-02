// test-revalidation.js
// Simple script to test revalidation endpoint

async function testRevalidation() {
  try {
    console.log('Testing revalidation endpoint...');
    
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
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success:', data);
    } else {
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

// Run the test
testRevalidation();