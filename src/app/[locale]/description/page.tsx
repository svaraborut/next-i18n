'use client'
import { useLocale } from 'use-intl'
import { loadLocalizedContent } from '@/lib/i18n/content'
import { Wrapper } from '@/components/Wrapper'

export default async function Page() {
	const locale = useLocale()
	const { data, isBackup } = await loadLocalizedContent(
		locale,
		async (cc) => await import(`@/content/desc.${cc}.md`)
	)
	const Content = data.default

	return (
		<Wrapper>
			<div className='markdown'>
				{isBackup && (
					<div className='w-full rounded bg-amber-300 px-4 py-2'>
						We are sorry but this article is not available in your language.
					</div>
				)}
				<Content />
			</div>
		</Wrapper>
	)
}
