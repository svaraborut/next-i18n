'use client'
import { useLocale, useTranslations } from 'use-intl'
import { Wrapper } from '@/components/Wrapper'

export default function Page() {
	const locale = useLocale()
	const t = useTranslations()

	return (
		<Wrapper>
			<h1 className='text-xl font-bold'>Homepage {locale}</h1>
			<h1 className='text-xl font-bold'>{t('title')}</h1>
			<pre className='font-mono'>{process.env.NEXT_PUBLIC_WATERMARK}</pre>
		</Wrapper>
	)
}
