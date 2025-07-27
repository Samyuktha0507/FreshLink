import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import styles from './Header.module.css';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/products">🌿 FreshLink</Link>
      </div>
      <div className={styles.actions}>
        <Link to="/cart" className={styles.cartIconContainer}>
          <FiShoppingCart className={styles.cartIcon} />
          {cartItemCount > 0 && (
            <span className={styles.cartBadge}>{cartItemCount}</span>
          )}
        </Link>
        <div className={styles.userProfile} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <FiUser className={styles.userIcon} />
          <span>{user ? user.name : 'Guest'}</span>
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <button onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
