'use client'
import { useTranslations } from 'use-intl'
import { Link } from '@/i18n/Link'
import { i18nConfig } from '@/middleware'
import { useLocaleSwitch } from '@/lib/i18n/hook'

export default function Page() {
	const { currentLocale, setLocale } = useLocaleSwitch()
	const t = useTranslations()
	return (
		<div className='p-8'>
			<h1>{t('title')}</h1>
			<p>{t('description')}</p>
			<Link className='text-blue-600 hover:underline' href='/xx/article'>
				Article
			</Link>
			<select value={currentLocale} onChange={(e) => setLocale(e.target.value)}>
				{i18nConfig.locales.map((cc) => (
					<option key={cc} value={cc}>
						{cc}
					</option>
				))}
			</select>
		</div>
	)
}
