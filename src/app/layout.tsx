import type { Metadata } from 'next'
import '@/components/globals.css'
import { Body } from '@/components/Body'
import { IntlProvider } from '@/lib/i18n/provider'
import { i18nConfig } from '@/middleware'
import { getLocale } from '@/lib/i18n/server'

export const metadata: Metadata = {
	title: 'Root',
	description: 'Root'
}

async function getMessages(locale: string) {
	try {
		return (await import(`@/i18n/main/${locale}`)).default
	} catch (e) {
		return (await import(`@/i18n/main/${i18nConfig.defaultLocale}`)).default
	}
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()
	const messages = await getMessages(locale)

	return (
		<html lang={locale}>
			<IntlProvider messages={messages} locale={locale}>
				<Body>{children}</Body>
			</IntlProvider>
		</html>
	)
}
