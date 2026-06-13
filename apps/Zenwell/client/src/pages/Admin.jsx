import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const adminUser = sessionStorage.getItem('adminUser');
    if (!adminUser) {
      navigate('/admin-login', { replace : true });
      return;
    }
    setUser(JSON.parse(adminUser));
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [prodRes, enquRes] = await Promise.all([
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/enquiries')
      ]);

      const products = await prodRes.json();
      const enquiries = await enquRes.json();

      setProducts(products.data || products);
      setEnquiries(enquiries.data || enquiries);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminUser');
    navigate('/login');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setFormData(product);
  };

  const handleSaveProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${editingProduct}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchData();
        setEditingProduct(null);
        setFormData({});
      }
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const [addingProduct, setAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    image: '',
    shortDesc: '',
    fullDesc: ''
  });

  const handleAddProduct = async () => {
  // Validate form
  if (!newProductForm.name || !newProductForm.category || !newProductForm.price) {
    alert('Please fill: Name, Category, Price');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProductForm)
    });

    const data = await res.json();
    console.log('Response:', data);

    if (res.ok) {
      alert('✓ Product added successfully!');
      fetchData();
      setAddingProduct(false);
      setNewProductForm({
        name: '',
        category: '',
        price: '',
        quantity: '',
        image: '',
        shortDesc: '',
        fullDesc: ''
      });
    } else {
      alert('Error: ' + (data.error || 'Failed to add product'));
    }
  } catch (err) {
    console.error('Error adding product:', err);
    alert('Connection error: ' + err.message);
  }
};

  const handleUpdateEnquiryStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/enquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error('Error updating enquiry:', err);
    }
  };

  const handleViewEnquiry = (enquiry) => {
  alert(`📧 ${enquiry.name}\n📨 ${enquiry.email}\n📱 ${enquiry.phone}\n\n💬 Message:\n${enquiry.message}`);
};

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;

    try {
     await fetch(`http://localhost:5000/api/enquiries/${id}`, { method: 'DELETE' });
      fetchData();
  }  catch (err) {
      console.error('Error deleting enquiry:', err);
  }
};

  if (!user) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h3>ZenWell Admin</h3>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${tab === 'products' ? 'active' : ''}`}
            onClick={() => setTab('products')}
          >
            📦 Products
          </button>
          <button
            className={`admin-nav-item ${tab === 'enquiries' ? 'active' : ''}`}
            onClick={() => setTab('enquiries')}
          >
            📧 Enquiries
          </button>
        </nav>

        <div className="admin-footer">
          <p className="admin-user">👤 {user.username}</p>
          <button className="admin-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>{tab === 'products' ? 'Products' : 'Enquiries'}</h1>
          <p>Manage and update your data</p>
        </div>

        {loading ? (
          <div className="admin-loading">Loading data...</div>
        ) : (
          <>
            {tab === 'products' && (
              <div className="admin-products">
              <button className="btn-add-product" onClick={() => setAddingProduct(true)}>
                + Add New Product
              </button>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>₹{product.price}</td>
                        <td>{product.quantity}</td>
                        <td className="admin-actions">
                          <button className="btn-edit" onClick={() => handleEditProduct(product)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {editingProduct && (
                  <div className="admin-modal">
                    <div className="modal-content">
                      <h2>Edit Product</h2>
                      <div className="modal-form">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Category"
                          value={formData.category || ''}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={formData.quantity || ''}
                          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={formData.image || ''}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                        <textarea
                          placeholder="Short Description"
                          value={formData.shortDesc || ''}
                          onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                        ></textarea>
                        <textarea
                          placeholder="Full Description"
                          value={formData.fullDesc || ''}
                          onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                        ></textarea>
                      </div>
                      <div className="modal-actions">
                        <button className="btn-save" onClick={handleSaveProduct}>Save</button>
                        <button className="btn-cancel" onClick={() => setEditingProduct(null)}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
                {addingProduct && (
                  <div className="admin-modal">
                    <div className="modal-content">
                      <h2>Add New Product</h2>
                      <div className="modal-form">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={newProductForm.name}
                          onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Category"
                          value={newProductForm.category}
                          onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={newProductForm.price}
                          onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                        />
                        <input
                          type="number"
                          placeholder="Quantity"
                          value={newProductForm.quantity}
                          onChange={(e) => setNewProductForm({ ...newProductForm, quantity: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={newProductForm.image}
                          onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                        />
                        <textarea
                          placeholder="Short Description"
                          value={newProductForm.shortDesc}
                          onChange={(e) => setNewProductForm({ ...newProductForm, shortDesc: e.target.value })}
                        ></textarea>
                        <textarea
                          placeholder="Full Description"
                          value={newProductForm.fullDesc}
                          onChange={(e) => setNewProductForm({ ...newProductForm, fullDesc: e.target.value })}
                        ></textarea>
                      </div>
                      <div className="modal-actions">
                        <button className="btn-save" onClick={handleAddProduct}>Add Product</button>
                        <button className="btn-cancel" onClick={() => setAddingProduct(false)}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab === 'enquiries' && (
              <div className="admin-enquiries">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Product</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map(enquiry => (
                      <tr key={enquiry._id}>
                        <td>{enquiry.name}</td>
                        <td>{enquiry.email}</td>
                        <td>{enquiry.product}</td>
                        <td className="message-cell">{enquiry.message.substring(0, 30)}...</td>
                        <td>
                          <span className={`status-badge status-${enquiry.status.toLowerCase()}`}>
                            {enquiry.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={enquiry.status}
                            onChange={(e) => handleUpdateEnquiryStatus(enquiry._id, e.target.value)}
                          >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="admin-actions">
                          <button className="btn-view" onClick={() => handleViewEnquiry(enquiry)}>View</button>
                          <button className="btn-delete" onClick={() => handleDeleteEnquiry(enquiry._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Admin;