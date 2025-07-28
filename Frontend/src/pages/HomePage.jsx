import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import { FaStore, FaLeaf, FaTruck, FaShoppingCart, FaFilter, FaMoneyBillWave, FaHistory, FaRobot, FaPhone, FaEnvelope } from 'react-icons/fa';

const HomePage = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.homeContainer}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>🌿 FreshLink</div>
          <div className={styles.navLinks}>
            <a onClick={() => scrollToSection('about')}>About</a>
            <a onClick={() => scrollToSection('features')}>Features</a>
            <a onClick={() => scrollToSection('contact')}>Contact</a>
          </div>
        </nav>
        <main className={styles.mainContent}>
          <h1>
            Connect. Trade. <span className={styles.highlight}>Grow</span>
          </h1>
          <p>
            Connect food stall vendors with wholesale producers. Get fresh
            ingredients delivered fast, manage your business better.
          </p>
          <div className={styles.cardContainer}>
            <div className={styles.card}>
              <FaStore className={styles.icon} />
              <h3>I'm a Vendor</h3>
              <p>Buy wholesale produce for my food stall</p>
              {/* FIX: Change link to pass 'vendor' as the role parameter */}
              <Link to="/login/vendor">
                <button className={`${styles.btn} ${styles.vendorBtn}`}>
                  Join as Vendor
                </button>
              </Link>
            </div>
            <div className={styles.card}>
              <FaLeaf className={styles.icon} />
              <h3>I'm a Producer</h3>
              <p>Sell my produce to food vendors</p>
              <Link to="/login/producer">
                <button className={`${styles.btn} ${styles.producerBtn}`}>
                  Join as Producer
                </button>
              </Link>
            </div>
            <div className={styles.card}>
              <FaTruck className={styles.icon} />
              <h3>I'm a Delivery Partner</h3>
              <p>Deliver fresh produce and earn</p>
              <Link to="/delivery-partner">
                <button className={`${styles.btn} ${styles.deliveryBtn}`}>
                  Join as Delivery Partner
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* About Us Section */}
      <section id="about" className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>🌱 About Us – FreshLink</h2>
        <p className={styles.sectionText}>
          At FreshLink, we believe that every great meal begins with a trusted connection.
        </p>
        <p className={styles.sectionText}>
          We’re a purpose-driven platform built to empower local street food vendors by connecting them directly with reliable producers and wholesale suppliers — no middlemen, no inflated prices, just fresh, traceable produce at fair rates.
        </p>
        <p className={styles.sectionText}>
          Designed with the unique needs of small-scale food stall owners in mind, FreshLink makes it easier than ever to source raw materials transparently, make informed purchasing decisions, and manage operations with simplicity.
        </p>
        <p className={styles.sectionText}>
          Whether you’re frying samosas on a bustling street corner or grilling kebabs for a midnight crowd — we’ve got your back with timely delivery options, AI-powered assistance, and role-based dashboards that put everything you need at your fingertips.
        </p>
        <h3 className={styles.missionTitle}>Our mission?</h3>
        <p className={styles.missionText}>
          To make India's vibrant street food ecosystem stronger, smarter, and more sustainable — one link at a time.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className={`${styles.infoSection} ${styles.featuresSection}`}>
        <h2 className={styles.sectionTitle}>🔧 Features – What FreshLink Offers</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <FaShoppingCart className={styles.featureIcon} />
            <h4>Smart Product Listings</h4>
            <p>View a wide variety of produce with tier-based quality badges, pricing, images, and delivery options.</p>
          </div>
          <div className={styles.featureItem}>
            <FaFilter className={styles.featureIcon} />
            <h4>Advanced Filters & Sorting</h4>
            <p>Sort by price, delivery method (Manual Pickup, Instant Delivery, Normal Delivery), or quality certification (Tier 1/Tier 2).</p>
          </div>
          <div className={styles.featureItem}>
            <FaMoneyBillWave className={styles.featureIcon} />
            <h4>Seamless Checkout & Payments</h4>
            <p>Integrated Razorpay payments with support for Cash on Delivery, auto-calculated delivery fees, and detailed billing.</p>
          </div>
          <div className={styles.featureItem}>
            <FaHistory className={styles.featureIcon} />
            <h4>Order Tracking & History</h4>
            <p>Live order updates with estimated arrival times, Order ID traceability, and a “Repeat Order” option to refill your cart in a click.</p>
          </div>
          <div className={styles.featureItem}>
            <FaRobot className={styles.featureIcon} />
            <h4>Chatbot Assistance</h4>
            <p>Our smart AI chatbot helps you navigate products, order queries, and account issues — with both text and voice input.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer id="contact" className={styles.contactSection}>
        <h2 className={styles.sectionTitle}>Contact Us</h2>
        <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
                <FaPhone />
                <a href="tel:1234567890">1234567890</a>
            </div>
            <div className={styles.contactItem}>
                <FaEnvelope />
                <a href="mailto:FreshLink@blablah.com">FreshLink@blablah.com</a>
            </div>
        </div>
        <div className={styles.footerText}>
          © 2025 FreshLink. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
