'use server'
import { cookies, headers } from 'next/headers'

export interface I18nConfig {
	locales: string[]
	defaultLocale: string
	// Match routes that should be redirected to localized urls
	pathMatcher: RegExp
	// Name of the cookie to hold the locale setting
	cookieName?: string
	cookieAge?: number
}

/**
 * Set the language cookie via server-side actions
 */
export async function setLocale(
	{ cookieName = 'locale', cookieAge = 31_536_000, ...config }: I18nConfig,
	locale: string
) {
	const cookieStore = await cookies()
	if (!locale || !config.locales.includes(locale)) {
		locale = cookieStore.get(cookieName)?.value || config.defaultLocale
	}
	cookieStore.set(cookieName, locale, {
		maxAge: cookieAge,
		httpOnly: false,
		secure: false,
		sameSite: 'lax'
	})
}

/**
 * Get the current locale via server-side (works behind the middleware)
 */
export async function getLocale(): Promise<string> {
	await cookies()
	const header = (await headers()).get('x-locale') ?? 'en' // todo : remove
	if (!header) throw new Error('getLocale expects the locale middleware to be used')
	return header
}
