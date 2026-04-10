/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        fondo: '#18181b', // negro elegante
        primario: '#fff', // blanco
        secundario: '#232323', // gris oscuro
        gris: '#6b7280', // gris neutro
        acento: '#d4af37', // dorado
        acento2: '#eab308', // amarillo dorado
        error: '#ef4444',
        exito: '#22c55e',
        info: '#0ea5e9',
        // Puedes agregar más tonos según la identidad visual
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [require('@shadcn/ui')],
};
