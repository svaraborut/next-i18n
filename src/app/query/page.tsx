import { Content } from '@/app/query/content'
import { IntlProvider } from '@/lib/i18n/provider'
import { i18nConfig } from '@/middleware'
import { getLocale } from '@/lib/i18n/server'

async function getMessages(locale: string) {
	try {
		return (await import(`@/i18n/main/${locale}`)).default
	} catch (e) {
		return (await import(`@/i18n/main/${i18nConfig.defaultLocale}`)).default
	}
}

export default async function Page() {
	const locale = await getLocale()
	const messages = await getMessages(locale)
	// console.log(`🍞 rendering ${locale}`)

	return (
		<IntlProvider messages={messages} locale={locale}>
			<Content />
		</IntlProvider>
	)
}
