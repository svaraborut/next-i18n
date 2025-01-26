import { Body } from '@/components/Body'
import { ReactNode } from 'react'
import { IntlProvider } from '@/lib/i18n/IntlProvider'
import { i18nConfig } from '@/middleware'
import { Metadata, ResolvingMetadata } from 'next'

// (!) THIS ONLY WORKS IF THERE IS NO `runtime=edge` DECLARATION IN THE UNDERLYING PAGE.
// THIS CAN ONLY BE ACHIEVED WITH Vercel CLI v35 (see known bugs)
export const dynamicParams = false
export const dynamic = 'error'

// Localization metadata. THIS IS A CONVOLUTED HACK TO GENERATE HREFLANG FOR ANY PAGE
// WITHIN THIS FOLDER.
export async function generateMetadata(
	{
		params
	}: {
		params: Promise<{ locale: string }>
	},
	parent: ResolvingMetadata
): Promise<Metadata> {
	const { locale } = await params
	// https://github.com/vercel/next.js/discussions/50189#discussioncomment-11480319
	const pathname = new URL((await parent).alternates?.canonical?.url!).pathname
	const normalized = pathname.replace(`/${locale}`, '')

	return {
		title: 'Static',
		description: 'Statically generated pages via SSG',
		alternates: {
			canonical: `/${locale}${normalized}`,
			languages: {
				'x-default': `/${i18nConfig.defaultLocale}${normalized}`,
				...Object.fromEntries(
					i18nConfig.locales.filter((cc) => cc !== locale).map((cc) => [cc, `/${cc}${normalized}`])
				)
			}
		}
	}
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
			<IntlProvider messages={messages} locale={locale}>
				<Body>{children}</Body>
			</IntlProvider>
		</html>
	)
}
