import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './PaymentPage.module.css'; // Retained
import { FiCreditCard, FiUser, FiCalendar, FiLock, FiCheckCircle, FiSmartphone, FiDollarSign } from 'react-icons/fi';

// These constants hold the actual numeric values for calculation
// In a real app, delivery fees might come from backend API based on location/distance
const STANDARD_DELIVERY_FEE = 40.00;
const INSTANT_DELIVERY_FEE = 100.00;

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Redirect if user lands here without an order
  useEffect(() => {
    if (!state || !state.order) {
      navigate('/cart');
    }
  }, [state, navigate]);
  
  // Handle redirection after COD success or any payment success
  useEffect(() => {
    if (isOrderPlaced) {
      const timer = setTimeout(() => {
        clearCart(); // Clear cart after successful order
        navigate('/products'); // Redirect to products page
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isOrderPlaced, navigate, clearCart]); // Added clearCart to dependency array

  if (!state || !state.order) {
    return null; // Render nothing while redirecting
  }

  const { order } = state;

  const handlePayment = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      // Replace alert with a more user-friendly message box or state for error display
      alert('Please select a payment method.');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing (replace with actual API call to backend for order creation)
    setTimeout(() => {
      setIsProcessing(false);
      setIsOrderPlaced(true);
      // Cart clearing is now handled by the useEffect above, after order is placed
    }, 2000);
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">Your order #{Math.floor(Math.random() * 100000)} has been confirmed.</p>
          <p className="text-gray-500 text-sm">You will be redirected to the shopping page shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Payment Options Column */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Payment Method</h2>
            
            <div className="space-y-4 mb-6">
              <div
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-primary-green ring-2 ring-primary-green bg-light-green' : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <FiCreditCard size={24} className="text-gray-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-800">Credit/Debit Card</h4>
                  <p className="text-sm text-gray-500">Pay with your card.</p>
                </div>
              </div>
              <div
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-primary-green ring-2 ring-primary-green bg-light-green' : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setPaymentMethod('upi')}
              >
                <FiSmartphone size={24} className="text-gray-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-800">UPI</h4>
                  <p className="text-sm text-gray-500">Pay with any UPI app.</p>
                </div>
              </div>
              <div
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-primary-green ring-2 ring-primary-green bg-light-green' : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setPaymentMethod('cod')}
              >
                <FiDollarSign size={24} className="text-gray-600 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-800">Cash on Delivery</h4>
                  <p className="text-sm text-gray-500">Pay when your order arrives.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              {paymentMethod === 'card' && (
                <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-3">
                  <h4 className="text-lg font-semibold text-gray-800">Enter Card Details</h4>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Name on Card" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green" />
                  </div>
                  <div className="relative">
                    <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Card Number (XXXX XXXX XXXX XXXX)" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green" />
                  </div>
                  <div className="flex gap-4">
                    <div className="relative w-1/2">
                      <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="MM / YY" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green" />
                    </div>
                    <div className="relative w-1/2">
                      <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="CVC" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green" />
                    </div>
                  </div>
                </div>
              )}
              {paymentMethod === 'upi' && (
                <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-3">
                  <h4 className="text-lg font-semibold text-gray-800">Enter UPI ID</h4>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="yourname@bank" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green" />
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-primary-green text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-opacity-75"
                disabled={!paymentMethod || isProcessing}
              >
                {isProcessing ? 'Processing...' : (paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${order.total.toFixed(2)}`)}
              </button>
            </form>
          </div>

          {/* Order Summary Column */}
          <div className="lg:w-1/3 p-6 bg-gray-50 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {order.items.map(item => (
                <div key={item._id} className="flex justify-between text-gray-700 text-sm"> {/* Use item._id */}
                  <span>{item.name} (x{item.quantity})</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-gray-700 border-t pt-3 mt-3">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery</span>
                <span>₹{order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-3 mt-3">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
