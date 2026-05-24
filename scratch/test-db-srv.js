import mongoose from 'mongoose';

// Trying SRV format
const MONGODB_URI = "mongodb+srv://fasihmunir12_db_user:fQko5SXarDHkCsSo@ac-gqpbixq.0f3nbjb.mongodb.net/scratchclothing?retryWrites=true&w=majority";

async function testConnection() {
  console.log('🔄 Attempting to connect to MongoDB (using SRV format)...');
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    const admin = mongoose.connection.db.admin();
    const info = await admin.listDatabases();
    console.log('📂 Available databases:');
    info.databases.forEach(db => console.log(`  - ${db.name}`));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

testConnection();
