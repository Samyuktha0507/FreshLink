import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './LoginPage.module.css'; // Retained
import { FiUser, FiLock, FiMail, FiArrowLeft } from 'react-icons/fi';

const LoginPage = () => {
  const { role: urlRole } = useParams();
  const navigate = useNavigate();
  const { login, register, user } = useAuth(); // Destructure 'user' from useAuth()

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', contact: '' });
  const [error, setError] = useState('');

  // Effect to redirect if user is already logged in and tries to access login page
  useEffect(() => {
    if (user) { // If user object exists in AuthContext
      console.log('LoginPage useEffect: User already logged in, role:', user.role);
      // Redirect based on current user's role
      if (user.role === 'vendor') {
          navigate('/products');
      } else if (user.role === 'producer') {
          navigate('/dashboard');
      } else if (user.role === 'driver') {
          navigate('/driver-dashboard');
      } else {
          navigate('/');
      }
    }
  }, [user, navigate]); // Rerun when user object or navigate function changes

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        console.log('LoginPage handleSubmit: Attempting login with:', formData.email);
        await login(formData.email, formData.password);
      } else {
        // For registration, use urlRole to set the initial role from the URL
        // Ensure 'contact' is also passed for registration
        const registrationData = { ...formData, role: urlRole, contact: formData.contact };
        console.log('LoginPage handleSubmit: Attempting registration with:', registrationData);
        await register(registrationData);
      }

      // After login/register, the `user` object in AuthContext should be updated.
      // The useEffect above will handle the redirection based on the updated `user` state.
      // We can also add a fallback direct check here, but the useEffect is more robust.
      const loggedInUser = JSON.parse(localStorage.getItem('user')); // Direct check from localStorage

      if (loggedInUser) {
          console.log('LoginPage handleSubmit: Successfully logged in/registered. User object from localStorage:', loggedInUser);
          console.log('LoginPage handleSubmit: User role for redirection:', loggedInUser.role);

          if (loggedInUser.role === 'vendor') {
              navigate('/products');
          } else if (loggedInUser.role === 'producer') {
              navigate('/dashboard');
          } else if (loggedInUser.role === 'driver') {
              navigate('/driver-dashboard');
          } else {
              navigate('/'); // Fallback if user object is somehow not set
          }
      } else {
          console.error('LoginPage handleSubmit: User object not found in localStorage after successful operation.');
          navigate('/'); // Fallback if user object is somehow not set
      }

    } catch (err) {
      console.error('LoginPage handleSubmit: Error during login/registration:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const pageTitle = isLogin ? 'Login' : 'Sign Up';
  const roleTitle = urlRole ? urlRole.charAt(0).toUpperCase() + urlRole.slice(1) : 'User';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Link to="/" className="absolute top-4 left-4 text-primary-green hover:underline flex items-center gap-1">
        <FiArrowLeft /> Back to Home
      </Link>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{roleTitle} {pageTitle}</h2>
          <p className="text-gray-600">Welcome! Please enter your details.</p>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                />
              </div>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="contact"
                  placeholder="Contact Number"
                  onChange={handleChange}
                  required={urlRole === 'driver'} // Make contact required only for drivers/delivery partners
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
                />
              </div>
            </>
          )}
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-green text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-opacity-75"
          >
            {pageTitle}
          </button>
        </form>
        <div className="text-center mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="ml-1 text-primary-green font-medium hover:underline focus:outline-none"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
