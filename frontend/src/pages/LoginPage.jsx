import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, isLoading, isAdmin } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Attempting login with:', { email, password }); // Debug: Log credentials
    try {
      await login(email, password);
      const { isAdmin: updatedIsAdmin } = useAuthStore.getState(); // Obtener el estado actualizado
      console.log('Login successful. isAdmin:', updatedIsAdmin); // Debug: Log isAdmin state actualizado
      // Redirigir según el rol del usuario
      if (updatedIsAdmin) {
        console.log('Redirecting to /admin/dashboard'); // Debug: Log redirection
        navigate('/admin/dashboard');
      } else {
        console.log('Redirecting to /'); // Debug: Log redirection
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data?.error || err.message); // Debug: Log error
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-1/2 bg-sidebar text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">FashionStore</h1>
        <p className="text-lg">Bienvenido de nuevo</p>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-primario mb-6">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-primario mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo"
                className={`w-full px-4 py-2 border ${error ? 'border-error' : 'border-borde'} rounded-lg focus:outline-none focus:ring-2 focus:ring-acento`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-primario mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className={`w-full px-4 py-2 border ${error ? 'border-error' : 'border-borde'} rounded-lg focus:outline-none focus:ring-2 focus:ring-acento`}
              />
            </div>
            {error && <p className="text-error text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-acento hover:bg-acentoHover text-white py-2 rounded-lg font-medium text-lg"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
