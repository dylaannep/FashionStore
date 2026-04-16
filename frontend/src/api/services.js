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
  create: (data) => api.post('/api/productos/', data, {
    headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
  }),
  update: (id, data) => api.put(`/api/productos/${id}`, data, {
    headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' },
  }),
  delete: (id) => api.delete(`/api/productos/${id}`),
};

// Variantes
export const variantesService = {
  getAll: () => api.get('/api/producto-variantes/'),
  getById: (id) => api.get(`/api/producto-variantes/${id}`),
  create: (data) => api.post('/api/producto-variantes/', data),
  update: (id, data) => api.put(`/api/producto-variantes/${id}`, data),
  delete: (id) => api.delete(`/api/producto-variantes/${id}`),
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
  getByUsuario: (id_usuario) => api.get(`/api/pedidos/usuario/${id_usuario}`),
  cambiarEstado: (id_pedido, id_estado) => api.put(`/api/pedidos/${id_pedido}/estado`, { id_estado }),
};

// Función auxiliar para crear pedidos (wrapper con mejor manejo de errores)
export const createPedido = async (payload) => {
  try {
    const response = await api.post('/api/pedidos/', payload);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Error al crear el pedido';
    throw new Error(errorMessage);
  }
};

// Función para obtener pedidos del usuario logueado
export const getMyPedidos = async () => {
  try {
    const response = await api.get('/api/pedidos/usuario/me');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Error al obtener pedidos';
    throw new Error(errorMessage);
  }
};

// Función para cambiar estado de un pedido
export const changePedidoEstado = async (id_pedido, id_estado) => {
  try {
    const response = await api.put(`/api/pedidos/${id_pedido}/estado`, { id_estado });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Error al cambiar el estado del pedido';
    throw new Error(errorMessage);
  }
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

// Métodos de Pago
export const metodosPagoService = {
  getAll: () => api.get('/api/metodos-pago/'),
  getById: (id) => api.get(`/api/metodos-pago/${id}`),
  create: (data) => api.post('/api/metodos-pago/', data),
  update: (id, data) => api.put(`/api/metodos-pago/${id}`, data),
  delete: (id) => api.delete(`/api/metodos-pago/${id}`),
};

// Función auxiliar para obtener métodos de pago
export const getMetodosPago = async () => {
  try {
    const response = await api.get('/api/metodos-pago/');
    return response.data || [];
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    throw new Error('No se pudieron cargar los métodos de pago');
  }
};

// Roles
export const rolesService = {
  getAll: () => api.get('/api/roles/'),
  getById: (id) => api.get(`/api/roles/${id}`),
  create: (data) => api.post('/api/roles/', data),
  update: (id, data) => api.put(`/api/roles/${id}`, data),
  delete: (id) => api.delete(`/api/roles/${id}`),
};
