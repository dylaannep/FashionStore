import React, { useEffect, useState } from 'react';
import { tallasService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const TallasPage = () => {
  const [tallas, setTallas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '' });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTallas();
  }, []);

  const fetchTallas = async () => {
    setLoading(true);
    try {
      const response = await tallasService.getAll();
      setTallas(response.data);
    } catch (error) {
      console.error('Error fetching tallas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nombre: item.nombre || '',
      activo: item.activo !== undefined ? item.activo : true,
    });
    setEditingId(item.id_talla);
    setModalOpen(true);
  };

  const handleDelete = async (talla) => {
    if (window.confirm(`¿Estás seguro de eliminar la talla "${talla.nombre}"?`)) {
      try {
        await tallasService.delete(talla.id);
        fetchTallas();
      } catch (error) {
        console.error('Error deleting talla:', error);
      }
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({ nombre: '' });
    setErrors({});
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!formData.nombre) {
      setErrors({ nombre: 'El nombre es obligatorio' });
      return;
    }

    try {
      if (editingId) {
        await tallasService.update(editingId, formData);
      } else {
        await tallasService.create(formData);
      }
      fetchTallas();
      handleModalClose();
    } catch (error) {
      console.error('Error saving talla:', error);
      setErrors({ general: 'Ocurrió un error al guardar la talla' });
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await tallasService.update(item.id_talla, { activo: !item.activo });
      fetchTallas();
    } catch (error) {
      console.error('Error toggling active state:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tallas</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Nueva Talla
      </button>
      <DataTable
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'activo', label: 'Activo', render: (activo) => (activo ? 'Sí' : 'No') },
        ]}
        data={tallas}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        loading={loading}
      />
      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        title={editingId ? 'Editar Talla' : 'Nueva Talla'}
        submitLabel={editingId ? 'Guardar cambios' : 'Crear talla'}
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
            placeholder="Ingrese el nombre de la talla"
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

export default TallasPage;
