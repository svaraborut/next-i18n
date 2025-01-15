import type { Metadata } from 'next'
import { Body } from '@/components/Body'
import { ReactNode } from 'react'
import { HeadHreflang } from '@/components/HeadHreflang'
import { IntlProvider } from '@/lib/i18n/provider'
import { i18nConfig } from '@/middleware'

export const metadata: Metadata = {
	title: 'Translated',
	description: 'Translated'
}

// Generate locales at root level, this should be inherited by all child layouts
export async function generateStaticParams() {
	return i18nConfig.locales.map((locale) => ({ locale }))
}

async function getMessages(locale: string) {
	try {
		return (await import(`@/i18n/main/${locale}`)).default
	} catch (e) {
		return (await import(`@/i18n/main/${i18nConfig.defaultLocale}`)).default
	}
}

export default async function RootLayout({
	children,
	params
}: Readonly<{
	children: ReactNode
	params: Promise<{ locale: string }>
}>) {
	const { locale } = await params
	const messages = await getMessages(locale)

	return (
		<html lang={locale}>
			<HeadHreflang locale={locale} />
			<IntlProvider messages={messages} locale={locale}>
				<Body>{children}</Body>
			</IntlProvider>
		</html>
	)
}
