/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'glass-card', 
    'glass-panel', 
    'form-input-enhanced', 
    'form-select-enhanced', 
    'form-label-enhanced', 
    'btn-primary',
    'animate-fadeIn',
    'animate-blob',
    'animation-delay-2000',
    'animation-delay-4000',
    'card-hover-effect',
    'bg-grid-slate-100'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} 