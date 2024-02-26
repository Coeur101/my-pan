/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: [],
  theme: {
    extend: {
      colors: {
        btn: {
          primary: '#1677ff',
        },
      },
      backgroundImage: {
        'login-warpper': 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
        'share-warpper': "url('@/assets/share_bg.png')",
      },
    },
  },
  plugins: [],
}
