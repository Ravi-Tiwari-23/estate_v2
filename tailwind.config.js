/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: { extend: { colors: { ink: '#13201d', cream: '#f6f4ed', sage: '#dce7df', green: '#155f4b', gold: '#c88a3d' }, boxShadow: { soft: '0 18px 50px rgba(19,32,29,.10)' } } },
  plugins: []
};
