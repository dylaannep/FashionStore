import React, { useEffect, useState } from 'react';
import { inventarioService, productosService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const InventarioPage = () => {
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ producto: '', cantidad: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchInventario();
    fetchProductos();
  }, []);

  const fetchInventario = async () => {
    setLoading(true);
    try {
      const response = await inventarioService.getAll();
      setInventario(response.data);
    } catch (error) {
      console.error('Error fetching inventario:', error);
    } finally {
      setLoading(false);
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
      cantidad: item.cantidad || 0,
      activo: item.activo !== undefined ? item.activo : true,
    });
    setEditingId(item.id_inventario);
    setModalOpen(true);
  };

  const handleToggleActive = async (item) => {
    const accion = item.activo ? 'inactivar' : 'activar';
    if (window.confirm(`¿Deseas ${accion} "${item.producto}"?`)) {
      await inventarioService.update(item.id_inventario, { activo: !item.activo });
      fetchInventario();
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`¿Estás seguro de eliminar el registro de inventario para el producto "${productos.find(p => p.id === item.producto)?.nombre}"?`)) {
      try {
        await inventarioService.delete(item.id);
        fetchInventario();
      } catch (error) {
        console.error('Error deleting inventario:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await inventarioService.update(editingId, formData);
      } else {
        await inventarioService.create(formData);
      }
      fetchInventario();
      setModalOpen(false);
      setFormData({ producto: '', cantidad: 0 });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving inventario:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Nuevo Registro
      </button>
      <DataTable
        columns={[
          { key: 'producto', label: 'Producto', render: (productoId) => productos.find(p => p.id === productoId)?.nombre || 'N/A' },
          { key: 'cantidad', label: 'Cantidad' },
        ]}
        data={inventario}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Registro' : 'Nuevo Registro'}>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Producto"
            type="select"
            options={productos.map(p => ({ value: p.id, label: p.nombre }))}
            value={formData.producto}
            onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
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

export default InventarioPage;
