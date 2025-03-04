'use client'
import { i18nConfig } from '@/middleware'
import { useLocale, useTranslations } from 'use-intl'
import { Links } from '@/components/Links'
import { Link } from '@/lib/routing'
import { LocaleSwitch } from '@/components/LocaleSwitch'

export default async function Page() {
	const currentLocale = useLocale()
	const t = useTranslations()
	return (
		<div className='p-8'>
			<Links />
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
			<LocaleSwitch />
		</div>
	)
}
