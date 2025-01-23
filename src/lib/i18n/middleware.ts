import { NextRequest, NextResponse } from 'next/server'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

export type I18nLocale = string

export interface I18nConfig {
	locales: I18nLocale[]
	defaultLocale: I18nLocale
}

export interface I18nServerConfig extends I18nConfig {
	showDefault?: boolean
	matcher: {
		// If false=disabled, true=always, RegExp=only when match
		[K in 'url' | 'query' | 'hidden']?: boolean | RegExp
	}
	cookieName?: string
	queryName?: string
	cookieOptions?: {
		maxAge: number
	}
}

/**
 * todo : describe
 *
 * All routes matching this middleware should be served under a [locale] folder as all requests
 * will be rewritten to that url.
 */
export function createMiddleware(config: I18nServerConfig): (req: NextRequest) => NextResponse {
	// Options
	const { locales, defaultLocale, showDefault, cookieName = 'locale', queryName = 'ln' } = config
	const matcher = {
		url: true,
		query: false,
		hidden: false,
		...config.matcher
	}
	const cookieOptions = {
		maxAge: 31_536_000,
		httpOnly: false,
		secure: false,
		sameSite: 'lax',
		...config.cookieOptions
	} as const

	// Utils
	function getExpectedLocale(request: NextRequest) {
		// Cookie
		let locale = request.cookies.get(cookieName)?.value
		if (locale && locales.includes(locale)) return locale
		// Locale
		const languages = new Negotiator({
			headers: { 'accept-language': request.headers.get('accept-language') ?? undefined }
		}).languages()
		return match(languages, locales, defaultLocale)
	}

	function onlyAcceptable(locale: I18nLocale | undefined) {
		return locale && locales.includes(locale) ? locale : undefined
	}

	function matchWithMatcher(match: boolean | RegExp, pathnameCanonical: string) {
		return match && (match === true || pathnameCanonical.match(match))
	}

	return (request: NextRequest) => {
		const { pathname } = request.nextUrl

		// Canonical pathname
		const urlLocale = locales.find((cc) => pathname === `/${cc}` || pathname.startsWith(`/${cc}/`))
		const qLocale = onlyAcceptable(request.nextUrl.searchParams.get(queryName) ?? undefined)
		// (!) Here is important to convert empty strings to a single slash
		const pathnameCanonical = (urlLocale ? pathname.slice(1 + urlLocale.length) : pathname) || '/'

		// Expected locale
		const locale = getExpectedLocale(request)
		// The locale that should be present in the url
		const showLocale = locale === defaultLocale && !showDefault ? undefined : locale

		// (!) Query and Url locales are always respected above the cookie or matched locale. This is
		// consistent with the expected user behaviour and also allows for caching of the route. To keep
		// a consistent caching behaviour either the whole website is (URL/Query) localized or the
		// SET-COOKIE HEADER ISSUED BY THIS ROUTE SHOULD BE PRESERVED IN THE CACHE
		let localeToSet: string | undefined = undefined
		if (qLocale && qLocale !== locale) localeToSet = qLocale
		else if (urlLocale && urlLocale !== locale) localeToSet = urlLocale

		// Fix all urls
		if (matchWithMatcher(matcher.url, pathnameCanonical)) {
			// [fix] Url based
			request.nextUrl.searchParams.delete(queryName)

			// This extra redirect on URL mismatch should not be cacheable, preventing Cloudflare
			// from dropping this Cookie-Set
			if (localeToSet) {
				// todo : this fixes a bug but is convoluted
				request.nextUrl.pathname =
					localeToSet !== defaultLocale ? `/${localeToSet}${pathnameCanonical}` : pathnameCanonical
				const res = NextResponse.redirect(request.nextUrl)
				res.cookies.set(cookieName, localeToSet, cookieOptions)
				return res
			} else if (urlLocale !== showLocale || qLocale) {
				request.nextUrl.pathname = showLocale
					? `/${showLocale}${pathnameCanonical}`
					: pathnameCanonical
				return NextResponse.redirect(request.nextUrl)
			}
		} else if (matchWithMatcher(matcher.query, pathnameCanonical)) {
			// [fix] Query based
			request.nextUrl.pathname = pathnameCanonical

			// This extra redirect on URL mismatch should not be cacheable, preventing Cloudflare
			// from dropping this Cookie-Set
			if (localeToSet) {
				const res = NextResponse.redirect(request.nextUrl)
				res.cookies.set(cookieName, localeToSet, cookieOptions)
				return res
			} else if (urlLocale || qLocale !== showLocale) {
				if (showLocale) {
					request.nextUrl.searchParams.set(queryName, showLocale)
				} else {
					request.nextUrl.searchParams.delete(queryName)
				}
				return NextResponse.redirect(request.nextUrl)
			}
		} else if (matchWithMatcher(matcher.hidden, pathnameCanonical)) {
			// [fix] Implicit
			request.nextUrl.pathname = pathnameCanonical
			request.nextUrl.searchParams.delete(queryName)

			// This extra redirect on URL mismatch should not be cacheable, preventing Cloudflare
			// from dropping this Cookie-Set
			if (localeToSet) {
				const res = NextResponse.redirect(request.nextUrl)
				res.cookies.set(cookieName, localeToSet, cookieOptions)
				return res
			} else if (urlLocale || qLocale) {
				return NextResponse.redirect(request.nextUrl)
			}
		} else {
			// Do not process this route
			return NextResponse.next()
		}

		// Proxy to the canonical translation url.
		request.nextUrl.pathname = `/${locale}${pathnameCanonical}`
		return NextResponse.rewrite(request.nextUrl)
	}
}
