import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductsPage.module.css';
import { FiSearch, FiFilter, FiShoppingCart, FiCheckCircle, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx'; // Correct import
import { useProducts } from '../context/ProductContext.jsx'; // Assuming this context fetches products
import Chatbot from '../components/Chatbot.jsx';

// Helper component for Add to Cart button and quantity selector
const AddToCartButton = ({ product, setAddedItem }) => { // Added setAddedItem prop
    // Ensure useCart hook provides addItemToCart and updateItemQuantity
    const { cartItems, addItemToCart, updateItemQuantity } = useCart();
    // Use product._id for consistency with MongoDB and CartContext
    const itemInCart = cartItems.find(item => item._id === product._id);
    const quantity = itemInCart ? itemInCart.quantity : 0;

    const handleAddToCart = () => {
        addItemToCart(product); // Pass the entire product object
        setAddedItem(product); // Set item for notification
    };

    const handleUpdateQuantity = (newQuantity) => {
        updateItemQuantity(product._id, newQuantity); // Pass product._id and new quantity
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

// Notification component for when an item is added to cart
const AddToCartNotification = ({ item }) => {
    return (
        <div className={styles.notification}>
            <FiCheckCircle className={styles.notificationIcon} />
            {/* Use item.image as per your provided code, with robust placeholder */}
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


const ProductsPage = () => {
  const { products: allProducts } = useProducts(); // Assuming useProducts fetches initial product data
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');
  const [addedItem, setAddedItem] = useState(null); // State to trigger notification

  // Effect for showing the "Added to Cart" notification
  useEffect(() => {
    if (addedItem) {
      const timer = setTimeout(() => setAddedItem(null), 3000); // Notification disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [addedItem]);

  // Memoized filtering and sorting logic for products
  const filteredAndSortedProducts = useMemo(() => {
    let products = allProducts; // Start with all products from context

    // Filter by search term
    if (searchTerm) {
      products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filter by category
    if (activeCategory !== 'All') {
      products = products.filter(p => p.category === activeCategory);
    }

    // Sort products
    if (sortBy === 'Price: Low to High') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      products.sort((a, b) => b.price - a.price);
    }
    // No specific sort for 'Newest First' implies default order or backend-sorted order

    return products;
  }, [searchTerm, activeCategory, sortBy, allProducts]); // Dependencies for memoization

  return (
    <div className={styles.pageContainer}>
      {/* Conditionally render the notification */}
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
          {/* Map over filtered and sorted products */}
          {filteredAndSortedProducts.map(product => (
            // Use product._id for the key for consistency with MongoDB
            <div key={product._id} className={styles.productCard}>
              {/* Product Image with robust placeholder */}
              <img
                src={product.image || `https://placehold.co/300x200/E0E0E0/333333?text=NoImg`}
                alt={product.name}
                className={styles.productImage}
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x200/E0E0E0/333333?text=NoImg`; }}
              />
              <div className={styles.productDetails}>
                <span className={styles.companyName}>{product.companyName}</span>
                <h3>{product.name}</h3>
                <p className={styles.productStock}>{product.stock > 0 ? `${product.stock} kg available` : 'Out of Stock'}</p>
                <p className={styles.productPrice}>₹{product.price ? product.price.toFixed(2) : 'N/A'}</p>
              </div>
              {/* Pass setAddedItem to AddToCartButton */}
              <AddToCartButton product={product} setAddedItem={setAddedItem} />
            </div>
          ))}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default ProductsPage;
