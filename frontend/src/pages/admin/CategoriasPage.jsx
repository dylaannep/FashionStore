import React, { useEffect, useState } from 'react';
import { categoriasService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', activo: true });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await categoriasService.getAll();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
      activo: item.activo !== undefined ? item.activo : true,
    });
    setEditingId(item.id_categoria);
    setModalOpen(true);
  };

  const handleDelete = async (categoria) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      try {
        await categoriasService.delete(categoria.id);
        fetchCategorias();
      } catch (error) {
        console.error('Error deleting categoria:', error);
      }
    }
  };

  const handleToggleActive = async (item) => {
    const accion = item.activo ? 'inactivar' : 'activar';
    if (window.confirm(`¿Deseas ${accion} "${item.nombre}"?`)) {
      await categoriasService.update(item.id_categoria, { activo: !item.activo });
      fetchCategorias();
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El campo Nombre es obligatorio.';
    } else if (formData.nombre.length > 100) {
      newErrors.nombre = 'El Nombre no puede exceder 100 caracteres.';
    }

    if (formData.descripcion && formData.descripcion.length > 200) {
      newErrors.descripcion = 'La Descripción no puede exceder 200 caracteres.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingId) {
        await categoriasService.update(editingId, formData);
      } else {
        await categoriasService.create(formData);
      }
      await fetchCategorias();
      setModalOpen(false);
      setFormData({ nombre: '', descripcion: '', activo: true });
      setErrors({});
      setEditingId(null);
    } catch (error) {
      const mensaje = error?.response?.data?.error || '';
      const backendErrors = {};

      if (mensaje.toLowerCase().includes('nombre ya está en uso')) {
        backendErrors.nombre = 'El nombre ya está en uso. Por favor, elige otro.';
      } else if (mensaje.toLowerCase().includes('nombre')) {
        backendErrors.nombre = mensaje;
      } else if (mensaje.toLowerCase().includes('descripci')) {
        backendErrors.descripcion = mensaje;
      } else {
        backendErrors.general = mensaje || 'Ocurrió un error al guardar. Intenta de nuevo.';
      }

      setErrors(backendErrors);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({ nombre: '', descripcion: '', activo: true });
    setErrors({});
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categorías</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setEditingId(null);
          setFormData({ nombre: '', descripcion: '', activo: true });
          setModalOpen(true);
        }}
      >
        Nueva Categoría
      </button>
      <DataTable
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'descripcion', label: 'Descripción' }
        ]}
        data={categorias}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        loading={loading}
      />
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        title={editingId ? 'Editar Categoría' : 'Nueva Categoría'}
        submitLabel={editingId ? 'Guardar cambios' : 'Crear categoría'}
        size="md"
      >
        <FormField label="Nombre">
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => {
              setFormData({ ...formData, nombre: e.target.value });
              if (errors.nombre) setErrors({ ...errors, nombre: '' });
            }}
            placeholder="Ingrese el nombre de la categoría"
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-colors ${
              errors.nombre
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
            }`}
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.nombre}
            </p>
          )}
        </FormField>

        <FormField label="Descripción">
          <textarea
            value={formData.descripcion}
            onChange={(e) => {
              setFormData({ ...formData, descripcion: e.target.value });
              if (errors.descripcion) setErrors({ ...errors, descripcion: '' });
            }}
            placeholder="Ingrese una descripción"
            rows={3}
            className={`w-full px-3 py-2 rounded-lg border text-sm bg-white placeholder-gray-400 
              focus:outline-none focus:ring-2 transition-colors resize-none ${
              errors.descripcion
                ? 'border-red-400 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
            }`}
          />
          {errors.descripcion && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {errors.descripcion}
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

export default CategoriasPage;
