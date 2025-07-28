import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DeliveryPartnerPage.module.css';
import { FiUser, FiPhone, FiCreditCard, FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi'; // Added FiXCircle for error
import axios from 'axios'; // Import axios

const DeliveryPartnerPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    aadhaar: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(''); // State for custom message
  const [isError, setIsError] = useState(false); // State to track if there's an error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => { // Made async
    e.preventDefault();
    setSubmissionMessage(''); // Clear previous messages
    setIsError(false); // Clear previous error state

    // Basic validation
    if (!formData.name || !formData.contact || formData.aadhaar.length !== 12 || !/^\d+$/.test(formData.aadhaar)) {
      setSubmissionMessage('Please fill all fields correctly. Aadhaar number must be 12 digits and numeric.');
      setIsError(true);
      return;
    }

    try {
      // Get the full backend URL from the Vercel Environment Variable
      const apiUrl = import.meta.env.VITE_API_URL;
      
      // Make the API call to your backend's delivery route
      // Assuming your backend has a route like /api/delivery for partner registration
      const response = await axios.post(`${apiUrl}/api/delivery/register-partner`, formData); 
      
      console.log('Delivery Partner registration successful:', response.data);
      setSubmissionMessage('Thank you for your enthusiasm! We have received your details and will reach out to you soon.');
      setIsSubmitted(true);
      setIsError(false);

    } catch (error) {
      console.error('Error submitting delivery partner form:', error);
      setSubmissionMessage(error.response?.data?.message || 'An error occurred during submission. Please try again.');
      setIsError(true);
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
            {submissionMessage && ( // Display custom message
              <div className={`${styles.messageBox} ${isError ? styles.errorMessage : styles.infoMessage}`}>
                {isError ? <FiXCircle /> : <FiCheckCircle />} {submissionMessage}
              </div>
            )}
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
                  pattern="\d{12}" // Ensures only digits are entered
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
