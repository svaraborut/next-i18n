import { NextRequest, NextResponse } from 'next/server'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'
import { I18nConfig } from '@/lib/i18n/server'

/**
 * Create a middleware to handle the complete i18n detection, cookie management and
 * redirect pipeline. Detection priority is PATH, QUERY, COOKIES, LOCALE and redirects
 * will be performed only for pages that match pathMatcher
 */
export function createI18nMiddleware({
	cookieName = 'locale',
	cookieAge = 31_536_000,
	...config
}: I18nConfig) {
	function getPreferredLocale(request: NextRequest) {
		// Pathname
		const { pathname } = request.nextUrl
		let locale = config.locales.find(
			(cc) => pathname.startsWith(`/${cc}/`) || pathname === `/${cc}`
		)
		if (locale) return { locale, source: 'path' }

		// Query
		locale = request.nextUrl.searchParams.get('ln') || undefined
		if (locale && config.locales.includes(locale)) return { locale, source: 'query' }

		// Cookies
		locale = request.cookies.get(cookieName)?.value
		if (locale && config.locales.includes(locale)) return { locale, source: 'cookie' }

		// Locale
		const languages = new Negotiator({
			headers: { 'accept-language': request.headers.get('accept-language') ?? undefined }
		}).languages()
		return { locale: match(languages, config.locales, config.defaultLocale) }
	}

	return (request: NextRequest) => {
		const detection = getPreferredLocale(request)
		request.headers.set('x-locale', detection.locale)

		// THIS ROUTE SHOULD BE PREFIXED BY A LOCALE BUT CURRENTLY IS NOT
		// THEREFORE TRIGGER A REDIRECT TO CONCILIATE THIS ISSUE
		const { pathname } = request.nextUrl
		if (detection.source !== 'path' && pathname.match(config.pathMatcher)) {
			request.nextUrl.pathname = `/${detection.locale}${pathname}`
			return NextResponse.redirect(request.nextUrl)
		}

		// todo : experiments
		// (?) Path name without any locale prefix
		// let canonicalPath = detection.source === 'path' ? pathname.substring(detection.locale.length + 1) : pathname
		// if (canonicalPath.match(config.pathMatcher)) {
		//
		// }

		// Process the request
		const res = NextResponse.next()
		// todo : (!) THIS APPROACH POLLUTES THE ACTUAL RESPONSE HEADERS
		// todo : this seems kind of a hack that goes against next.js. It is not
		//        clear why this data is not accessible within the layout components
		res.headers.set('x-url', request.url)
		// Inject locale as a header to all requests to pass it to layouts/pages
		// (NOT CLEAR WHY IS SET TO THE RESPONSE)
		res.headers.set('x-locale', detection.locale)

		// Make sure to sync the cookie to the current locale
		// todo : disabled
		// if (detection.source !== 'cookie') {
		// 	res.cookies.set(cookieName, detection.locale, {
		// 		maxAge: cookieAge,
		// 		httpOnly: false,
		// 		secure: false,
		// 		sameSite: 'lax'
		// 	})
		// }
		return res
	}
}
