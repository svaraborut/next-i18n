'use client'
import { useLocale, useTranslations } from 'use-intl'
import { Link } from '@/i18n/Link'
import { i18nConfig } from '@/middleware'
import { Links } from '@/components/Links'
import { LocaleSwitch } from '@/components/LocaleSwitch'

export const runtime = 'edge'

export default function Page() {
	const locale = useLocale()
	const t = useTranslations()

	return (
		<div className='p-8'>
			<Links />
			<h1 className='text-xl font-bold'>{t('title')}</h1>
			<p>{t('description')}</p>
			<LocaleSwitch />
			<div className='flex gap-2'>
				{i18nConfig.locales.map((cc) => (
					<Link
						key={cc}
						className={cc !== locale ? 'text-blue-600 hover:underline' : 'text-blue-600 underline'}
						href={`/xx/article`}
						locale={cc}
					>
						{cc}
					</Link>
				))}
			</div>
		</div>
	)
}
