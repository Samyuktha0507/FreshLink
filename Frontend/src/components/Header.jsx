import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import styles from './Header.module.css'; // Retained
import { FiShoppingCart, FiUser, FiLogOut, FiBox, FiTruck } from 'react-icons/fi'; // Added FiBox, FiTruck for dashboard links

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
    <header className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 bg-white border-b border-gray-200 shadow-sm relative z-10 rounded-b-lg">
      <div className="text-xl sm:text-2xl font-bold text-primary-green">
        <Link to="/products">🌿 FreshLink</Link>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Cart Icon */}
        <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <FiShoppingCart className="text-xl sm:text-2xl text-gray-700" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary-yellow text-dark-blue rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* User Profile / Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FiUser className="text-lg sm:text-xl bg-primary-yellow text-white p-1 rounded-full" />
            <span className="text-gray-700 font-medium hidden sm:inline">{user ? user.name : 'Guest'}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl overflow-hidden w-48 z-20">
              {user && (
                <>
                  {user.role === 'producer' && (
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                      <FiBox /> Producer Dashboard
                    </Link>
                  )}
                  {user.role === 'driver' && (
                    <Link to="/driver-dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                      <FiTruck /> Driver Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <FiLogOut /> Logout
                  </button>
                </>
              )}
              {!user && (
                <Link to="/login/vendor" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setDropdownOpen(false)}>
                  <FiUser /> Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
