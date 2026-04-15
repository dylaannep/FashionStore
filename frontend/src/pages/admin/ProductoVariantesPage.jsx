import React, { useEffect, useState } from 'react';
import { variantesService, productosService, coloresService, tallasService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const ProductoVariantesPage = () => {
  const [variantes, setVariantes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id_producto: '',
    id_color: '',
    id_talla: '',
    sku: '',
    precio: '',
    imagen: null,
    activo: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVariantes();
    fetchProductos();
    fetchColores();
    fetchTallas();
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

  const fetchColores = async () => {
    try {
      const response = await coloresService.getAll();
      setColores(response.data);
    } catch (error) {
      console.error('Error fetching colores:', error);
    }
  };

  const fetchTallas = async () => {
    try {
      const response = await tallasService.getAll();
      setTallas(response.data);
    } catch (error) {
      console.error('Error fetching tallas:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id_producto: item.id_producto || '',
      id_color: item.id_color || '',
      id_talla: item.id_talla || '',
      sku: item.sku || '',
      precio: item.precio || '',
      imagen: null,
      activo: item.activo !== undefined ? item.activo : true,
    });
    setEditingId(item.id_producto_variante);
    setModalOpen(true);
  };

  const handleDelete = async (variante) => {
    if (window.confirm(`¿Estás seguro de eliminar la variante con SKU "${variante.sku}"?`)) {
      try {
        await variantesService.delete(variante.id_producto_variante);
        fetchVariantes();
      } catch (error) {
        console.error('Error deleting variante:', error);
      }
    }
  };

  const handleToggleActive = async (item) => {
    const accion = item.activo ? 'inactivar' : 'activar';
    if (window.confirm(`¿Deseas ${accion} la variante "${item.sku}"?`)) {
      try {
        await variantesService.update(item.id_producto_variante, { activo: !item.activo });
        fetchVariantes();
      } catch (error) {
        console.error(`Error al ${accion} la variante:`, error);
        alert(`Ocurrió un error al intentar ${accion} la variante. Por favor, inténtalo de nuevo.`);
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({
      id_producto: '',
      id_color: '',
      id_talla: '',
      sku: '',
      precio: '',
      imagen: null,
      activo: true,
    });
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async () => {
    setErrors({});

    const newErrors = {};
    if (!formData.id_producto) newErrors.id_producto = 'Debe seleccionar un producto.';
    if (!formData.id_color) newErrors.id_color = 'Debe seleccionar un color.';
    if (!formData.id_talla) newErrors.id_talla = 'Debe seleccionar una talla.';
    if (!formData.sku.trim()) newErrors.sku = 'El SKU es obligatorio.';
    else if (formData.sku.includes(' ')) newErrors.sku = 'El SKU no puede contener espacios.';
    else if (formData.sku.length < 3) newErrors.sku = 'El SKU debe tener al menos 3 caracteres.';
    else if (formData.sku.length > 100) newErrors.sku = 'El SKU no puede exceder 100 caracteres.';
    if (!formData.precio) newErrors.precio = 'El precio es obligatorio.';
    else if (isNaN(formData.precio)) newErrors.precio = 'El precio debe ser un número válido.';
    else if (parseFloat(formData.precio) <= 0) newErrors.precio = 'El precio debe ser mayor a 0.';
    else if (!/^\d+(\.\d{1,2})?$/.test(formData.precio)) newErrors.precio = 'El precio debe tener máximo 2 decimales.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Determinar si usar FormData (si hay imagen) o JSON plano
    let dataToSend;
    
    if (formData.imagen) {
      // Usar FormData si hay archivo de imagen
      dataToSend = new FormData();
      dataToSend.append('id_producto', parseInt(formData.id_producto));
      dataToSend.append('id_color', parseInt(formData.id_color));
      dataToSend.append('id_talla', parseInt(formData.id_talla));
      dataToSend.append('sku', formData.sku);
      dataToSend.append('precio', parseFloat(formData.precio));
      dataToSend.append('activo', formData.activo);
      dataToSend.append('imagen', formData.imagen);
    } else {
      // Usar JSON plano si no hay imagen
      dataToSend = {
        sku: formData.sku,
        precio: parseFloat(formData.precio),
        activo: formData.activo,
      };
      // Incluir campos adicionales solo en creación
      if (!editingId) {
        dataToSend.id_producto = parseInt(formData.id_producto);
        dataToSend.id_color = parseInt(formData.id_color);
        dataToSend.id_talla = parseInt(formData.id_talla);
      }
    }

    try {
      if (editingId) {
        await variantesService.update(editingId, dataToSend);
      } else {
        await variantesService.create(dataToSend);
      }
      fetchVariantes();
      handleModalClose();
    } catch (error) {
      const mensaje = error?.response?.data?.error || '';
      const backendErrors = {};

      if (mensaje.toLowerCase().includes('sku')) {
        backendErrors.sku = mensaje;
      } else if (mensaje.toLowerCase().includes('precio')) {
        backendErrors.precio = mensaje;
      } else if (mensaje.toLowerCase().includes('producto')) {
        backendErrors.id_producto = mensaje;
      } else if (mensaje.toLowerCase().includes('color')) {
        backendErrors.id_color = mensaje;
      } else if (mensaje.toLowerCase().includes('talla')) {
        backendErrors.id_talla = mensaje;
      } else {
        backendErrors.general = mensaje || 'Ocurrió un error al guardar. Intenta de nuevo.';
      }

      setErrors(backendErrors);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Variantes de Productos</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setEditingId(null);
          setFormData({
            id_producto: '',
            id_color: '',
            id_talla: '',
            sku: '',
            precio: '',
            imagen: null,
            activo: true,
          });
          setErrors({});
          setModalOpen(true);
        }}
      >
        Nueva Variante
      </button>
      <DataTable
        columns={[
          { key: 'imagen', label: 'Imagen', render: (val, row) => {
            const imagenMostrada = row.imagen || productos.find(p => p.id_producto === row.id_producto)?.imagen;
            return imagenMostrada ? (
              <img src={imagenMostrada} alt="Variante" className="h-12 w-12 object-cover rounded" />
            ) : (
              <span className="text-gray-400">N/A</span>
            );
          }},
          { key: 'sku', label: 'SKU' },
          { key: 'id_producto', label: 'Producto', render: (val) => productos.find(p => p.id_producto === val)?.nombre || '—' },
          { key: 'id_color', label: 'Color', render: (val) => colores.find(c => c.id_color === val)?.nombre || '—' },
          { key: 'id_talla', label: 'Talla', render: (val) => tallas.find(t => t.id_talla === val)?.nombre || '—' },
          { key: 'precio', label: 'Precio', render: (val) => `$${parseFloat(val).toFixed(2)}` },
          { key: 'activo', label: 'Estado', render: (val) => (val ? 'Activo' : 'Inactivo') },
        ]}
        data={variantes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        loading={loading}
      />
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        title={editingId ? 'Editar Variante' : 'Nueva Variante'}
        submitLabel={editingId ? 'Guardar cambios' : 'Crear variante'}
      >
        <FormField label="Producto">
          <select
            value={formData.id_producto}
            onChange={(e) => {
              setFormData({ ...formData, id_producto: e.target.value });
              if (errors.id_producto) setErrors({ ...errors, id_producto: '' });
            }}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-colors ${
              errors.id_producto
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
            }`}
          >
            <option value="">Seleccione un producto</option>
            {productos.map((producto) => (
              <option key={producto.id_producto} value={producto.id_producto}>{producto.nombre}</option>
            ))}
          </select>
          {errors.id_producto && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.id_producto}
            </p>
          )}
        </FormField>

        <FormField label="Color">
          <select
            value={formData.id_color}
            onChange={(e) => {
              setFormData({ ...formData, id_color: e.target.value });
              if (errors.id_color) setErrors({ ...errors, id_color: '' });
            }}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-colors ${
              errors.id_color
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
            }`}
          >
            <option value="">Seleccione un color</option>
            {colores.map((color) => (
              <option key={color.id_color} value={color.id_color}>{color.nombre}</option>
            ))}
          </select>
          {errors.id_color && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.id_color}
            </p>
          )}
        </FormField>

        <FormField label="Talla">
          <select
            value={formData.id_talla}
            onChange={(e) => {
              setFormData({ ...formData, id_talla: e.target.value });
              if (errors.id_talla) setErrors({ ...errors, id_talla: '' });
            }}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-colors ${
              errors.id_talla
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
            }`}
          >
            <option value="">Seleccione una talla</option>
            {tallas.map((talla) => (
              <option key={talla.id_talla} value={talla.id_talla}>{talla.nombre}</option>
            ))}
          </select>
          {errors.id_talla && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.id_talla}
            </p>
          )}
        </FormField>

        <FormField
          label="SKU"
          value={formData.sku}
          onChange={(e) => {
            setFormData({ ...formData, sku: e.target.value });
            if (errors.sku) setErrors({ ...errors, sku: '' });
          }}
          error={errors.sku}
          placeholder="Ej: NIKE-ZAPDEP-BK-001"
        />

        <FormField
          label="Precio"
          type="number"
          step="0.01"
          value={formData.precio}
          onChange={(e) => {
            setFormData({ ...formData, precio: e.target.value });
            if (errors.precio) setErrors({ ...errors, precio: '' });
          }}
          error={errors.precio}
          placeholder="0.00"
        />

        <FormField label="Imagen (Opcional)">
          <input
            type="file"
            onChange={(e) => setFormData({ ...formData, imagen: e.target.files[0] })}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
          <p className="text-xs text-gray-500 mt-1">Dejar en blanco para usar la imagen del producto</p>
        </FormField>

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

export default ProductoVariantesPage;
