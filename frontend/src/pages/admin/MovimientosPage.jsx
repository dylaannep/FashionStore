import React, { useEffect, useState } from 'react';
import { movimientosService, inventarioService, productosService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const MovimientosPage = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ producto: '', tipo: 'entrada', cantidad: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMovimientos();
    fetchInventario();
    fetchProductos();
  }, []);

  const fetchMovimientos = async () => {
    setLoading(true);
    try {
      const response = await movimientosService.getAll();
      setMovimientos(response.data);
    } catch (error) {
      console.error('Error fetching movimientos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventario = async () => {
    try {
      const response = await inventarioService.getAll();
      setInventario(response.data);
    } catch (error) {
      console.error('Error fetching inventario:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await productosService.getAll();
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      producto: item.producto || '',
      tipo: item.tipo || 'entrada',
      cantidad: item.cantidad || 0,
      activo: item.activo !== undefined ? item.activo : true,
    });
    setEditingId(item.id_movimiento);
    setModalOpen(true);
  };

  const handleDelete = async (movimiento) => {
    if (window.confirm(`¿Estás seguro de eliminar el movimiento para el producto "${productos.find(p => p.id === movimiento.producto)?.nombre}"?`)) {
      try {
        await movimientosService.delete(movimiento.id);
        fetchMovimientos();
      } catch (error) {
        console.error('Error deleting movimiento:', error);
      }
    }
  };

  const handleToggleActive = async (item) => {
    const accion = item.activo ? 'inactivar' : 'activar';
    if (window.confirm(`¿Deseas ${accion} "${item.producto}"?`)) {
      await movimientosService.update(item.id_movimiento, { activo: !item.activo });
      fetchMovimientos();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await movimientosService.update(editingId, formData);
      } else {
        await movimientosService.create(formData);
      }
      fetchMovimientos();
      setModalOpen(false);
      setFormData({ producto: '', tipo: 'entrada', cantidad: 0 });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving movimiento:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Movimientos de Inventario</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Nuevo Movimiento
      </button>
      <DataTable
        columns={[
          { key: 'producto', label: 'Producto', render: (productoId) => productos.find(p => p.id === productoId)?.nombre || 'N/A' },
          { key: 'tipo', label: 'Tipo' },
          { key: 'cantidad', label: 'Cantidad' },
        ]}
        data={movimientos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Movimiento' : 'Nuevo Movimiento'}>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Producto"
            type="select"
            options={productos.map(p => ({ value: p.id, label: p.nombre }))}
            value={formData.producto}
            onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
          />
          <FormField
            label="Tipo"
            type="select"
            options={[{ value: 'entrada', label: 'Entrada' }, { value: 'salida', label: 'Salida' }]}
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          />
          <FormField
            label="Cantidad"
            type="number"
            value={formData.cantidad}
            onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value, 10) })}
          />
          <button type="submit" className="bg-acento text-white px-4 py-2 rounded mt-4">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MovimientosPage;
