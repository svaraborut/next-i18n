'use client'
import { useLocale } from 'use-intl'
import { Links } from '@/components/Links'
import { LocaleSwitch } from '@/components/LocaleSwitch'
import { i18nConfig } from '@/middleware'

export const runtime = 'edge'

async function getContent(locale: string) {
	try {
		return (await import(`@/content/desc.${locale}.md`)).default
	} catch (e) {
		return (await import(`@/content/desc.${i18nConfig.defaultLocale}.md`)).default
	}
}

// https://github.com/tailwindlabs/tailwindcss-typography?tab=readme-ov-file#element-modifiers
const style = [
	'space-y-8 [&_section]:space-y-8',
	// Heading
	// 'prose-h1:font-display prose-h1:text-5xl prose-h1:sm:text-7xl prose-h1:font-bold',
	'prose-h1:font-bold prose-h1:text-4xl prose-h2:leading-8',
	'prose-h2:font-bold prose-h2:text-2xl prose-h2:leading-8',
	'prose-h3:font-semibold prose-h3:text-xl',
	'prose-h4:font-semibold prose-h4:text-lg',
	// Quote
	'prose-blockquote:p-4 prose-blockquote:bg-secondary prose-blockquote:rounded-lg',
	'prose-blockquote:border-l-4 prose-blockquote:border-primary',
	'prose-blockquote:space-y-4',
	// Code
	'prose-pre:bg-secondary prose-pre:text-foreground',
	// Table
	'prose-table:rounded',
	'prose-th:border prose-th:px-2 prose-th:py-0.5 prose-th:bg-gray-100',
	'prose-td:border prose-td:px-2 prose-td:py-0.5',
	// Other
	'prose-code:bg-gray-100 prose-code:px-0.5 prose-code:rounded',
	'prose-a:underline',
	'prose-ul:list-disc prose-ul:pl-4',
	'prose-ol:list-decimal prose-ol:pl-4',
	'prose-img:rounded-2xl prose-img:w-full'
	// todo : how to style the caption
	// 'prose-figcaption::text-sm prose-figcaption::block prose-figcaption::mt-2 prose-figcaption::text-center',
].join(' ')

export default async function Page() {
	const locale = useLocale()
	const Content = await getContent(locale)

	return (
		<div className='p-8'>
			<Links />
			<div className={style}>
				<Content />
			</div>
			<LocaleSwitch />
		</div>
	)
}
