// (!) DOING THIS HACK HERE
// https://stackoverflow.com/questions/76181096/
'use client'
import { IntlConfig, IntlProvider as BaseIntlProvider } from 'use-intl'
import { cache, ReactNode } from 'react'

export type IntlProviderProps = Omit<IntlConfig, 'now' | 'timeZone'> & {
	children: ReactNode
}

const getNow = cache(() => new Date())
const getTimeZone = cache(() => Intl.DateTimeFormat().resolvedOptions().timeZone)

export function IntlProvider(props: IntlProviderProps) {
	return (
		<BaseIntlProvider {...props} now={getNow()} timeZone={getTimeZone()}>
			{props.children}
		</BaseIntlProvider>
	)
}
