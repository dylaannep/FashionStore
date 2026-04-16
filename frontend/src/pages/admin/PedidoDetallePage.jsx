import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pedidosService } from '../../api/services';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { ArrowLeft, AlertCircle, Loader, Check } from 'lucide-react';

const PedidoDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChangeEstado, setShowChangeEstado] = useState(false);
  const [newEstado, setNewEstado] = useState('');
  const [changingEstado, setChangingEstado] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const estadosMap = {
    1: { nombre: 'Pendiente', color: 'yellow', siguientes: [2, 5] },
    2: { nombre: 'Confirmado', color: 'blue', siguientes: [3, 5] },
    3: { nombre: 'Enviado', color: 'purple', siguientes: [4, 5] },
    4: { nombre: 'Entregado', color: 'green', siguientes: [] },
    5: { nombre: 'Cancelado', color: 'red', siguientes: [] },
  };

  useEffect(() => {
    fetchPedido();
  }, [id]);

  const fetchPedido = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await pedidosService.getById(id);
      setPedido(response.data || response);
    } catch (err) {
      setError('Error al cargar el pedido');
      console.error('Error fetching pedido:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEstado = async () => {
    if (!newEstado) {
      setError('Por favor selecciona un nuevo estado');
      return;
    }

    setChangingEstado(true);
    setError('');
    try {
      const response = await pedidosService.cambiarEstado(id, parseInt(newEstado));
      setPedido(response.data || response);
      setShowChangeEstado(false);
      setNewEstado('');
      setSuccessMessage(`Estado cambiado a ${estadosMap[newEstado].nombre}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar el estado del pedido');
      console.error('Error changing estado:', err);
    } finally {
      setChangingEstado(false);
    }
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

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando detalles del pedido...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="p-6">
        <Button variant="secondary" onClick={() => navigate('/admin/pedidos')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Pedidos
        </Button>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">No se encontró el pedido</p>
        </div>
      </div>
    );
  }

  const siguientesEstados = estadosMap[pedido.id_estado]?.siguientes || [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header con botón volver */}
      <div className="mb-6">
        <Button 
          variant="secondary" 
          onClick={() => navigate('/admin/pedidos')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Pedidos
        </Button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Encabezado del Pedido */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Número de Pedido</p>
            <h1 className="text-3xl font-bold text-gray-900">#{pedido.id_pedido}</h1>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Fecha de Pedido</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatFecha(pedido.fecha_pedido)}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cliente */}
            <div>
              <p className="text-sm text-gray-600 mb-2 font-semibold">Cliente</p>
              <p className="text-gray-900 font-medium">
                {typeof pedido.usuario === 'object' && pedido.usuario?.nombre 
                  ? pedido.usuario.nombre 
                  : pedido.usuario_nombre || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                {typeof pedido.usuario === 'object' && pedido.usuario?.email 
                  ? pedido.usuario.email 
                  : pedido.usuario_email || 'N/A'}
              </p>
            </div>

            {/* Estado */}
            <div>
              <p className="text-sm text-gray-600 mb-2 font-semibold">Estado Actual</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getEstadoColor(pedido.id_estado)}`}>
                {estadosMap[pedido.id_estado]?.nombre}
              </span>
            </div>

            {/* Método de Pago */}
            <div>
              <p className="text-sm text-gray-600 mb-2 font-semibold">Método de Pago</p>
              <p className="text-gray-900 font-medium">
                {typeof pedido.metodo_pago === 'object' && pedido.metodo_pago?.nombre 
                  ? pedido.metodo_pago.nombre 
                  : pedido.metodo_pago || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Información de Envío */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Información de Envío</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600 font-semibold">Dirección</p>
              <p className="text-gray-900">{pedido.direccion || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Teléfono</p>
              <p className="text-gray-900">{pedido.telefono || 'N/A'}</p>
            </div>
            {pedido.notas && (
              <div>
                <p className="text-gray-600 font-semibold">Notas</p>
                <p className="text-gray-900">{pedido.notas}</p>
              </div>
            )}
          </div>
        </div>

        {/* Botón Cambiar Estado */}
        {siguientesEstados.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Gestionar Estado</h3>
              <p className="text-sm text-gray-600 mb-4">
                Puedes cambiar el estado del pedido a:
              </p>
              <div className="space-y-2 mb-4">
                {siguientesEstados.map(estId => (
                  <p key={estId} className="text-sm text-gray-900 font-medium">
                    • {estadosMap[estId].nombre}
                  </p>
                ))}
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowChangeEstado(true)}
            >
              Cambiar Estado
            </Button>
          </div>
        )}

        {siguientesEstados.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-center justify-center">
            <p className="text-center text-gray-600">
              Este pedido no puede cambiar de estado.
            </p>
          </div>
        )}
      </div>

      {/* Detalles de Productos */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Productos</h3>
        
        {pedido.detalles && pedido.detalles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Producto</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Talla</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Color</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Cantidad</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">P. Unitario</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pedido.detalles.map((detalle, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">
                        {detalle.producto_variante?.producto?.nombre}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {detalle.producto_variante?.talla?.nombre}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: detalle.producto_variante?.color?.hexadecimal }}
                        ></div>
                        <span className="text-gray-600">
                          {detalle.producto_variante?.color?.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-900">
                      {detalle.cantidad}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      ₡{parseFloat(detalle.precio_unitario).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      ₡{parseFloat(detalle.subtotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No hay detalles de productos</p>
        )}
      </div>

      {/* Resumen de Compra */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen</h3>
        
        <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
          <div className="flex justify-between text-gray-900">
            <span>Subtotal:</span>
            <span className="font-medium">₡{(pedido.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-900">
            <span>IVA (13%):</span>
            <span className="font-medium">₡{(pedido.iva || 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-blue-600">
            ₡{(pedido.total_con_iva || pedido.total || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Modal Cambiar Estado */}
      {showChangeEstado && (
        <Modal
          isOpen={showChangeEstado}
          onClose={() => {
            setShowChangeEstado(false);
            setNewEstado('');
            setError('');
          }}
          title="Cambiar Estado del Pedido"
          size="sm"
        >
          <div className="p-6 space-y-4">
            <p className="text-gray-600">
              Estado actual: <span className="font-semibold">{estadosMap[pedido.id_estado]?.nombre}</span>
            </p>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nuevo Estado
              </label>
              <select
                value={newEstado}
                onChange={(e) => setNewEstado(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un estado</option>
                {siguientesEstados.map(estId => (
                  <option key={estId} value={estId}>
                    {estadosMap[estId].nombre}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowChangeEstado(false);
                  setNewEstado('');
                  setError('');
                }}
                disabled={changingEstado}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleChangeEstado}
                isLoading={changingEstado}
                disabled={changingEstado || !newEstado}
              >
                Confirmar Cambio
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PedidoDetallePage;
