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

  const handleEdit = (categoria) => {
    setFormData({ nombre: categoria.nombre, descripcion: categoria.descripcion, activo: categoria.activo });
    setEditingId(categoria.id);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoriasService.update(editingId, formData);
      } else {
        await categoriasService.create(formData);
      }
      fetchCategorias();
      setModalOpen(false);
      setFormData({ nombre: '', descripcion: '', activo: true });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving categoria:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categorías</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Nueva Categoría
      </button>
      <DataTable
        columns={[{ key: 'nombre', label: 'Nombre' }]}
        data={categorias}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Categoría' : 'Nueva Categoría'}>
        <form onSubmit={handleSubmit}>
          <FormField label="Nombre">
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="input"
            />
          </FormField>
          <FormField label="Descripción">
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="textarea"
            />
          </FormField>
          <FormField label="Activo">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="checkbox"
            />
          </FormField>
          <button type="submit" className="bg-acento text-white px-4 py-2 rounded mt-4">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriasPage;
