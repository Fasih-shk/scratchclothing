'use client';

export default function AdminOrders() {
  return (
    <div>
      <h1 className="admin-page-title">Orders</h1>
      <div className="admin-card">
        <p style={{ color: 'var(--admin-text-muted)' }}>
          Once connected to Frappe, your "Sales Order" list will appear here.
        </p>
      </div>
    </div>
  );
}
