/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f9ff',
          100: '#b3f0ff',
          200: '#80e7ff',
          300: '#4ddeff',
          400: '#1ad5ff',
          500: '#00bcd4',
          600: '#00a4b8',
          700: '#008c9c',
          800: '#007480',
          900: '#005c64',
        },
        
        secondary: {
          50: '#fff3e0',
          100: '#ffe0b3',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800',
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
        },

        neutral: {
          25: '#fcfcfd',   
          50: '#f9fafb',   
          100: '#f3f4f6',  
          200: '#e5e7eb',  
          300: '#d1d5db',  
          400: '#9ca3af',  
          500: '#6b7280',  
          600: '#4b5563',  
          700: '#374151', 
          800: '#1f2937',  
          900: '#111827',
        },

        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },

        tecsup: {
          cyan: '#00bcd4',
          'cyan-light': '#4dd0e1',
          'cyan-dark': '#0097a7',
          
          'card-bg': '#ffffff',
          'input-bg': '#f8fafc',
          'surface': '#f1f5f9',
          
          'text-primary': '#1e293b',
          'text-secondary': '#64748b',
          'text-muted': '#94a3b8',
          'text-link': '#0ea5e9',
        },

        badge: {
          'nuevo-bg': '#1f2937',
          'nuevo-text': '#ffffff',
          'activo-bg': '#fbbf24',
          'activo-text': '#92400e',
          'laboratorio-bg': '#e0e7ff',
          'laboratorio-text': '#3730a3',
          'servicio-bg': '#fef3c7',
          'servicio-text': '#92400e',
        }
      },

      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        'title': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'subtitle': ['18px', { lineHeight: '24px', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label': ['14px', { lineHeight: '20px', fontWeight: '500' }],
      },

      borderRadius: {
        'button': '12px',
        'card': '16px',
        'input': '8px',
      },

      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'button': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'input-focus': '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  presets: [require("nativewind/preset")],
  plugins: [],
};