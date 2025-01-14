import type { Metadata } from 'next'
import '@/components/globals.css'
import { Body } from '@/components/Body'
import { i18nConfig } from '@/i18n'
import { cache } from 'react'
import { IntlProvider } from '@/i18n/proxy'
import { cookies, headers } from 'next/headers'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

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

// ??
const getNow = cache(() => new Date())
const getTimeZone = cache(() => Intl.DateTimeFormat().resolvedOptions().timeZone)

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	// >> NON STATIC : Manage languages
	let locale: string | undefined = undefined
	if (!locale) {
		const cookieList = await cookies()
		locale = cookieList.get('locale')?.value
		if (locale && !i18nConfig.locales.includes(locale)) locale = undefined
	}
	if (!locale) {
		const headersList = await headers()
		const languages = new Negotiator({
			headers: { 'accept-language': headersList.get('accept-language') ?? undefined }
		}).languages()
		locale = match(languages, i18nConfig.locales, i18nConfig.defaultLocale)
	}
	// << NON STATIC : Manage languages
	console.log(`🍞 rendering ${locale}`)

	const messages = await getMessages(locale)

	return (
		<html lang={locale}>
			<IntlProvider messages={messages} locale={locale} now={getNow()} timeZone={getTimeZone()}>
				<Body>{children}</Body>
			</IntlProvider>
		</html>
	)
}
