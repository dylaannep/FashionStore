import React, { useEffect, useState } from 'react';
import { subcategoriasService, categoriasService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const SubcategoriasPage = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', categoria: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSubcategorias();
    fetchCategorias();
  }, []);

  const fetchSubcategorias = async () => {
    setLoading(true);
    try {
      const response = await subcategoriasService.getAll();
      setSubcategorias(response.data);
    } catch (error) {
      console.error('Error fetching subcategorias:', error);
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

  const handleEdit = (subcategoria) => {
    setFormData({ nombre: subcategoria.nombre, categoria: subcategoria.categoria });
    setEditingId(subcategoria.id);
    setModalOpen(true);
  };

  const handleDelete = async (subcategoria) => {
    if (window.confirm(`¿Estás seguro de eliminar la subcategoría "${subcategoria.nombre}"?`)) {
      try {
        await subcategoriasService.delete(subcategoria.id);
        fetchSubcategorias();
      } catch (error) {
        console.error('Error deleting subcategoria:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await subcategoriasService.update(editingId, formData);
      } else {
        await subcategoriasService.create(formData);
      }
      fetchSubcategorias();
      setModalOpen(false);
      setFormData({ nombre: '', categoria: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving subcategoria:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Subcategorías</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Nueva Subcategoría
      </button>
      <DataTable
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'categoria', label: 'Categoría', render: (categoriaId) => categorias.find(c => c.id === categoriaId)?.nombre || 'N/A' },
        ]}
        data={subcategorias}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Subcategoría' : 'Nueva Subcategoría'}>
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

export default SubcategoriasPage;
