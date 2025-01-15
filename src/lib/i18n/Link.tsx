'use client'
import NextLink from 'next/link'
import { LinkProps as NextLinkProps } from 'next/dist/client/link'
import React, { useMemo } from 'react'
import { useLocale } from 'use-intl'

export type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> &
	NextLinkProps & {
		children?: React.ReactNode | undefined
	} & React.RefAttributes<HTMLAnchorElement> & {
		locale?: string
	}

export function Link({ href, hrefLang, locale, ...props }: LinkProps) {
	const currentLocale = useLocale()
	const targetLocale = locale ?? currentLocale

	// Correct the link if there is a locale switch ongoing
	// todo : this is a mess
	// const href2 = useMemo(() => {
	// 	const url = typeof href === 'string' ? new URL(href) : href
	// 	if (targetLocale !== currentLocale) {
	// 		const prefix = '/' + currentLocale
	// 		if (url.pathname?.startsWith(prefix)) {
	// 			url.pathname = '/' + targetLocale + url.pathname.slice(prefix.length)
	// 		}
	// 	}
	// 	return url.href
	// }, [href])

	const href2 = useMemo(() => {
		if (typeof href !== 'string') throw new Error('Unsupported')
		for (const prefix of ['/xx', '/' + currentLocale]) {
			if (href.startsWith(prefix)) {
				href = '/' + targetLocale + href.slice(prefix.length)
				break
			}
		}
		return href
	}, [href, currentLocale, targetLocale])

	return <NextLink href={href2!} hrefLang={targetLocale} {...props} />
}
