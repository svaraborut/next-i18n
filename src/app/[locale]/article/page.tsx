'use client'
import { useLocale, useTranslations } from 'use-intl'
import { i18nConfig } from '@/i18n'
import { Link } from '@/i18n/Link'

export default function Page() {
	const locale = useLocale()
	const t = useTranslations()

	return (
		<div className='p-8'>
			<h1>{t('title')}</h1>
			<p>{t('description')}</p>
			<div className='flex gap-2'>
				{i18nConfig.locales.map((cc) => (
					<a
						key={cc}
						className={cc !== locale ? 'text-blue-600 hover:underline' : 'underline'}
						href={`/${cc}/article`}
					>
						{cc}
					</a>
				))}
			</div>
			<div className='flex gap-2'>
				<Link href='/xx/article' locale='gr'>
					Article GR
				</Link>
				<Link href='/implicit' locale='si'>
					Implicit
				</Link>
			</div>
		</div>
	)
}
