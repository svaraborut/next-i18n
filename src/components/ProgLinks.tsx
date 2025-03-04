'use client'
import { usePathname, useRouter } from '@/lib/routing'
import { cn } from '@/components/utils'

export function ProgLinks() {
	const router = useRouter()
	const pathname = usePathname()

	return (
		<div className='mb-4 flex gap-2 max-sm:flex-col'>
			<button
				className={cn(
					'text-start hover:underline',
					pathname === '/' ? 'text-red-600' : 'text-blue-600'
				)}
				onClick={() => router.push('/')}
			>
				💻 Homepage
			</button>
			<button
				className={cn(
					'text-start hover:underline',
					pathname === '/article' ? 'text-red-600' : 'text-blue-600'
				)}
				onClick={() => router.push('/article')}
			>
				💻 Article
			</button>
			<button
				className={cn(
					'text-start hover:underline',
					pathname === '/description' ? 'text-red-600' : 'text-blue-600'
				)}
				onClick={() => router.push('/description')}
			>
				💻 Description
			</button>
			<button
				className={cn(
					'text-start hover:underline',
					pathname === '/descriptionPartial' ? 'text-red-600' : 'text-blue-600'
				)}
				onClick={() => router.push('/descriptionPartial')}
			>
				💻 Partial
			</button>
			<button
				className={cn(
					'text-start hover:underline',
					pathname === '/implicit' ? 'text-red-600' : 'text-blue-600'
				)}
				onClick={() => router.push('/implicit')}
			>
				💻 Implicit
			</button>
			<button
				className={cn(
					'text-start hover:underline',
					pathname === '/query' ? 'text-red-600' : 'text-blue-600'
				)}
				onClick={() => router.push('/query')}
			>
				💻 Query
			</button>
		</div>
	)
}
