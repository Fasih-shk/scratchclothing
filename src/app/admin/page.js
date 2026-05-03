'use client';

import {
  activityFeed,
  dashboardStats,
  lowStockItems,
  monthlySales,
  orderPipeline,
  recentOrders,
} from '@/app/admin/data';

function pillClass(status) {
  if (status === 'Completed' || status === 'Paid') return 'admin-pill admin-pill--success';
  if (status === 'To Deliver' || status === 'To Bill' || status === 'Draft') return 'admin-pill admin-pill--warning';
  return 'admin-pill admin-pill--danger';
}

export default function AdminDashboard() {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Overview of sales, fulfillment, inventory, and customer operations.</p>
        </div>
      </div>

      <section className="admin-grid admin-grid--kpi">
        {dashboardStats.map((stat) => (
          <article key={stat.label} className="admin-card">
            <p className="admin-kpi__label">{stat.label}</p>
            <h2 className="admin-kpi__value">{stat.value}</h2>
            <p className={`admin-kpi__trend ${stat.trendDirection === 'up' ? 'admin-kpi__trend--up' : 'admin-kpi__trend--down'}`}>
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
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.city}</td>
                    <td>{order.total}</td>
                    <td><span className={pillClass(order.status)}>{order.status}</span></td>
                    <td><span className={pillClass(order.payment)}>{order.payment}</span></td>
                  </tr>
                ))}
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
            {lowStockItems.map((item) => (
              <div key={item.code} className="admin-list-item">
                <div>
                  <p className="admin-list-item__title">{item.itemName}</p>
                  <p className="admin-list-item__meta">{item.code} - {item.warehouse}</p>
                </div>
                <span className="admin-pill admin-pill--danger">Qty {item.qty}</span>
              </div>
            ))}
          </div>

          <h4 className="admin-card__title" style={{ marginBottom: '0.6rem' }}>Recent Activity</h4>
          <div className="admin-list">
            {activityFeed.map((activity) => (
              <div key={activity.action} className="admin-list-item">
                <div>
                  <p className="admin-list-item__title">{activity.action}</p>
                  <p className="admin-list-item__meta">{activity.user}</p>
                </div>
                <span className="admin-list-item__meta">{activity.time}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
