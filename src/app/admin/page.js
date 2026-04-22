'use client';

import ThemeSelector from '@/components/ThemeSelector';

export default function AdminDashboard() {
  // These will eventually be fetched from Frappe
  const stats = [
    { title: 'Total Orders', value: '0' },
    { title: 'Total Customers', value: '0' },
    { title: 'Products', value: '0' },
    { title: 'Revenue', value: '£0.00' },
  ];

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="admin-card">
            <p className="stat-card__title">{stat.title}</p>
            <h2 className="stat-card__value">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <ThemeSelector />
      </div>

      <div className="admin-card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Recent Activity</h3>
        <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
          Connect your Frappe backend to see real-time orders and customer activity here.
        </p>
      </div>
    </div>
  );
}
