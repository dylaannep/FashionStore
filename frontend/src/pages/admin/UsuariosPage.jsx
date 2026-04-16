import React, { useEffect, useState } from 'react';
import { usuariosService, rolesService, usuarioRolesService } from '../../api/services';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import FormField from '../../components/ui/FormField';
import { Eye, EyeOff } from 'lucide-react';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    nombre: '', 
    email: '', 
    password: '',
    rol: '' 
  });
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
      // Filtrar solo roles activos
      const rolesActivos = response.data.filter(r => r.activo === true || r.activo === 1);
      setRoles(rolesActivos);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  // Obtener el nombre del rol principal del usuario
  const getRolNombre = (usuario) => {
    if (usuario.roles && usuario.roles.length > 0) {
      return usuario.roles[0].rol_nombre || 'N/A';
    }
    return 'N/A';
  };

  // Obtener el ID del rol principal del usuario
  const getRolId = (usuario) => {
    if (usuario.roles && usuario.roles.length > 0) {
      return usuario.roles[0].id_rol || '';
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.email || !/^[\w\.-]+@[\w\.-]+\.\w{2,}$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!editingId && (!formData.password || formData.password.length < 6)) {
      newErrors.password = 'La contraseña es obligatoria y debe tener al menos 6 caracteres';
    }

    if (!formData.rol) {
      newErrors.rol = 'Debe seleccionar un rol';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (item) => {
    setFormData({
      nombre: item.nombre || '',
      email: item.email || '',
      password: '', // No mostrar contraseña actual por seguridad
      rol: getRolId(item),
    });
    setErrors({});
    setEditingId(item.id_usuario);
    setModalOpen(true);
  };

  const handleToggleActive = async (usuario) => {
    const accion = usuario.activo ? 'inactivar' : 'activar';
    if (window.confirm(`¿Deseas ${accion} al usuario "${usuario.nombre}"? ${!usuario.activo ? 'El usuario podrá volver a iniciar sesión.' : 'El usuario no podrá iniciar sesión.'}`)) {
      try {
        await usuariosService.update(usuario.id_usuario, { activo: !usuario.activo });
        fetchUsuarios();
      } catch (error) {
        console.error('Error toggling usuario:', error);
        alert('Error al actualizar el usuario');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const dataToSend = { ...formData };

      if (editingId) {
        // En edición, no enviar contraseña si está vacía
        if (!dataToSend.password) {
          delete dataToSend.password;
        }
        await usuariosService.update(editingId, {
          nombre: dataToSend.nombre,
          email: dataToSend.email,
          ...(dataToSend.password && { password: dataToSend.password })
        });

        // Actualizar rol si cambió
        const usuarioActual = usuarios.find(u => u.id_usuario === editingId);
        const rolActualId = getRolId(usuarioActual);
        if (rolActualId !== dataToSend.rol) {
          // Revocar rol anterior
          if (rolActualId) {
            await usuarioRolesService.delete(`${editingId}/${rolActualId}`);
          }
          // Asignar nuevo rol
          await usuarioRolesService.create({ id_usuario: editingId, id_rol: dataToSend.rol });
        }
      } else {
        const newUsuario = await usuariosService.create({
          nombre: dataToSend.nombre,
          email: dataToSend.email,
          password: dataToSend.password
        });

        // Asignar rol al nuevo usuario
        if (newUsuario.id_usuario && dataToSend.rol) {
          await usuarioRolesService.create({ 
            id_usuario: newUsuario.id_usuario, 
            id_rol: dataToSend.rol 
          });
        }
      }

      fetchUsuarios();
      setModalOpen(false);
      setFormData({ nombre: '', email: '', password: '', rol: '' });
      setErrors({});
      setEditingId(null);
    } catch (error) {
      console.error('Error saving usuario:', error);
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Error al guardar el usuario');
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 transition"
        onClick={() => {
          setFormData({ nombre: '', email: '', password: '', rol: '' });
          setErrors({});
          setEditingId(null);
          setModalOpen(true);
        }}
      >
        Nuevo Usuario
      </button>
      <DataTable
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'email', label: 'Email' },
          { 
            key: 'rol', 
            label: 'Rol', 
            render: (_, usuario) => getRolNombre(usuario)
          },
          {
            key: 'estado',
            label: 'Estado',
            render: (_, usuario) => (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                usuario.activo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {usuario.activo ? 'Activo' : 'Inactivo'}
              </span>
            )
          }
        ]}
        data={usuarios}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        loading={loading}
      />
      <Modal 
        isOpen={modalOpen} 
        onClose={() => {
          setModalOpen(false);
          setErrors({});
        }} 
        onSubmit={handleSubmit}
        title={editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
        submitLabel={editingId ? 'Actualizar Usuario' : 'Crear Usuario'}
      >
        <form className="space-y-4">
          {/* Nombre */}
          <div>
            <FormField
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Juan Pérez"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          {/* Email */}
          <div>
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Ej: usuario@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {editingId ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editingId ? 'Dejar en blanco para mantener la actual' : 'Mínimo 6 caracteres'}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Rol */}
          <div>
            <FormField
              label="Rol"
              type="select"
              options={roles.map(r => ({ 
                value: r.id_rol || r.id, 
                label: r.nombre 
              }))}
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
            />
            {errors.rol && <p className="text-red-500 text-xs mt-1">{errors.rol}</p>}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsuariosPage;
