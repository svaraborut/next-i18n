'use client'
import { i18nConfig } from '@/middleware'
import { useLocale, useTranslations } from 'use-intl'
import { Link } from '@/lib/routing'
import { Wrapper } from '@/components/Wrapper'

export default async function Page() {
	const currentLocale = useLocale()
	const t = useTranslations()
	return (
		<Wrapper>
			<h1 className='text-xl font-bold'>Query</h1>
			<h1 className='text-xl font-bold'>{t('title')}</h1>
			<p>{t('description')}</p>
			<div className='flex gap-2'>
				{i18nConfig.locales.map((cc) => (
					<Link
						key={cc}
						className={cc !== currentLocale ? 'text-blue-600 hover:underline' : 'underline'}
						locale={cc}
						href='/query'
					>
						{cc}
					</Link>
				))}
			</div>
		</Wrapper>
	)
}
