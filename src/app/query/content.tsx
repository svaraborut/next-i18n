'use client'
import { useLocale, useTranslations } from 'use-intl'
import { Link } from '@/i18n/Link'
import { i18nConfig } from '@/i18n'

export function Content() {
	const currentLocale = useLocale()
	const t = useTranslations()
	return (
		<div className='p-8'>
			<h1>{t('title')}</h1>
			<p>{t('description')}</p>
			<Link className='text-blue-600 hover:underline' href='/xx/article'>
				Article
			</Link>
			<div className='flex gap-2'>
				{i18nConfig.locales.map((cc) => (
					<a
						key={cc}
						className={cc !== currentLocale ? 'text-blue-600 hover:underline' : 'underline'}
						href={`/query?ln=${cc}`}
					>
						{cc}
					</a>
				))}
			</div>
		</div>
	)
}
