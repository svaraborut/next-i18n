import type { Config } from 'tailwindcss'

export default {
	mode: 'jit',
	content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				primary: 'var(--primary)',
				secondary: 'var(--secondary)'
			}
		}
	},
	plugins: [
		// https://docs.astro.build/en/recipes/tailwind-rendered-markdown/
		require('@tailwindcss/typography')
	]
} satisfies Config
