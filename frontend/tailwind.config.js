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

