/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				primary: {
					DEFAULT: '#8B2635',
					hover: '#6B1E2A',
					light: '#A0522D',
				},
				background: {
					DEFAULT: '#FFFFFF',
					offWhite: '#FAFAFA',
					light: '#F5F5F5',
				},
				text: {
					primary: '#1A1A1A',
					secondary: '#6B6B6B',
					light: '#8C8C8C',
				},
				accent: {
					DEFAULT: '#D4A5A5',
				},
				success: '#10B981',
				warning: '#F59E0B',
				error: '#EF4444',
				info: '#3B82F6',
				border: '#E5E7EB',
			},
			borderRadius: {
				lg: '0.75rem',
				md: '0.5rem',
				sm: '0.375rem',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
