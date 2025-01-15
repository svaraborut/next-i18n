import { NextRequest, NextResponse } from 'next/server'
import { i18nConfig } from '@/i18n'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'

// todo : check this
export const runtime = 'experimental-edge'

interface DetectedLocale {
	locale: string
	source?: 'path' | 'query' | 'cookie'
}

function getPreferredLocale(request: NextRequest): DetectedLocale {
	// Pathname
	const { pathname } = request.nextUrl
	let locale = i18nConfig.locales.find(
		(cc) => pathname.startsWith(`/${cc}/`) || pathname === `/${cc}`
	)
	if (locale) return { locale, source: 'path' }

	// Query
	locale = request.nextUrl.searchParams.get('ln') || undefined
	if (locale && i18nConfig.locales.includes(locale)) return { locale, source: 'query' }

	// Cookies
	locale = request.cookies.get('locale')?.value
	if (locale && i18nConfig.locales.includes(locale)) return { locale, source: 'cookie' }

	// Locale
	const languages = new Negotiator({
		headers: { 'accept-language': request.headers.get('accept-language') ?? undefined }
	}).languages()
	return { locale: match(languages, i18nConfig.locales, i18nConfig.defaultLocale) }
}

const matcher = /^\/(|article)$/

export function middleware(request: NextRequest) {
	const detection = getPreferredLocale(request)
	// Inject locale as a header to all requests to pass it to layouts/pages
	request.headers.set('x-locale', detection.locale)

	// THIS ROUTE SHOULD BE PREFIXED BY A LOCALE BUT CURRENTLY IS NOT
	// THEREFORE TRIGGER A REDIRECT TO CONCILIATE THIS ISSUE
	const { pathname } = request.nextUrl
	console.log(detection, pathname, pathname.match(matcher))
	if (detection.source !== 'path' && pathname.match(matcher)) {
		request.nextUrl.pathname = `/${detection.locale}${pathname}`
		return NextResponse.redirect(request.nextUrl)
	}

	// Process the request
	const res = NextResponse.next()
	// Make sure to sync the cookie to the current locale
	if (detection.source !== 'cookie') {
		res.cookies.set('locale', detection.locale, {
			maxAge: 31_536_000, // year
			httpOnly: false,
			secure: false,
			sameSite: 'lax'
		})
	}
	return res
}

export const config = {
	matcher: [
		// todo : this may be problematic, maybe only include the paths
		'/((?!_next|assets|api|trpc).*)'
	]
}
