'use client';

export default function AdminUsers() {
  return (
    <div>
      <h1 className="admin-page-title">Customers</h1>
      <div className="admin-card">
        <p style={{ color: 'var(--admin-text-muted)' }}>
          Once connected to Frappe, your "Customer" list will appear here.
        </p>
      </div>
    </div>
  );
}
