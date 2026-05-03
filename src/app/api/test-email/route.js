import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { to, subject, message } = await request.json();

    const result = await sendEmail({
      to: to || 'talhahabib956@gmail.com',
      subject: subject || 'Test Email from MuniDrip',
      html: message || '<p>This is a test email from MuniDrip.</p>',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}