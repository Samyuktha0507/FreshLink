import React from 'react';
import { useCart } from '../context/CartContext';
import { FiXCircle, FiPlusCircle, FiMinusCircle } from 'react-icons/fi'; // Assuming you have react-icons installed

const Cart = () => {
  const { cartItems, removeItemFromCart, updateItemQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-auto my-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Start adding some delicious products!</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-lg max-w-4xl mx-auto my-8 font-inter">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Your Shopping Cart</h2>
      <div className="space-y-6">
        {cartItems.map(item => (
          <div key={item._id} className="flex flex-col sm:flex-row items-center bg-gray-50 p-4 rounded-xl shadow-sm">
            <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 mb-4 sm:mb-0 sm:mr-6">
              {/* Use a placeholder image if item.imageUrl is not available */}
              <img
                src={item.imageUrl || `https://placehold.co/96x96/E0E0E0/333333?text=${item.name.substring(0, 5)}`}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/96x96/E0E0E0/333333?text=NoImg`; }}
              />
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.name}</h3>
              <p className="text-gray-600 mb-2">Price: ${item.price ? item.price.toFixed(2) : 'N/A'}</p>
              <div className="flex items-center justify-center sm:justify-start space-x-2">
                <button
                  onClick={() => updateItemQuantity(item._id, item.quantity - 1)}
                  className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FiMinusCircle size={20} />
                </button>
                <span className="text-lg font-medium text-gray-800">{item.quantity}</span>
                <button
                  onClick={() => updateItemQuantity(item._id, item.quantity + 1)}
                  className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                  aria-label="Increase quantity"
                >
                  <FiPlusCircle size={20} />
                </button>
                <button
                  onClick={() => removeItemFromCart(item._id)}
                  className="ml-4 p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                  aria-label="Remove item"
                >
                  <FiXCircle size={20} />
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-auto text-right">
              <p className="text-lg font-bold text-gray-900">
                Subtotal: ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t-2 border-gray-200 flex flex-col sm:flex-row justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Total: ${getCartTotal()}</h3>
        <button
          className="mt-4 sm:mt-0 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
          onClick={() => alert('Proceed to Checkout (Not implemented yet)')} // Replace with actual checkout logic
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
