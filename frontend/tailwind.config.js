const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
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
        'brand-primary': '#000000',  // negro (marca principal)
        'brand-secondary': '#ffffff', // blanco (marca secundaria)
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },
      animationDelay: {
        '2000': '2000ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
});
