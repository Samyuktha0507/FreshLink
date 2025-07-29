import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DeliveryPartnerPage.module.css'; // Retained
import { FiUser, FiPhone, FiCreditCard, FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import axios from 'axios';

const DeliveryPartnerPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    aadhaar: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage('');
    setIsError(false);

    // Basic validation
    if (!formData.name || !formData.contact || formData.aadhaar.length !== 12 || !/^\d+$/.test(formData.aadhaar)) {
      setSubmissionMessage('Please fill all fields correctly. Aadhaar number must be 12 digits and numeric.');
      setIsError(true);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <Link to="/" className="absolute top-4 left-4 text-primary-green hover:underline flex items-center gap-1">
        <FiArrowLeft /> Back to Home
      </Link>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Join as a Delivery Partner</h2>
              <p className="text-gray-600">Fill in your details below to get started.</p>
            </div>
            {submissionMessage && (
              <div className={`p-3 mb-4 rounded-lg flex items-center gap-2 ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {isError ? <FiXCircle size={20} /> : <FiCheckCircle size={20} />} {submissionMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                />
              </div>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="contact"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                />
              </div>
              <div className="relative">
                <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="aadhaar"
                  placeholder="Aadhaar Card Number (12 digits)"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  maxLength="12"
                  pattern="\d{12}"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-green text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-opacity-75"
              >
                Submit Details
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank you for your enthusiasm!</h2>
            <p className="text-gray-600">We have received your details and will reach out to you soon.</p>
            <Link to="/" className="mt-6 inline-block text-primary-green hover:underline">
              Go to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryPartnerPage;
