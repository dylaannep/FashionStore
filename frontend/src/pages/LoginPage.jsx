import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      // Redirección automática por el store
    } catch (err) {
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
