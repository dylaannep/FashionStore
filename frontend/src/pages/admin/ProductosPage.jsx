import React, { useEffect, useState } from 'react';
import { productosService, subcategoriasService, categoriasService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    id_subcategoria: '',
    descripcion: '',
    marca: '',
    activo: true,
    imagen: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProductos();
    fetchSubcategorias();
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

  const fetchSubcategorias = async () => {
    try {
      const response = await subcategoriasService.getAll();
      const formattedSubcategorias = response.data.map((s) => {
        const categoria = categorias.find((c) => c.id_categoria === s.id_categoria);
        return {
          value: s.id_subcategoria,
          label: categoria ? `${categoria.nombre} - ${s.nombre}` : s.nombre,
        };
      });
      setSubcategorias(formattedSubcategorias);
    } catch (error) {
      console.error('Error fetching subcategorias:', error);
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
      id_subcategoria: item.id_subcategoria || '',
      descripcion: item.descripcion || '',
      marca: item.marca || '',
      activo: item.activo !== undefined ? item.activo : true,
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
        console.error(`Error al ${accion} el producto:`, error);
        alert(`Ocurrió un error al intentar ${accion} el producto. Por favor, inténtalo de nuevo.`);
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({ nombre: '', id_subcategoria: '', descripcion: '', marca: '', activo: true, imagen: null });
    setErrors({});
  };

  const handleSubmit = async () => {
    setErrors({});

    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    else if (formData.nombre.length > 150) newErrors.nombre = 'El nombre no puede exceder 150 caracteres.';
    if (!formData.id_subcategoria) newErrors.id_subcategoria = 'Debe seleccionar una subcategoría.';
    if (formData.marca && formData.marca.length > 100) newErrors.marca = 'La marca no puede exceder 100 caracteres.';
    if (formData.descripcion && formData.descripcion.length > 500) newErrors.descripcion = 'La descripción no puede exceder 500 caracteres.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSend = createFormData();

    try {
      if (editingId) {
        await productosService.update(editingId, dataToSend);
      } else {
        await productosService.create(dataToSend);
      }
      fetchProductos();
      handleModalClose();
    } catch (error) {
      const mensaje = error?.response?.data?.error || '';
      const backendErrors = {};

      if (mensaje.toLowerCase().includes('nombre')) {
        backendErrors.nombre = mensaje;
      } else if (mensaje.toLowerCase().includes('subcategoría')) {
        backendErrors.id_subcategoria = mensaje;
      } else if (mensaje.toLowerCase().includes('marca')) {
        backendErrors.marca = mensaje;
      } else if (mensaje.toLowerCase().includes('descripción')) {
        backendErrors.descripcion = mensaje;
      } else {
        backendErrors.general = mensaje || 'Ocurrió un error al guardar. Intenta de nuevo.';
      }

      setErrors(backendErrors);
    }
  };

  const createFormData = () => {
    const formDataToSend = new FormData();
    formDataToSend.append('nombre', formData.nombre);
    formDataToSend.append('id_subcategoria', formData.id_subcategoria);
    formDataToSend.append('descripcion', formData.descripcion);
    formDataToSend.append('marca', formData.marca);
    formDataToSend.append('activo', formData.activo);
    if (formData.imagen) {
      formDataToSend.append('imagen', formData.imagen);
    }
    return formDataToSend;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setEditingId(null);
          setFormData({ nombre: '', id_subcategoria: '', descripcion: '', marca: '', activo: true, imagen: null });
          setErrors({});
          setModalOpen(true);
        }}
      >
        Nuevo Producto
      </button>
      <DataTable
        columns={[
          { key: 'imagen', label: 'Imagen', render: (url) => url ? <img src={url} alt="Producto" className="h-12 w-12 object-cover" /> : 'N/A' },
          { key: 'nombre', label: 'Nombre' },
          { key: 'marca', label: 'Marca', render: (val) => val || '—' },
          { key: 'id_subcategoria', label: 'Subcategoría', render: (val) => {
            const sub = subcategorias.find(s => s.id_subcategoria === val);
            if (!sub) return '—';
            const cat = categorias.find(c => c.id_categoria === sub.id_categoria);
            return cat ? `${sub.nombre} - ${cat.nombre}` : sub.nombre;
          }},
          { key: 'activo', label: 'Estado', render: (val) => (val ? 'Activo' : 'Inactivo') },
        ]}
        data={productos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        loading={loading}
      />
      <Modal 
        isOpen={modalOpen} 
        onClose={handleModalClose} 
        onSubmit={handleSubmit}
        title={editingId ? 'Editar Producto' : 'Nuevo Producto'}
        submitLabel={editingId ? 'Guardar cambios' : 'Crear producto'}
      >
        <FormField
          label="Nombre"
          value={formData.nombre}
          onChange={(e) => {
            setFormData({ ...formData, nombre: e.target.value });
            if (errors.nombre) setErrors({ ...errors, nombre: '' });
          }}
          error={errors.nombre}
        />
        <FormField label="Subcategoría">
          <select
            value={formData.id_subcategoria}
            onChange={(e) => {
              setFormData({ ...formData, id_subcategoria: e.target.value });
              if (errors.id_subcategoria) setErrors({ ...errors, id_subcategoria: '' });
            }}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-colors ${
              errors.id_subcategoria
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
            }`}
          >
            <option value="">Seleccione una subcategoría</option>
            {subcategorias.map((subcategoria) => (
              <option key={subcategoria.value} value={subcategoria.value}>{subcategoria.label}</option>
            ))}
          </select>
          {errors.id_subcategoria && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.id_subcategoria}
            </p>
          )}
        </FormField>
        <FormField
          label="Marca"
          value={formData.marca}
          onChange={(e) => {
            setFormData({ ...formData, marca: e.target.value });
            if (errors.marca) setErrors({ ...errors, marca: '' });
          }}
          error={errors.marca}
        />
        <FormField
          label="Descripción"
          value={formData.descripcion}
          onChange={(e) => {
            setFormData({ ...formData, descripcion: e.target.value });
            if (errors.descripcion) setErrors({ ...errors, descripcion: '' });
          }}
          error={errors.descripcion}
        />
        <FormField label="Activo">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Activo</span>
          </div>
        </FormField>
        <FormField
          label="Imagen"
          type="file"
          onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
        />
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

export default ProductosPage;
