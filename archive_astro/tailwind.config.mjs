/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'; // <--- 1. Import ini

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Plus Jakarta Sans"', 'sans-serif'],
			},
		},
	},
	plugins: [
        typography, // <--- 2. Masukkan di sini
    ], 
}