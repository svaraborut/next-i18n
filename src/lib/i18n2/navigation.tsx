import { I18nLocale, I18nZone } from '@/lib/i18n2/routing'
import React, { useMemo } from 'react'
import { LinkProps as NextLinkProps } from 'next/dist/client/link'
import NextLink from 'next/link'
import { useLocale } from 'use-intl'

export interface I18nNavigationConfig {
	zones: I18nZone[]
}

export type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> &
	NextLinkProps & {
		children?: React.ReactNode | undefined
	} & React.RefAttributes<HTMLAnchorElement> & {
		locale?: string
	}

// (!) Used to process relative urls. This is an ugly hack
const dummyBase = new URL('http://a')

export function createNavigation({ zones }: I18nNavigationConfig) {
	/**
	 * Use zone internals to produce the navigation url. This function does execute in
	 * 10us therefore is acceptable to use it extensively, also to produce the page
	 * alternatives map.
	 */
	function prepareUrl(
		url: string | URL,
		currentLocale: I18nLocale,
		targetLocale: I18nLocale | undefined = undefined
	) {
		const _url = typeof url === 'string' ? new URL(url, dummyBase) : url
		for (const z of zones) {
			const matchRes = z.match(_url, currentLocale, targetLocale)
			// console.log(url, currentLocale, targetLocale, matchRes?.publicUrl.href)
			if (matchRes) {
				return matchRes.publicUrl.href.replace(dummyBase.href, '/')
			}
		}
		return typeof url === 'string' ? url : url.href
	}

	return {
		/**
		 * Implementation of the Link object with localization included.
		 * (?) PREFETCHING WHEN LOCALE CHANGES WILL CAUSE COOKIE ASSIGNMENT OF THE
		 * TARGET LOCALE EFFECTIVELY SWITCHING THE USER LANGUAGE. FURTHERMORE, PREFETCHING
		 * OTHER LOCALES IS NOT EFFICIENT AS IS VERY UNLIKELY THE USER WILL BE OFTEN
		 * SWITCHING LANGUAGE. PREFETCHING WAS DISABLED ALL TOGETHER DUE TO
		 * https://github.com/vercel/next.js/discussions/57565
		 */
		Link({ href, hrefLang, locale, prefetch, ...props }: LinkProps) {
			const currentLocale = useLocale()
			const targetLocale = locale ?? currentLocale
			const href2 = useMemo(() => {
				// todo : benchmarks
				// const start = Date.now()
				// for (let i = 0; i < 10_000; i++) {
				// 	prepareUrl(href as any, currentLocale, targetLocale)
				// }
				// console.log('XX took', Date.now() - start)
				return prepareUrl(href as any, currentLocale, targetLocale)
			}, [href, currentLocale, targetLocale])
			return <NextLink href={href2!} hrefLang={targetLocale} prefetch={false} {...props} />
		}
	}
}
