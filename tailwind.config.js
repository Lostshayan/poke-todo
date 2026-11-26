/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float-slow': 'floatSlow 3.5s ease-in-out infinite',
        'pokeball-wobble': 'pokeballWobble 0.8s ease-in-out infinite',
        'pokeball-throw': 'pokeballThrow 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'flash-capture': 'flashCapture 0.5s ease-out forwards',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pokeballWobble: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-18deg)' },
          '75%': { transform: 'rotate(18deg)' },
        },
        pokeballThrow: {
          '0%': { transform: 'translate(0, 120px) scale(1.3) rotate(0deg)', opacity: '1' },
          '60%': { transform: 'translate(0, -40px) scale(0.9) rotate(360deg)', opacity: '1' },
          '100%': { transform: 'translate(0, 0px) scale(1) rotate(540deg)', opacity: '1' },
        },
        flashCapture: {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.25)', filter: 'brightness(3)' },
          '100%': { transform: 'scale(0)', filter: 'brightness(4)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
