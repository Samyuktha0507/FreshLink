import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Correctly imported
import styles from './LoginPage.module.css';
import { FiUser, FiLock, FiMail, FiArrowLeft } from 'react-icons/fi';

const LoginPage = () => {
  const { role: urlRole } = useParams(); // Renamed to urlRole to avoid conflict
  const navigate = useNavigate();
  const { login, register, user } = useAuth(); // <-- Destructure 'user' from useAuth()

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        // For registration, still use urlRole to set the initial role from the URL
        await register({ ...formData, role: urlRole });
      }

      // --- CRITICAL CHANGE HERE: Use 'user.role' from AuthContext for redirection ---
      // The 'user' object in AuthContext will be updated after successful login/register
      // with the actual role returned by the backend.
      if (user) { // Ensure user object is available
          if (user.role === 'vendor') {
              navigate('/products'); // Redirect to vendor-specific dashboard
          } else if (user.role === 'producer') {
              navigate('/dashboard'); // Redirect to producer-specific dashboard
          } else if (user.role === 'driver') { // Assuming 'driver' is your delivery partner role
              navigate('/driver-dashboard'); // Redirect to driver-specific dashboard
          } else {
              // Fallback for any other roles or if role is missing/unexpected
              navigate('/'); // Or a generic dashboard
          }
      } else {
          // Fallback if user object is somehow not set immediately (though it should be by AuthContext)
          navigate('/');
      }

    } catch (err) {
      // Axios errors have response.data.message
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  // Use urlRole for display purposes
  const pageTitle = isLogin ? 'Login' : 'Sign Up';
  const roleTitle = urlRole.charAt(0).toUpperCase() + urlRole.slice(1);

  return (
    <div className={styles.pageContainer}>
      <Link to="/" className={styles.backToHome}><FiArrowLeft /> Back to Home</Link>
      <div className={styles.loginCard}>
        <div className={styles.cardHeader}>
          <h2>{roleTitle} {pageTitle}</h2>
          <p>Welcome! Please enter your details.</p>
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <FiUser /><input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
            </div>
          )}
          <div className={styles.inputGroup}>
            <FiMail /><input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          </div>
          <div className={styles.inputGroup}>
            <FiLock /><input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          </div>
          <button type="submit" className={styles.submitBtn}>{pageTitle}</button>
        </form>
        <div className={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className={styles.toggleBtn}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
