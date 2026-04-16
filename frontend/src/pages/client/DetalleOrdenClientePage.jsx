import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pedidosService } from '../../api/services';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import { ArrowLeft, AlertCircle, Loader } from 'lucide-react';

const DetalleOrdenClientePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const estadosMap = {
    1: { nombre: 'Pendiente', descripcion: 'Tu pedido está pendiente de confirmación', icon: '⏳', color: 'yellow' },
    2: { nombre: 'Confirmado', descripcion: 'Tu pedido ha sido confirmado', icon: '✓', color: 'blue' },
    3: { nombre: 'Enviado', descripcion: 'Tu pedido está en camino', icon: '📦', color: 'purple' },
    4: { nombre: 'Entregado', descripcion: 'Tu pedido ha sido entregado', icon: '✓', color: 'green' },
    5: { nombre: 'Cancelado', descripcion: 'Tu pedido ha sido cancelado', icon: '✗', color: 'red' },
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPedido();
  }, [id, user, navigate]);

  const fetchPedido = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await pedidosService.getById(id);
      const pedidoData = response.data || response;
      
      // Validar que el pedido pertenece al usuario logueado
      if (pedidoData.id_usuario !== user.id_usuario) {
        setError('No tienes acceso a este pedido');
        return;
      }
      
      setPedido(pedidoData);
    } catch (err) {
      setError('Error al cargar el pedido');
      console.error('Error fetching pedido:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (idEstado) => {
    const estado = estadosMap[idEstado];
    const colorMap = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      red: 'bg-red-100 text-red-800 border-red-300',
    };
    return colorMap[estado?.color] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando tu pedido...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/cliente/pedidos')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Mis Pedidos
          </Button>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">{error || 'No se encontró el pedido'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header con botón volver */}
        <div className="mb-6">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/cliente/pedidos')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Mis Pedidos
          </Button>
        </div>

        {/* Card principal - Número y Fecha */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">#{pedido.id_pedido}</h1>
            <p className="text-gray-600">
              Realizado el {formatFecha(pedido.fecha_pedido)}
            </p>
          </div>

          {/* Estado prominente */}
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="text-center">
              <p className="text-3xl mb-2">{estadosMap[pedido.id_estado]?.icon}</p>
              <span className={`inline-block px-6 py-2 rounded-full text-lg font-bold border-2 ${getEstadoColor(pedido.id_estado)}`}>
                {estadosMap[pedido.id_estado]?.nombre}
              </span>
              <p className="text-gray-600 mt-3">
                {estadosMap[pedido.id_estado]?.descripcion}
              </p>
            </div>
          </div>
        </div>

        {/* Información de envío */}
        {(pedido.direccion || pedido.telefono) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Información de Envío</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pedido.direccion && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Dirección</p>
                  <p className="text-gray-900">{pedido.direccion}</p>
                </div>
              )}
              {pedido.telefono && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Teléfono</p>
                  <p className="text-gray-900">{pedido.telefono}</p>
                </div>
              )}
            </div>
            {pedido.notas && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm font-semibold text-gray-600 mb-1">Notas Especiales</p>
                <p className="text-gray-900">{pedido.notas}</p>
              </div>
            )}
          </div>
        )}

        {/* Detalles de productos */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Productos</h3>
          
          {pedido.detalles && pedido.detalles.length > 0 ? (
            <div className="space-y-4">
              {pedido.detalles.map((detalle, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                  {/* Imagen */}
                  {detalle.producto_variante?.imagen && (
                    <img
                      src={detalle.producto_variante.imagen}
                      alt={detalle.producto_variante?.producto?.nombre}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    />
                  )}

                  {/* Información */}
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {detalle.producto_variante?.producto?.nombre}
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Talla: <span className="font-medium">{detalle.producto_variante?.talla?.nombre}</span></p>
                      <div className="flex items-center gap-2">
                        <span>Color:</span>
                        <div 
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: detalle.producto_variante?.color?.hexadecimal }}
                          title={detalle.producto_variante?.color?.nombre}
                        ></div>
                        <span className="font-medium">{detalle.producto_variante?.color?.nombre}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cantidad y Precio */}
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">
                      ₡{parseFloat(detalle.precio_unitario).toFixed(2)} × {detalle.cantidad}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      ₡{parseFloat(detalle.subtotal).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No hay detalles de productos</p>
          )}
        </div>

        {/* Resumen de factura estilo profesional */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Resumen de Compra</h3>
          
          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between text-gray-900">
              <span>Subtotal</span>
              <span className="font-medium">₡{(pedido.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-900">
              <span>IVA (13%)</span>
              <span className="font-medium">₡{(pedido.iva || 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
            <span className="text-lg font-bold text-gray-900">Total a Pagar</span>
            <span className="text-3xl font-bold text-blue-600">
              ₡{(pedido.total_con_iva || pedido.total || 0).toFixed(2)}
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Método de Pago</p>
            <p className="text-gray-900">
              {typeof pedido.metodo_pago === 'object' && pedido.metodo_pago?.nombre 
                ? pedido.metodo_pago.nombre 
                : pedido.metodo_pago || 'N/A'}
            </p>
          </div>
        </div>

        {/* Botón de volver */}
        <div className="mt-8 text-center">
          <Button
            variant="secondary"
            onClick={() => navigate('/cliente/pedidos')}
          >
            Volver a Mis Pedidos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DetalleOrdenClientePage;
