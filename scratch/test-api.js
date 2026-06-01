// Fetch test for local API
const url = 'http://localhost:3000/api/theme';

async function test() {
  try {
    console.log(`Sending GET request to ${url}...`);
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }
    const data = await res.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Test failed:', err.message);
  }
}

test();
