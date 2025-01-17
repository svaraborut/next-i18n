'use client'
import NextLink from 'next/link'
import { LinkProps as NextLinkProps } from 'next/dist/client/link'
import React, { useMemo } from 'react'
import { useLocale } from 'use-intl'
import { i18nConfig } from '@/middleware'
import { UrlObject } from 'node:url'

const regexLnRemover = /([?&]ln=\w+$|ln=\w+&)/g

export function prepareHref({
	href,
	targetLocale,
	currentLocale
}: {
	href: string | UrlObject
	targetLocale: string
	currentLocale: string | undefined
}) {
	if (typeof href === 'string' && href.startsWith('.')) {
		throw new Error(`Unsupported relative link ${href}`)
	} else if (typeof href !== 'string') {
		throw new Error('Unsupported url object')
	}

	// todo : handle external links
	// todo : experimental
	const urlLocale = i18nConfig.locales.find((cc) => href === `/${cc}` || href.startsWith(`/${cc}/`))
	// (!) Fix base single slash and remove any query parameter from the url
	const pathnameCanonical = ((urlLocale ? href.slice(1 + urlLocale.length) : href) || '/').replace(
		regexLnRemover,
		''
	)
	const qSign = pathnameCanonical.includes('?') ? '&' : '?'

	// (!) Always include also defaultLocale to leverage the middleware to perform a
	// redirect and actually switch the language.
	if (pathnameCanonical.match(i18nConfig.matcher.url)) {
		// Always add non default locale OR also default if is a language switch.
		if (
			!urlLocale &&
			(targetLocale !== i18nConfig.defaultLocale || targetLocale !== currentLocale)
		) {
			return `/${targetLocale}${pathnameCanonical}`
		}
	} else if (pathnameCanonical.match(i18nConfig.matcher.query)) {
		// Always add non default locale OR also default if is a language switch.
		if (targetLocale !== i18nConfig.defaultLocale || targetLocale !== currentLocale) {
			return `${pathnameCanonical}${qSign}ln=${targetLocale}`
		}
	} else {
		// Change language if required
		if (targetLocale !== currentLocale) return `${pathnameCanonical}${qSign}ln=${targetLocale}`
	}
	return href
}

export type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> &
	NextLinkProps & {
		children?: React.ReactNode | undefined
	} & React.RefAttributes<HTMLAnchorElement> & {
		locale?: string
	}

export function Link({ href, hrefLang, locale, prefetch, ...props }: LinkProps) {
	const currentLocale = useLocale()
	const targetLocale = locale ?? currentLocale

	const href2 = useMemo(() => {
		if (typeof href !== 'string') throw new Error('Unsupported')
		return prepareHref({ href, currentLocale, targetLocale })
	}, [href, currentLocale, targetLocale])

	// (?) PREFETCHING WHEN LOCALE CHANGES WILL CAUSE COOKIE ASSIGNMENT OF THE
	// TARGET LOCALE EFFECTIVELY SWITCHING THE USER LANGUAGE. FURTHERMORE PREFETCHING
	// OTHER LOCALES IS NOT EFFICIENT AS IS VERY UNLIKELY THE USER WILL BE OFTEN
	// SWITCHING LANGUAGE.
	// (!) PREFETCHING DISABLED ALL TOGETHER DUE TO https://github.com/vercel/next.js/discussions/57565
	return (
		<NextLink
			href={href2!}
			hrefLang={targetLocale}
			// prefetch={currentLocale === targetLocale && prefetch}
			prefetch={false}
			{...props}
		/>
	)
}
