import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardPage.module.css'; // Retained
import { FiPlus, FiEdit, FiBarChart2, FiArrowLeft, FiX, FiTrash2 } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useProducts } from '../context/ProductContext.jsx';
import { useAuth } from '../context/AuthContext.jsx'; // Import useAuth to get current user's ID

// Dummy sales data for the chart
const salesData = [
  { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 }, { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 }, { name: 'May', sales: 6000 }, { name: 'Jun', sales: 5500 },
];

const DashboardPage = () => {
  const { user } = useAuth(); // Get the logged-in user
  const { products, deleteProduct, loading, error } = useProducts(); // Get products, deleteProduct, loading, error from context
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Filter products to show only those belonging to the logged-in producer
  // Ensure user is not null before filtering
  const producerProducts = products.filter(p => p.user === user?._id); // Use user?._id for filtering

  const openModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (productId) => {
    // Replace window.confirm with a custom modal/dialog for better UX
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        deleteProduct(productId); // Pass the product's _id
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading producer dashboard...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">Error: {error}</div>;
  }

  // If user is not a producer or not logged in, redirect or show message
  if (!user || user.role !== 'producer') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl text-gray-600 p-4">
        <p className="mb-4">Access Denied. You must be logged in as a Producer to view this dashboard.</p>
        <Link to="/login/producer" className="text-primary-green hover:underline">Go to Producer Login</Link>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 font-sans">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="text-xl sm:text-2xl font-bold text-primary-green">
          🌿 FreshLink Producer Dashboard
        </div>
        <Link to="/" className="text-gray-600 hover:text-primary-green flex items-center gap-1 transition-colors">
          <FiArrowLeft /> Back to Home
        </Link>
      </header>

      <main className="max-w-6xl mx-auto space-y-6">
        {/* My Products Section */}
        <section className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
            <button
              className="px-4 py-2 bg-primary-green text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors flex items-center gap-2"
              onClick={() => openModal()}
            >
              <FiPlus /> Add New Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Product</th>
                  <th className="py-3 px-6 text-left">Company</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Stock (kg)</th>
                  <th className="py-3 px-6 text-left">Price (₹)</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {producerProducts.length > 0 ? (
                  producerProducts.map(product => (
                    <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.image || 'https://placehold.co/40x40/E0E0E0/333333?text=NoImg'}
                            alt={product.name}
                            className="w-10 h-10 rounded-md mr-3 object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/E0E0E0/333333?text=NoImg'; }}
                          />
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">{product.companyName || 'N/A'}</td>
                      <td className="py-3 px-6 text-left">{product.category || 'N/A'}</td>
                      <td className="py-3 px-6 text-left">{product.stock !== undefined ? product.stock : 'N/A'}</td>
                      <td className="py-3 px-6 text-left">₹{product.price !== undefined ? product.price.toFixed(2) : 'N/A'}</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center space-x-2">
                          <button
                            className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors"
                            onClick={() => openModal(product)}
                            aria-label="Edit product"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                            onClick={() => handleDelete(product._id)} // Use product._id
                            aria-label="Delete product"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      You haven't added any products yet. Click "Add New Product" to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Details Section */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Sales Details</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Order ID</th>
                    <th className="py-3 px-6 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {/* Dummy data for now, replace with actual sales data */}
                  <tr><td className="py-3 px-6 text-left">2025-07-27</td><td className="py-3 px-6 text-left">#12345</td><td className="py-3 px-6 text-left">₹1,250.00</td></tr>
                  <tr><td className="py-3 px-6 text-left">2025-07-26</td><td className="py-3 px-6 text-left">#12344</td><td className="py-3 px-6 text-left">₹850.50</td></tr>
                  <tr><td className="py-3 px-6 text-left">2025-07-25</td><td className="py-3 px-6 text-left">#12343</td><td className="py-3 px-6 text-left">₹2,300.00</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Sales Analytics Section */}
          <section className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FiBarChart2 /> Sales Analytics</h2>
            </div>
            <div className="h-80 w-full"> {/* Fixed height for chart container */}
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#e0e0e0' }} />
                  <YAxis tickLine={false} axisLine={{ stroke: '#e0e0e0' }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#5a8a58" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </main>

      {/* Product Add/Edit Modal */}
      {isModalOpen && <ProductModal product={editingProduct} onClose={closeModal} />}
    </div>
  );
};

// Product Add/Edit Modal Component
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
      // For simplicity, using URL.createObjectURL for immediate preview
      // In a real app, you'd upload this file to cloud storage (e.g., Cloudinary, S3)
      // and get a persistent URL to save to your database.
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  const handleSubmit = async (e) => { // Made async
    e.preventDefault();
    const finalData = {
        ...formData,
        stock: parseFloat(formData.stock),
        price: parseFloat(formData.price),
    };
    try {
        if (product) {
            await editProduct(product._id, finalData); // Use product._id for edit
        } else {
            await addProduct(finalData);
        }
        onClose(); // Close modal on success
    } catch (error) {
        // Handle error, e.g., display a message to the user
        console.error("Error saving product:", error);
        alert(`Failed to save product: ${error.message || 'Unknown error'}`); // Simple alert for now
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Close modal">
          <FiX size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
              >
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
                <option>Dairy</option>
                <option>Herbs & Spices</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="stock" className="text-sm font-medium text-gray-700 mb-1">Stock (kg)</label>
              <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="price" className="text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" step="0.01" id="price" name="price" value={formData.price} onChange={handleChange} required
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-green"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="image" className="text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <input type="file" id="image" accept="image/*" onChange={handleImageChange}
              className="border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-green file:text-white hover:file:bg-green-700"
            />
            {formData.image && <img src={formData.image} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-lg shadow-md"/>}
          </div>
          <button type="submit" className="w-full bg-primary-green text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-opacity-75">
            Save Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardPage;
