import { createZone, I18nZone } from '@/lib/i18n2/routing'
import { createImplicitZone } from '@/lib/i18n2/experimental'

export const i18nZones: I18nZone[] = [
	createZone({
		// matcher: /^(?:\/(\w{2}))?(|\/(?:|article|descriptionPartial))$/,
		path: /^\/(|article|descriptionPartial)$/,
		locales: ['en', 'it', 'si', 'fr', 'de', 'ru', 'gr', 'zh'],
		defaultLocale: 'en'
	}),
	createZone({
		matcher: (path) => {
			const m = path.match(/^(\/description)(?:\/(\w{2}))?$/)
			if (!m) return undefined
			return [m[2], m[1]] as const
		},
		producer: (locale, pathname) => (locale ? `${pathname}/${locale}` : pathname),
		locales: ['en', /*'it', 'si', todo */ 'fr', 'de', 'ru', 'gr', 'zh'],
		defaultLocale: 'en'
	}),
	createImplicitZone({
		matcher: /^\/query$/,
		locales: ['en', 'it', 'si', 'fr', 'de', 'ru', 'gr', 'zh'],
		defaultLocale: 'en',
		queryVisible: true
	}),
	createImplicitZone({
		locales: ['en', 'it', 'si', 'fr', 'de', 'ru', 'gr', 'zh'],
		defaultLocale: 'en'
	})
]
