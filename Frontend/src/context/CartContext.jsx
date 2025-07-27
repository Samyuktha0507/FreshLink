import React, { createContext, useState, useContext } from 'react';
import { useProducts } from './ProductContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { updateProductStock } = useProducts(); // Get the stock update function

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        updateProductStock(product.id, -1); // Decrease stock by 1
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      updateProductStock(product.id, -1); // Decrease stock by 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    let quantityChange = 0;
    setCartItems((prevItems) => {
        const itemToUpdate = prevItems.find(item => item.id === productId);
        if (itemToUpdate) {
            quantityChange = newQuantity - itemToUpdate.quantity;
        }
        return prevItems
          .map((item) => (item.id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item))
          .filter((item) => item.quantity > 0);
      }
    );
    if(quantityChange !== 0) {
        updateProductStock(productId, -quantityChange); // Update stock by the difference
    }
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find(item => item.id === productId);
    if (itemToRemove) {
        updateProductStock(productId, itemToRemove.quantity); // Return all stock to inventory
    }
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };
  
  const clearCart = () => {
    // Return all items' stock before clearing
    cartItems.forEach(item => {
        updateProductStock(item.id, item.quantity);
    });
    setCartItems([]);
  };

  const value = { cartItems, addToCart, updateQuantity, removeFromCart, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
