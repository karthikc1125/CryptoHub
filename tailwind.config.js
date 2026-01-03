/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#7927ff',
                    dark: '#09005c',
                    light: '#2193b0',
                },
            },
            animation: {
                'fade-in-down': 'fadeInDown 0.6s ease-out',
                'fade-in-up': 'fadeInUp 0.6s ease-out both',
            },
            keyframes: {
                fadeInDown: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-30px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                fadeInUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(30px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
            },
        },
    },
    plugins: [],
}
