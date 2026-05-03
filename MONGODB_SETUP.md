# MongoDB Setup Guide

## Installation Options

### Option 1: Local MongoDB Installation

#### Windows
1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer and follow prompts
3. MongoDB will be installed as a Windows Service
4. Verify installation:
   ```bash
   mongod --version
   ```

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option 2: Docker (Recommended for Development)

```bash
# Pull and run MongoDB image
docker pull mongo:latest
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Connect to MongoDB
mongosh mongodb://localhost:27017
```

### Option 3: MongoDB Atlas (Cloud - Recommended for Production)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get the connection string
5. Add to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/scratchclothing
   ```

---

## Environment Setup

### 1. Create `.env.local` file
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit with your MongoDB connection string
nano .env.local
```

### 2. Local MongoDB URI
```
MONGODB_URI=mongodb://localhost:27017/scratchclothing
```

### 3. MongoDB Atlas URI
```
MONGODB_URI=mongodb+srv://username:password@cluster-xxxxx.mongodb.net/scratchclothing?retryWrites=true&w=majority
```

---

## Running the Migrations

### Install Dependencies
```bash
npm install mongoose
```

### Run Migration Script
```bash
node src/scripts/migrate.js
```

**Output:**
```
🔄 Starting MongoDB migrations...
✅ Connected to MongoDB
📝 Creating collections and indexes...
✅ User indexes created
✅ Category indexes created
✅ Product indexes created
✅ Cart indexes created
✅ Order indexes created
✅ Review indexes created
✅ Inventory indexes created
✅ InventoryHistory indexes created
✅ Coupon indexes created
✅ Return indexes created
✅ Address indexes created
🌱 Seeding sample data...
✅ Seeded 4 categories
✅ Seeded 2 products
✅ Seeded 2 coupons
✅ Sample data seeded successfully
✅ All migrations completed successfully!
```

---

## Verify Installation

### Check Collections
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/scratchclothing

# Show all collections
show collections

# Check document count
db.users.countDocuments()
db.products.countDocuments()
db.categories.countDocuments()
```

### Check Indexes
```bash
# Show all indexes in a collection
db.products.getIndexes()
db.orders.getIndexes()
```

---

## Development Tools

### MongoDB Compass (GUI)
Visual database management tool.

**Download:** [mongodb.com/products/compass](https://www.mongodb.com/products/compass)

**Connection String:**
```
mongodb://localhost:27017
```

### Mongosh (CLI)
Command-line interface for MongoDB.

**Installation:**
```bash
npm install -g mongosh
```

**Usage:**
```bash
# Connect to local MongoDB
mongosh

# Connect to MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/scratchclothing"

# Run queries
db.products.find()
db.orders.aggregate([{$group: {_id: null, total: {$sum: "$total"}}}])
```

---

## Add Migration to package.json

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "migrate": "node src/scripts/migrate.js",
    "db:seed": "node src/scripts/migrate.js"
  }
}
```

Then run:
```bash
npm run migrate
```

---

## Testing Database Connection

Create a test file `src/lib/__tests__/mongodb.test.js`:

```javascript
import connectDB from '@/lib/mongodb';
import { Product, User, Order } from '@/models';

async function testConnection() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Test collections exist
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    console.log(`Users: ${userCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Orders: ${orderCount}`);

    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
  process.exit();
}

testConnection();
```

Run:
```bash
node src/lib/__tests__/mongodb.test.js
```

---

## Backup & Restore

### Backup with mongodump
```bash
# Local backup
mongodump --db scratchclothing --out ./backup

# Cloud backup
mongodump --uri "mongodb+srv://username:password@cluster.mongodb.net/scratchclothing" --out ./backup
```

### Restore with mongorestore
```bash
# Local restore
mongorestore --db scratchclothing ./backup/scratchclothing

# Cloud restore
mongorestore --uri "mongodb+srv://username:password@cluster.mongodb.net/scratchclothing" ./backup/scratchclothing
```

---

## Performance Tips

1. **Use Indexes**: Already defined in schemas
2. **Batch Operations**: For bulk inserts/updates
3. **Connection Pooling**: MongoDB driver handles this
4. **TTL Indexes**: For auto-deleting old documents
5. **Data Validation**: Enforced in Mongoose schemas

---

## Troubleshooting

### Connection Failed
- Check MongoDB service is running: `sudo systemctl status mongodb`
- Verify connection string in `.env.local`
- Check firewall rules (especially for cloud MongoDB)

### Indexes Not Created
- Run migration again: `npm run migrate`
- Check MongoDB logs for errors

### Slow Queries
- Check indexes: `db.collection.getIndexes()`
- Add missing indexes for frequently queried fields
- Use `explain()` to analyze query performance

### Out of Memory
- Limit query results with `.limit()`
- Use pagination for large result sets
- Monitor collection sizes

---

## Next Steps

1. ✅ Install MongoDB
2. ✅ Configure `.env.local`
3. ✅ Run migrations
4. ✅ Install Mongoose: `npm install mongoose`
5. Use models in API routes
6. Implement authentication
7. Connect frontend to API

See `SCHEMA_DOCUMENTATION.md` for detailed schema information.
