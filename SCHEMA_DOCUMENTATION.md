# MongoDB Schema Documentation

## Overview

This document describes the MongoDB database schema for the MUNI DRIP e-commerce application. The database uses Mongoose for ODM (Object Data Modeling) with Next.js.

## Database Collections

### 1. **Users** (`User.js`)
Stores user account information and authentication data.

**Key Fields:**
- `email` - User's email address (unique, indexed)
- `password` - Hashed password
- `firstName`, `lastName` - User name
- `phone` - Contact number
- `addresses` - Array of Address IDs
- `isVerified` - Email verification status
- `role` - User type (customer, admin, vendor)
- `totalSpent` - Total spending amount
- `orderCount` - Number of orders placed

**Indexes:**
- email (unique)
- createdAt (for sorting by registration date)

---

### 2. **Addresses** (`Address.js`)
Stores customer shipping and billing addresses.

**Key Fields:**
- `userId` - Reference to User (required)
- `type` - Address type (shipping, billing, both)
- `firstName`, `lastName` - Recipient name
- `streetAddress`, `city`, `postalCode`, `country` - Address components
- `isDefault` - Default address flag

**Indexes:**
- userId (for quick address lookup)

---

### 3. **Products** (`Product.js`)
Main product catalog with pricing, inventory, and metadata.

**Key Fields:**
- `name` - Product name
- `slug` - URL-friendly identifier (unique)
- `description` - Detailed product description
- `category` - Reference to Category
- `price` - Selling price
- `originalPrice` - Original/list price
- `discount` - Discount percentage/amount
- `images` - Array of image URLs and metadata
- `variants` - Size, color, and other variant options
- `inventory` - Stock levels (total, available, reserved)
- `sku` - Stock keeping unit (unique)
- `status` - Product status (active, inactive, discontinued)
- `isFeatured` - Featured product flag
- `rating` - Average rating and count
- `collection` - Product collection (mens, womens, summer, etc.)

**Virtual Fields:**
- `discountedPrice` - Calculated price after discount

**Indexes:**
- Full-text search on name and description
- slug, category, collection, status+isFeatured, createdAt

---

### 4. **Categories** (`Category.js`)
Product categories with hierarchical support.

**Key Fields:**
- `name` - Category name
- `slug` - URL-friendly identifier
- `parentCategory` - Reference to parent category (for subcategories)
- `image`, `icon` - Category visuals
- `displayOrder` - Display sequence
- `isActive`, `isFeatured` - Status flags
- `productCount` - Number of products

**Indexes:**
- slug, parentCategory, displayOrder

---

### 5. **Cart** (`Cart.js`)
Shopping cart for each user with items and totals.

**Key Fields:**
- `userId` - Reference to User (unique)
- `items` - Array of cart items with:
  - `productId` - Product reference
  - `quantity` - Item quantity
  - `variant` - Size/color selections
  - `price` - Item price
  - `discount` - Item discount
- `subtotal`, `tax`, `shippingCost`, `total` - Price calculations
- `couponCode`, `couponDiscount` - Applied coupon
- `status` - Cart status (active, abandoned, converted)
- `abandonedAt` - When cart was abandoned

**Indexes:**
- userId (unique), status+updatedAt

---

### 6. **Orders** (`Order.js`)
Complete order information with items, payment, and shipping.

**Key Fields:**
- `orderNumber` - Unique order identifier (auto-generated)
- `userId` - Reference to User
- `items` - Array of ordered products
- `subtotal`, `tax`, `shippingCost`, `total` - Order totals
- `shippingAddress`, `billingAddress` - Delivery addresses
- `paymentMethod` - Payment type (credit_card, paypal, etc.)
- `paymentStatus` - Payment status (pending, completed, failed)
- `status` - Order status (pending, confirmed, processing, shipped, delivered)
- `trackingNumber`, `carrier` - Shipping tracking
- `statusHistory` - History of status changes
- `returnStatus` - Return information
- `email`, `phone` - Customer contact info

**Indexes:**
- orderNumber (unique), userId, status+createdAt, paymentStatus, email, createdAt

---

### 7. **Reviews** (`Review.js`)
Product reviews and ratings from customers.

**Key Fields:**
- `productId` - Reference to Product
- `userId` - Reference to User (reviewer)
- `orderId` - Reference to Order (verification)
- `title`, `comment` - Review content
- `rating` - Rating (1-5)
- `isVerifiedPurchase` - Purchase verification flag
- `status` - Moderation status (pending, approved, rejected)
- `helpful`, `unhelpful` - Helpful votes
- `adminResponse` - Seller response to review
- `images` - Review images

**Indexes:**
- productId+status, userId, rating, createdAt

---

### 8. **Inventory** (`Inventory.js`)
Stock tracking for products with warehouse information.

**Key Fields:**
- `productId` - Reference to Product (unique)
- `quantity` - Total stock quantity
- `reserved` - Reserved for orders
- `available` - Available for sale
- `reorderLevel` - Low stock threshold
- `isLowStock`, `isOutOfStock` - Status flags
- `variants` - Stock per variant
- `warehouse` - Warehouse location info
- `lastStockCheckDate` - Last inventory audit

