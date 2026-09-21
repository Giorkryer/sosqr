/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "Cuidado Suave"
        stone: {
          50: '#FBFBFA', // Fundo base
          200: '#E7E5E4', // Borda
          600: '#57534E', // Texto secundário
          900: '#1C1917', // Texto principal
        },
        teal: {
          50: '#F0FDFA',
          700: '#0F766E', // Primária
          800: '#115E59', // Primária hover / foco
        },
        rose: {
          50: '#FFF1F2',
          200: '#FECDD3',
          500: '#F43F5E', // Alerta / Crítico
        },
        emerald: {
          600: '#059669', // Ação imediata
          700: '#047857', // Ação imediata hover
        },
      },
      fontFamily: {
        sans: ['"Atkinson Hyperlegible"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
