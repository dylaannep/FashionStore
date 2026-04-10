import React from 'react';
import { useAuthStore } from '../../store/authStore';

export default function DashboardPage() {
  const { usuario } = useAuthStore();
  return (
    <div>
      <h1 className="text-2xl font-bold text-acento mb-6">Bienvenido, {usuario?.nombre}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-secundario rounded-lg p-6 shadow text-center">
          <div className="text-3xl font-bold text-acento">0</div>
          <div className="text-gris mt-2">Productos</div>
        </div>
        <div className="bg-secundario rounded-lg p-6 shadow text-center">
          <div className="text-3xl font-bold text-acento">0</div>
          <div className="text-gris mt-2">Pedidos</div>
        </div>
        <div className="bg-secundario rounded-lg p-6 shadow text-center">
          <div className="text-3xl font-bold text-acento">0</div>
          <div className="text-gris mt-2">Usuarios</div>
        </div>
      </div>
    </div>
  );
}
