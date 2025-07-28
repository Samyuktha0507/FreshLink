import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios'; // Import axios

const ProductContext = createContext(null);

// Get the base URL from the Vercel Environment Variable
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create an axios instance for product-related API calls
const productApi = axios.create({
  baseURL: API_BASE_URL,
});

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]); // Start with an empty array, data will be fetched
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to set authorization header for product API calls
  // This assumes the user token is available in localStorage
  const setAuthHeader = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      productApi.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    } else {
      // If no user is logged in, remove the header (for public product fetching)
      delete productApi.defaults.headers.common['Authorization'];
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      setAuthHeader(); // Ensure auth header is set before fetching

      try {
        // Assuming your backend has a route like /api/products for fetching all products
        const response = await productApi.get('/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to fetch products.');
        setProducts([]); // Clear products on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  const addProduct = async (productData) => {
    setAuthHeader(); // Ensure auth header is set
    try {
      // Assuming your backend has a route like /api/products for adding products
      const response = await productApi.post('/api/products', productData);
      setProducts((prev) => [response.data, ...prev]); // Add the new product returned from backend
      return response.data;
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || 'Failed to add product.');
      throw err; // Re-throw to allow component to handle
    }
  };

  const editProduct = async (productId, updatedData) => {
    setAuthHeader(); // Ensure auth header is set
    try {
      // Assuming your backend has a route like /api/products/:id for updating products
      const response = await productApi.put(`/api/products/${productId}`, updatedData);
      setProducts((prev) => prev.map((p) => (p.id === productId ? response.data : p))); // Update with data from backend
      return response.data;
    } catch (err) {
      console.error('Error editing product:', err);
      setError(err.response?.data?.message || 'Failed to edit product.');
      throw err;
    }
  };

  const deleteProduct = async (productId) => {
    setAuthHeader(); // Ensure auth header is set
    try {
      // Assuming your backend has a route like /api/products/:id for deleting products
      await productApi.delete(`/api/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p.id !== productId)); // Remove from local state
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.message || 'Failed to delete product.');
      throw err;
    }
  };

  // This function might need backend integration depending on its actual use.
  // For now, it only updates local state. If stock changes need to be persistent,
  // it would also require an API call (e.g., a PUT request to update product stock).
  const updateProductStock = (productId, quantityChange) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + quantityChange } : p
      )
    );
    // TODO: If stock changes need to persist, add an API call here.
  };

  const value = { products, loading, error, addProduct, editProduct, deleteProduct, updateProductStock };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  return useContext(ProductContext);
};
