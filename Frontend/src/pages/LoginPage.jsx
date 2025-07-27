import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './LoginPage.module.css';
import { FiUser, FiLock, FiMail, FiArrowLeft } from 'react-icons/fi';

const LoginPage = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
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
        await register({ ...formData, role });
      }

      // Redirect after successful login/register
      if (role === 'vendor') navigate('/products');
      else if (role === 'producer') navigate('/dashboard');
      else navigate('/');

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const pageTitle = isLogin ? 'Login' : 'Sign Up';
  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

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
