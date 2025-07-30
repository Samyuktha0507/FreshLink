import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductsPage.module.css'; // Retained
import { FiSearch, FiFilter, FiShoppingCart, FiCheckCircle, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx'; // Correct import
import { useProducts } from '../context/ProductContext.jsx'; // Assuming this context fetches products
import Chatbot from '../components/Chatbot.jsx';

const AddToCartButton = ({ product, setAddedItem }) => { // Added setAddedItem prop back
    // --- FIX: Use correct function names from CartContext ---
    const { cartItems, addItemToCart, updateItemQuantity } = useCart();
    // --- FIX: Use product._id for consistency with MongoDB and CartContext ---
    const itemInCart = cartItems.find(item => item._id === product._id);
    const quantity = itemInCart ? itemInCart.quantity : 0;

    const handleAddToCart = () => {
        addItemToCart(product); // Correct function name
        setAddedItem(product); // Set item for notification
    };

    const handleUpdateQuantity = (newQuantity) => {
        updateItemQuantity(product._id, newQuantity); // Correct function name and use _id
    };

    if (quantity === 0) {
        return (
            <button
                className={styles.addToCartBtn}
                onClick={handleAddToCart} // Call the new handler
                disabled={product.stock <= 0}
            >
                {product.stock > 0 ? <><FiShoppingCart /> Add to Cart</> : 'Out of Stock'}
            </button>
        );
    }

    return (
        <div className={styles.quantitySelector}>
            <button onClick={() => handleUpdateQuantity(quantity - 1)}><FiMinus /></button>
            <span>{quantity}</span>
            <button onClick={() => handleUpdateQuantity(quantity + 1)} disabled={quantity >= product.stock}><FiPlus /></button>
        </div>
    );
};

const ProductsPage = () => {
  const { products: allProducts, loading, error } = useProducts(); // Get loading and error from context
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');
  const [addedItem, setAddedItem] = useState(null); // State to trigger notification

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
    return <div className={styles.loadingErrorContainer}>Loading products...</div>;
  }

  if (error) {
    return <div className={styles.loadingErrorContainer}>Error: {error}</div>;
  }

  return (
    <div className={styles.pageContainer}>
      {addedItem && <AddToCartNotification item={addedItem} />}

      <div className={styles.main}>
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search fresh produce..."
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterSort}>
            <FiFilter className={styles.filterIcon} />
            <select className={styles.sortDropdown} onChange={e => setSortBy(e.target.value)}>
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.categoryFilters}>
            {['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Herbs & Spices', 'Other'].map(cat => (
              <button
                key={cat}
                className={activeCategory === cat ? styles.active : ''}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.productGrid}>
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map(product => (
              // --- FIX: Use product._id for the key for consistency with MongoDB ---
              <div key={product._id} className={styles.productCard}>
                {/* Product Image with robust placeholder */}
                <img
                  src={product.image || `https://placehold.co/300x200/E0E0E0/333333?text=NoImg`}
                  alt={product.name}
                  className={styles.productImage}
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x200/E0E0E0/333333?text=NoImg`; }}
                />
                <div className={styles.productDetails}>
                  <span className={styles.companyName}>{product.companyName || 'N/A'}</span>
                  <h3>{product.name}</h3>
                  <p className={styles.productStock}>{product.description || 'No description available.'}</p> {/* Changed from stock to description for better display */}
                  <p className={styles.productPrice}>₹{product.price ? product.price.toFixed(2) : 'N/A'}</p>
                  <p className={styles.productStock}>
                    {product.stock !== undefined ? `${product.stock} kg available` : 'Stock N/A'}
                  </p>
                  {/* Pass setAddedItem to AddToCartButton */}
                  <AddToCartButton product={product} setAddedItem={setAddedItem} />
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noProductsFound}>
              No products found matching your criteria.
            </div>
          )}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

// Notification component for when an item is added to cart
const AddToCartNotification = ({ item }) => {
    return (
        <div className={styles.notification}>
            <FiCheckCircle className={styles.notificationIcon} />
            <img
                src={item.image || `https://placehold.co/50x50/E0E0E0/333333?text=NoImg`}
                alt={item.name}
                className={styles.notificationImg}
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/50x50/E0E0E0/333333?text=NoImg`; }}
            />
            <div className={styles.notificationText}><strong>Added to Cart</strong><p>{item.name}</p></div>
            <Link to="/cart" className={styles.notificationBtn}>View Cart</Link>
        </div>
    );
};

export default ProductsPage;
