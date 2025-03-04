'use client'
import { useRouter } from '@/lib/routing'

export function ProgLinks() {
	const router = useRouter()

	return (
		<div className='mb-4 flex gap-2 max-sm:flex-col'>
			<button className='text-start text-blue-600 hover:underline' onClick={() => router.push('/')}>
				💻 Homepage
			</button>
			<button
				className='text-start text-blue-600 hover:underline'
				onClick={() => router.push('/article')}
			>
				💻 Article
			</button>
			<button
				className='text-start text-blue-600 hover:underline'
				onClick={() => router.push('/description')}
			>
				💻 Description
			</button>
			<button
				className='text-start text-blue-600 hover:underline'
				onClick={() => router.push('/descriptionPartial')}
			>
				💻 Partial
			</button>
			<button
				className='text-start text-blue-600 hover:underline'
				onClick={() => router.push('/implicit')}
			>
				💻 Implicit
			</button>
			<button
				className='text-start text-blue-600 hover:underline'
				onClick={() => router.push('/query')}
			>
				💻 Query
			</button>
		</div>
	)
}
