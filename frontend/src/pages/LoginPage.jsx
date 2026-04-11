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
    <div className="min-h-screen flex items-center justify-center bg-fondo">
      <div className="bg-secundario p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-acento">FashionStore</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-primario mb-1">Correo electrónico</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded bg-fondo text-primario border border-gris focus:outline-none focus:border-acento"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-primario mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded bg-fondo text-primario border border-gris focus:outline-none focus:border-acento"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="mb-4 text-error text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 rounded bg-acento text-fondo font-semibold hover:bg-acento2 transition disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
