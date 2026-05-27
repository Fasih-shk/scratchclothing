import { sendEmail } from '../src/lib/email.js';

console.log('Testing SMTP using src/lib/email.js:');
console.log(`Host: ${process.env.EMAIL_SERVER_HOST}`);
console.log(`Port: ${process.env.EMAIL_SERVER_PORT}`);
console.log(`User: ${process.env.EMAIL_USER}`);
console.log(`Password length: ${process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0}`);

async function runTest() {
  try {
    console.log('🔄 Sending test email via src/lib/email.js...');
    const result = await sendEmail({
      to: process.env.EMAIL_USER,
      subject: 'SMTP Test Email (via email.js)',
      text: 'If you receive this, SMTP is working and whitespace has been stripped correctly!',
      html: '<b>If you receive this, SMTP is working and whitespace has been stripped correctly!</b>',
    });
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('❌ Email sending failed:');
      console.error(result.error);
    }
  } catch (error) {
    console.error('❌ Unexpected Error:');
    console.error(error);
  }
}

runTest();
