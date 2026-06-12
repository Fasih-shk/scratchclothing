// Test script for IP Geolocation & Weather Theme Selection
// Run: node scratch/test-weather-theme.js <ip>

const testIPs = {
  reykjavik: '82.221.128.0', // Iceland (Cold -> Winter)
  dubai: '94.200.0.0',       // UAE (Warm -> Summer)
  london: '8.8.8.8',          // US DNS/London lookup (Moderate -> Dark/Original)
  local: '127.0.0.1'          // Localhost (Should mock/fallback)
};

async function resolveThemeFromIP(ip) {
  console.log(`\n🔍 Processing IP: ${ip}`);

  // 1. Detect if IP is local/private loopback
  const isLocal = ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.');
  
  let lat = 51.5074; // London default
  let lon = -0.1278;
  let city = 'London (Fallback)';
  let country = 'United Kingdom';

  if (!isLocal) {
    try {
      console.log(`🌐 Fetching geolocation from ipapi.co for IP: ${ip}...`);
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
      if (!geoRes.ok) {
        throw new Error(`Geo API error: ${geoRes.status}`);
      }
      const geoData = await geoRes.json();
      
      if (geoData.latitude && geoData.longitude) {
        lat = geoData.latitude;
        lon = geoData.longitude;
        city = geoData.city || 'Unknown City';
        country = geoData.country_name || 'Unknown Country';
        console.log(`📍 Found Location: ${city}, ${country} (${lat}, ${lon})`);
      } else {
        console.warn('⚠️ Geolocation data returned invalid coords. Using fallback.');
      }
    } catch (err) {
      console.error('❌ Geolocation lookup failed:', err.message);
    }
  } else {
    console.log(`💻 Local IP detected. Simulating London, UK (${lat}, ${lon})`);
  }

  // 2. Fetch current weather from Open-Meteo
  let temp = 15; // default moderate
  let weatherSuccess = false;

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    console.log(`🌤️ Fetching weather from Open-Meteo...`);
    const weatherRes = await fetch(weatherUrl);
    
    if (weatherRes.ok) {
      const weatherData = await weatherRes.json();
      if (weatherData.current_weather) {
        temp = weatherData.current_weather.temperature;
        weatherSuccess = true;
        console.log(`🌡️ Temperature: ${temp}°C`);
      }
    }
  } catch (err) {
    console.error('❌ Weather fetch failed:', err.message);
  }

  // 3. Resolve theme
  let theme = 'dark'; // default fallback
  if (temp < 12) {
    theme = 'winter';
  } else if (temp > 22) {
    theme = 'summer';
  }

  console.log(`🎨 Resolved Theme: ${theme.toUpperCase()} (Based on temp: ${temp}°C)`);
  return { theme, temp, city, country };
}

async function run() {
  const argIP = process.argv[2];
  if (argIP) {
    await resolveThemeFromIP(argIP);
  } else {
    console.log('Running test sweep over predefined locations...');
    for (const [name, ip] of Object.entries(testIPs)) {
      console.log(`\n================== TEST: ${name.toUpperCase()} ==================`);
      await resolveThemeFromIP(ip);
    }
  }
}

run();
