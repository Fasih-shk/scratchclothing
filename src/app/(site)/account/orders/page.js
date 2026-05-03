'use client';

import { useEffect, useState } from 'react';

const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '15 Jan 2024',
    status: 'delivered',
    total: 85.99,
    items: [
      { name: 'Classic Black T-Shirt', price: 35, qty: 2 },
      { name: 'White Urban T-Shirt', price: 30, qty: 1 },
    ],
    shippingAddress: '123 Street Name, London, SW1A 1AA',
  },
  {
    id: 'ORD-2024-002',
    date: '20 Jan 2024',
    status: 'shipped',
    total: 120.00,
    items: [
      { name: 'Grey Melange Hoodie', price: 65, qty: 1 },
      { name: 'Black Bomber Jacket', price: 120, qty: 1, discount: 65 },
    ],
    shippingAddress: '123 Street Name, London, SW1A 1AA',
    trackingNumber: 'TRK123456789',
  },
  {
    id: 'ORD-2024-003',
    date: '01 Feb 2024',
    status: 'processing',
    total: 45.50,
    items: [
      { name: 'Bucket Hat Black', price: 25, qty: 1 },
      { name: 'Shipping', price: 20.50, qty: 1 },
    ],
    shippingAddress: '123 Street Name, London, SW1A 1AA',
  },
];

export default function OrdersPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px 0', color: 'var(--color-white)' }}>My Orders</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 14, margin: 0 }}>Track and manage your orders</p>
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {mockOrders.map((order) => (
          <div key={order.id} style={{ background: 'var(--color-surface)', borderRadius: 12, padding: 20, border: '1px solid var(--color-border)' }}>
            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <span style={{ fontWeight: 700, color: 'var(--color-white)', fontSize: 16 }}>{order.id}</span>
                <span style={{ display: 'block', fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>{order.date}</span>
              </div>
              <span style={{
                background: order.status === 'delivered' ? '#dcfce7' : order.status === 'shipped' ? '#dbeafe' : '#fef3c7',
                color: order.status === 'delivered' ? '#166534' : order.status === 'shipped' ? '#1e40af' : '#92400e',
                padding: '4px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, textTransform: 'capitalize'
              }}>
                {order.status}
              </span>
            </div>

            {/* Items */}
            <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '12px 0', marginBottom: 12 }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: 'var(--color-white)', fontSize: 14 }}>{item.name}</span>
                    <span style={{ color: 'var(--color-muted)', fontSize: 14 }}>Qty: {item.qty}</span>
                  </div>
                  <span style={{ color: 'var(--color-white)', fontSize: 14, fontWeight: 600 }}>
                    £{((item.price - (item.discount || 0)) * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                <p style={{ margin: 0 }}>Shipping to: {order.shippingAddress}</p>
                {order.trackingNumber && (
                  <p style={{ margin: '4px 0 0 0', color: 'var(--color-white)', fontWeight: 500 }}>Tracking: {order.trackingNumber}</p>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, fontWeight: 700 }}>
                <span style={{ color: 'var(--color-muted)' }}>Total</span>
                <span style={{ color: 'var(--color-white)' }}>£{order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ background: 'var(--color-white)', color: 'var(--color-black)', border: 'none', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                View Details
              </button>
              {order.status === 'delivered' && (
                <button style={{ background: 'transparent', color: 'var(--color-white)', border: '1px solid var(--color-white)', borderRadius: 6, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Buy Again
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}