import { NextRequest } from 'next/server'
import { createMiddleware } from '@/lib/i18n2/middleware'
import { i18nZones } from '@/lib/config'

// todo : check this
export const runtime = 'experimental-edge'

export const i18nConfig = {
	locales: ['en', 'it', 'si', 'fr', 'de', 'ru', 'gr', 'zh'],
	defaultLocale: 'en',
	// todo : temporary for <Link />
	matcher: {
		url: /^\/(|article|description|descriptionPartial)$/,
		query: /^\/query$/,
		hidden: true
	}
}

// const mw = createMiddleware({
// 	...i18nConfig,
// 	showDefault: false,
// 	cookieName: 'locale',
// 	queryName: 'ln',
// 	cookieOptions: {
// 		maxAge: 31_536_000
// 	}
// })

const mw2 = createMiddleware({
	zones: i18nZones,
	cookie: {
		maxAge: 31_536_000
	}
})

export const middleware = (request: NextRequest) => {
	const res = mw2(request)

	// todo : (!) THIS APPROACH POLLUTES THE ACTUAL RESPONSE HEADERS
	// todo : this seems kind of a hack that goes against next.js. It is not
	//        clear why this data is not accessible within the layout components
	res.headers.set('x-url', request.url)
	return res
}

export const config = {
	matcher: [
		// Skip all assets and apis
		'/((?!_next|assets|api|trpc|.*\\.).*)'
	]
}
