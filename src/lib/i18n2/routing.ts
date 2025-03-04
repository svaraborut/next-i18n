/**
 * Multi zone i18n routing for Next.js. This approach is based on next-intl
 * and enhanced to support different translation approaches over the app.
 */

export type I18nLocale = string

export interface I18nZoneBase {
	locales: I18nLocale[]
	defaultLocale: I18nLocale
}

export interface I18nZoneConfig extends I18nZoneBase {
	// The matcher, should be either a RegExp with two matching groups (1=locale, 2=pathname)
	// or a function serving the same purpose. When it matches should result in the detection
	// and extraction of such parts, else the zone will skip this url.
	matcher?: RegExp | ((pathname: string) => [string, string] | undefined)
	// SHOULD BE THE CONTRARY OF THE MATCHER ABOVE. Recomposing the matched value into a pathname.
	producer?: (locale: I18nLocale, pathname: string) => string

	// Weather the default locale should be exposed within the url
	showDefault?: boolean
	// The name of the query parameter, defaults to `ln`
	queryName?: string
	// Enable the use of query strings to switch the language
	// querySwitch?: boolean
}

export interface I18nZone extends I18nZoneBase {
	/**
	 * Matches an incoming request URL with the current zone. If there is a match it extracts the
	 * canonical URL and produces an url detection if known. Values provided to this function are
	 * 		url -> the request url
	 * 		currentLocale -> the locale detected via NON URL means (cookie, headers, cloudflare)
	 * 	  targetLocale -> used by navigation utils to force a language switch
	 * When the match is successful, the function will return:
	 * 		canonicalUrl -> the internal url of the resource (for rewrite)
	 * 		publicUrl -> the url the user should be visiting
	 * 	 	detectedLocale -> the locale extracted from the url
	 */
	match: (
		url: URL,
		currentLocale: I18nLocale,
		targetLocale: I18nLocale | undefined
	) =>
		| undefined
		| {
				canonicalUrl: URL
				publicUrl: URL
				currentLocale: I18nLocale
				detectedLocale: I18nLocale | undefined
		  }
	// todo : this will not work as we do not have entire urls here
	// create: (url: URL, currentLocale: I18nLocale, desiredLocale: I18nLocale) => URL
}

/**
 * Create a zone that with URL based i18n via /cc/...
 * This does also support hiding the default locale.
 */
export function createUrlZone({
	locales,
	defaultLocale,
	showDefault = false,
	queryName = 'ln',
	querySwitch = true,
	// Standard ISO 2 matcher
	matcher = /^\/(\w{2}|\w{2}-\w{2})(\/.*)$/,
	producer = (locale, pathname) => `/${locale}${pathname}`
}: I18nZoneConfig & { querySwitch?: boolean }): I18nZone {
	// Normalize matcher to a (string) => [string, string] | undefined function
	const _matcher =
		matcher instanceof RegExp
			? (path: string) => {
					const m = path.match(matcher)
					return m ? ([m[1], m[2]] as const) : undefined
				}
			: matcher

	return {
		locales,
		defaultLocale,
		match: (url, currentLocale, targetLocale = undefined) => {
			// Match and sanitize
			const match = _matcher(url.pathname)
			if (!match) {
				return undefined
			}
			let detectedLocale = locales.find((cc) => cc === match[0])
			const pathnameCanonical = match[1]

			// IF ENABLED, ALLOW THE USE OF SEARCH PARAMETERS AS AN OVERRIDE FOR LANGUAGE.
			// THIS ALLOWS FOR FRONTEND-ONLY FORM GET OPERATIONS TO BE USED.
			if (querySwitch && queryName && url.searchParams.has(queryName)) {
				const ln = url.searchParams.get(queryName)
				if (ln && locales.includes(ln)) detectedLocale = ln as I18nLocale
			}

			// Prepare output
			const locale = targetLocale ?? detectedLocale ?? currentLocale
			const canonicalUrl = new URL(url)
			canonicalUrl.searchParams.delete(queryName)
			canonicalUrl.pathname = `/${locale}${pathnameCanonical}`
			const publicUrl = new URL(url)
			publicUrl.searchParams.delete(queryName)
			publicUrl.pathname =
				!targetLocale && !showDefault && locale === defaultLocale
					? pathnameCanonical // todo : || '/'
					: producer(locale, pathnameCanonical)

			return {
				canonicalUrl,
				publicUrl,
				currentLocale,
				detectedLocale
			}
		}
	}
}

/**
 *
 */
export function createImplicitZone({
	locales,
	defaultLocale,
	matcher,
	showDefault = false,
	queryName = 'ln',
	queryVisible = false
}: I18nZoneConfig & { queryVisible?: boolean }): I18nZone {
	return {
		locales,
		defaultLocale,
		match: (url, currentLocale, targetLocale = undefined) => {
			// Sanitize
			const pathnameCanonicalTs = url.pathname
			const pathnameCanonical = pathnameCanonicalTs === '/' ? '' : pathnameCanonicalTs
			let detectedLocale: I18nLocale | undefined

			// Skip if we are not match
			if (matcher && !pathnameCanonicalTs.match(matcher as any)) {
				return undefined
			}

			// IF ENABLED, ALLOW THE USE OF SEARCH PARAMETERS AS AN OVERRIDE FOR LANGUAGE.
			// THIS ALLOWS FOR FE ONLY FORM GET OPERATIONS TO BE USED.
			if (queryName && url.searchParams.has(queryName)) {
				const ln = url.searchParams.get(queryName)
				if (ln && locales.includes(ln)) detectedLocale = ln as I18nLocale
			}

			// Prepare output
			const locale = targetLocale ?? detectedLocale ?? currentLocale
			const canonicalUrl = new URL(url)
			canonicalUrl.searchParams.delete(queryName)
			canonicalUrl.pathname = `/${locale}${pathnameCanonical}`
			const publicUrl = new URL(url)
			publicUrl.searchParams.set(queryName, locale)
			if (!targetLocale && (!queryVisible || (!showDefault && locale === defaultLocale))) {
				publicUrl.searchParams.delete(queryName)
			}

			return {
				canonicalUrl,
				publicUrl,
				currentLocale,
				detectedLocale
			}
		}
	}
}

// >> Experimental handling of relative urls

export type I18nUrl = string | URL

// (!) Used to process relative urls. This is an ugly hack
const dummyBaseUrl = new URL('http://d-u-m-m-y')
const dummyBaseHref = dummyBaseUrl.href

function toUrl(url: I18nUrl): URL {
	return typeof url === 'string' ? new URL(url, dummyBaseUrl) : url
}

function toHref(url: URL): string {
	const href = url.href
	return href.startsWith(dummyBaseHref) ? href.slice(dummyBaseHref.length - 1) : href
}

// << Experimental handling of relative urls

/**
 * Match a single zone and return its value, and its match result
 */
export function matchZone(
	zones: I18nZone[],
	url: I18nUrl,
	currentLocale: I18nLocale | ((zone: I18nZone) => I18nLocale)
): [I18nZone, Exclude<ReturnType<I18nZone['match']>, undefined>] | undefined {
	const _url = toUrl(url)
	for (const z of zones) {
		const matchRes = z.match(
			_url,
			typeof currentLocale === 'function' ? currentLocale(z) : currentLocale,
			undefined
		)
		if (matchRes) return [z, matchRes]
	}
	return undefined
}
