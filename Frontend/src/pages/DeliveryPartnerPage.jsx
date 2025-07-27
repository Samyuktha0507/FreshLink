import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DeliveryPartnerPage.module.css';
import { FiUser, FiPhone, FiCreditCard, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const DeliveryPartnerPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    aadhaar: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (formData.name && formData.contact && formData.aadhaar.length === 12) {
      console.log('Submitting form data:', formData);
      setIsSubmitted(true);
    } else {
      alert('Please fill all fields correctly. Aadhaar number must be 12 digits.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Link to="/" className={styles.backToHome}>
        <FiArrowLeft /> Back to Home
      </Link>
      <div className={styles.formCard}>
        {!isSubmitted ? (
          <>
            <div className={styles.cardHeader}>
              <h2>Join as a Delivery Partner</h2>
              <p>Fill in your details below to get started.</p>
            </div>
            <form onSubmit={handleSubmit} className={styles.regForm}>
              <div className={styles.inputGroup}>
                <FiUser />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <FiPhone />
                <input
                  type="tel"
                  name="contact"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <FiCreditCard />
                <input
                  type="text"
                  name="aadhaar"
                  placeholder="Aadhaar Card Number (12 digits)"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  maxLength="12"
                  pattern="\d{12}"
                  required
                />
              </div>
              <button type="submit" className={styles.submitBtn}>Submit Details</button>
            </form>
          </>
        ) : (
          <div className={styles.successMessage}>
            <FiCheckCircle className={styles.successIcon} />
            <h2>Thank you for your enthusiasm!</h2>
            <p>We have received your details and will reach out to you soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryPartnerPage;
