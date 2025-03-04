'use client'
import { useTranslations } from 'use-intl'
import { Wrapper } from '@/components/Wrapper'

export default function Page() {
	const t = useTranslations()
	return (
		<Wrapper>
			<h1 className='text-xl font-bold'>Implicit</h1>
			<h1 className='text-xl font-bold'>{t('title')}</h1>
			<p>{t('description')}</p>
		</Wrapper>
	)
}
