/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        fondo: '#f8fafc',        // blanco grisáceo (fondo principal)
        primario: '#1e293b',     // slate-800 (texto principal)
        secundario: '#ffffff',   // blanco (cards, modals)
        sidebar: '#1e3a5f',      // navy oscuro (sidebar)
        sidebarHover: '#2d5a8e', // navy medio (hover sidebar)
        gris: '#64748b',         // gris neutro (texto secundario)
        borde: '#e2e8f0',        // gris claro (bordes)
        acento: '#2563eb',       // azul profesional (botones primarios, énfasis)
        acentoHover: '#1d4ed8',  // azul oscuro (hover)
        success: '#16a34a',      // verde (éxito, activo)
        error: '#dc2626',        // rojo (error, inactivo)
        warning: '#d97706',      // ámbar (advertencia)
        info: '#0891b2',         // cyan (información)
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
