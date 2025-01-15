'use client'
import { useLocale, useTranslations } from 'use-intl'
import { Link } from '@/i18n/Link'
import { i18nConfig } from '@/middleware'

export default function Page() {
	const locale = useLocale()
	const t = useTranslations()

	return (
		<div className='p-8'>
			<h1>{t('title')}</h1>
			<p>{t('description')}</p>
			<div className='flex gap-2'>
				{i18nConfig.locales.map((cc) => (
					<Link
						key={cc}
						className={cc !== locale ? 'text-blue-600 hover:underline' : 'underline'}
						href={`/xx/article`}
						locale={cc}
					>
						{cc}
					</Link>
				))}
			</div>
			<div className='flex gap-2'>
				<Link href='/xx/article' locale='gr'>
					Article GR
				</Link>
				<Link href='/implicit'>Implicit</Link>
			</div>
		</div>
	)
}
