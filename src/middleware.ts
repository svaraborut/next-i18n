import { NextRequest, NextResponse } from 'next/server'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

// todo : check this
export const runtime = 'experimental-edge'

export const i18nConfig = {
	locales: ['en', 'it', 'si', 'fr', 'de', 'ru', 'gr', 'zh'],
	defaultLocale: 'en',
	matcher: {
		url: /^\/(|article)$/,
		query: /^\/query$/
	}
}

function getExpectedLocale(request: NextRequest) {
	// Cookie
	let locale = request.cookies.get('locale')?.value
	if (locale && i18nConfig.locales.includes(locale)) return locale
	// Locale
	const languages = new Negotiator({
		headers: { 'accept-language': request.headers.get('accept-language') ?? undefined }
	}).languages()
	return match(languages, i18nConfig.locales, i18nConfig.defaultLocale)
}

function onlyAcceptable(locale: string | undefined) {
	return locale && i18nConfig.locales.includes(locale) ? locale : undefined
}

const cookieOptions = {
	maxAge: 31_536_000,
	httpOnly: false,
	secure: false,
	sameSite: 'lax'
} as const

/**
 * Expected behavior
 *
 * /			/en		(render)
 * /article		/en/article
 * /query		/query?ln=en
 * /implicit	/en/implicit
 *
 */
export const middleware = (request: NextRequest) => {
	const { pathname } = request.nextUrl

	// Canonical pathname
	const urlLocale = i18nConfig.locales.find(
		(cc) => pathname === `/${cc}` || pathname.startsWith(`/${cc}/`)
	)
	const qLocale = onlyAcceptable(request.nextUrl.searchParams.get('ln') ?? undefined)
	// (!) Here is important to convert empty strings to a single slash
	const pathnameCanonical = (urlLocale ? pathname.slice(1 + urlLocale.length) : pathname) || '/'

	// Expected locale
	const locale = getExpectedLocale(request)
	// The locale that should be present in the url
	const showLocale = locale === i18nConfig.defaultLocale ? undefined : locale

	// todo : WE CAN CONSIDER ALLOWING ANY /xx LOCALIZED URL TO SET COOKIES SUCH TO SIMPLIFY <Link>
	//        LOGIC. ALTHOUGH THIS MAY NOT BE EXCELLENT FOR SEO PURPOSES
	// (!) By giving priority to query rather than url we can use the FORM-GET strategy to switch
	let localeToSet: string | undefined = undefined
	if (qLocale && qLocale !== locale) localeToSet = qLocale
	else if (urlLocale && urlLocale !== locale) localeToSet = urlLocale

	// Fix all urls
	if (pathnameCanonical.match(i18nConfig.matcher.url)) {
		// [fix] Url based
		request.nextUrl.searchParams.delete('ln')

		// This extra redirect on URL mismatch should not be cacheable, preventing Cloudflare
		// from dropping this Cookie-Set
		if (localeToSet) {
			// todo : this fixes a bug but is convoluted
			request.nextUrl.pathname =
				localeToSet !== i18nConfig.defaultLocale
					? `/${localeToSet}${pathnameCanonical}`
					: pathnameCanonical
			const res = NextResponse.redirect(request.nextUrl)
			res.cookies.set('locale', localeToSet, cookieOptions)
			return res
		} else if (urlLocale !== showLocale || qLocale) {
			request.nextUrl.pathname = showLocale
				? `/${showLocale}${pathnameCanonical}`
				: pathnameCanonical
			return NextResponse.redirect(request.nextUrl)
		}
	} else if (pathnameCanonical.match(i18nConfig.matcher.query)) {
		// [fix] Query based
		request.nextUrl.pathname = pathnameCanonical

		// This extra redirect on URL mismatch should not be cacheable, preventing Cloudflare
		// from dropping this Cookie-Set
		if (localeToSet) {
			const res = NextResponse.redirect(request.nextUrl)
			res.cookies.set('locale', localeToSet, cookieOptions)
			return res
		} else if (urlLocale || qLocale !== showLocale) {
			if (showLocale) {
				request.nextUrl.searchParams.set('ln', showLocale)
			} else {
				request.nextUrl.searchParams.delete('ln')
			}
			return NextResponse.redirect(request.nextUrl)
		}
	} else {
		// [fix] Implicit
		request.nextUrl.pathname = pathnameCanonical
		request.nextUrl.searchParams.delete('ln')

		// This extra redirect on URL mismatch should not be cacheable, preventing Cloudflare
		// from dropping this Cookie-Set
		if (localeToSet) {
			const res = NextResponse.redirect(request.nextUrl)
			res.cookies.set('locale', localeToSet, cookieOptions)
			return res
		} else if (urlLocale || qLocale) {
			return NextResponse.redirect(request.nextUrl)
		}
	}

	// Proxy to the canonical translation url
	request.nextUrl.pathname = `/${locale}${pathnameCanonical}`

	// todo : (!) THIS APPROACH POLLUTES THE ACTUAL RESPONSE HEADERS
	// todo : this seems kind of a hack that goes against next.js. It is not
	//        clear why this data is not accessible within the layout components
	const res = NextResponse.next()
	res.headers.set('x-url', request.url)

	return NextResponse.rewrite(request.nextUrl, res)
}

export const config = {
	matcher: [
		// Skip all assets and apis
		'/((?!_next|assets|api|trpc|.*\\.).*)'
	]
}
