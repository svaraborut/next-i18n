/**
 * Zone concept, extends over the standard next-intl approach enabling the user
 * to mix various sections with different translations within the same app.
 */

export type I18nLocale = string

export interface I18nZoneBase {
	locales: I18nLocale[]
	defaultLocale: I18nLocale
}

export interface I18nZoneConfig extends I18nZoneBase {
	// Extension of matcher to only match the canonical pathname of the route. The pathname
	// will always include the leading slash and exclude the trailing slash
	path?: RegExp | ((pathname: string) => boolean)
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
 * Match any url starting with an ISO language string and break it into the two distinct parts.
 * This works with:
 * / /zh /zh-CN /article /su-per-article /zh/article /zh-CN/article
 */
export const IsoLocaleUrlMatcher = /^(?:\/(\w{2}|\w{2}-\w{2}))?(|\/.*)$/

/**
 * Create a zone that with URL based i18n via /cc/...
 * This does also support hiding the default locale.
 */
export function createZone({
	locales,
	defaultLocale,
	showDefault = false,
	queryName = 'ln',
	querySwitch = true,
	path,
	matcher = IsoLocaleUrlMatcher,
	producer = (locale, pathname) => `/${locale}${pathname}`
}: I18nZoneConfig & { querySwitch?: boolean }): I18nZone {
	// Normalize matcher to a (string) => [string, string] | undefined function
	const _matcher =
		matcher instanceof RegExp
			? (str: string) => {
					const m = str.match(matcher)
					return m ? ([m[1], m[2]] as const) : undefined
				}
			: matcher
	// Normalize path matcher
	const _path =
		path === undefined
			? undefined
			: path instanceof RegExp
				? (str: string) => !!str.match(path)
				: path

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
			if (_path && !_path(pathnameCanonical || '/')) {
				return undefined
			}

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
