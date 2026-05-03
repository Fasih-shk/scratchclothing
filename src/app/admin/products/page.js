'use client';

import { useEffect, useState, useCallback } from 'react';

const API_URL = '/api/admin/products';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await fetch(`${API_URL}?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const openDeleteModal = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleSaveProduct = async (formData) => {
    try {
      const url = editingProduct ? `${API_URL}/${editingProduct._id}` : API_URL;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setShowModal(false);
        fetchProducts();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      const res = await fetch(`${API_URL}/${deletingProduct._id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setShowDeleteModal(false);
        setDeletingProduct(null);
        fetchProducts();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleStatusChange = async (product, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: { background: '#dcfce7', color: '#166534' },
      inactive: { background: '#fef3c7', color: '#92400e' },
      discontinued: { background: '#fee2e2', color: '#991b1b' },
    };
    return styles[status] || styles.inactive;
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="admin-topbar__breadcrumb" style={{ marginBottom: '1rem' }}>
        <a href="/admin">Home</a>
        <span className="admin-topbar__breadcrumb-sep">/</span>
        <span className="admin-topbar__breadcrumb-current">Products</span>
      </div>

      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-subtitle">Manage and organize your product catalog</p>
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
          <button className="admin-btn admin-btn--primary" onClick={openAddModal}>
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <form className="admin-toolbar" onSubmit={handleSearch}>
          <input
            className="admin-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU"
          />
          <select
            className="admin-select"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="discontinued">Discontinued</option>
          </select>
          <button type="submit" className="admin-btn">
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search
          </button>
        </form>

        {/* Table */}
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                          />
                        ) : (
                          <div style={{ width: 40, height: 40, background: '#f3f4f6', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                            N/A
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>{product.name}</td>
                      <td style={{ fontSize: 12 }}>{product.sku || '-'}</td>
                      <td>{product.category?.name || '-'}</td>
                      <td>
                        {product.currency} {product.price.toFixed(2)}
                        {product.discount > 0 && (
                          <span style={{ fontSize: 11, color: '#ef4444', marginLeft: 4 }}>
                            -{product.discount}%
                          </span>
                        )}
                      </td>
                      <td>{product.inventory?.available || 0}</td>
                      <td>
                        <span className={`admin-pill admin-pill--${product.status === 'active' ? 'success' : product.status === 'inactive' ? 'warning' : 'danger'}`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="admin-btn"
                            style={{ padding: '4px 8px' }}
                            onClick={() => openEditModal(product)}
                            title="Edit Product"
                          >
                            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="admin-btn admin-btn--danger"
                            style={{ padding: '4px 8px' }}
                            onClick={() => openDeleteModal(product)}
                            title="Delete Product"
                          >
                            <svg viewBox="0 0 24 24" fill="none" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="admin-pagination">
            <button
              className="admin-btn"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {pagination.totalPages}
            </span>
            <button
              className="admin-btn"
              disabled={page === pagination.totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete "{deletingProduct?.name}"?</p>
            <p style={{ color: '#ef4444', fontSize: 12 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="admin-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="admin-btn admin-btn--danger"
                onClick={handleDeleteProduct}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Product Modal Component
function ProductModal({ product, categories, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    category: product?.category?._id || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    discount: product?.discount || 0,
    discountType: product?.discountType || 'percentage',
    currency: product?.currency || 'GBP',
    sku: product?.sku || '',
    status: product?.status || 'active',
    isFeatured: product?.isFeatured || false,
    isNewArrival: product?.isNewArrival || false,
    collection: product?.collection || '',
    tags: product?.tags?.join(', ') || '',
    material: product?.material || '',
    brand: product?.brand || '',
    lowStockThreshold: product?.lowStockThreshold || 10,
    trackInventory: product?.trackInventory !== false,
    inventory: {
      total: product?.inventory?.total || 0,
      available: product?.inventory?.available || 0,
    },
    seoTitle: product?.seoTitle || '',
    seoDescription: product?.seoDescription || '',
    images: product?.images || []
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('inventory.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        inventory: { ...prev.inventory, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalImages = [...formData.images];

      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        selectedFiles.forEach(file => uploadData.append('files', file));

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });
        const data = await res.json();
        
        if (data.success) {
          finalImages = [...finalImages, ...data.files];
        } else {
          throw new Error(data.error || 'Upload failed');
        }
      }

      const data = {
        ...formData,
        images: finalImages,
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        discount: parseFloat(formData.discount) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,
        inventory: {
          total: parseInt(formData.inventory.total) || 0,
          available: parseInt(formData.inventory.available) || 0,
        },
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      };

      if (!product && !data.slug) {
        data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      await onSave(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--large" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3>{product ? 'Edit Product' : 'Add Product'}</h3>
          <button className="admin-modal__close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="admin-modal__body">
          <div className="admin-form-section-title">General Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
              <label>Name</label>
              <input
                className="admin-input"
                name="name"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>SKU</label>
              <input
                className="admin-input"
                name="sku"
                placeholder="e.g. TSH-001"
                value={formData.sku}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label>Brand</label>
              <input
                className="admin-input"
                name="brand"
                placeholder="Brand name"
                value={formData.brand}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
              <label>Short Description</label>
              <input
                className="admin-input"
                name="shortDescription"
                placeholder="A brief summary for listings..."
                value={formData.shortDescription}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group" style={{ gridColumn: 'span 2' }}>
              <label>Long Description</label>
              <textarea
                className="admin-input admin-textarea"
                name="description"
                placeholder="Detailed product story and details..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
          </div>

          <div className="admin-form-section-title">Product Images</div>
          <div className="admin-form-group">
            <label>Upload Images</label>
            <label className="admin-upload-zone">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <div className="admin-upload-zone__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="admin-upload-zone__text">Click to upload or drag and drop</p>
              <p className="admin-upload-zone__hint">PNG, JPG, WEBP up to 5MB</p>
            </label>

            <div className="admin-image-grid">
              {/* Existing Images */}
              {formData.images.map((img, idx) => (
                <div key={`existing-${idx}`} className="admin-image-preview">
                  <img src={img.url} alt={`Existing ${idx}`} />
                  <button 
                    type="button" 
                    className="admin-image-preview__remove"
                    onClick={() => removeExistingImage(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* New Previews */}
              {previews.map((preview, idx) => (
                <div key={`new-${idx}`} className="admin-image-preview">
                  <img src={preview} alt={`Preview ${idx}`} />
                  <button 
                    type="button" 
                    className="admin-image-preview__remove"
                    onClick={() => removePreview(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-form-section-title">Pricing & Inventory</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div className="admin-form-group">
              <label>Selling Price ({formData.currency})</label>
              <input
                className="admin-input"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Original Price</label>
              <input
                className="admin-input"
                name="originalPrice"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label>Discount (%)</label>
              <input
                className="admin-input"
                name="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label>Current Stock</label>
              <input
                className="admin-input"
                name="inventory.total"
                type="number"
                value={formData.inventory.total}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label>Low Stock Alert</label>
              <input
                className="admin-input"
                name="lowStockThreshold"
                type="number"
                value={formData.lowStockThreshold}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label>Currency</label>
              <select className="admin-select" name="currency" value={formData.currency} onChange={handleChange}>
                <option value="GBP">GBP</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="admin-form-section-title">Categorization & Shipping</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="admin-form-group">
              <label>Category</label>
              <select
                className="admin-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Collection</label>
              <select
                className="admin-select"
                name="collection"
                value={formData.collection}
                onChange={handleChange}
              >
                <option value="">Select Collection</option>
                <option value="mens">Mens</option>
                <option value="womens">Womens</option>
                <option value="unisex">Unisex</option>
                <option value="winter">Winter</option>
                <option value="summer">Summer</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Material</label>
              <input
                className="admin-input"
                name="material"
                placeholder="e.g. 100% Cotton"
                value={formData.material}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label>Status</label>
              <select
                className="admin-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          <div className="admin-form-section-title">SEO Configuration</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="admin-form-group">
              <label>SEO Title</label>
              <input
                className="admin-input"
                name="seoTitle"
                placeholder="Browser tab title"
                value={formData.seoTitle}
                onChange={handleChange}
              />
            </div>
            <div className="admin-form-group">
              <label>SEO Description</label>
              <input
                className="admin-input"
                name="seoDescription"
                placeholder="Search engine summary"
                value={formData.seoDescription}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, marginTop: '0.5rem', padding: '1rem', background: 'var(--admin-surface-muted)', borderRadius: 'var(--admin-radius)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              Featured Product
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                name="isNewArrival"
                checked={formData.isNewArrival}
                onChange={handleChange}
              />
              New Arrival
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                name="trackInventory"
                checked={formData.trackInventory}
                onChange={handleChange}
              />
              Track Stock
            </label>
          </div>
        </form>
        <div className="admin-modal__footer">
          <button type="button" className="admin-btn" onClick={onClose} disabled={isUploading}>
            Cancel
          </button>
          <button 
            type="button" 
            className="admin-btn admin-btn--primary" 
            onClick={handleSubmit} 
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : (product ? 'Save Changes' : 'Create Product')}
          </button>
        </div>
      </div>
    </div>
  );
}