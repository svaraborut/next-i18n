import { NextRequest, NextResponse } from 'next/server'
import Negotiator from 'negotiator'
import { match as localeMatch } from '@formatjs/intl-localematcher'
import { I18nZone } from '@/lib/i18n2/routing'
import { matchZone } from '@/lib/i18n2/utils'

export interface I18nServerConfig {
	zones: I18nZone[]
	cookie?: {
		name?: string
		maxAge?: number
	}
}

/**
 * Todo describe
 *
 * All routes matching this middleware should be served under a [locale] folder as all requests
 * will be rewritten to that url.
 */
export function createMiddleware({
	zones,
	cookie
}: I18nServerConfig): (req: NextRequest) => NextResponse {
	// [normalize]
	const cookieOptions = {
		maxAge: 31_536_000,
		httpOnly: false,
		secure: false,
		sameSite: 'lax',
		name: 'locale',
		...cookie
	} as const

	return (request: NextRequest) => {
		// Match the correct zone
		const url = new URL(request.url)
		let cookieLocale = request.cookies.get(cookieOptions.name)?.value
		const headerLocales = new Negotiator({
			headers: { 'accept-language': request.headers.get('accept-language') ?? undefined }
		}).languages()

		const matchBundle = matchZone(zones, url, (z) =>
			cookieLocale && z.locales.includes(cookieLocale)
				? cookieLocale
				: localeMatch(headerLocales, z.locales, z.defaultLocale)
		)

		if (!matchBundle) {
			// Do not process this route
			return NextResponse.next()
		} else {
			const [zone, match] = matchBundle
			// Conciliate URL and cookies with this zone expected behaviour
			// (!) Query and Url locales are always respected above the cookie or matched locale. This is
			// consistent with the expected user behaviour and also allows for caching of the route. To keep
			// a consistent caching behaviour either the whole website is (URL/Query) localized or the
			// SET-COOKIE HEADER ISSUED BY THIS ROUTE SHOULD BE PRESERVED IN THE CACHE
			if (
				request.url !== match.publicUrl.href ||
				(match.detectedLocale && match.detectedLocale !== match.currentLocale)
			) {
				// console.log(
				// 	`🚩 [redir] ${request.url} [${match.currentLocale}] -> ${match.publicUrl.href} [${match.detectedLocale}] (cn: ${match.canonicalUrl.href})`
				// )
				const res = NextResponse.redirect(match.publicUrl)
				res.cookies.set(
					cookieOptions.name,
					match.detectedLocale ?? match.currentLocale,
					cookieOptions
				)
				return res
			} else {
				// console.log(
				// 	`🚩 [     ] ${request.url} [${match.currentLocale}] -> ${match.publicUrl.href} [${match.detectedLocale}] (cn: ${match.canonicalUrl.href})`
				// )
				// Proxy to the canonical translation url.
				return NextResponse.rewrite(match.canonicalUrl)
			}
		}
	}
}
