import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Setting from '@/models/Setting';

export const dynamic = 'force-dynamic';

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return '127.0.0.1';
}

export async function GET(request) {
  try {
    await connectDB();
    
    // 1. Fetch current global setting
    let setting = await Setting.findOne({ key: 'theme_mode' });
    if (!setting) {
      // Seed default if not exists
      setting = await Setting.create({ key: 'theme_mode', value: 'auto' });
    }
    
    const themeMode = setting.value;
    console.log(`[Theme API] Global Theme Mode Setting: ${themeMode}`);


    // 2. If it's not set to auto, return the static theme immediately
    if (themeMode !== 'auto') {
      return NextResponse.json({
        success: true,
        theme: themeMode,
        source: 'admin-override',
      });
    }

    // 3. Auto mode: check cookie cache first
    const cachedThemeCookie = request.cookies.get('theme-session');
    if (cachedThemeCookie) {
      try {
        const cached = JSON.parse(cachedThemeCookie.value);
        // Ensure cache is not older than 12 hours
        if (cached.theme && (Date.now() - cached.timestamp < 12 * 60 * 60 * 1000)) {
          return NextResponse.json({
            success: true,
            theme: cached.theme,
            source: 'session-cache',
            isAutoMode: true,
            city: cached.city,
            country: cached.country,
            temperature: cached.temperature,
          });
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }

    // 4. Resolve IP & Location
    const url = new URL(request.url);
    const latParam = url.searchParams.get('lat');
    const lonParam = url.searchParams.get('lon');
    let ip = url.searchParams.get('ip') || getClientIp(request);
    
    let lat = 51.5074; // London default
    let lon = -0.1278;
    let city = 'London (Fallback)';
    let country = 'United Kingdom';
    let locationResolved = false;

    if (latParam && lonParam) {
      lat = parseFloat(latParam);
      lon = parseFloat(lonParam);
      city = 'Client Device Location';
      country = 'User Location';
      locationResolved = true;
      console.log(`[Theme API] Using client-provided coordinates: ${lat}, ${lon}`);
    }

    if (!locationResolved) {
      let isLocal = ip === '127.0.0.1' || ip === '::1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.');
      
      if (isLocal) {
        try {
          // Fetch the server's public IP as a fallback for local development testing
          const publicIpRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2000) });
          if (publicIpRes.ok) {
            const publicIpData = await publicIpRes.json();
            if (publicIpData.ip) {
              ip = publicIpData.ip;
              isLocal = false; // Now we have a real IP
            }
          }
        } catch (e) {
          console.warn('Failed to resolve public IP for local dev fallback');
        }
      }
      
      if (!isLocal) {
        try {
          const geoRes = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(3000), // 3s timeout
          });
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.latitude && geoData.longitude) {
              lat = parseFloat(geoData.latitude);
              lon = parseFloat(geoData.longitude);
              city = geoData.city || 'Unknown City';
              country = geoData.country || 'Unknown Country';
              locationResolved = true;
            }
          }
        } catch (err) {
          console.error('Geo IP lookup error in API:', err.message);
        }
      }
    }

    // 5. Query weather (Open-Meteo)
    let temp = 15;
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
        {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        }
      );
      if (weatherRes.ok) {
        const weatherData = await weatherRes.json();
        if (weatherData.current_weather) {
          temp = weatherData.current_weather.temperature;
        }
      }
    } catch (err) {
      console.error('Weather service lookup error in API:', err.message);
    }

    // 6. Decide Theme
    let theme = 'dark';
    if (temp < 12) {
      theme = 'winter';
    } else if (temp > 22) {
      theme = 'summer';
    }

    // 7. Save to Cookie & Return
    const responseData = {
      success: true,
      theme,
      source: 'auto-resolved',
      isAutoMode: true,
      city,
      country,
      temperature: temp,
    };

    const response = NextResponse.json(responseData);
    
    response.cookies.set('theme-session', JSON.stringify({
      theme,
      city,
      country,
      temperature: temp,
      timestamp: Date.now(),
    }), {
      maxAge: 12 * 60 * 60, // 12 hours
      path: '/',
      httpOnly: false, // Accessible by frontend if needed
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Theme API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error', theme: 'dark' },
      { status: 500 }
    );
  }
}
