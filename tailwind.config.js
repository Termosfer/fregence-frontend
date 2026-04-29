/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      keyframes: {
        // Sənin mövcud keyframe-lərin
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        // YENİ: Sonsuz axın üçün keyframe
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        // Sənin mövcud animasiyaların
        'slide-in': 'slide-in 0.5s ease-in-out forwards',
        'slide-out': 'slide-out 0.5s ease-in-out forwards',
        // YENİ: 35 saniyəlik lüks yavaş axın
        'marquee': 'marquee 35s linear infinite',
      },
    },
  },
  plugins: [],
};