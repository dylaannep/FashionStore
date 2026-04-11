import React, { useEffect, useState } from 'react';
import { usuariosService, rolesService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', email: '', rol: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await usuariosService.getAll();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await rolesService.getAll();
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      nombre: item.nombre || '',
      email: item.email || '',
      rol: item.rol || '',
      activo: item.activo !== undefined ? item.activo : true,
    });
    setEditingId(item.id_usuario);
    setModalOpen(true);
  };

  const handleDelete = async (usuario) => {
    if (window.confirm(`¿Estás seguro de eliminar el usuario "${usuario.nombre}"?`)) {
      try {
        await usuariosService.delete(usuario.id);
        fetchUsuarios();
      } catch (error) {
        console.error('Error deleting usuario:', error);
      }
    }
  };

  const handleToggleActive = async (item) => {
    const accion = item.activo ? 'inactivar' : 'activar';
    if (window.confirm(`¿Deseas ${accion} "${item.nombre}"?`)) {
      await usuariosService.update(item.id_usuario, { activo: !item.activo });
      fetchUsuarios();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await usuariosService.update(editingId, formData);
      } else {
        await usuariosService.create(formData);
      }
      fetchUsuarios();
      setModalOpen(false);
      setFormData({ nombre: '', email: '', rol: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving usuario:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Nuevo Usuario
      </button>
      <DataTable
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'email', label: 'Email' },
          { key: 'rol', label: 'Rol', render: (rolId) => roles.find(r => r.id === rolId)?.nombre || 'N/A' },
        ]}
        data={usuarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <FormField
            label="Rol"
            type="select"
            options={roles.map(r => ({ value: r.id, label: r.nombre }))}
            value={formData.rol}
            onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
          />
          <button type="submit" className="bg-acento text-white px-4 py-2 rounded mt-4">
            Guardar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default UsuariosPage;
