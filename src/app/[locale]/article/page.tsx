'use client'
import { useLocale, useTranslations } from 'use-intl'
import { Link } from '@/lib/routing'
import { i18nConfig } from '@/middleware'
import { Wrapper } from '@/components/Wrapper'

export default function Page() {
	const locale = useLocale()
	const t = useTranslations()

	return (
		<Wrapper>
			<h1 className='text-xl font-bold'>Article {locale}</h1>
			<h1 className='text-xl font-bold'>{t('title')}</h1>
			<p>{t('description')}</p>
			<div className='flex gap-2'>
				{i18nConfig.locales.map((cc) => (
					<Link
						key={cc}
						className={cc !== locale ? 'text-blue-600 hover:underline' : 'text-blue-600 underline'}
						href={`/article`}
						locale={cc}
					>
						{cc}
					</Link>
				))}
			</div>
		</Wrapper>
	)
}
