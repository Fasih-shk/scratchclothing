import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import ThemeSelector from '@/components/ThemeSelector';

function pillClass(status) {
  if (status === 'completed' || status === 'paid' || status === 'Completed' || status === 'Paid') return 'admin-pill admin-pill--success';
  if (status === 'To Deliver' || status === 'To Bill' || status === 'Draft' || status === 'pending' || status === 'processing' || status === 'shipped') return 'admin-pill admin-pill--warning';
  return 'admin-pill admin-pill--danger';
}

export default async function AdminDashboard() {
  await connectDB();

  // 1. Dashboard Stats
  const orders = await Order.find();
  const products = await Product.find();

  let grossSales = 0;
  let netSales = 0;
  let openOrdersCount = 0;

  orders.forEach((order) => {
    grossSales += order.total || 0;
    if (order.paymentStatus === 'completed' || order.paymentStatus === 'paid') {
      netSales += order.total || 0;
    }
    if (order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'returned') {
      openOrdersCount++;
    }
  });

  const lowStockThreshold = 10;
  const lowStockCount = products.filter(p => (p.inventory?.available || 0) < (p.lowStockThreshold || lowStockThreshold)).length;

  const dashboardStats = [
    {
      label: 'Gross Sales',
      value: `GBP ${grossSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: 'Calculated from total orders',
      trendDirection: 'up',
    },
    {
      label: 'Net Sales',
      value: `GBP ${netSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      trend: 'Completed payments',
      trendDirection: 'up',
    },
    {
      label: 'Open Orders',
      value: openOrdersCount.toString(),
      trend: 'Pending fulfillment',
      trendDirection: openOrdersCount > 0 ? 'up' : 'down',
    },
    {
      label: 'Low Stock SKUs',
      value: lowStockCount.toString(),
      trend: 'Require reorder',
      trendDirection: 'down',
    },
  ];

  // 2. Monthly Sales (Aggregate)
  const monthlySalesRaw = await Order.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        amount: { $sum: "$total" }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Find max amount to calculate percentages
  const maxMonthlySales = Math.max(...monthlySalesRaw.map(s => s.amount), 1); // fallback to 1 to avoid NaN

  // If no monthly sales, provide a default empty chart or 0s. 
  let monthlySales = monthlySalesRaw.map(item => ({
    month: monthNames[item._id - 1],
    amount: Math.round((item.amount / maxMonthlySales) * 100), // percentage for the bar
    realAmount: item.amount
  }));

  // Ensure we show at least recent 6 months even if empty
  if (monthlySales.length === 0) {
    const currentMonthIndex = new Date().getMonth();
    for (let i = 5; i >= 0; i--) {
      let mIndex = (currentMonthIndex - i + 12) % 12;
      monthlySales.push({
        month: monthNames[mIndex],
        amount: 0,
        realAmount: 0
      });
    }
  }

  // 3. Order Pipeline
  const pipelineRaw = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);
  
  const pipelineMap = pipelineRaw.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  const orderPipeline = [
    { label: 'Pending', count: pipelineMap['pending'] || 0, type: 'warning' },
    { label: 'Processing', count: pipelineMap['processing'] || 0, type: 'info' },
    { label: 'Shipped', count: pipelineMap['shipped'] || 0, type: 'info' },
    { label: 'Delivered', count: pipelineMap['delivered'] || 0, type: 'success' },
    { label: 'Cancelled/Returned', count: (pipelineMap['cancelled'] || 0) + (pipelineMap['returned'] || 0), type: 'danger' },
  ];

  // 4. Recent Orders
  const recentOrdersRaw = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('userId');

  const recentOrders = recentOrdersRaw.map(order => ({
    id: order.orderNumber,
    customer: order.userId ? `${order.userId.firstName} ${order.userId.lastName}` : (order.shippingAddress?.firstName ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : 'Guest'),
    city: order.shippingAddress?.city || 'Unknown',
    total: `${order.currency} ${order.total?.toFixed(2)}`,
    status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending',
    payment: order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'Pending'
  }));

  // 5. Low Stock Items
  const lowStockItemsRaw = await Product.find({
    $expr: {
      $lt: [ { $ifNull: ["$inventory.available", 0] }, { $ifNull: ["$lowStockThreshold", 10] } ]
    }
  }).limit(5);

  const lowStockItems = lowStockItemsRaw.map(product => ({
    code: product.sku || product.slug,
    itemName: product.name,
    qty: product.inventory?.available || 0,
    warehouse: 'Main Warehouse'
  }));

  // 6. Activity Feed (Mapping from recent orders)
  const activityFeed = recentOrdersRaw.map(order => {
    // Generate a human-readable time ago
    const timeDiff = Date.now() - new Date(order.createdAt).getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const timeStr = hours > 24 ? `${Math.floor(hours/24)} days ago` : hours > 0 ? `${hours} hours ago` : `${minutes} mins ago`;

    return {
      action: `Order ${order.orderNumber} placed`,
      user: order.email || 'customer',
      time: timeStr
    };
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Workspace</h1>
          <p className="admin-page-subtitle">Operations overview and performance metrics.</p>
        </div>
        <div className="admin-page-header__actions">
          <button className="admin-btn">
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Email Report
          </button>
          <button className="admin-btn admin-btn--primary">
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Create New
          </button>
        </div>
      </div>

      <div className="admin-card admin-welcome-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-welcome-card__content">
          <h2 className="admin-welcome-card__title">Welcome back, Admin!</h2>
          <p className="admin-welcome-card__text">You have {openOrdersCount} open orders to process today. Check your low stock alerts below.</p>
          <div className="admin-welcome-card__shortcuts">
            <button className="admin-welcome-card__shortcut">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              New Product
            </button>
            <button className="admin-welcome-card__shortcut">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2" />
                <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              New Order
            </button>
            <button className="admin-welcome-card__shortcut">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Customers
            </button>
            <button className="admin-welcome-card__shortcut">
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                <path d="M12 20V10M18 20V4M6 20v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Reports
            </button>
          </div>
        </div>
      </div>

      <section className="admin-grid admin-grid--kpi">
        {dashboardStats.map((stat) => (
          <article key={stat.label} className="admin-card">
            <div className="admin-kpi__header">
              <p className="admin-kpi__label">{stat.label}</p>
              <div className={`admin-kpi__trend-icon ${stat.trendDirection === 'up' ? 'admin-kpi__trend-icon--up' : 'admin-kpi__trend-icon--down'}`}>
                {stat.trendDirection === 'up' ? (
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <path d="M7 17L17 7m0 0H8m9 0v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <path d="M7 7l10 10m0 0H8m9 0v-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <h2 className="admin-kpi__value">{stat.value}</h2>
            <p className={`admin-kpi__trend-text ${stat.trendDirection === 'up' ? 'admin-kpi__trend-text--up' : 'admin-kpi__trend-text--down'}`}>
              {stat.trend}
            </p>
          </article>
        ))}
      </section>

      <section className="admin-grid admin-grid--two" style={{ marginTop: '0.9rem' }}>
        <article className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Monthly Sales Performance</h3>
            <button className="admin-btn admin-btn--ghost">View Report</button>
          </div>
          {monthlySales.map((entry) => (
            <div key={entry.month} className="admin-chart-row">
              <span>{entry.month}</span>
              <div className="admin-progress">
                <span style={{ width: `${entry.amount}%` }} />
              </div>
              <strong>{entry.amount}%</strong>
            </div>
          ))}
        </article>

        <article className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Order Pipeline</h3>
            <button className="admin-btn admin-btn--ghost">Refresh</button>
          </div>
          <div className="admin-list">
            {orderPipeline.map((state) => (
              <div key={state.label} className="admin-list-item">
                <div>
                  <p className="admin-list-item__title">{state.label}</p>
                  <p className="admin-list-item__meta">Current count in this stage</p>
                </div>
                <span className={`admin-pill admin-pill--${state.type}`}>{state.count}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-grid admin-grid--two" style={{ marginTop: '0.9rem' }}>
        <article className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Recent Sales Orders</h3>
            <button className="admin-btn admin-btn--ghost">Open Sales Order List</button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.city}</td>
                    <td>{order.total}</td>
                    <td><span className={pillClass(order.status)}>{order.status}</span></td>
                    <td><span className={pillClass(order.payment)}>{order.payment}</span></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No recent orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card__header">
            <h3 className="admin-card__title">Low Stock Alerts</h3>
            <button className="admin-btn admin-btn--ghost">Create Reorder</button>
          </div>
          <div className="admin-list" style={{ marginBottom: '0.9rem' }}>
            {lowStockItems.length > 0 ? lowStockItems.map((item) => (
              <div key={item.code} className="admin-list-item">
                <div>
                  <p className="admin-list-item__title">{item.itemName}</p>
                  <p className="admin-list-item__meta">{item.code} - {item.warehouse}</p>
                </div>
                <span className="admin-pill admin-pill--danger">Qty {item.qty}</span>
              </div>
            )) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', padding: '0.5rem 0' }}>All stock levels are optimal.</p>
            )}
          </div>

          <h4 className="admin-card__title" style={{ marginBottom: '0.6rem' }}>Recent Activity</h4>
          <div className="admin-list">
            {activityFeed.length > 0 ? activityFeed.map((activity, index) => (
              <div key={index} className="admin-list-item">
                <div>
                  <p className="admin-list-item__title">{activity.action}</p>
                  <p className="admin-list-item__meta">{activity.user}</p>
                </div>
                <span className="admin-list-item__meta">{activity.time}</span>
              </div>
            )) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', padding: '0.5rem 0' }}>No recent activity.</p>
            )}
          </div>
        </article>
      </section>

      <ThemeSelector />
    </div>
  );
}
