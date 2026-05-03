'use client';

import './admin.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/context/AuthContext';
import AdminSidebarNav from '@/components/admin/AdminSidebarNav';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user, logout, isInitialized, initialize } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'AD';
  const userName = user ? `${user.firstName} ${user.lastName}` : 'Admin';
  const userEmail = user?.email || 'admin@munidrip.com';

  return (
    <div className="admin-layout">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar__header">
            <Link href="/admin" className="admin-sidebar__logo">
              <div className="admin-sidebar__logo-mark" />
              <div>
                <p className="admin-sidebar__logo-title">MUNI DRIP</p>
                <p className="admin-sidebar__logo-subtitle">Enterprise Resource</p>
              </div>
            </Link>
          </div>

          <div className="admin-sidebar__search-wrap">
            <div className="admin-sidebar__search">
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input type="text" placeholder="Search or type a command (Ctrl + G)" />
            </div>
          </div>

          <div className="admin-sidebar__section-title">Public</div>
          <AdminSidebarNav />

          <div className="admin-sidebar__footer">
            <Link href="/" className="admin-sidebar__back-link">
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Go to Website
            </Link>
          </div>
        </aside>

        <section className="admin-content">
          <header className="admin-topbar">
            <div className="admin-topbar__inner">
              <div className="admin-topbar__breadcrumb">
                <Link href="/admin">Home</Link>
                <span className="admin-topbar__breadcrumb-sep">/</span>
                <span className="admin-topbar__breadcrumb-current">Dashboard</span>
              </div>
              <div className="admin-topbar__actions">
                <button className="admin-topbar__icon-btn" aria-label="Help">
                  <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="admin-topbar__user-menu" ref={dropdownRef}>
                  <button 
                    className="admin-topbar__user"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-label="User menu"
                  >
                    <span className="admin-topbar__avatar" aria-hidden="true">{userInitials}</span>
                    <div>
                      <p className="admin-topbar__user-name">{userName}</p>
                      <p className="admin-topbar__user-email">{userEmail}</p>
                    </div>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="admin-topbar__dropdown">
                      <Link href="/admin/profile" className="admin-topbar__dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                          <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                          <circle stroke="currentColor" strokeWidth="1.5" cx="12" cy="7" r="4" />
                        </svg>
                        Profile
                      </Link>
                      <Link href="/admin/settings" className="admin-topbar__dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                          <circle stroke="currentColor" strokeWidth="1.5" cx="12" cy="12" r="3" />
                          <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                        Settings
                      </Link>
                      <div className="admin-topbar__dropdown-divider" />
                      <button className="admin-topbar__dropdown-item admin-topbar__dropdown-logout" onClick={handleLogout}>
                        <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                          <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                          <polyline stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points="16 17 21 12 16 7" />
                          <line stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
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