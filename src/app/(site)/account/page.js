'use client';

import Link from 'next/link';

// Customer Dashboard Page - matches site dark theme
export default function AccountDashboard() {
  const orders = [
    { id: 'ORD-2024-001', date: '15 Jan 2024', status: 'delivered', total: 85.99, items: 3 },
    { id: 'ORD-2024-002', date: '20 Jan 2024', status: 'shipped', total: 120.00, items: 2 },
    { id: 'ORD-2024-003', date: '01 Feb 2024', status: 'processing', total: 45.50, items: 1 },
  ];

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const delivered = orders.filter(o => o.status === 'delivered').length;

  const getStatusStyle = (status) => {
    const styles = {
      delivered: { background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600 },
      shipped: { background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600 },
      processing: { background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600 },
    };
    return styles[status] || styles.processing;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px 0', color: 'var(--color-white)' }}>Dashboard</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 14, margin: 0 }}>Overview of your account</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 12, padding: 20, border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-white)' }}>{totalOrders}</div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>Total Orders</div>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 12, padding: 20, border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-white)' }}>£{totalSpent.toFixed(2)}</div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>Total Spent</div>
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 12, padding: 20, border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-white)' }}>{delivered}</div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>Delivered</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 12, padding: 20, border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--color-white)' }}>Recent Orders</h2>
          <Link href="/account/orders" style={{ color: 'var(--color-white)', fontSize: 14, fontWeight: 600, textDecoration: 'underline' }}>View All Orders</Link>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase' }}>Order</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase' }}>Items</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase' }}>Total</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: 12, fontWeight: 600, color: 'var(--color-muted)' }}></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--color-white)' }}>{order.id}</td>
                <td style={{ padding: '12px 8px', fontSize: 14, color: 'var(--color-muted)' }}>{order.date}</td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={getStatusStyle(order.status)}>{order.status}</span>
                </td>
                <td style={{ padding: '12px 8px', fontSize: 14, color: 'var(--color-muted)' }}>{order.items} items</td>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--color-white)' }}>£{order.total.toFixed(2)}</td>
                <td style={{ padding: '12px 8px' }}>
                  <button style={{ background: 'var(--color-white)', color: 'var(--color-black)', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}