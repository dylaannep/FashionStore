import React, { useEffect, useState } from 'react';
import { variantesService, productosService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const ProductoVariantesPage = () => {
  const [variantes, setVariantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', producto: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchVariantes();
    fetchProductos();
  }, []);

  const fetchVariantes = async () => {
    setLoading(true);
    try {
      const response = await variantesService.getAll();
      setVariantes(response.data);
    } catch (error) {
      console.error('Error fetching variantes:', error);
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

  const handleEdit = (variante) => {
    setFormData({ nombre: variante.nombre, producto: variante.producto });
    setEditingId(variante.id);
    setModalOpen(true);
  };

  const handleDelete = async (variante) => {
    if (window.confirm(`¿Estás seguro de eliminar la variante "${variante.nombre}"?`)) {
      try {
        await variantesService.delete(variante.id);
        fetchVariantes();
      } catch (error) {
        console.error('Error deleting variante:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await variantesService.update(editingId, formData);
      } else {
        await variantesService.create(formData);
      }
      fetchVariantes();
      setModalOpen(false);
      setFormData({ nombre: '', producto: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving variante:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Producto Variantes</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Nueva Variante
      </button>
      <DataTable
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'producto', label: 'Producto', render: (productoId) => productos.find(p => p.id === productoId)?.nombre || 'N/A' },
        ]}
        data={variantes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Variante' : 'Nueva Variante'}>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
          <FormField
            label="Producto"
            type="select"
            options={productos.map(p => ({ value: p.id, label: p.nombre }))}
            value={formData.producto}
            onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
          />
          <button type="submit" className="bg-acento text-white px-4 py-2 rounded mt-4">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductoVariantesPage;
