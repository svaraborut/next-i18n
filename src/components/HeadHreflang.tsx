import Head from 'next/head'
import { i18nConfig } from '@/middleware'

export function HeadHreflang({ locale }: { locale: string }) {
	// todo : https://stackoverflow.com/questions/28291574/
	// todo : render the url dynamic
	return (
		<Head>
			<link
				rel='alternate'
				hrefLang={i18nConfig.defaultLocale}
				href={`https://esempio.com/${i18nConfig.defaultLocale}/todo`}
			/>
			{i18nConfig.locales
				.filter((cc) => cc !== locale)
				.map((cc) => (
					<link
						key={`hreflang-${cc}`}
						rel='alternate'
						hrefLang={cc}
						href={`https://esempio.com/${cc}/todo`}
					/>
				))}
		</Head>
	)
}
