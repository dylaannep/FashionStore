import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import AdminLayout from '../components/shared/AdminLayout';
import CategoriasPage from '../pages/admin/CategoriasPage';
import SubCategoriasPage from '../pages/admin/SubcategoriasPage';
import ColoresPage from '../pages/admin/ColoresPage';
import TallasPage from '../pages/admin/TallasPage';
import ProductosPage from '../pages/admin/ProductosPage';
import ProductoVariantesPage from '../pages/admin/ProductoVariantesPage';
import InventarioPage from '../pages/admin/InventarioPage';
import MovimientosPage from '../pages/admin/MovimientosPage';
import PedidosPage from '../pages/admin/PedidosPage';
import UsuariosPage from '../pages/admin/UsuariosPage';
import UsuarioRolesPage from '../pages/admin/UsuarioRolesPage';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuthStore();
  if (isLoading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/" />;
  return children;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: <div>Página principal de la tienda</div>,
  },
  {
    path: '/productos',
    element: <div>Listado de productos</div>,
  },
  {
    path: '/categorias/:id',
    element: <div>Detalle de categoría</div>,
  },
  {
    path: '/producto/:id',
    element: <div>Detalle de producto</div>,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'categorias', element: <CategoriasPage /> },
      { path: 'subcategorias', element: <SubCategoriasPage /> },
      { path: 'colores', element: <ColoresPage /> },
      { path: 'tallas', element: <TallasPage /> },
      { path: 'productos', element: <ProductosPage /> },
      { path: 'producto-variantes', element: <ProductoVariantesPage /> },
      { path: 'inventario', element: <InventarioPage /> },
      { path: 'movimientos', element: <MovimientosPage /> },
      { path: 'pedidos', element: <PedidosPage /> },
      { path: 'usuarios', element: <UsuariosPage /> },
      { path: 'usuario-roles', element: <UsuarioRolesPage /> },
      { index: true, element: <Navigate to="dashboard" /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
