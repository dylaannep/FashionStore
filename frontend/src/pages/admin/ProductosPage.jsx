import React, { useEffect, useState } from 'react';
import { productosService, categoriasService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', categoria: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const response = await productosService.getAll();
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await categoriasService.getAll();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nombre: item.nombre || '',
      categoria: item.categoria || '',
      activo: item.activo !== undefined ? item.activo : true,
    });
    setEditingId(item.id_producto);
    setModalOpen(true);
  };

  const handleDelete = async (producto) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
      try {
        await productosService.delete(producto.id);
        fetchProductos();
      } catch (error) {
        console.error('Error deleting producto:', error);
      }
    }
  };

  const handleToggleActive = async (item) => {
    const accion = item.activo ? 'inactivar' : 'activar';
    if (window.confirm(`¿Deseas ${accion} "${item.nombre}"?`)) {
      await productosService.update(item.id_producto, { activo: !item.activo });
      fetchProductos();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productosService.update(editingId, formData);
      } else {
        await productosService.create(formData);
      }
      fetchProductos();
      setModalOpen(false);
      setFormData({ nombre: '', categoria: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving producto:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Nuevo Producto
      </button>
      <DataTable
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'categoria', label: 'Categoría', render: (categoriaId) => categorias.find(c => c.id === categoriaId)?.nombre || 'N/A' },
        ]}
        data={productos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Producto' : 'Nuevo Producto'}>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
          <FormField
            label="Categoría"
            type="select"
            options={categorias.map(c => ({ value: c.id, label: c.nombre }))}
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
          />
          <button type="submit" className="bg-acento text-white px-4 py-2 rounded mt-4">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductosPage;
