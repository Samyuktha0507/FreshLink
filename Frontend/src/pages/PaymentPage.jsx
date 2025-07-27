import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './PaymentPage.module.css';
import { FiCreditCard, FiUser, FiCalendar, FiLock, FiCheckCircle, FiSmartphone, FiDollarSign } from 'react-icons/fi';

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
  
  // Handle redirection after COD success
  useEffect(() => {
    if (isOrderPlaced && paymentMethod === 'cod') {
      const timer = setTimeout(() => {
        clearCart();
        navigate('/products');
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isOrderPlaced, paymentMethod, navigate, clearCart]);

  if (!state || !state.order) {
    return null; // Render nothing while redirecting
  }

  const { order } = state;

  const handlePayment = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsOrderPlaced(true);
      if(paymentMethod !== 'cod') {
        clearCart();
      }
    }, 2000);
  };

  if (isOrderPlaced) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
            <div className={styles.successMessage}>
                <FiCheckCircle className={styles.successIcon} />
                <h2>Order Placed Successfully!</h2>
                <p>Your order #{Math.floor(Math.random() * 100000)} has been confirmed.</p>
                {paymentMethod === 'cod' ? (
                    <p>You will be redirected to the shopping page shortly.</p>
                ) : (
                    <button onClick={() => navigate('/products')} className={styles.payBtn}>Continue Shopping</button>
                )}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.paymentLayout}>
          <div className={styles.paymentOptions}>
            <h2>Choose Payment Method</h2>
            
            <div className={`${styles.optionCard} ${paymentMethod === 'card' ? styles.selected : ''}`} onClick={() => setPaymentMethod('card')}>
                <FiCreditCard /><div><h4>Credit/Debit Card</h4><p>Pay with your card.</p></div>
            </div>
            <div className={`${styles.optionCard} ${paymentMethod === 'upi' ? styles.selected : ''}`} onClick={() => setPaymentMethod('upi')}>
                <FiSmartphone /><div><h4>UPI</h4><p>Pay with any UPI app.</p></div>
            </div>
            <div className={`${styles.optionCard} ${paymentMethod === 'cod' ? styles.selected : ''}`} onClick={() => setPaymentMethod('cod')}>
                <FiDollarSign /><div><h4>Cash on Delivery</h4><p>Pay when your order arrives.</p></div>
            </div>

            <form onSubmit={handlePayment}>
                {paymentMethod === 'card' && (
                    <div className={styles.detailsSection}>
                        <h4>Enter Card Details</h4>
                        <div className={styles.inputGroup}><FiUser /><input type="text" placeholder="Name on Card" required /></div>
                        <div className={styles.inputGroup}><FiCreditCard /><input type="text" placeholder="Card Number (XXXX XXXX XXXX XXXX)" required /></div>
                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}><FiCalendar /><input type="text" placeholder="MM / YY" required /></div>
                            <div className={styles.inputGroup}><FiLock /><input type="text" placeholder="CVC" required /></div>
                        </div>
                    </div>
                )}
                {paymentMethod === 'upi' && (
                    <div className={styles.detailsSection}>
                        <h4>Enter UPI ID</h4>
                        <div className={styles.inputGroup}><FiUser /><input type="text" placeholder="yourname@bank" required /></div>
                    </div>
                )}
                <button type="submit" className={styles.payBtn} disabled={!paymentMethod || isProcessing}>
                  {isProcessing ? 'Processing...' : (paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${order.total.toFixed(2)}`)}
                </button>
            </form>
          </div>

          <div className={styles.summary}>
            <h3>Order Summary</h3>
            {order.items.map(item => (
                <div key={item.id} className={styles.summaryItem}><span>{item.name} (x{item.quantity})</span><span>₹{(item.price * item.quantity).toFixed(2)}</span></div>
            ))}
            <div className={styles.summaryRow}><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
            <div className={styles.summaryRow}><span>Delivery</span><span>₹{order.deliveryFee.toFixed(2)}</span></div>
            <div className={styles.summaryTotal}><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