**Virtual Fields:**
- `calculatedAvailable` - quantity - reserved

**Indexes:**
- productId, isLowStock, isOutOfStock

---

### 9. **InventoryHistory** (`InventoryHistory.js`)
Audit trail for inventory movements.

**Key Fields:**
- `productId` - Product reference
- `type` - Movement type (restock, sale, return, damage, etc.)
- `quantityBefore`, `quantityAfter`, `quantityChanged` - Stock changes
- `orderId`, `returnId` - Related order/return
- `reason` - Reason for change
- `performedBy` - User who made the change
- `variant` - Size/color if applicable

**Indexes:**
- productId+createdAt, type+createdAt, orderId

---

### 10. **Coupons** (`Coupon.js`)
Discount codes and promotional campaigns.

**Key Fields:**
- `code` - Coupon code (unique, uppercase)
- `discountType` - Percentage or fixed amount
- `discountValue` - Discount amount
- `minOrderAmount` - Minimum order requirement
- `maxUsagePerCoupon` - Total usage limit
- `maxUsagePerUser` - Per-user limit
- `startDate`, `endDate` - Validity period
- `applicableProducts`, `applicableCategories` - Restrictions
- `applicableCollections` - Collections (mens, womens, summer, etc.)
- `isActive` - Active status

**Indexes:**
- code, isActive+endDate, startDate+endDate

---

### 11. **Returns** (`Return.js`)
Product return and exchange management.

**Key Fields:**
- `returnNumber` - Unique return identifier (auto-generated)
- `orderId` - Original order reference
- `userId` - Customer reference
- `items` - Returned items with condition
- `reason` - Return reason
- `status` - Return status (requested, approved, received, refunded)
- `returnType` - Refund or exchange
- `exchangeProductId` - Product to exchange for
- `refundAmount`, `refundMethod` - Refund details
- `returnShippingLabel`, `returnTrackingNumber` - Return shipping
- `inspectionNotes`, `inspectionResult` - Inspection details

**Indexes:**
- returnNumber, orderId, userId, status+createdAt

---

## Database Relationships

```
User
├── 1:N → Address (shipping/billing addresses)
├── 1:1 → Cart (current shopping cart)
├── 1:N → Order (customer orders)
├── 1:N → Review (product reviews)
└── 1:N → Return (returned orders)

Product
├── N:1 → Category
├── 1:1 → Inventory
├── 1:N → InventoryHistory
├── 1:N → Review
└── Many:Many ← Order (through Order.items)

Category
└── Self-referential (parentCategory for hierarchy)

Order
├── 1:1 → User
├── 1:N → Product (through items)
├── 1:N → Return (customer returns)
└── 1:N → InventoryHistory (stock reservations)

Coupon
├── Many:Many → Product (applicableProducts)
└── Many:Many → Category (applicableCategories)
```

---

## Running Migrations

### Setup MongoDB Connection
Create a `.env.local` file:
```env
MONGODB_URI=mongodb://username:password@localhost:27017/scratchclothing
```

### Run Migration Script
```bash
node src/scripts/migrate.js
```

This will:
1. Create all collections
2. Create indexes
3. Seed sample data (categories, products, coupons)

---

## Performance Optimization

### Indexed Fields
- **Users**: email (fast login)
- **Products**: full-text search (name + description), category, status
- **Orders**: userId (customer orders), status (reporting), createdAt (recent orders)
- **Inventory**: productId (always unique), isLowStock (alerts)

### Query Patterns
```javascript
// Find featured products in a category
db.products.find({ 
  category: ObjectId("..."), 
  isFeatured: true, 
  status: "active" 
})

// Get customer orders
db.orders.find({ userId: ObjectId("...") }).sort({ createdAt: -1 })

// Find low stock items
db.inventory.find({ isLowStock: true })

// Get abandoned carts
db.carts.find({ 
  status: "abandoned", 
  updatedAt: { $lt: new Date(Date.now() - 24*60*60*1000) } 
})
```

---

## Data Validation

All models include:
- Required field validation
- Type checking
- Min/Max constraints
- Format validation (email, phone, URL)
- Enum restrictions
- Unique constraints

---

## Timestamps

All collections include:
- `createdAt` - Record creation timestamp
- `updatedAt` - Last modification timestamp

Automatically managed by Mongoose.

---

## Best Practices

1. **Use Refs for Related Data**: For frequently accessed relationships
2. **Denormalize Sparingly**: Cache frequently read data (e.g., product name in orders)
3. **Index Common Queries**: Especially for filtering and sorting
4. **Regular Backups**: MongoDB snapshots and daily backups
5. **Archive Old Data**: Move old orders/returns to archive collection

---

## Future Enhancements

- [ ] Wishlist collection
- [ ] Notification/Email log collection
- [ ] Analytics collection
- [ ] SEO metrics collection
- [ ] Payment transaction logging
- [ ] Customer support tickets
