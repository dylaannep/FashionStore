import api from './axios';

// Categorias
export const categoriasService = {
  getAll: () => api.get('/api/categorias/'),
  getById: (id) => api.get(`/api/categorias/${id}`),
  create: (data) => api.post('/api/categorias/', data),
  update: (id, data) => api.put(`/api/categorias/${id}`, data),
  delete: (id) => api.delete(`/api/categorias/${id}`),
};

// SubCategorias
export const subcategoriasService = {
  getAll: (categoriaId) => api.get('/api/subcategorias/', { params: categoriaId ? { categoria: categoriaId } : {} }),
  getById: (id) => api.get(`/api/subcategorias/${id}`),
  create: (data) => api.post('/api/subcategorias/', data),
  update: (id, data) => api.put(`/api/subcategorias/${id}`, data),
  delete: (id) => api.delete(`/api/subcategorias/${id}`),
};

// Colores
export const coloresService = {
  getAll: () => api.get('/api/colores/'),
  getById: (id) => api.get(`/api/colores/${id}`),
  create: (data) => api.post('/api/colores/', data),
  update: (id, data) => api.put(`/api/colores/${id}`),
  delete: (id) => api.delete(`/api/colores/${id}`),
};

// Tallas
export const tallasService = {
  getAll: () => api.get('/api/tallas/'),
  getById: (id) => api.get(`/api/tallas/${id}`),
  create: (data) => api.post('/api/tallas/', data),
  update: (id, data) => api.put(`/api/tallas/${id}`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  delete: (id) => api.delete(`/api/tallas/${id}`),
};

// Productos
export const productosService = {
  getAll: () => api.get('/api/productos/'),
  getById: (id) => api.get(`/api/productos/${id}`),
  create: (data) => api.post('/api/productos/', data),
  update: (id, data) => api.put(`/api/productos/${id}`),
  delete: (id) => api.delete(`/api/productos/${id}`),
};

// Variantes
export const variantesService = {
  getAll: () => api.get('/api/variantes/'),
  getById: (id) => api.get(`/api/variantes/${id}`),
  create: (data) => api.post('/api/variantes/', data),
  update: (id, data) => api.put(`/api/variantes/${id}`, data),
  delete: (id) => api.delete(`/api/variantes/${id}`),
};

// Inventario
export const inventarioService = {
  getAll: () => api.get('/api/inventario/'),
  getById: (id) => api.get(`/api/inventario/${id}`),
  create: (data) => api.post('/api/inventario/', data),
  update: (id, data) => api.put(`/api/inventario/${id}`, data),
  delete: (id) => api.delete(`/api/inventario/${id}`),
};

// Movimientos
export const movimientosService = {
  getAll: () => api.get('/api/movimientos/'),
  getById: (id) => api.get(`/api/movimientos/${id}`),
  create: (data) => api.post('/api/movimientos/', data),
  update: (id, data) => api.put(`/api/movimientos/${id}`, data),
  delete: (id) => api.delete(`/api/movimientos/${id}`),
};

// Pedidos
export const pedidosService = {
  getAll: () => api.get('/api/pedidos/'),
  getById: (id) => api.get(`/api/pedidos/${id}`),
  create: (data) => api.post('/api/pedidos/', data),
  update: (id, data) => api.put(`/api/pedidos/${id}`, data),
  delete: (id) => api.delete(`/api/pedidos/${id}`),
};

// Usuarios
export const usuariosService = {
  getAll: () => api.get('/api/usuarios/'),
  getById: (id) => api.get(`/api/usuarios/${id}`),
  create: (data) => api.post('/api/usuarios/', data),
  update: (id, data) => api.put(`/api/usuarios/${id}`, data),
  delete: (id) => api.delete(`/api/usuarios/${id}`),
};

// Usuario-Roles
export const usuarioRolesService = {
  getAll: () => api.get('/api/usuario-roles/'),
  getById: (id) => api.get(`/api/usuario-roles/${id}`),
  create: (data) => api.post('/api/usuario-roles/', data),
  update: (id, data) => api.put(`/api/usuario-roles/${id}`, data),
  delete: (id) => api.delete(`/api/usuario-roles/${id}`),
};

// Roles
export const rolesService = {
  getAll: () => api.get('/api/roles/'),
  getById: (id) => api.get(`/api/roles/${id}`),
  create: (data) => api.post('/api/roles/', data),
  update: (id, data) => api.put(`/api/roles/${id}`, data),
  delete: (id) => api.delete(`/api/roles/${id}`),
};
