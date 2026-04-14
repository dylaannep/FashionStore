import React, { useEffect, useState } from 'react';
import { productosService, subcategoriasService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', id_subcategoria: '', imagen: null });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProductos();
    fetchSubcategorias();
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

  // Mejorar el dropdown de subcategorías para incluir el contexto de la categoría padre
  const fetchSubcategorias = async () => {
    try {
      const response = await subcategoriasService.getAll();
      const formattedSubcategorias = response.data.map((s) => ({
        value: s.id_subcategoria,
        label: `${s.categoria_nombre} - ${s.nombre}`,
      }));
      setSubcategorias(formattedSubcategorias);
    } catch (error) {
      console.error('Error fetching subcategorias:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nombre: item.nombre || '',
      id_subcategoria: item.id_subcategoria || '',
      imagen: null,
    });
    setEditingId(item.id_producto);
    setModalOpen(true);
  };

  const handleDelete = async (producto) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
      try {
        await productosService.delete(producto.id_producto);
        fetchProductos();
      } catch (error) {
        console.error('Error deleting producto:', error);
      }
    }
  };

  const handleToggleActive = async (item) => {
    const accion = item.activo ? 'inactivar' : 'activar';
    if (window.confirm(`¿Deseas ${accion} "${item.nombre}"?`)) {
      try {
        await productosService.update(item.id_producto, { activo: !item.activo });
        fetchProductos();
      } catch (error) {
        console.error(`Error al ${accion} producto:`, error);
      }
    }
  };

  // Manejo de errores del servidor en handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.nombre || !formData.id_subcategoria) {
      setErrors({ nombre: 'Nombre es obligatorio', id_subcategoria: 'Subcategoría es obligatoria' });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('nombre', formData.nombre);
    formDataToSend.append('id_subcategoria', formData.id_subcategoria);
    if (formData.imagen) {
      formDataToSend.append('imagen', formData.imagen);
    }

    try {
      if (editingId) {
        await productosService.update(editingId, formDataToSend);
      } else {
        await productosService.create(formDataToSend);
      }
      fetchProductos();
      setModalOpen(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error('Error submitting producto:', error);
      }
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
          { key: 'imagen', label: 'Imagen', render: (url) => url ? <img src={url} alt="Producto" className="h-12 w-12 object-cover" /> : 'N/A' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'subcategoria_nombre', label: 'Subcategoría' },
        ]}
        data={productos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Producto' : 'Nuevo Producto'}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <FormField
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            error={errors.nombre}
          />
          <FormField
            label="Subcategoría"
            type="select"
            options={subcategorias}
            value={formData.id_subcategoria}
            onChange={(e) => setFormData({ ...formData, id_subcategoria: e.target.value })}
            error={errors.id_subcategoria}
          />
          <FormField
            label="Imagen"
            type="file"
            onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
          />
          {errors.imagen && <p className="text-red-500 text-sm">{errors.imagen}</p>}
          <button type="submit" className="bg-acento text-white px-4 py-2 rounded mt-4">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductosPage;
