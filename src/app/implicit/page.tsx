'use client'
import { useLocale, useTranslations } from 'use-intl'
import { Link } from '@/i18n/Link'
import { i18nConfig } from '@/i18n'
import { setLanguage } from '@/app/implicit/action'

export default function Page() {
	const currentLocale = useLocale()
	const t = useTranslations()
	return (
		<div className='p-8'>
			<h1>{t('title')}</h1>
			<p>{t('description')}</p>
			<Link className='text-blue-600 hover:underline' href='/xx/article'>
				Article
			</Link>
			<select
				value={currentLocale}
				onChange={(e) => {
					console.log(`🌐 switching to ${e.target.value}`)
					setLanguage(e.target.value)
				}}
			>
				{i18nConfig.locales.map((cc) => (
					<option key={cc} value={cc}>
						{cc}
					</option>
				))}
			</select>
		</div>
	)
}
