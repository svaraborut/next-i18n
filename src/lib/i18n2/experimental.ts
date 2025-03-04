import { I18nLocale, I18nZone, I18nZoneConfig } from '@/lib/i18n2/routing'

/**
 * EXPERIMENTAL. Implicit zones, are zones without an explicit url but rather are
 * sections where the translation is cookie-only
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
