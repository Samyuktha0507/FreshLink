import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css'; // Retained
import { FaStore, FaLeaf, FaTruck, FaShoppingCart, FaFilter, FaMoneyBillWave, FaHistory, FaRobot, FaPhone, FaEnvelope } from 'react-icons/fa';

const HomePage = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center py-4">
          <div className="text-3xl font-bold text-primary-green">🌿 FreshLink</div>
          <div className="flex space-x-6">
            <a onClick={() => scrollToSection('about')} className="text-lg hover:text-primary-green transition-colors cursor-pointer">About</a>
            <a onClick={() => scrollToSection('features')} className="text-lg hover:text-primary-green transition-colors cursor-pointer">Features</a>
            <a onClick={() => scrollToSection('contact')} className="text-lg hover:text-primary-green transition-colors cursor-pointer">Contact</a>
          </div>
        </nav>

        <main className="text-center py-20">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Connect. Trade. <span className="text-primary-green">Grow</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
            Connect food stall vendors with wholesale producers. Get fresh
            ingredients delivered fast, manage your business better.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center w-full md:w-80 transform transition-transform hover:scale-105">
              <FaStore className="text-5xl text-primary-yellow mb-4" />
              <h3 className="text-2xl font-bold mb-2">I'm a Vendor</h3>
              <p className="text-gray-600 mb-6">Buy wholesale produce for my food stall</p>
              <Link to="/login/vendor" className="w-full">
                <button className="w-full bg-primary-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md">
                  Join as Vendor
                </button>
              </Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center w-full md:w-80 transform transition-transform hover:scale-105">
              <FaLeaf className="text-5xl text-primary-green mb-4" />
              <h3 className="text-2xl font-bold mb-2">I'm a Producer</h3>
              <p className="text-gray-600 mb-6">Sell my produce to food vendors</p>
              <Link to="/login/producer" className="w-full">
                <button className="w-full bg-primary-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md">
                  Join as Producer
                </button>
              </Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center w-full md:w-80 transform transition-transform hover:scale-105">
              <FaTruck className="text-5xl text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-2">I'm a Delivery Partner</h3>
              <p className="text-gray-600 mb-6">Deliver fresh produce and earn</p>
              <Link to="/delivery-partner" className="w-full">
                <button className="w-full bg-primary-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md">
                  Join as Delivery Partner
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* About Us Section */}
      <section id="about" className="bg-light-green py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">🌱 About Us – FreshLink</h2>
          <p className="text-lg leading-relaxed mb-4">
            At FreshLink, we believe that every great meal begins with a trusted connection.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            We’re a purpose-driven platform built to empower local street food vendors by connecting them directly with reliable producers and wholesale suppliers — no middlemen, no inflated prices, just fresh, traceable produce at fair rates.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            Designed with the unique needs of small-scale food stall owners in mind, FreshLink makes it easier than ever to source raw materials transparently, make informed purchasing decisions, and manage operations with simplicity.
          </p>
          <p className="text-lg leading-relaxed mb-8">
            Whether you’re frying samosas on a bustling street corner or grilling kebabs for a midnight crowd — we’ve got your back with timely delivery options, AI-powered assistance, and role-based dashboards that put everything you need at your fingertips.
          </p>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Our mission?</h3>
          <p className="text-xl font-semibold text-primary-green">
            To make India's vibrant street food ecosystem stronger, smarter, and more sustainable — one link at a time.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-12">🔧 Features – What FreshLink Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 rounded-xl shadow-md bg-gray-50 transform transition-transform hover:scale-105">
              <FaShoppingCart className="text-5xl text-primary-yellow mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Smart Product Listings</h4>
              <p className="text-gray-600 text-center">View a wide variety of produce with tier-based quality badges, pricing, images, and delivery options.</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl shadow-md bg-gray-50 transform transition-transform hover:scale-105">
              <FaFilter className="text-5xl text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Advanced Filters & Sorting</h4>
              <p className="text-gray-600 text-center">Sort by price, delivery method (Manual Pickup, Instant Delivery, Normal Delivery), or quality certification (Tier 1/Tier 2).</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl shadow-md bg-gray-50 transform transition-transform hover:scale-105">
              <FaMoneyBillWave className="text-5xl text-green-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Seamless Checkout & Payments</h4>
              <p className="text-gray-600 text-center">Integrated Razorpay payments with support for Cash on Delivery, auto-calculated delivery fees, and detailed billing.</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl shadow-md bg-gray-50 transform transition-transform hover:scale-105">
              <FaHistory className="text-5xl text-purple-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Order Tracking & History</h4>
              <p className="text-gray-600 text-center">Live order updates with estimated arrival times, Order ID traceability, and a “Repeat Order” option to refill your cart in a click.</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl shadow-md bg-gray-50 transform transition-transform hover:scale-105">
              <FaRobot className="text-5xl text-red-600 mb-4" />
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Chatbot Assistance</h4>
              <p className="text-gray-600 text-center">Our smart AI chatbot helps you navigate products, order queries, and account issues — with both text and voice input.</p>
            </div>
            {/* Placeholder to keep grid even if needed, or remove if only 5 features */}
            <div className="hidden md:flex flex-col items-center p-6 rounded-xl bg-transparent"></div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <footer id="contact" className="bg-dark-blue py-12 px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8">
          <div className="flex items-center gap-3 text-lg">
            <FaPhone className="text-primary-yellow" />
            <a href="tel:1234567890" className="hover:underline">1234567890</a>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <FaEnvelope className="text-primary-yellow" />
            <a href="mailto:FreshLink@blablah.com" className="hover:underline">FreshLink@blablah.com</a>
          </div>
        </div>
        <div className="text-gray-400 text-sm">
          © 2025 FreshLink. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
