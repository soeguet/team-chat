/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  html: {
    inject: false,
    minify: true,
    template: 'public/index.html',
    chunksSortMode: 'manual',
    chunks: ['manifest', 'vendor', 'main'],
    preload: ['**/*.js', '**/*.css'],
  },
}
