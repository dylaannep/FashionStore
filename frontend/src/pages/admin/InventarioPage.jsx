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
  const [formData, setFormData] = useState({ producto: '', cantidad: 0, activo: true });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

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

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({ producto: '', cantidad: 0, activo: true });
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.producto) {
      setErrors({ producto: 'El producto es obligatorio' });
      return;
    }
    if (formData.cantidad <= 0) {
      setErrors({ cantidad: 'La cantidad debe ser mayor a 0' });
      return;
    }

    try {
      if (editingId) {
        await inventarioService.update(editingId, formData);
      } else {
        await inventarioService.create(formData);
      }
      fetchInventario();
      handleModalClose();
    } catch (error) {
      console.error('Error saving inventario:', error);
      setErrors({ general: 'Ocurrió un error al guardar el registro de inventario' });
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await inventarioService.update(item.id_inventario, { activo: !item.activo });
      fetchInventario();
    } catch (error) {
      console.error('Error toggling active state:', error);
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
          { key: 'activo', label: 'Activo', render: (activo) => (activo ? 'Sí' : 'No') },
        ]}
        data={inventario}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        loading={loading}
      />
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        title={editingId ? 'Editar Registro' : 'Nuevo Registro'}
        submitLabel={editingId ? 'Guardar cambios' : 'Crear registro'}
        size="md"
      >
        <FormField label="Producto">
          <select
            value={formData.producto}
            onChange={(e) => {
              setFormData({ ...formData, producto: e.target.value });
              if (errors.producto) setErrors({ ...errors, producto: '' });
            }}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-colors ${
              errors.producto
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
            }`}
          >
            <option value="">Seleccione un producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          {errors.producto && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.producto}
            </p>
          )}
        </FormField>

        <FormField label="Cantidad">
          <input
            type="number"
            value={formData.cantidad}
            onChange={(e) => {
              setFormData({ ...formData, cantidad: parseInt(e.target.value, 10) });
              if (errors.cantidad) setErrors({ ...errors, cantidad: '' });
            }}
            placeholder="Ingrese la cantidad"
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-colors ${
              errors.cantidad
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
            }`}
          />
          {errors.cantidad && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.cantidad}
            </p>
          )}
        </FormField>

        <FormField label="Activo">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="checkbox checkbox-primary"
            />
            <span className="text-sm text-gray-700">Activo</span>
          </div>
        </FormField>

        {errors.general && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {errors.general}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InventarioPage;
