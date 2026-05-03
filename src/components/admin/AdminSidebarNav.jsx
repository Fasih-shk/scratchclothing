'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/products', label: 'Products', icon: 'products' },
  { href: '/admin/orders', label: 'Orders', badge: '248', icon: 'orders' },
  { href: '/admin/users', label: 'Customers', icon: 'customers' },
];

function renderIcon(type) {
  if (type === 'dashboard') {
    return (
      <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
        <path d="M3 3h6v6H3V3Zm8 0h6v4h-6V3ZM3 11h4v6H3v-6Zm6 2h8v4H9v-4Z" fill="currentColor" />
      </svg>
    );
  }
  if (type === 'products') {
    return (
      <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
        <path d="m10 2 7 4v8l-7 4-7-4V6l7-4Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="m3 6 7 4 7-4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (type === 'orders') {
    return (
      <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
        <path d="M4 4h12v12H4z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 8h6M7 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
      <path d="M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3 17a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-sidebar__nav">
      {navItems.map((item) => {
        const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
        const className = `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`;

        return (
          <Link key={item.href} href={item.href} className={className}>
            <span className="admin-nav-item__left">
              <span className="admin-nav-item__icon">{renderIcon(item.icon)}</span>
              <span>{item.label}</span>
            </span>
            {item.badge ? <span className="admin-nav-item__badge">{item.badge}</span> : <span className="admin-nav-item__chevron">›</span>}
          </Link>
        );
      })}
    </nav>
  );
}

