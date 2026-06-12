import connectDB from '../src/lib/mongodb.js';
import User from '../src/models/User.js';
import { hashPassword } from '../src/lib/auth.js';

const ADMIN_EMAILS = ['fasihmunir12@gmail.com', 'info@munidrip.com'];
const DEFAULT_PASSWORD = 'AdminSecurePassword123!';

async function createAdmins() {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    for (const email of ADMIN_EMAILS) {
      console.log(`\n--------------------------------------------`);
      console.log(`Processing: ${email}`);
      
      let user = await User.findOne({ email });
      
      if (user) {
        console.log(`ℹ️  User already exists.`);
        console.log(`🔄 Updating user role to 'admin' and ensuring active/verified status...`);
        
        user.role = 'admin';
        user.isVerified = true;
        user.isActive = true;
        
        await user.save();
        console.log(`✅ User updated successfully! Role: ${user.role}, Active: ${user.isActive}, Verified: ${user.isVerified}`);
      } else {
        console.log(`ℹ️  User not found. Creating a new admin user...`);
        const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
        
        const firstName = email.startsWith('info') ? 'Info' : 'Fasih';
        const lastName = email.startsWith('info') ? 'MuniDrip' : 'Munir';
        
        user = await User.create({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone: '+447000000000',
          role: 'admin',
          isVerified: true,
          isActive: true,
          currency: 'GBP',
        });
        console.log(`✅ Admin user created successfully!`);
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Temporary Password: ${DEFAULT_PASSWORD}`);
        console.log(`⚠️  Please change your password after logging in.`);
      }
    }

    console.log(`\n--------------------------------------------`);
    console.log('🎉 Seeding/Updating of both admin accounts complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create/update admin users:', error);
    process.exit(1);
  }
}

createAdmins();
