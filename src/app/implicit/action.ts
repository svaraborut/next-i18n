'use server'
import { cookies } from 'next/headers'
import { i18nConfig } from '@/i18n'

export async function setLanguage(locale: string) {
	const cookieStore = await cookies()

	// Coerce
	if (!locale || !i18nConfig.locales.includes(locale)) {
		locale = cookieStore.get('locale')?.value || i18nConfig.defaultLocale
	}

	// Set cookie
	cookieStore.set('locale', locale, {
		maxAge: 31_536_000, // year
		httpOnly: false,
		secure: false,
		sameSite: 'lax'
	})
}
