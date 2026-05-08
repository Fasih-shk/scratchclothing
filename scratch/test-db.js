import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;


if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env');
  process.exit(1);
}

async function testConnection() {
  console.log('🔄 Attempting to connect to MongoDB...');
  console.log(`URI: ${MONGODB_URI.split('@')[1] ? '***@' + MONGODB_URI.split('@')[1] : MONGODB_URI}`);
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Check if we can list collections
    const admin = mongoose.connection.db.admin();
    const info = await admin.listDatabases();
    console.log('📂 Available databases:');
    info.databases.forEach(db => console.log(`  - ${db.name}`));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    if (error.reason) console.error('Reason:', error.reason);
  }
}

testConnection();
