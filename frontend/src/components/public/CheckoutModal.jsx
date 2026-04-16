import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/FormField';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../store/CartContext';
import { createPedido, getMetodosPago } from '../../api/services';
import { AlertCircle, CheckCircle } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, cartItems, totals }) => {
  const { user } = useAuth();
  const { clearCart } = useCart();
  
  const [step, setStep] = useState(1); // 1: Envío, 2: Pago, 3: Confirmación
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [metodosPago, setMetodosPago] = useState([]);
  const [loadingMetodos, setLoadingMetodos] = useState(true);

  const [formData, setFormData] = useState({
    direccion: '',
    telefono: '',
    notas: '',
    id_metodo_pago: ''
  });

  const [createdOrder, setCreatedOrder] = useState(null);

  // Cargar métodos de pago
  useEffect(() => {
    if (!isOpen) return;
    
    const loadMetodos = async () => {
      try {
        setLoadingMetodos(true);
        const data = await getMetodosPago();
        setMetodosPago(data || []);
        setError(''); // Clear any previous errors
      } catch (err) {
        console.error('Error loading metodos de pago:', err);
        setError('Error al cargar los métodos de pago');
      } finally {
        setLoadingMetodos(false);
      }
    };

    loadMetodos();
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    setError('');
    
    if (!formData.direccion.trim()) {
      setError('La dirección de envío es requerida.');
      return false;
    }
    
    if (!formData.telefono.trim()) {
      setError('El teléfono es requerido.');
      return false;
    }

    // Validar formato básico de teléfono
    if (!/^[\d\s\+\-\(\)]{8,}$/.test(formData.telefono)) {
      setError('El teléfono debe tener un formato válido.');
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    setError('');
    
    if (!formData.id_metodo_pago) {
      setError('Debes seleccionar un método de pago.');
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleCreateOrder();
    }
  };

  const handleCreateOrder = async () => {
    try {
      setIsLoading(true);
      setError('');

      const payload = {
        id_metodo_pago: parseInt(formData.id_metodo_pago),
        detalles: cartItems.map(item => ({
          id_producto_variante: item.id_producto_variante,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        })),
        direccion: formData.direccion.trim(),
        telefono: formData.telefono.trim(),
        notas: formData.notas.trim() || null
      };

      const response = await createPedido(payload);

      if (response && response.id_pedido) {
        setCreatedOrder(response);
        setStep(3);
        clearCart();
        setSuccessMessage(`¡Pedido #${response.id_pedido} creado exitosamente!`);
      } else {
        setError('Error al crear el pedido. Intenta de nuevo.');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message || 'Error al crear el pedido. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (step === 3) {
      // Permitir cerrar solo después de completar
      setStep(1);
      setFormData({ direccion: '', telefono: '', notas: '', id_metodo_pago: '' });
      setCreatedOrder(null);
      setSuccessMessage('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (step !== 3) {
          setStep(1);
          setFormData({ direccion: '', telefono: '', notas: '', id_metodo_pago: '' });
          setError('');
          onClose();
        }
      }}
      title="Finalizar Compra"
      size="lg"
    >
      <div className="p-6">
        {/* Indicador de pasos */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <span className={`text-sm ${step >= 1 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Envío
            </span>
          </div>

          <div className={`flex-grow h-0.5 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
            <span className={`text-sm ${step >= 2 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Pago
            </span>
          </div>

          <div className={`flex-grow h-0.5 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
            <span className={`text-sm ${step >= 3 ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
              Confirmación
            </span>
          </div>
        </div>

        {/* Step 1: Información de Envío */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-900">
                <strong>Cliente:</strong> {user?.nombre} ({user?.email})
              </p>
            </div>

            <FormField
              label="Dirección de Envío"
              name="direccion"
              type="text"
              value={formData.direccion}
              onChange={handleInputChange}
              placeholder="Ej: Calle Principal 123, Apto 4B"
              required
            />

            <FormField
              label="Teléfono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="Ej: +506 8765-4321"
              required
            />

            <FormField
              label="Notas Especiales (Opcional)"
              name="notas"
              type="textarea"
              value={formData.notas}
              onChange={handleInputChange}
              placeholder="Ej: Entregar después de las 2PM"
              rows={3}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Método de Pago */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-gray-900">Resumen de Compra</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₡{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (13%):</span>
                  <span className="font-medium">₡{totals.iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                  <span className="text-gray-900 font-semibold">Total:</span>
                  <span className="text-blue-600 font-bold">₡{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <FormField
              label="Método de Pago"
              name="id_metodo_pago"
              type="select"
              value={formData.id_metodo_pago}
              onChange={handleInputChange}
              options={metodosPago.map(mp => ({
                value: mp.id_metodo,
                label: mp.nombre
              }))}
              placeholder="Selecciona un método de pago"
              disabled={loadingMetodos}
              required
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Confirmación */}
        {step === 3 && createdOrder && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Creado Exitosamente!</h3>
              <p className="text-gray-600">Tu pedido ha sido registrado en el sistema</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600">Número de Pedido</p>
                <p className="text-2xl font-bold text-gray-900">#{createdOrder.id_pedido}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-semibold text-yellow-600">Pendiente</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-blue-600">₡{createdOrder.total_con_iva?.toFixed(2) || totals.total.toFixed(2)}</p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">Dirección de Envío</p>
                <p className="text-gray-900 font-medium">{createdOrder.direccion}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Teléfono</p>
                <p className="text-gray-900 font-medium">{createdOrder.telefono}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                ✓ Tu pedido está en estado <strong>Pendiente</strong>. El administrador lo revisará y te contactará pronto.
              </p>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="mt-8 flex gap-3 justify-end">
          {step < 3 && (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  if (step === 2) {
                    setStep(1);
                    setError('');
                  } else {
                    setStep(1);
                    setFormData({ direccion: '', telefono: '', notas: '', id_metodo_pago: '' });
                    setError('');
                    onClose();
                  }
                }}
                disabled={isLoading}
              >
                {step === 1 ? 'Cancelar' : 'Atrás'}
              </Button>
              <Button
                variant="primary"
                onClick={handleNextStep}
                isLoading={isLoading}
                disabled={isLoading}
              >
                {step === 2 ? 'Crear Pedido' : 'Siguiente'}
              </Button>
            </>
          )}

          {step === 3 && (
            <Button
              variant="primary"
              onClick={handleClose}
            >
              Finalizar
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CheckoutModal;
