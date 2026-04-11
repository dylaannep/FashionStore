import React, { useEffect, useState } from 'react';
import { usuarioRolesService, usuariosService, rolesService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';

const UsuarioRolesPage = () => {
  const [usuarioRoles, setUsuarioRoles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ usuario: '', rol: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchUsuarioRoles();
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchUsuarioRoles = async () => {
    setLoading(true);
    try {
      const response = await usuarioRolesService.getAll();
      setUsuarioRoles(response.data);
    } catch (error) {
      console.error('Error fetching usuario-roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await usuariosService.getAll();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
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

  const handleEdit = (usuarioRol) => {
    setFormData({ usuario: usuarioRol.usuario, rol: usuarioRol.rol });
    setEditingId(usuarioRol.id);
    setModalOpen(true);
  };

  const handleDelete = async (usuarioRol) => {
    if (window.confirm(`¿Estás seguro de eliminar la asignación del rol "${roles.find(r => r.id === usuarioRol.rol)?.nombre}" al usuario "${usuarios.find(u => u.id === usuarioRol.usuario)?.nombre}"?`)) {
      try {
        await usuarioRolesService.delete(usuarioRol.id);
        fetchUsuarioRoles();
      } catch (error) {
        console.error('Error deleting usuario-rol:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await usuarioRolesService.update(editingId, formData);
      } else {
        await usuarioRolesService.create(formData);
      }
      fetchUsuarioRoles();
      setModalOpen(false);
      setFormData({ usuario: '', rol: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving usuario-rol:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Usuario-Roles</h1>
      <button
        className="bg-acento text-white px-4 py-2 rounded mb-4"
        onClick={() => setModalOpen(true)}
      >
        Nueva Asignación
      </button>
      <DataTable
        columns={[
          { key: 'usuario', label: 'Usuario', render: (usuarioId) => usuarios.find(u => u.id === usuarioId)?.nombre || 'N/A' },
          { key: 'rol', label: 'Rol', render: (rolId) => roles.find(r => r.id === rolId)?.nombre || 'N/A' },
        ]}
        data={usuarioRoles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Editar Asignación' : 'Nueva Asignación'}>
        <form onSubmit={handleSubmit}>
          <FormField
            label="Usuario"
            type="select"
            options={usuarios.map(u => ({ value: u.id, label: u.nombre }))}
            value={formData.usuario}
            onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
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

export default UsuarioRolesPage;
