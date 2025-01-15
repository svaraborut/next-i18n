'use client'
import { useLocaleSwitch } from '@/lib/i18n/hook'
import { i18nConfig } from '@/middleware'

export function LocaleSwitch() {
	const { currentLocale, setLocale } = useLocaleSwitch()
	return (
		<select value={currentLocale} onChange={(e) => setLocale(e.target.value)}>
			{i18nConfig.locales.map((cc) => (
				<option key={cc} value={cc}>
					{cc}
				</option>
			))}
		</select>
	)
}