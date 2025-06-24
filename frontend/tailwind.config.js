/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // These paths tell Tailwind CSS where to look for your classes
    // It's crucial that these paths correctly point to your source files.
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all .js, .jsx, .ts, .tsx files in the src folder and its subfolders
    "./public/index.html",         // Also scans your main HTML file
  ],
  theme: {
    extend: {}, // This is where you can customize Tailwind's default theme (colors, fonts, etc.)
  },
  plugins: [], // Add any Tailwind plugins here
}

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'bride-pink': '#ff6b8b',
        'bride-rose': '#ff4d6d',
        'bride-mauve': '#c9184a',
        'bride-peach': '#ffddd2',
        'bride-cream': '#fff1e6',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('https://50gramwedding.com/wp-content/uploads/2023/05/Wedding-2-9.png')",
        'flower-texture': "url('https://www.transparenttextures.com/patterns/floral.png')",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}