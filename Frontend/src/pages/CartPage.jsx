import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './CartPage.module.css';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiTruck, FiPackage, FiZap } from 'react-icons/fi';

// These constants hold the actual numeric values for calculation
const STANDARD_DELIVERY_FEE = 40.00;
const INSTANT_DELIVERY_FEE = 100.00;

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [deliveryOption, setDeliveryOption] = useState('pickup');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // This variable will hold the numeric fee for calculation
  let deliveryFee = 0;
  if (deliveryOption === 'standard') {
    deliveryFee = STANDARD_DELIVERY_FEE;
  } else if (deliveryOption === 'instant') {
    deliveryFee = INSTANT_DELIVERY_FEE;
  }

  // The total is now calculated correctly using numbers
  const total = subtotal + deliveryFee;

  const handleProceedToPayment = () => {
    if (cartItems.length > 0) {
      navigate('/payment', { state: { order: { items: cartItems, subtotal, deliveryFee, total, deliveryOption } } });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.cartContainer}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <FiShoppingCart className={styles.cartIcon} />
            <h2>Your Cart is Empty</h2>
            <Link to="/products"><button className={styles.shopButton}>Start Shopping</button></Link>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            <div className={styles.leftColumn}>
              <div className={styles.cartItems}>
                {cartItems.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                    <div className={styles.itemDetails}><h3>{item.name}</h3><p>₹{item.price.toFixed(2)}</p></div>
                    <div className={styles.quantityControl}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><FiMinus /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}><FiPlus /></button>
                    </div>
                    <p className={styles.itemTotal}>₹{(item.price * item.quantity).toFixed(2)}</p>
                    <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}><FiTrash2 /></button>
                  </div>
                ))}
              </div>
              <div className={styles.deliveryOptions}>
                <h2>Delivery Options</h2>
                <div className={`${styles.optionCard} ${deliveryOption === 'pickup' ? styles.selected : ''}`} onClick={() => setDeliveryOption('pickup')}>
                  <FiPackage /><div><h4>Manual Pickup</h4><p>Collect your order directly from the source.</p></div><span>FREE</span>
                </div>
                <div className={`${styles.optionCard} ${deliveryOption === 'standard' ? styles.selected : ''}`} onClick={() => setDeliveryOption('standard')}>
                  <FiTruck /><div><h4>Standard Delivery</h4><p>Delivered from the warehouse to your location.</p></div><span className={styles.deliveryChargeText}>Charges Apply</span>
                </div>
                <div className={`${styles.optionCard} ${deliveryOption === 'instant' ? styles.selected : ''}`} onClick={() => setDeliveryOption('instant')}>
                  <FiZap /><div><h4>Instant Delivery</h4><p>Get your order delivered within 2 hours.</p></div><span className={styles.deliveryChargeText}>Charges Apply</span>
                </div>
              </div>
            </div>
            <div className={styles.orderSummary}>
              <h2>Order Summary</h2>
              <div className={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className={styles.summaryRow}><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
              <div className={styles.summaryTotal}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
              <button className={styles.checkoutBtn} onClick={handleProceedToPayment}>Proceed to Payment</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
