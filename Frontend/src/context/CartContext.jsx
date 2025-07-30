import React, { createContext, useState, useContext, useEffect } from 'react';
import { useProducts } from './ProductContext'; // Make sure this path is correct

// Create the Cart Context
const CartContext = createContext();

// Cart Provider component to wrap your application
export const CartProvider = ({ children }) => {
  // Initialize cart state from localStorage or an empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem('cartItems');
      console.log('CartContext: Initializing cart from localStorage:', localCart); // DEBUG
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error("CartContext: Failed to parse cart items from localStorage:", error);
      return [];
    }
  });

  const { updateProductStock } = useProducts(); // Get the stock update function from ProductContext

  // Effect to save cart items to localStorage whenever they change
  useEffect(() => {
    console.log('CartContext: cartItems changed, saving to localStorage:', cartItems); // DEBUG
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error("CartContext: Failed to save cart items to localStorage:", error);
    }
  }, [cartItems]);

  // Function to add an item to the cart
  // product: { _id, name, price, stock, image, ...otherProductDetails }
  const addItemToCart = (product, quantity = 1) => {
    console.log("CartContext: addItemToCart called for product:", product.name, "Quantity:", quantity); // DEBUG
    setCartItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(item => item._id === product._id);
      console.log("CartContext: existingItemIndex:", existingItemIndex); // DEBUG

      if (existingItemIndex > -1) {
        // If item exists, update its quantity
        const updatedItems = [...currentItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
        console.log("CartContext: Item exists, newQuantity:", newQuantity, "Product stock:", product.stock); // DEBUG
        // Prevent adding more than available stock
        if (newQuantity <= product.stock) {
            updatedItems[existingItemIndex].quantity = newQuantity;
            updateProductStock(product._id, -quantity); // Decrease stock by quantity added
            console.log("CartContext: Updated existing item in cart:", updatedItems); // DEBUG
        } else {
            console.warn(`CartContext: Cannot add more ${product.name}. Max stock reached.`);
        }
        return updatedItems;
      } else {
        // If item does not exist, add it with quantity, if stock allows
        console.log("CartContext: Item new, quantity:", quantity, "Product stock:", product.stock); // DEBUG
        if (quantity <= product.stock) {
            updateProductStock(product._id, -quantity); // Decrease stock by quantity added
            const newCart = [...currentItems, { ...product, quantity }];
            console.log("CartContext: Added new item to cart:", newCart); // DEBUG
            return newCart;
        } else {
            console.warn(`CartContext: Cannot add ${product.name}. Not enough stock available.`);
            return currentItems; // Do not add if not enough stock
        }
      }
    });
  };

  // Function to update the quantity of an item
  const updateItemQuantity = (productId, newQuantity) => {
    console.log("CartContext: updateItemQuantity called for productId:", productId, "New quantity:", newQuantity); // DEBUG
    setCartItems(currentItems => {
      return currentItems.map(item => {
        if (item._id === productId) {
          const quantityDifference = newQuantity - item.quantity;
          console.log("CartContext: Quantity difference:", quantityDifference); // DEBUG
          // Only update if new quantity is valid and within stock limits
          if (newQuantity >= 0 && newQuantity <= item.stock) { // Ensure quantity is non-negative and not exceeding product's original stock
            updateProductStock(productId, -quantityDifference); // Adjust stock by the difference
            console.log("CartContext: Updated item quantity in cart:", { ...item, quantity: newQuantity }); // DEBUG
            return { ...item, quantity: newQuantity };
          } else {
            console.warn(`CartContext: Cannot update quantity for ${item.name} to ${newQuantity}. Stock limits apply.`);
            return item; // Return original item if update is invalid
          }
        }
        return item;
      }).filter(item => item.quantity > 0); // Remove item if quantity becomes 0
    });
  };

  // Function to remove an item from the cart
  const removeItemFromCart = (productId) => {
    console.log("CartContext: removeItemFromCart called for productId:", productId); // DEBUG
    setCartItems(currentItems => {
      const itemToRemove = currentItems.find(item => item._id === productId);
      if (itemToRemove) {
          updateProductStock(productId, itemToRemove.quantity); // Return all stock to inventory
          console.log("CartContext: Removed item stock returned:", itemToRemove.quantity); // DEBUG
      }
      const newCart = currentItems.filter(item => item._id !== productId);
      console.log("CartContext: Item removed, new cart:", newCart); // DEBUG
      return newCart;
    });
  };

  // Function to clear the entire cart
  const clearCart = () => {
    console.log("CartContext: clearCart called. Clearing cart."); // DEBUG
    // Return all items' stock before clearing
    cartItems.forEach(item => {
        updateProductStock(item._id, item.quantity);
    });
    setCartItems([]);
  };

  // Calculate total items and total price
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const value = {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    getTotalItems,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
