/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'glass-card',
    'btn-primary',
    'form-input-enhanced',
    'form-label-enhanced',
    'form-select-enhanced',
    'glass-panel',
    'bg-gradient-to-r',
    'from-blue-600',
    'to-purple-600',
    'text-transparent',
    'bg-clip-text',
    'backdrop-blur-md',
    'animate-blob',
    'animation-delay-2000',
    'animation-delay-4000',
    'mix-blend-multiply',
    'filter',
    'blur-3xl',
    'opacity-20',
    'opacity-25',
    'opacity-100',
    'transition-all',
    'duration-200',
    'duration-1000',
    'group-hover:duration-200',
    'group-hover:opacity-100',
    'dark:bg-gray-900/80',
    'dark:border-gray-800',
    'dark:text-gray-300',
    'dark:text-gray-400',
    'dark:bg-gray-700',
    'dark:text-white',
    'dark:hover:text-blue-400',
    'dark:ring-gray-800',
    'dark:from-gray-900',
    'dark:to-gray-800',
    'dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]',
    'dark:bg-[conic-gradient(from_90deg_at_50%_50%,rgba(255,255,255,0.1)_0deg,transparent_60deg,transparent_300deg,rgba(255,255,255,0.1)_360deg)]'
  ],
  theme: {
    extend: {
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1), transparent)',
        'conic-gradient': 'conic-gradient(from 90deg at 50% 50%, rgba(0,0,0,0.1) 0deg, transparent 60deg, transparent 300deg, rgba(0,0,0,0.1) 360deg)',
      },
      animation: {
        blob: 'blob 7s infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        poppins: ['var(--font-poppins)'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} 