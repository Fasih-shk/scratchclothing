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
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Orders</h1>
          <p className="admin-page-subtitle">Track order lifecycle from draft to delivery and billing.</p>
        </div>
        <button className="admin-btn admin-btn--primary">New Sales Order</button>
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
          <button className="admin-btn">Download</button>
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
