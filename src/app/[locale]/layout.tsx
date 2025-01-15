import { Body } from '@/components/Body'
import { ReactNode } from 'react'
import { IntlProvider } from '@/lib/i18n/provider'
import { i18nConfig } from '@/middleware'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

export async function generateMetadata({
	params
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const baseUrl = process.env.NEXT_PUBLIC_URL
	const { locale } = await params
	// todo : ugly hack
	const currentUrl = (await headers()).get('x-url')
	const pathname = new URL(currentUrl!).pathname.replace(`/${locale}`, '')

	// todo : how to add locales ?
	return {
		title: 'Translated',
		description: 'Translated',
		alternates: {
			canonical: `${baseUrl}/${locale}${pathname}`,
			languages: {
				'x-default': `${baseUrl}/${i18nConfig.defaultLocale}${pathname}`,
				...Object.fromEntries(
					i18nConfig.locales
						.filter((cc) => cc !== locale)
						.map((cc) => [cc, `${baseUrl}/${cc}${pathname}`])
				)
			}
		}
	}
}

// todo : not working
// export const dynamicParams = false
// export const dynamic = 'force-static'

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
	if (!i18nConfig.locales.includes(locale)) {
		notFound()
	}

	const messages = await getMessages(locale)

	return (
		<html lang={locale}>
			<IntlProvider messages={messages} locale={locale}>
				<Body>{children}</Body>
			</IntlProvider>
		</html>
	)
}
