import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pedidosService } from '../../api/services';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import { Eye, AlertCircle, Loader } from 'lucide-react';

const PedidosPage = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const estadosMap = {
    1: { nombre: 'Pendiente', color: 'yellow' },
    2: { nombre: 'Confirmado', color: 'blue' },
    3: { nombre: 'Enviado', color: 'purple' },
    4: { nombre: 'Entregado', color: 'green' },
    5: { nombre: 'Cancelado', color: 'red' },
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await pedidosService.getAll();
      setPedidos(Array.isArray(response.data) ? response.data : response);
    } catch (err) {
      setError('Error al cargar los pedidos');
      console.error('Error fetching pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar pedidos según búsqueda y estado
  const filteredPedidos = pedidos.filter(pedido => {
    const matchSearch = 
      pedido.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.id_pedido?.toString().includes(searchTerm) ||
      pedido.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = !filterEstado || pedido.id_estado?.toString() === filterEstado;
    
    return matchSearch && matchEstado;
  });

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Pedidos</h1>
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

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Buscar por cliente, email o #pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
      </div>

      {/* Tabla de pedidos */}
      {filteredPedidos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No hay pedidos que coincidan con tu búsqueda</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">#Pedido</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.id_pedido} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">#{pedido.id_pedido}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
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
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatFecha(pedido.fecha_pedido)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        ₡{(pedido.total_con_iva || pedido.total).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(pedido.id_estado)}`}>
                        {estadosMap[pedido.id_estado]?.nombre || 'Desconocido'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/admin/pedidos/${pedido.id_pedido}`)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosPage;
