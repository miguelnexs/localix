// src/context/AppContext.jsx
import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  
  const addToCart = (product) => {
    setCart([...cart, product]);
  };
  
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  return (
    <AppContext.Provider value={{
      cart,
      user,
      addToCart,
      removeFromCart,
      setUser
    }}>
      {children}
    </AppContext.Provider>
  );
};