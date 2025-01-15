'use client'
import { useTranslations } from 'use-intl'
import { Link } from '@/i18n/Link'

export default function Page() {
	const t = useTranslations()

	return (
		<div className='p-8'>
			<h1>{t('title')}</h1>
			<Link className='text-blue-600 hover:underline' href='/xx/article'>
				Article
			</Link>
		</div>
	)
}
