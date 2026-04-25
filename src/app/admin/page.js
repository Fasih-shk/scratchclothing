'use client';

import ThemeSelector from '@/components/ThemeSelector';

export default function AdminDashboard() {
  const shortcuts = [
    { title: 'Item', count: '12', color: 'orange' },
    { title: 'Sales Order', count: '5', color: 'blue' },
    { title: 'Customer', count: '128', color: 'green' },
    { title: 'Sales Invoice', count: '3', color: 'red' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Workspace</h1>
        <button className="btn-frappe-primary">Edit</button>
      </div>

      <div className="frappe-section">
        <h3 className="frappe-section-title">Your Shortcuts</h3>
        <div className="frappe-shortcut-grid">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.title} className="frappe-shortcut-card">
              <span className="shortcut-title">{shortcut.title}</span>
              <span className={`shortcut-badge badge-${shortcut.color}`}>{shortcut.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="frappe-section">
        <h3 className="frappe-section-title">Reports & Masters</h3>
        <div className="frappe-links-grid">
          <div className="frappe-links-group">
            <h4>Sales</h4>
            <ul>
              <li>Customer</li>
              <li>Quotation</li>
              <li>Sales Order</li>
              <li>Sales Invoice</li>
            </ul>
          </div>
          <div className="frappe-links-group">
            <h4>Items and Pricing</h4>
            <ul>
              <li>Item</li>
              <li>Item Group</li>
              <li>Price List</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="frappe-section">
        <h3 className="frappe-section-title">Theme Settings</h3>
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <ThemeSelector />
        </div>
      </div>
    </div>
  );
}
