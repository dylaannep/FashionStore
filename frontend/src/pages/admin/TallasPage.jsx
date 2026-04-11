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

  const handleToggleActive = async (item) => {
    const accion = item.activo ? 'inactivar' : 'activar';
    if (window.confirm(`¿Deseas ${accion} "${item.nombre}"?`)) {
      await tallasService.update(item.id_talla, { activo: !item.activo });
      fetchTallas();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await tallasService.update(editingId, formData);
      } else {
        await tallasService.create(formData);
      }
      fetchTallas();
      setModalOpen(false);
      setFormData({ nombre: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving talla:', error);
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
        columns={[{ key: 'nombre', label: 'Nombre' }]}
        data={tallas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Talla' : 'Nueva Talla'}>
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

export default TallasPage;
