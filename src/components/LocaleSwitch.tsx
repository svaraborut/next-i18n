'use client'
import { i18nConfig } from '@/middleware'
import { useLocale } from 'use-intl'
import { useRef } from 'react'

export function LocaleSwitch() {
	// const { currentLocale, setLocale } = useLocaleSwitch()
	// return (
	// 	<select value={currentLocale} onChange={(e) => setLocale(e.target.value)}>
	// 		{i18nConfig.locales.map((cc) => (
	// 			<option key={cc} value={cc}>
	// 				{cc}
	// 			</option>
	// 		))}
	// 	</select>
	// )
	const currentLocale = useLocale()
	const selectForm = useRef<HTMLFormElement>(null)
	return (
		<form ref={selectForm} method='GET'>
			<select value={currentLocale} name='ln' onChange={(e) => selectForm.current?.submit()}>
				{i18nConfig.locales.map((cc) => (
					<option key={cc} value={cc}>
						{cc}
					</option>
				))}
			</select>
		</form>
	)
}
