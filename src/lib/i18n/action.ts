'use server'
import { i18nConfig } from '@/middleware'
import { setLocale } from '@/lib/i18n/server'

export async function setLocaleAction(locale: string) {
	await setLocale(i18nConfig, locale)
}
