import type { Metadata } from 'next'
import '@/components/globals.css'
import { Body } from '@/components/Body'

export const metadata: Metadata = {
	title: 'Query',
	description: 'Query'
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='??'>
			<Body>{children}</Body>
		</html>
	)
}
