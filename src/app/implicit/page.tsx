'use client'
import { useTranslations } from 'use-intl'
import { i18nConfig } from '@/middleware'
import { useLocaleSwitch } from '@/lib/i18n/hook'
import { Links } from '@/components/Links'

export const runtime = 'edge'

export default function Page() {
	const { currentLocale, setLocale } = useLocaleSwitch()
	const t = useTranslations()
	return (
		<div className='p-8'>
			<Links />
			<h1 className='text-xl font-bold'>{t('title')}</h1>
			<p>{t('description')}</p>
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
