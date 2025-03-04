'use client'
import { ReactNode } from 'react'
import { Links } from '@/components/Links'
import { LocaleSwitch } from '@/components/LocaleSwitch'
import { ProgLinks } from '@/components/ProgLinks'

export function Wrapper({ children }: { children: ReactNode }) {
	return (
		<div className='p-8'>
			<Links />
			<ProgLinks />
			{children}
			<LocaleSwitch />
		</div>
	)
}
