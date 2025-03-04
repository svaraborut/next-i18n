import { Link } from '@/lib/routing'

export function Links() {
	return (
		<div className='mb-4 flex gap-2 max-sm:flex-col'>
			<Link className='text-blue-600 hover:underline' href='/'>
				Homepage
			</Link>
			<Link className='text-blue-600 hover:underline' href='/article'>
				Article
			</Link>
			<Link className='text-blue-600 hover:underline' href='/description'>
				Description
			</Link>
			<Link className='text-blue-600 hover:underline' href='/descriptionPartial'>
				Partial
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
