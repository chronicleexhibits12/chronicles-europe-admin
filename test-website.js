// test-website.js
// Simple script to test if website is accessible

async function testWebsite() {
  try {
    console.log('Testing website accessibility...');
    console.log('URL:', 'https://chronicleseurope.vercel.app');
    
    const response = await fetch('https://chronicleseurope.vercel.app');
    
    console.log(`Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    
    if (response.ok) {
      console.log('Website is accessible');
    } else {
      console.log('Website is not accessible');
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
}

// Run the test
testWebsite();