import { I18nLocale, I18nZone } from '@/lib/i18n2/routing'
import React, { useMemo } from 'react'
import { LinkProps as NextLinkProps } from 'next/dist/client/link'
import NextLink from 'next/link'
import { useLocale } from 'use-intl'
import { matchZone, toHref } from '@/lib/i18n2/utils'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export interface I18nNavigationConfig {
	zones: I18nZone[]
}

export type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> &
	NextLinkProps & {
		children?: React.ReactNode | undefined
	} & React.RefAttributes<HTMLAnchorElement> & {
		locale?: string
	}

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
		const matchBundle = matchZone(zones, url, currentLocale, targetLocale)
		return toHref(matchBundle?.[1].publicUrl ?? url)
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
		},
		/**
		 * Override navigation utils
		 */
		useRouter(): AppRouterInstance {
			const currentLocale = useLocale()
			const router = useRouter()
			return {
				...router,
				push(href: string, options?): void {
					return router.push(prepareUrl(href, currentLocale), options)
				},
				replace(href: string, options?): void {
					return router.replace(prepareUrl(href, currentLocale), options)
				},
				prefetch(href: string, options?): void {
					throw new Error('Prefetch is not supported')
				}
			}
		}
	}
}
