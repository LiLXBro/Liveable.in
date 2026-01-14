/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF', // Trust Blue
          hover: '#1e3a8a',
        },
        accent: {
          DEFAULT: '#16A34A', // Progress Green
        },
        background: '#F8FAFC', // Soft White
        text: {
          body: '#334155', // Slate Gray
          heading: '#0F172A', // Dark Slate
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
};
