import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar carrito del localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('fashionstore_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('fashionstore_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Agregar item al carrito
  const addToCart = (producto) => {
    const {
      id_producto_variante,
      id_producto,
      nombre_producto,
      talla,
      color,
      cantidad,
      precio_unitario,
      imagen
    } = producto;

    setCartItems(prevItems => {
      // Buscar si el item ya existe (mismo producto, talla y color)
      const existingItem = prevItems.find(
        item => item.id_producto_variante === id_producto_variante
      );

      if (existingItem) {
        // Aumentar cantidad
        return prevItems.map(item =>
          item.id_producto_variante === id_producto_variante
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }

      // Agregar nuevo item
      return [
        ...prevItems,
        {
          id_producto_variante,
          id_producto,
          nombre_producto,
          talla,
          color,
          cantidad,
          precio_unitario,
          imagen,
          subtotal: precio_unitario * cantidad
        }
      ];
    });
  };

  // Actualizar cantidad de un item
  const updateQuantity = (id_producto_variante, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id_producto_variante);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id_producto_variante === id_producto_variante
          ? {
              ...item,
              cantidad: newQuantity,
              subtotal: item.precio_unitario * newQuantity
            }
          : item
      )
    );
  };

  // Eliminar item del carrito
  const removeFromCart = (id_producto_variante) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id_producto_variante !== id_producto_variante)
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular totales
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = subtotal * 0.13; // 13% IVA
    const total = subtotal + iva;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      iva: parseFloat(iva.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calculateTotals,
    isLoading,
    setIsLoading,
    itemCount: cartItems.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};
