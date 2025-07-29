import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './CartPage.module.css'; // Retained
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiTruck, FiPackage, FiZap } from 'react-icons/fi';

// These constants hold the actual numeric values for calculation
// In a real app, delivery fees might come from backend API based on location/distance
const STANDARD_DELIVERY_FEE = 40.00;
const INSTANT_DELIVERY_FEE = 100.00;

const CartPage = () => {
  // Renamed `removeFromCart` to `removeItemFromCart` to match CartContext
  const { cartItems, updateItemQuantity, removeItemFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); // To get current location state if any
  const [deliveryOption, setDeliveryOption] = useState('pickup');

  // Calculate subtotal dynamically from cartItems
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  let deliveryFee = 0;
  if (deliveryOption === 'standard') {
    deliveryFee = STANDARD_DELIVERY_FEE;
  } else if (deliveryOption === 'instant') {
    deliveryFee = INSTANT_DELIVERY_FEE;
  }

  const total = subtotal + deliveryFee;

  const handleProceedToPayment = () => {
    if (cartItems.length > 0) {
      navigate('/payment', {
        state: {
          order: {
            items: cartItems,
            subtotal: subtotal, // Pass calculated subtotal
            deliveryFee: deliveryFee, // Pass calculated delivery fee
            total: total, // Pass calculated total
            deliveryType: deliveryOption
          }
        }
      });
    } else {
      // Optional: Show a message if cart is empty
      alert('Your cart is empty. Please add items before proceeding to payment.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600">
            <FiShoppingCart className="text-6xl text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-3">Your Cart is Empty</h2>
            <p className="mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products">
              <button className="px-6 py-3 bg-primary-green text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-opacity-75">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="space-y-6">
                {cartItems.map(item => (
                  <div key={item._id} className="flex flex-col sm:flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 mb-4 sm:mb-0 sm:mr-6">
                      <img
                        src={item.image || `https://placehold.co/96x96/E0E0E0/333333?text=NoImg`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/96x96/E0E0E0/333333?text=NoImg`; }}
                      />
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-gray-600 mb-2">₹{item.price ? item.price.toFixed(2) : 'N/A'}</p>
                      <div className="flex items-center justify-center sm:justify-start space-x-2">
                        <button
                          onClick={() => updateItemQuantity(item._id, item.quantity - 1)}
                          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <FiMinus size={20} />
                        </button>
                        <span className="text-lg font-medium text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock} // Disable if stock limit reached
                          className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <FiPlus size={20} />
                        </button>
                        <button
                          onClick={() => removeItemFromCart(item._id)}
                          className="ml-4 p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-auto text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Delivery Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      deliveryOption === 'pickup' ? 'border-primary-green ring-2 ring-primary-green bg-light-green' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setDeliveryOption('pickup')}
                  >
                    <FiPackage size={30} className="text-gray-600 mb-2" />
                    <h4 className="font-semibold text-gray-800">Manual Pickup</h4>
                    <p className="text-sm text-gray-500 text-center">Collect your order directly from the source.</p>
                    <span className="font-bold text-green-600 mt-2">FREE</span>
                  </div>
                  <div
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      deliveryOption === 'standard' ? 'border-primary-green ring-2 ring-primary-green bg-light-green' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setDeliveryOption('standard')}
                  >
                    <FiTruck size={30} className="text-gray-600 mb-2" />
                    <h4 className="font-semibold text-gray-800">Standard Delivery</h4>
                    <p className="text-sm text-gray-500 text-center">Delivered from the warehouse to your location.</p>
                    <span className="font-bold text-gray-700 mt-2">₹{STANDARD_DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  <div
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      deliveryOption === 'instant' ? 'border-primary-green ring-2 ring-primary-green bg-light-green' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setDeliveryOption('instant')}
                  >
                    <FiZap size={30} className="text-gray-600 mb-2" />
                    <h4 className="font-semibold text-gray-800">Instant Delivery</h4>
                    <p className="text-sm text-gray-500 text-center">Get your order delivered within 2 hours.</p>
                    <span className="font-bold text-gray-700 mt-2">₹{INSTANT_DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 p-6 bg-white rounded-xl shadow-md lg:sticky lg:top-8 self-start">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-3 mt-3">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button
                className="w-full px-6 py-3 bg-primary-green text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-opacity-75"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
