import './admin.css';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <Link href="/" className="admin-sidebar__logo">
            <span className="frappe-logo-icon">M</span>
            MUNI DRIP
          </Link>
        </div>

        <nav className="admin-sidebar__nav">
          <div className="admin-nav-group">
            <p className="admin-nav-group-title">Modules</p>
            <Link href="/admin" className="admin-nav-item active">
              <span className="admin-nav-icon">📊</span>
              Dashboard
            </Link>
            <Link href="/admin/products" className="admin-nav-item">
              <span className="admin-nav-icon">👕</span>
              Products
            </Link>
            <Link href="/admin/orders" className="admin-nav-item">
              <span className="admin-nav-icon">📦</span>
              Orders
            </Link>
            <Link href="/admin/users" className="admin-nav-item">
              <span className="admin-nav-icon">👥</span>
              Customers
            </Link>
          </div>
        </nav>

        <div className="admin-sidebar__footer">
          <Link href="/" className="admin-nav-item">
            <span className="admin-nav-icon">⬅️</span>
            Back to Store
          </Link>
        </div>
      </aside>

      <div className="admin-content-wrapper">
        <header className="admin-topbar">
          <div className="admin-search">
            <span className="admin-search-icon">🔍</span>
            <input type="text" placeholder="Search or type a command (Ctrl + G)" />
          </div>
          <div className="admin-topbar-actions">
            <button className="admin-icon-btn">🔔</button>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <main className="admin-main">
          <div className="admin-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
