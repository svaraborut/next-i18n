import { useRouter } from 'next/navigation'
import { useLocale } from 'use-intl'
import { useCallback } from 'react'
import { setLocaleAction } from '@/lib/i18n/action'

export interface UseLocaleSwitchResult {
	currentLocale: string
	setLocale: (locale: string) => void
}

export function useLocaleSwitch() {
	const router = useRouter()
	const currentLocale = useLocale()

	const setLocale = useCallback((locale: string) => {
		;(async () => {
			console.log(`🌐 switching to ${locale}`)
			await setLocaleAction(locale)
			// This is required to force the current page to refresh, otherwise the
			// content of the page will be stale at the old language and only update
			// the next time Next.js deems it necessary
			router.refresh()
		})().catch(console.error)
	}, [])

	return {
		currentLocale,
		setLocale
	}
}
