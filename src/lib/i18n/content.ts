import { ComponentType } from 'react'

export interface DefaultArticle<M = Record<string, string>> {
	default: ComponentType
	meta?: M
}

export interface LocalizedContent<T = DefaultArticle> {
	data: T
	isBackup: boolean
	loadedLocale: string
}

export type LocalizedContentLoader<T = DefaultArticle> = (locale: string) => Promise<T>

export async function loadLocalizedContent<T = DefaultArticle>(
	locale: string,
	importer: LocalizedContentLoader<T>,
	defaultLocale: string = 'en'
): Promise<LocalizedContent<T>> {
	try {
		return {
			data: await importer(locale),
			isBackup: false,
			loadedLocale: locale
		}
	} catch (e) {
		return {
			data: await importer(defaultLocale),
			isBackup: true,
			loadedLocale: defaultLocale
		}
	}
}
