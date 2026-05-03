'use client';

import { useMemo, useState } from 'react';
import { orders } from '@/app/admin/data';

function statusClass(value) {
  if (value === 'Completed' || value === 'Paid') return 'admin-pill admin-pill--success';
  if (value === 'Draft' || value === 'To Deliver' || value === 'To Bill') return 'admin-pill admin-pill--warning';
  return 'admin-pill admin-pill--danger';
}

export default function AdminOrders() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesQuery =
        order.id.toLowerCase().includes(query.toLowerCase()) ||
        order.customer.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'All' ? true : order.orderStatus === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <div>
      <div className="admin-topbar__breadcrumb" style={{ marginBottom: '1rem' }}>
        <a href="/admin">Home</a>
        <span className="admin-topbar__breadcrumb-sep">/</span>
        <span className="admin-topbar__breadcrumb-current">Orders</span>
      </div>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">Track order lifecycle from draft to delivery and billing.</p>
        </div>
        <div className="admin-page-header__actions">
          <button className="admin-btn">
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <button className="admin-btn admin-btn--primary">
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Sales Order
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by order number or customer"
          />
          <select className="admin-select" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="All">All statuses</option>
            <option value="Draft">Draft</option>
            <option value="To Deliver">To Deliver</option>
            <option value="To Bill">To Bill</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <div style={{ display: 'none' }} /> {/* Spacer for grid alignment if needed */}
          <button className="admin-btn">
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Territory</th>
                <th>Grand Total</th>
                <th>Order Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.customer}</td>
                  <td>{order.territory}</td>
                  <td>{order.grandTotal}</td>
                  <td><span className={statusClass(order.orderStatus)}>{order.orderStatus}</span></td>
                  <td><span className={statusClass(order.paymentStatus)}>{order.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
