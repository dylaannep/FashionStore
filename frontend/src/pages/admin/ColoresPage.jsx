import React, { useEffect, useState } from 'react';
import { coloresService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const ColoresPage = () => {
  const [colores, setColores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchColores();
  }, []);

  const fetchColores = async () => {
    setLoading(true);
    try {
      const response = await coloresService.getAll();
      setColores(response.data);
    } catch (error) {
      console.error('Error fetching colores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (color) => {
    setFormData({ nombre: color.nombre });
    setEditingId(color.id);
    setModalOpen(true);
  };

  const handleDelete = async (color) => {
    if (window.confirm(`¿Estás seguro de eliminar el color "${color.nombre}"?`)) {
      try {
        await coloresService.delete(color.id);
        fetchColores();
      } catch (error) {
        console.error('Error deleting color:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await coloresService.update(editingId, formData);
      } else {
        await coloresService.create(formData);
      }
      fetchColores();
      setModalOpen(false);
      setFormData({ nombre: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving color:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Colores</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Nuevo Color
      </button>
      <DataTable
        columns={[{ key: 'nombre', label: 'Nombre' }]}
        data={colores}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Color' : 'Nuevo Color'}>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
          <button type="submit" className="bg-acento text-white px-4 py-2 rounded mt-4">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ColoresPage;
