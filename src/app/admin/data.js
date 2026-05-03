export const dashboardStats = [
  {
    label: 'Gross Sales',
    value: 'GBP 1,248,400',
    trend: '+12.6% vs last month',
    trendDirection: 'up',
  },
  {
    label: 'Net Sales',
    value: 'GBP 998,320',
    trend: '+8.4% vs last month',
    trendDirection: 'up',
  },
  {
    label: 'Open Orders',
    value: '248',
    trend: '-3.1% vs last week',
    trendDirection: 'down',
  },
  {
    label: 'Low Stock SKUs',
    value: '19',
    trend: '7 require reorder today',
    trendDirection: 'down',
  },
];

export const monthlySales = [
  { month: 'Jan', amount: 71 },
  { month: 'Feb', amount: 64 },
  { month: 'Mar', amount: 75 },
  { month: 'Apr', amount: 81 },
  { month: 'May', amount: 69 },
  { month: 'Jun', amount: 88 },
];

export const orderPipeline = [
  { label: 'Draft', count: 18, type: 'warning' },
  { label: 'To Deliver', count: 96, type: 'info' },
  { label: 'To Bill', count: 43, type: 'warning' },
  { label: 'Completed', count: 815, type: 'success' },
  { label: 'Cancelled', count: 14, type: 'danger' },
];

export const recentOrders = [
  { id: 'SO-2026-00481', customer: 'Faisal Ahmed', city: 'Lahore', total: 'GBP 240.00', status: 'To Deliver', payment: 'Paid' },
  { id: 'SO-2026-00480', customer: 'Sana Khalid', city: 'Karachi', total: 'GBP 120.00', status: 'Completed', payment: 'Paid' },
  { id: 'SO-2026-00479', customer: 'Ali Murtaza', city: 'Manchester', total: 'GBP 310.00', status: 'To Bill', payment: 'Unpaid' },
  { id: 'SO-2026-00478', customer: 'Ayesha Noor', city: 'Dubai', total: 'GBP 199.00', status: 'To Deliver', payment: 'Paid' },
  { id: 'SO-2026-00477', customer: 'Rizwan Shah', city: 'Birmingham', total: 'GBP 155.00', status: 'Draft', payment: 'Unpaid' },
];

export const lowStockItems = [
  { code: 'SCT-290', itemName: 'Tech Fleece Set - Charcoal', qty: 3, warehouse: 'Main Warehouse' },
  { code: 'SCT-257', itemName: 'Core Tracksuit - Olive', qty: 4, warehouse: 'Main Warehouse' },
  { code: 'SCR-008', itemName: 'Urban Overshirt - Black', qty: 2, warehouse: 'UK Dispatch' },
  { code: 'SCT-298', itemName: 'Signature Set - Sand', qty: 5, warehouse: 'Main Warehouse' },
];

export const products = [
  { code: 'SCT-290', itemName: 'Tech Fleece Set - Charcoal', category: 'Tracksuits', rate: 'GBP 155.00', stock: 21, status: 'Active' },
  { code: 'SCT-257', itemName: 'Core Tracksuit - Olive', category: 'Tracksuits', rate: 'GBP 145.00', stock: 14, status: 'Active' },
  { code: 'SCR-008', itemName: 'Urban Overshirt - Black', category: 'Tops', rate: 'GBP 85.00', stock: 2, status: 'Low Stock' },
  { code: 'SET-112', itemName: 'Monogram Twinset - Stone', category: 'Sets', rate: 'GBP 120.00', stock: 0, status: 'Out of Stock' },
  { code: 'BOT-044', itemName: 'Cargo Jogger - Midnight', category: 'Bottoms', rate: 'GBP 72.00', stock: 18, status: 'Active' },
];

export const orders = [
  { id: 'SO-2026-00481', date: '2026-04-29', customer: 'Faisal Ahmed', territory: 'Pakistan', grandTotal: 'GBP 240.00', orderStatus: 'To Deliver', paymentStatus: 'Paid' },
  { id: 'SO-2026-00480', date: '2026-04-29', customer: 'Sana Khalid', territory: 'Pakistan', grandTotal: 'GBP 120.00', orderStatus: 'Completed', paymentStatus: 'Paid' },
  { id: 'SO-2026-00479', date: '2026-04-28', customer: 'Ali Murtaza', territory: 'United Kingdom', grandTotal: 'GBP 310.00', orderStatus: 'To Bill', paymentStatus: 'Unpaid' },
  { id: 'SO-2026-00478', date: '2026-04-28', customer: 'Ayesha Noor', territory: 'UAE', grandTotal: 'GBP 199.00', orderStatus: 'To Deliver', paymentStatus: 'Paid' },
  { id: 'SO-2026-00477', date: '2026-04-27', customer: 'Rizwan Shah', territory: 'United Kingdom', grandTotal: 'GBP 155.00', orderStatus: 'Draft', paymentStatus: 'Unpaid' },
  { id: 'SO-2026-00476', date: '2026-04-27', customer: 'Hiba Tariq', territory: 'Pakistan', grandTotal: 'GBP 88.00', orderStatus: 'Cancelled', paymentStatus: 'Unpaid' },
];

export const customers = [
  { name: 'Faisal Ahmed', customerId: 'CUST-00089', segment: 'Retail', city: 'Lahore', lifetimeValue: 'GBP 1,980.00', status: 'Active' },
  { name: 'Sana Khalid', customerId: 'CUST-00077', segment: 'Retail', city: 'Karachi', lifetimeValue: 'GBP 1,265.00', status: 'Active' },
  { name: 'Ali Murtaza', customerId: 'CUST-00073', segment: 'Wholesale', city: 'Manchester', lifetimeValue: 'GBP 4,400.00', status: 'Priority' },
  { name: 'Ayesha Noor', customerId: 'CUST-00061', segment: 'Retail', city: 'Dubai', lifetimeValue: 'GBP 810.00', status: 'Active' },
  { name: 'Rizwan Shah', customerId: 'CUST-00058', segment: 'Retail', city: 'Birmingham', lifetimeValue: 'GBP 590.00', status: 'Watch' },
];

export const activityFeed = [
  { action: 'Sales Invoice created for SO-2026-00480', user: 'accounts@munidrip', time: '12 minutes ago' },
  { action: 'Stock entry posted for SCT-290', user: 'warehouse@munidrip', time: '36 minutes ago' },
  { action: 'Customer CUST-00089 updated phone number', user: 'support@munidrip', time: '1 hour ago' },
  { action: 'Payment Entry received against SO-2026-00481', user: 'accounts@munidrip', time: '2 hours ago' },
];
