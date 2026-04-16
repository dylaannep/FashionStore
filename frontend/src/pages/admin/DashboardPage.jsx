import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { useAuthStore } from '../../store/authStore';

export default function DashboardPage() {
  const { usuario } = useAuthStore();
  const [stats, setStats] = useState({ productos: 0, pedidos: 0, usuarios: 0, bajoStock: 0 });
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productosRes, pedidosRes, usuariosRes, bajoStockRes] = await Promise.all([
          axios.get('/api/productos/'),
          axios.get('/api/pedidos/'),
          axios.get('/api/usuarios/'),
          axios.get('/api/inventario/bajo-stock'),
        ]);
        setStats({
          productos: productosRes.data.length,
          pedidos: pedidosRes.data.length,
          usuarios: usuariosRes.data.length,
          bajoStock: bajoStockRes.data.length,
        });
        setPedidos(pedidosRes.data.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.error || 'Error al cargar los datos.');
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {usuario?.nombre}</h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Productos</h2>
          <p className="text-2xl font-semibold text-blue-600">{stats.productos}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Pedidos</h2>
          <p className="text-2xl font-semibold text-green-600">{stats.pedidos}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Usuarios</h2>
          <p className="text-2xl font-semibold text-yellow-600">{stats.usuarios}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">Bajo Stock</h2>
          <p className="text-2xl font-semibold text-red-600">{stats.bajoStock}</p>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">Últimos Pedidos</h2>
      {pedidos.length > 0 ? (
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Usuario</th>
              <th className="p-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-50">
                <td className="p-2">{pedido.id}</td>
                <td className="p-2">
                  {typeof pedido.usuario === 'object' && pedido.usuario?.nombre 
                    ? pedido.usuario.nombre 
                    : pedido.usuario || 'N/A'}
                </td>
                <td className="p-2">${pedido.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No hay pedidos recientes.</p>
      )}
    </div>
  );
}
