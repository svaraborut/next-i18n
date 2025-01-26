'use client'
import { useLocale } from 'use-intl'
import { Links } from '@/components/Links'
import { LocaleSwitch } from '@/components/LocaleSwitch'
import { loadLocalizedContent } from '@/lib/i18n/content'

export default async function Page() {
	const locale = useLocale()
	const { data, isBackup } = await loadLocalizedContent(
		locale,
		async (cc) => await import(`@/content/partial.${cc}.mdx`)
	)
	const { default: Content, meta } = data

	return (
		<div className='p-8'>
			<Links />
			<div className='markdown'>
				{isBackup && (
					<div className='w-full rounded bg-amber-300 px-4 py-2'>
						We are sorry but this article is not available in your language.
					</div>
				)}
				{meta && (
					<div className='space-y-4 rounded bg-gray-50 px-4 py-2 text-black'>
						<p className='m-0 text-3xl'>{meta.title}</p>
						<p className='m-0'>{meta.description}</p>
					</div>
				)}
				<Content />
			</div>
			<LocaleSwitch />
		</div>
	)
}
