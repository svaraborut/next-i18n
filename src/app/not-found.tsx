// It seems that when a middleware is involved all pages are considered
// dynamic, therefore to compile for CloudFlare ALL pages must be edge
// compatible, forcing to create also the not-found page, to declare it
// as runtime=edge

export const runtime = 'edge'

export default function Page404() {
	return (
		<div className='p-8'>
			<h1 className='text-xl font-bold'>404 Not Found</h1>
		</div>
	)
}
