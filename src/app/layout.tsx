import '@/components/globals.scss'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Root',
	description: 'Root',
	// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
	metadataBase: new URL(process.env.NEXT_PUBLIC_URL!),
	// https://github.com/vercel/next.js/discussions/50189#discussioncomment-11480319
	alternates: {
		canonical: './'
	}
}

// Layout without any style
// https://stackoverflow.com/questions/75970151
export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return children
}
