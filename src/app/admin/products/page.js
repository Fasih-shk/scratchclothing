'use client';

import { useMemo, useState } from 'react';
import { products } from '@/app/admin/data';

function stockBadge(product) {
  if (product.status === 'Out of Stock') return 'admin-pill admin-pill--danger';
  if (product.status === 'Low Stock') return 'admin-pill admin-pill--warning';
  return 'admin-pill admin-pill--success';
}

export default function AdminProducts() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Tracksuits', 'Sets', 'Tops', 'Bottoms'];

  const filtered = useMemo(() => {
    return products.filter((item) => {
      const matchesQuery =
        item.itemName.toLowerCase().includes(query.toLowerCase()) ||
        item.code.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' ? true : item.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">Item master, pricing, and stock availability.</p>
        </div>
        <button className="admin-btn admin-btn--primary">New Item</button>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by item code or name"
          />
          <select className="admin-select" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button className="admin-btn">Bulk Update</button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Rate</th>
                <th>Stock Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.code}>
                  <td>{item.code}</td>
                  <td>{item.itemName}</td>
                  <td>{item.category}</td>
                  <td>{item.rate}</td>
                  <td>{item.stock}</td>
                  <td><span className={stockBadge(item)}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
