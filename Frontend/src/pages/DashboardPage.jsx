import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import { FiPlus, FiEdit, FiBarChart2, FiArrowLeft, FiX, FiTrash2 } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useProducts } from '../context/ProductContext.jsx';

const salesData = [
  { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 }, { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 }, { name: 'May', sales: 6000 }, { name: 'Jun', sales: 5500 },
];

const DashboardPage = () => {
  const { products, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const openModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        deleteProduct(productId);
    }
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.logo}>🌿 FreshLink Producer Dashboard</div>
        <Link to="/" className={styles.backLink}><FiArrowLeft /> Back to Home</Link>
      </header>
      <main className={styles.mainContent}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>My Products</h2>
            <button className={styles.primaryBtn} onClick={() => openModal()}><FiPlus /> Add New Product</button>
          </div>
          <div className={styles.tableContainer}>
            <table className={styles.productTable}>
              <thead>
                <tr><th>Product</th><th>Company</th><th>Category</th><th>Stock (kg)</th><th>Price (₹)</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td className={styles.productCell}><img src={product.image} alt={product.name} className={styles.productImg}/>{product.name}</td>
                    <td>{product.companyName}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>{product.price.toFixed(2)}</td>
                    <td className={styles.actionsCell}>
                      <button className={styles.iconBtn} onClick={() => openModal(product)}><FiEdit /></button>
                      <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(product.id)}><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <div className={styles.grid}>
          <section className={`${styles.card} ${styles.salesDetails}`}>
             <div className={styles.cardHeader}><h2>Sales Details</h2></div>
             <table className={styles.productTable}>
                <thead><tr><th>Date</th><th>Order ID</th><th>Amount</th></tr></thead>
                <tbody>
                    <tr><td>2025-07-27</td><td>#12345</td><td>₹1,250.00</td></tr>
                    <tr><td>2025-07-26</td><td>#12344</td><td>₹850.50</td></tr>
                    <tr><td>2025-07-25</td><td>#12343</td><td>₹2,300.00</td></tr>
                </tbody>
             </table>
          </section>
          <section className={`${styles.card} ${styles.analytics}`}>
            <div className={styles.cardHeader}><h2><FiBarChart2 /> Sales Analytics</h2></div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%"><LineChart data={salesData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="sales" stroke="#5a8a58" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer>
            </div>
          </section>
        </div>
      </main>
      {isModalOpen && <ProductModal product={editingProduct} onClose={closeModal} />}
    </div>
  );
};

const ProductModal = ({ product, onClose }) => {
  const { addProduct, editProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: product ? product.name : '',
    companyName: product ? product.companyName : '',
    stock: product ? product.stock : '',
    price: product ? product.price : '',
    category: product ? product.category : 'Vegetables',
    image: product ? product.image : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        stock: parseFloat(formData.stock),
        price: parseFloat(formData.price),
    };
    if (product) {
      editProduct(product.id, finalData);
    } else {
      addProduct(finalData);
    }
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeModalBtn} onClick={onClose}><FiX /></button>
        <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formRow}>
             <div className={styles.formGroup}><label>Product Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
             <div className={styles.formGroup}><label>Company Name</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required /></div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}><label>Category</label><select name="category" value={formData.category} onChange={handleChange}><option>Vegetables</option><option>Fruits</option><option>Grains</option><option>Dairy</option><option>Herbs & Spices</option><option>Other</option></select></div>
            <div className={styles.formGroup}><label>Stock (kg)</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} required /></div>
            <div className={styles.formGroup}><label>Price (₹)</label><input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required /></div>
          </div>
          <div className={styles.formGroup}><label>Product Image</label><input type="file" accept="image/*" onChange={handleImageChange} />{formData.image && <img src={formData.image} alt="Preview" className={styles.imagePreview}/>}</div>
          <button type="submit" className={styles.primaryBtn}>Save Product</button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
