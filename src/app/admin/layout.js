import './admin.css';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <Link href="/" className="admin-sidebar__logo">
            MUNI DRIP<span>®</span>
          </Link>
        </div>
        
        <nav className="admin-sidebar__nav">
          <Link href="/admin" className="admin-nav-item">Dashboard</Link>
          <Link href="/admin/products" className="admin-nav-item">Products</Link>
          <Link href="/admin/orders" className="admin-nav-item">Orders</Link>
          <Link href="/admin/users" className="admin-nav-item">Customers</Link>
        </nav>

        <div className="admin-sidebar__footer">
          <Link href="/" className="admin-nav-item">Back to Store</Link>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
