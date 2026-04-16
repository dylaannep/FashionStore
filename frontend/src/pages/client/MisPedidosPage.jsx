import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidosService } from '../../api/services';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import { AlertCircle, Loader, Eye } from 'lucide-react';

const MisPedidosPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const estadosMap = {
    1: { nombre: 'Pendiente', color: 'yellow' },
    2: { nombre: 'Confirmado', color: 'blue' },
    3: { nombre: 'Enviado', color: 'purple' },
    4: { nombre: 'Entregado', color: 'green' },
    5: { nombre: 'Cancelado', color: 'red' },
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMisPedidos();
  }, [user, navigate]);

  const fetchMisPedidos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await pedidosService.getByUsuario(user.id_usuario);
      setPedidos(Array.isArray(response.data) ? response.data : response);
    } catch (err) {
      console.error('Error fetching mis pedidos:', err);
      // Si el endpoint no existe, intentar obtener todos y filtrar
      try {
        const allResponse = await pedidosService.getAll();
        const userPedidos = (Array.isArray(allResponse.data) ? allResponse.data : allResponse)
          .filter(p => p.id_usuario === user.id_usuario);
        setPedidos(userPedidos);
      } catch (err2) {
        setError('Error al cargar tus pedidos');
        console.error('Error:', err2);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrar pedidos según estado
  const filteredPedidos = pedidos.filter(pedido => 
    !filterEstado || pedido.id_estado?.toString() === filterEstado
  );

  const getEstadoColor = (idEstado) => {
    const estado = estadosMap[idEstado];
    const colorMap = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
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

  const getEstadoInfo = (idEstado) => {
    const estado = estadosMap[idEstado];
    const infoMap = {
      1: '⏳ Tu pedido está pendiente de confirmación',
      2: '✓ Tu pedido ha sido confirmado',
      3: '📦 Tu pedido está en camino',
      4: '✓ Tu pedido ha sido entregado',
      5: '✗ Tu pedido ha sido cancelado',
    };
    return infoMap[idEstado] || 'Estado desconocido';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando tus pedidos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">
            Total de pedidos: <span className="font-semibold">{pedidos.length}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filtro */}
        {pedidos.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              {Object.entries(estadosMap).map(([id, estado]) => (
                <option key={id} value={id}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Lista de Pedidos */}
        {filteredPedidos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              {pedidos.length === 0 
                ? 'Aún no has realizado pedidos'
                : 'No hay pedidos que coincidan con tu búsqueda'
              }
            </p>
            {pedidos.length === 0 && (
              <Button variant="primary" onClick={() => navigate('/')}>
                Ir a Comprar
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPedidos.map((pedido) => (
              <div 
                key={pedido.id_pedido}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Información del Pedido */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Pedido #{pedido.id_pedido}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Fecha:</span> {formatFecha(pedido.fecha_pedido)}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Total:</span> ₡{(pedido.total_con_iva || pedido.total).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Productos:</span> {pedido.detalles?.length || 0}
                    </p>
                  </div>

                  {/* Estado y Mensaje */}
                  <div>
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(pedido.id_estado)}`}>
                        {estadosMap[pedido.id_estado]?.nombre}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {getEstadoInfo(pedido.id_estado)}
                    </p>
                  </div>
                </div>

                {/* Detalles rápidos */}
                {pedido.detalles && pedido.detalles.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Productos:</p>
                    <div className="space-y-1">
                      {pedido.detalles.slice(0, 3).map((detalle, idx) => (
                        <p key={idx} className="text-sm text-gray-900">
                          • {detalle.producto_variante?.producto?.nombre} 
                          <span className="text-gray-600"> (x{detalle.cantidad})</span>
                        </p>
                      ))}
                      {pedido.detalles.length > 3 && (
                        <p className="text-sm text-gray-600 italic">
                          +{pedido.detalles.length - 3} más
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Dirección de envío */}
                {pedido.direccion && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200 text-sm">
                    <p className="text-xs font-semibold text-blue-900 mb-1">Dirección de Envío:</p>
                    <p className="text-blue-900">{pedido.direccion}</p>
                    {pedido.telefono && (
                      <p className="text-blue-900 text-xs mt-1">
                        <span className="font-semibold">Teléfono:</span> {pedido.telefono}
                      </p>
                    )}
                  </div>
                )}

                {/* Botón Ver Detalles */}
                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/cliente/pedidos/${pedido.id_pedido}`)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPedidosPage;
