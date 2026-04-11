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
          axios.get('/api/productos/count'),
          axios.get('/api/pedidos?limit=5'),
          axios.get('/api/usuarios/count'),
          axios.get('/api/productos/bajo-stock'),
        ]);
        setStats({
          productos: productosRes.data.count,
          pedidos: pedidosRes.data.count,
          usuarios: usuariosRes.data.count,
          bajoStock: bajoStockRes.data.count,
        });
        setPedidos(pedidosRes.data.pedidos);
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
    <div>
      <h1 className="text-2xl font-bold text-acento mb-6">Bienvenido, {usuario?.nombre}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-secundario rounded-lg p-6 shadow text-center">
          <div className="text-3xl font-bold text-acento">{stats.productos}</div>
          <div className="text-gris mt-2">Productos</div>
        </div>
        <div className="bg-secundario rounded-lg p-6 shadow text-center">
          <div className="text-3xl font-bold text-acento">{stats.pedidos}</div>
          <div className="text-gris mt-2">Pedidos</div>
        </div>
        <div className="bg-secundario rounded-lg p-6 shadow text-center">
          <div className="text-3xl font-bold text-acento">{stats.usuarios}</div>
          <div className="text-gris mt-2">Usuarios</div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold text-acento mb-4">Productos en bajo stock</h2>
        <div className="bg-secundario rounded-lg p-6 shadow text-center">
          <div className="text-3xl font-bold text-error">{stats.bajoStock}</div>
          <div className="text-gris mt-2">Productos con bajo stock</div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold text-acento mb-4">Últimos pedidos</h2>
        <table className="w-full bg-secundario rounded-lg shadow">
          <thead>
            <tr className="text-left border-b border-gris">
              <th className="p-4">ID</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Total</th>
              <th className="p-4">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="border-b border-gris">
                <td className="p-4">{pedido.id}</td>
                <td className="p-4">{pedido.cliente}</td>
                <td className="p-4">${pedido.total}</td>
                <td className="p-4">{new Date(pedido.fecha).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
