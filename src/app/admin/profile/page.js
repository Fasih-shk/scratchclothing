'use client';

import { useAuthStore } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { user, isInitialized, initialize } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) {
      initialize().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [isInitialized, initialize]);

  if (isLoading || !user) {
    return <div className="admin-page"><p>Loading...</p></div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-topbar__breadcrumb" style={{ marginBottom: '1rem' }}>
        <a href="/admin">Home</a>
        <span className="admin-topbar__breadcrumb-sep">/</span>
        <span className="admin-topbar__breadcrumb-current">Profile</span>
      </div>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Profile</h1>
          <p className="admin-page-subtitle">Manage your account settings</p>
        </div>
        <div className="admin-page-header__actions">
          <button className="admin-btn admin-btn--primary">
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card__header">
          <h2 className="admin-card__title">Personal Information</h2>
        </div>
        <div className="admin-card__body">
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>First Name</label>
              <input type="text" defaultValue={user.firstName} />
            </div>
            <div className="admin-form-group">
              <label>Last Name</label>
              <input type="text" defaultValue={user.lastName} />
            </div>
            <div className="admin-form-group">
              <label>Email Address</label>
              <input type="email" defaultValue={user.email} disabled />
            </div>
            <div className="admin-form-group">
              <label>Phone</label>
              <input type="tel" defaultValue={user.phone || ''} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}