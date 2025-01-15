import { I18nConfig } from '@/lib/i18n/server'
import { createI18nMiddleware } from '@/lib/i18n'

// todo : check this
// export const runtime = 'experimental-edge'

export const i18nConfig = {
	locales: ['en', 'it', 'si', 'fr', 'de', 'ru', 'gr', 'zh'],
	defaultLocale: 'en',
	pathMatcher: /^\/(|article)$/
} satisfies I18nConfig

export const middleware = createI18nMiddleware(i18nConfig)

export const config = {
	matcher: [
		// todo : this may be problematic, maybe only include the paths
		'/((?!_next|assets|api|trpc).*)'
	]
}
