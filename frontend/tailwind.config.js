/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fondo: '#F5F7F2',
        superficie: '#FFFFFF',
        'verde-oscuro': {
          DEFAULT: '#294936',
          hover: '#1e3728',
        },
        salvia: {
          DEFAULT: '#648A6E',
          light: '#EAF0EB',
          dark: '#4c6c54',
        },
        'verde-claro': '#A8C3A5',
        coral: {
          DEFAULT: '#D98262',
          light: '#FBF0EC',
          hover: '#c56e4e',
        },
        amarillo: {
          DEFAULT: '#E6C66A',
          light: '#FCF8EC',
        },
        'texto-principal': '#26352A',
        'texto-secundario': '#5D6B61',
        borde: '#DCE4DC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
