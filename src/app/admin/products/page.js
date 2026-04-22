'use client';

export default function AdminProducts() {
  return (
    <div>
      <h1 className="admin-page-title">Products</h1>
      <div className="admin-card">
        <p style={{ color: 'var(--admin-text-muted)' }}>
          Once connected to Frappe, your "Item" list will appear here.
        </p>
      </div>
    </div>
  );
}
