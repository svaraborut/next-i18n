'use client'
import NextLink from 'next/link'
import { LinkProps as NextLinkProps } from 'next/dist/client/link'
import React, { useMemo } from 'react'
import { useLocale } from 'use-intl'
import { i18nConfig } from '@/middleware'

export function prepareHref({
	href,
	targetLocale,
	currentLocale
}: {
	href: string
	targetLocale: string
	currentLocale: string | undefined
}) {
	// todo : handle external links
	// todo : experimental
	const urlLocale = i18nConfig.locales.find((cc) => href === `/${cc}` || href.startsWith(`/${cc}/`))
	const pathnameCanonical = (urlLocale ? href.slice(1 + urlLocale.length) : href) || '/'

	if (pathnameCanonical.match(i18nConfig.matcher.url)) {
		if (!urlLocale && targetLocale !== i18nConfig.defaultLocale)
			return `/${targetLocale}${pathnameCanonical}`
	} else if (pathnameCanonical.match(i18nConfig.matcher.query)) {
		if (targetLocale !== i18nConfig.defaultLocale) return `${pathnameCanonical}?ln=${targetLocale}`
	} else {
		if (targetLocale !== currentLocale) return `${pathnameCanonical}?ln=${targetLocale}`
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
