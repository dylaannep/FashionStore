import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../hooks/useAuth';
import CheckoutModal from '../../components/public/CheckoutModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Navbar from '../../components/public/Navbar';
import Footer from '../../components/public/Footer';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, calculateTotals, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const { subtotal, iva, total } = calculateTotals();

  // Validar que el usuario esté autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Requerido</h1>
              <p className="text-gray-600 mb-6">
                Necesitas iniciar sesión para ver y gestionar tu carrito.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Carrito vacío
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Carrito</h1>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h2>
              <p className="text-gray-600 mb-6">
                Explora nuestros productos y agrega los que te gusten.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/')}
              >
                Continuar Comprando
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mi Carrito</h1>
            <p className="text-gray-600 mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Carrito Items - Columna principal */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id_producto_variante} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex gap-4">
                        {/* Imagen */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.imagen || '/placeholder-product.jpg'}
                            alt={item.nombre_producto}
                            className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                          />
                        </div>

                        {/* Info del producto */}
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.nombre_producto}
                          </h3>
                          
                          <div className="flex gap-4 text-sm text-gray-600 mt-1">
                            <span>Talla: <span className="font-medium text-gray-900">{item.talla}</span></span>
                            <span>Color: <span className="font-medium text-gray-900">{item.color}</span></span>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            {/* Cantidad */}
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                              <button
                                onClick={() => updateQuantity(item.id_producto_variante, item.cantidad - 1)}
                                className="p-1 hover:bg-gray-200 rounded transition"
                                title="Disminuir cantidad"
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <span className="w-8 text-center font-medium text-gray-900">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id_producto_variante, item.cantidad + 1)}
                                className="p-1 hover:bg-gray-200 rounded transition"
                                title="Aumentar cantidad"
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>

                            {/* Precio */}
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                ₡{item.precio_unitario.toFixed(2)} × {item.cantidad}
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                ₡{item.subtotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Botón eliminar */}
                        <button
                          onClick={() => removeFromCart(item.id_producto_variante)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón limpiar carrito */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Limpiar carrito
                </button>
              </div>
            </div>

            {/* Resumen de Compra */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen</h2>

                {/* Detalles */}
                <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">₡{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA (13%)</span>
                    <span className="font-medium">₡{iva.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">₡{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => setShowCheckout(true)}
                  >
                    Finalizar Compra
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => navigate('/')}
                  >
                    Continuar Comprando
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Checkout */}
      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          cartItems={cartItems}
          totals={{ subtotal, iva, total }}
        />
      )}

      {/* Modal de confirmación para limpiar carrito */}
      {showConfirmClear && (
        <Modal
          isOpen={showConfirmClear}
          onClose={() => setShowConfirmClear(false)}
          title="Limpiar Carrito"
          size="sm"
        >
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar todos los productos de tu carrito?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmClear(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  clearCart();
                  setShowConfirmClear(false);
                }}
              >
                Limpiar
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <Footer />
    </div>
  );
};

export default CartPage;
