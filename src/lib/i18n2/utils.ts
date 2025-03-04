import { I18nLocale, I18nZone } from '@/lib/i18n2/routing'

export type I18nUrl = string | URL

// (!) Used to process relative urls. This is an ugly hack
const dummyBaseUrl = new URL('http://d-u-m-m-y')
const dummyBaseHref = dummyBaseUrl.href

export function toUrl(url: I18nUrl): URL {
	return typeof url === 'string' ? new URL(url, dummyBaseUrl) : url
}

// (!) to be used in conjunction with toUrl() to revert back relative urls
export function toHref(url: I18nUrl): string {
	const href = typeof url === 'string' ? url : url.href
	return href.startsWith(dummyBaseHref) ? href.slice(dummyBaseHref.length - 1) : href
}

/**
 * Utility to match a single zone from a collection of i18n zones
 */
export function matchZone(
	zones: I18nZone[],
	url: I18nUrl,
	currentLocale: I18nLocale | ((zone: I18nZone) => I18nLocale),
	targetLocale: undefined | I18nLocale | ((zone: I18nZone) => I18nLocale) = undefined
): [I18nZone, Exclude<ReturnType<I18nZone['match']>, undefined>] | undefined {
	const _url = toUrl(url)
	for (const z of zones) {
		const matchRes = z.match(
			_url,
			typeof currentLocale === 'function' ? currentLocale(z) : currentLocale,
			typeof targetLocale === 'function' ? targetLocale(z) : targetLocale
		)
		if (matchRes) return [z, matchRes]
	}
	return undefined
}
