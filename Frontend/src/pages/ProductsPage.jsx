import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductsPage.module.css'; // Retained
import { FiSearch, FiFilter, FiShoppingCart, FiCheckCircle, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import Chatbot from '../components/Chatbot.jsx';

// Helper component for Add to Cart button and quantity selector
const AddToCartButton = ({ product, setAddedItem }) => {
    const { cartItems, addItemToCart, updateItemQuantity } = useCart();
    const itemInCart = cartItems.find(item => item._id === product._id); // Use _id
    const quantity = itemInCart ? itemInCart.quantity : 0;

    const handleAddToCart = () => {
        addItemToCart(product);
        setAddedItem(product);
    };

    const handleUpdateQuantity = (newQuantity) => {
        updateItemQuantity(product._id, newQuantity); // Use _id
    };

    if (quantity === 0) {
        return (
            <button
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
            >
                {product.stock > 0 ? (
                    <span className="flex items-center justify-center gap-2">
                        <FiShoppingCart /> Add to Cart
                    </span>
                ) : (
                    'Out of Stock'
                )}
            </button>
        );
    }

    return (
        <div className="flex items-center justify-center space-x-2 bg-gray-100 p-2 rounded-lg">
            <button
                onClick={() => handleUpdateQuantity(quantity - 1)}
                className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
                <FiMinus size={20} />
            </button>
            <span className="text-lg font-medium text-gray-800">{quantity}</span>
            <button
                onClick={() => handleUpdateQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
                className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
            >
                <FiPlus size={20} />
            </button>
        </div>
    );
};

// Notification component for when an item is added to cart
const AddToCartNotification = ({ item }) => {
    return (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-xl flex items-center space-x-3 z-50 animate-bounce">
            <FiCheckCircle className="text-xl" />
            <img
                src={item.image || `https://placehold.co/50x50/E0E0E0/333333?text=NoImg`}
                alt={item.name}
                className="w-12 h-12 rounded-md object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/50x50/E0E0E0/333333?text=NoImg`; }}
            />
            <div className="flex flex-col">
                <strong className="text-lg">Added to Cart</strong>
                <p className="text-sm">{item.name}</p>
            </div>
            <Link to="/cart" className="ml-4 px-4 py-2 bg-white text-green-600 rounded-md font-semibold hover:bg-gray-100 transition-colors">
                View Cart
            </Link>
        </div>
    );
};


const ProductsPage = () => {
  const { products: allProducts, loading, error } = useProducts(); // Get loading and error from context
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    if (addedItem) {
      const timer = setTimeout(() => setAddedItem(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [addedItem]);

  const filteredAndSortedProducts = useMemo(() => {
    let products = allProducts;

    if (searchTerm) {
      products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (activeCategory !== 'All') {
      products = products.filter(p => p.category === activeCategory);
    }

    const sorted = [...products]; // Create a shallow copy to avoid mutating original state
    if (sortBy === 'Price: Low to High') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      sorted.sort((a, b) => b.price - a.price);
    }
    // 'Newest First' implies default order from backend or by creation date if available

    return sorted;
  }, [searchTerm, activeCategory, sortBy, allProducts]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading products...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gray-50 font-sans">
      {addedItem && <AddToCartNotification item={addedItem} />}

      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-1/2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search fresh produce..."
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary-green"
              onChange={e => setSortBy(e.target.value)}
            >
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Herbs & Spices', 'Other'].map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeCategory === cat ? 'bg-primary-green text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map(product => (
              <div key={product._id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-transform hover:scale-105">
                <img
                  src={product.image || `https://placehold.co/300x200/E0E0E0/333333?text=NoImg`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x200/E0E0E0/333333?text=NoImg`; }}
                />
                <div className="p-4 flex-grow flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">{product.companyName || 'N/A'}</span>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description || 'No description available.'}</p>
                  <p className="text-2xl font-bold text-green-600 mb-4">₹{product.price ? product.price.toFixed(2) : 'N/A'}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {product.stock !== undefined ? `${product.stock} kg available` : 'Stock N/A'}
                  </p>
                  <AddToCartButton product={product} setAddedItem={setAddedItem} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-600 text-lg">
              No products found matching your criteria.
            </div>
          )}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default ProductsPage;
