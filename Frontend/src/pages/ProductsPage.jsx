import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductsPage.module.css';
import { FiSearch, FiFilter, FiShoppingCart, FiCheckCircle, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import Chatbot from '../components/Chatbot.jsx';

const AddToCartButton = ({ product }) => {
    const { cartItems, addToCart, updateQuantity } = useCart();
    const itemInCart = cartItems.find(item => item.id === product.id);
    const quantity = itemInCart ? itemInCart.quantity : 0;

    if (quantity === 0) {
        return (
            <button 
                className={styles.addToCartBtn} 
                onClick={() => addToCart(product)} 
                disabled={product.stock <= 0}
            >
                {product.stock > 0 ? <><FiShoppingCart /> Add to Cart</> : 'Out of Stock'}
            </button>
        );
    }

    return (
        <div className={styles.quantitySelector}>
            <button onClick={() => updateQuantity(product.id, quantity - 1)}><FiMinus /></button>
            <span>{quantity}</span>
            <button onClick={() => updateQuantity(product.id, quantity + 1)} disabled={quantity >= product.stock}><FiPlus /></button>
        </div>
    );
};

const ProductsPage = () => {
  const { products: allProducts } = useProducts();
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
    if (searchTerm) products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (activeCategory !== 'All') products = products.filter(p => p.category === activeCategory);
    if (sortBy === 'Price: Low to High') products.sort((a, b) => a.price - b.price);
    else if (sortBy === 'Price: High to Low') products.sort((a, b) => b.price - a.price);
    return products;
  }, [searchTerm, activeCategory, sortBy, allProducts]);

  return (
    <div className={styles.pageContainer}>
      {addedItem && <AddToCartNotification item={addedItem} />}
      <div className={styles.main}>
        <div className={styles.controls}>
          <div className={styles.searchBar}><FiSearch /><input type="text" placeholder="Search fresh produce..." onChange={e => setSearchTerm(e.target.value)} /></div>
          <div className={styles.filterSort}><FiFilter className={styles.filterIcon} /><select className={styles.sortDropdown} onChange={e => setSortBy(e.target.value)}><option>Newest First</option><option>Price: Low to High</option><option>Price: High to Low</option></select></div>
        </div>
        <div className={styles.filters}>
          <div className={styles.categoryFilters}>
            {['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Herbs & Spices', 'Other'].map(cat => (
              <button key={cat} className={activeCategory === cat ? styles.active : ''} onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>
        </div>
        <div className={styles.productGrid}>
          {filteredAndSortedProducts.map(product => (
            <div key={product.id} className={styles.productCard}>
              <img src={product.image} alt={product.name} className={styles.productImage} />
              <div className={styles.productDetails}>
                <span className={styles.companyName}>{product.companyName}</span>
                <h3>{product.name}</h3>
                <p className={styles.productStock}>{product.stock > 0 ? `${product.stock} kg available` : 'Out of Stock'}</p>
                <p className={styles.productPrice}>₹{product.price.toFixed(2)}</p>
              </div>
              <AddToCartButton product={product} />
            </div>
          ))}
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

const AddToCartNotification = ({ item }) => {
    return (
        <div className={styles.notification}>
            <FiCheckCircle className={styles.notificationIcon} />
            <img src={item.image} alt={item.name} className={styles.notificationImg} />
            <div className={styles.notificationText}><strong>Added to Cart</strong><p>{item.name}</p></div>
            <Link to="/cart" className={styles.notificationBtn}>View Cart</Link>
        </div>
    );
};

export default ProductsPage;
