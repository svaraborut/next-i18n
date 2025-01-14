import { i18nConfig } from '@/i18n'
import { cache } from 'react'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { headers } from 'next/headers'
import { Content } from '@/app/query/content'
import { IntlProvider } from '@/i18n/proxy'

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

export default async function Page({
	searchParams
}: Readonly<{
	searchParams?: { [key: string]: string | string[] | undefined }
}>) {
	// >> NON STATIC : Manage languages
	let locale: string | undefined = undefined
	if (!locale) {
		locale =
			typeof searchParams?.['ln'] === 'string' ? searchParams?.['ln'] : searchParams?.['ln']?.[0]
		if (locale && !i18nConfig.locales.includes(locale)) locale = undefined
	}
	if (!locale) {
		const headersList = await headers()
		const languages = new Negotiator({
			headers: { 'accept-language': headersList.get('accept-language') ?? undefined }
		}).languages()
		locale = match(languages, i18nConfig.locales, i18nConfig.defaultLocale)
	}
	console.log(`🍞 rendering ${locale}`)
	// << NON STATIC : Manage languages

	const messages = await getMessages(locale)

	return (
		<IntlProvider messages={messages} locale={locale} now={getNow()} timeZone={getTimeZone()}>
			<Content />
		</IntlProvider>
	)
}
