import './admin.css';
import Link from 'next/link';
import AdminSidebarNav from '@/components/admin/AdminSidebarNav';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__header">
            <Link href="/admin" className="admin-sidebar__logo">
              <span className="admin-sidebar__logo-mark" aria-hidden="true" />
              <div>
                <p className="admin-sidebar__logo-title">MUNI DRIP ERP</p>
                <p className="admin-sidebar__logo-subtitle">Commerce OS</p>
              </div>
            </Link>
          </div>

          <div className="admin-sidebar__section-title">Workspace</div>
          <AdminSidebarNav />

          <div className="admin-sidebar__footer">
            <div className="admin-sidebar__status">
              <span className="admin-sidebar__status-dot" />
              <span>System healthy</span>
            </div>
            <Link href="/" className="admin-sidebar__back-link">Back to Store</Link>
          </div>
        </aside>

        <section className="admin-content">
          <header className="admin-topbar">
            <div className="admin-topbar__inner">
              <p className="admin-topbar__title">Scratch Clothing - Operations Workspace</p>
              <div className="admin-topbar__actions">
                <div className="admin-topbar__search">
                  <input type="text" placeholder="Search orders, products, customers..." />
                </div>
                <button className="admin-topbar__icon-btn" aria-label="Notifications">
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
                    <path d="M12 4a5 5 0 0 0-5 5v2.4c0 .5-.2 1-.6 1.4L5 14.2a1 1 0 0 0 .7 1.8h12.6a1 1 0 0 0 .7-1.8l-1.4-1.4c-.4-.4-.6-.9-.6-1.4V9a5 5 0 0 0-5-5Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M9.5 18a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span className="admin-topbar__dot" />
                </button>
                <div className="admin-topbar__user">
                  <span className="admin-topbar__avatar" aria-hidden="true">TA</span>
                  <div>
                    <p className="admin-topbar__user-name">Talha Ahmad</p>
                    <p className="admin-topbar__user-email">talha@munidrip.co.uk</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="admin-page">{children}</main>
        </section>
      </div>
    </div>
  );
}
