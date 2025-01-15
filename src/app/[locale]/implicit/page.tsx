'use client'
import { useTranslations } from 'use-intl'
import { Links } from '@/components/Links'
import { LocaleSwitch } from '@/components/LocaleSwitch'

export const runtime = 'edge'

export default function Page() {
	const t = useTranslations()
	return (
		<div className='p-8'>
			<Links />
			<h1 className='text-xl font-bold'>{t('title')}</h1>
			<p>{t('description')}</p>
			<LocaleSwitch />
		</div>
	)
}
