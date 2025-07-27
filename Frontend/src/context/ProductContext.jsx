import React, { createContext, useState, useContext } from 'react';

// Added companyName to each product
const initialProducts = [
    { id: 1, name: 'Fresh Apples', price: 120, category: 'Fruits', stock: 150, image: 'https://placehold.co/300x200/a8e6cf/333?text=Apples', companyName: 'Evergreen Farms' },
    { id: 2, name: 'Ripe Bananas', price: 50, category: 'Fruits', stock: 250, image: 'https://placehold.co/300x200/ffd3b6/333?text=Bananas', companyName: 'Golden Harvest' },
    { id: 3, name: 'Organic Carrots', price: 80, category: 'Vegetables', stock: 200, image: 'https://placehold.co/300x200/ffaaa5/333?text=Carrots', companyName: 'Evergreen Farms' },
    { id: 4, name: 'Imported Avocados', price: 450, category: 'Other', stock: 80, image: 'https://placehold.co/300x200/d4a5a5/333?text=Avocados', companyName: 'Global Produce Inc.' },
];

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (productData) => {
    const newProduct = { id: Date.now(), ...productData };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const editProduct = (productId, updatedData) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...updatedData } : p)));
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateProductStock = (productId, quantityChange) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + quantityChange } : p
      )
    );
  };

  const value = { products, addProduct, editProduct, deleteProduct, updateProductStock };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  return useContext(ProductContext);
};
