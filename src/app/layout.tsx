import '@/components/globals.scss'
import { Body } from '@/components/Body'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Root',
	description: 'Root'
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html>
			<Body>{children}</Body>
		</html>
	)
}
