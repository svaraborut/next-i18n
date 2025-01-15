import { Link } from '@/i18n/Link'

export function Links() {
	return (
		<div className='mb-4 flex gap-2'>
			<Link className='text-blue-600 hover:underline' href='/xx'>
				Homepage
			</Link>
			<Link className='text-blue-600 hover:underline' href='/xx/article'>
				Article
			</Link>
			<Link className='text-blue-600 hover:underline' href='/implicit'>
				Implicit
			</Link>
			<Link className='text-blue-600 hover:underline' href='/query'>
				Query
			</Link>
		</div>
	)
}
