import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ProductProvider } from './context/ProductContext.jsx';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx'; // Producer Dashboard
import DeliveryPartnerPage from './pages/DeliveryPartnerPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import './index.css'; // Retained
import './App.css'; // Retained

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login/:role', element: <LoginPage /> },
  { path: '/dashboard', element: <DashboardPage /> }, // Producer Dashboard
  { path: '/delivery-partner', element: <DeliveryPartnerPage /> },
  { path: '/payment', element: <PaymentPage /> },
  // Add specific routes for driver dashboard if needed, e.g.,
  // { path: '/driver-dashboard', element: <DriverDashboardPage /> },
  {
    element: <App />, // App component will render Header and Outlet
    children: [
      { path: '/products', element: <ProductsPage /> }, // Vendor shopping page
      { path: '/cart', element: <CartPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider, ProductProvider, and CartProvider should wrap the RouterProvider */}
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);
