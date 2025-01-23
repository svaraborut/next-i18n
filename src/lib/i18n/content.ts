import { ComponentType } from 'react'

export interface LocalizedContent<T = ComponentType> {
	Content: T
	isBackup: boolean
	loadedLocale: string
}

export type LocalizedContentLoader<T = ComponentType> = (locale: string) => Promise<T>

export async function loadLocalizedContent<T = ComponentType>(
	locale: string,
	importer: LocalizedContentLoader<T>,
	defaultLocale: string = 'en'
): Promise<LocalizedContent<T>> {
	try {
		return {
			Content: await importer(locale),
			isBackup: false,
			loadedLocale: locale
		}
	} catch (e) {
		return {
			Content: await importer(defaultLocale),
			isBackup: true,
			loadedLocale: defaultLocale
		}
	}
}
