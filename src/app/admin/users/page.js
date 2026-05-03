'use client';

import { useMemo, useState } from 'react';
import { customers } from '@/app/admin/data';

function initials(name) {
  return name
    .split(' ')
    .map((piece) => piece[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function customerStatusClass(status) {
  if (status === 'Priority') return 'admin-pill admin-pill--info';
  if (status === 'Watch') return 'admin-pill admin-pill--warning';
  return 'admin-pill admin-pill--success';
}

export default function AdminUsers() {
  const [query, setQuery] = useState('');
  const [segment, setSegment] = useState('All');

  const filtered = useMemo(() => {
    return customers.filter((customer) => {
      const matchesQuery =
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.customerId.toLowerCase().includes(query.toLowerCase());
      const matchesSegment = segment === 'All' ? true : customer.segment === segment;
      return matchesQuery && matchesSegment;
    });
  }, [query, segment]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customers</h1>
          <p className="admin-page-subtitle">Customer master with segment visibility and value tracking.</p>
        </div>
        <button className="admin-btn admin-btn--primary">New Customer</button>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by customer name or ID"
          />
          <select className="admin-select" value={segment} onChange={(event) => setSegment(event.target.value)}>
            <option value="All">All segments</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
          </select>
          <button className="admin-btn">Email Campaign</button>
        </div>

        <div className="admin-list">
          {filtered.map((customer) => (
            <div className="admin-list-item" key={customer.customerId}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="admin-avatar">{initials(customer.name)}</span>
                <div>
                  <p className="admin-list-item__title">{customer.name}</p>
                  <p className="admin-list-item__meta">
                    {customer.customerId} - {customer.segment} - {customer.city}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="admin-list-item__title">{customer.lifetimeValue}</p>
                <span className={customerStatusClass(customer.status)}>{customer.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
