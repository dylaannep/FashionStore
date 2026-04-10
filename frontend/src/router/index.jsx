import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import AdminLayout from '../components/shared/AdminLayout';
// Importa más páginas según las vayas creando

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

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/" element={<div>Página principal de la tienda</div>} />
        <Route path="/productos" element={<div>Listado de productos</div>} />
        <Route path="/categorias/:id" element={<div>Detalle de categoría</div>} />
        <Route path="/producto/:id" element={<div>Detalle de producto</div>} />

        {/* Rutas protegidas de administrador */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="productos" element={<div>Admin Productos</div>} />
          <Route path="categorias" element={<div>Admin Categorías</div>} />
          <Route path="inventario" element={<div>Admin Inventario</div>} />
          <Route path="pedidos" element={<div>Admin Pedidos</div>} />
          <Route path="usuarios" element={<div>Admin Usuarios</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
