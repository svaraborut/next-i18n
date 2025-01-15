'use client'
import { useTranslations } from 'use-intl'
import { Links } from '@/components/Links'

export default function Page() {
	const t = useTranslations()

	return (
		<div className='p-8'>
			<Links />
			<h1 className='text-xl font-bold'>Homepage</h1>
			<h1>{t('title')}</h1>
		</div>
	)
}
