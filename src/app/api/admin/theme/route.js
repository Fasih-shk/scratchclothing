import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Setting from '@/models/Setting';
import { authenticateAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    let setting = await Setting.findOne({ key: 'theme_mode' });
    if (!setting) {
      setting = await Setting.create({ key: 'theme_mode', value: 'auto' });
    }

    return NextResponse.json({
      success: true,
      themeMode: setting.value,
    });
  } catch (error) {
    console.error('Admin theme GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authResult = await authenticateAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
    }

    const { themeMode } = await request.json();
    if (!['dark', 'winter', 'summer', 'auto'].includes(themeMode)) {
      return NextResponse.json({ success: false, error: 'Invalid theme mode' }, { status: 400 });
    }

    await connectDB();
    
    // Update or create the global setting
    await Setting.findOneAndUpdate(
      { key: 'theme_mode' },
      { value: themeMode },
      { upsert: true, new: true }
    );

    const response = NextResponse.json({
      success: true,
      message: `Theme mode updated to ${themeMode}`,
    });

    // Clear the theme-session cookie for the admin so they see the change instantly
    response.cookies.delete('theme-session');

    return response;
  } catch (error) {
    console.error('Admin theme POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
