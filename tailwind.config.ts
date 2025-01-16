import type { Config } from 'tailwindcss'

export default {
	content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)'
			}
		}
	},
	plugins: [
		// https://docs.astro.build/en/recipes/tailwind-rendered-markdown/
		require('@tailwindcss/typography')
	]
} satisfies Config
