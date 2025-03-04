import { HTMLAttributes } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'

const fontSans = Geist({
	variable: '--font-sans',
	subsets: ['latin']
})

const fontMono = Geist_Mono({
	variable: '--font-mono',
	subsets: ['latin']
})

export function Body({ className, ...props }: HTMLAttributes<HTMLBodyElement>) {
	return (
		<body
			className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
			{...props}
		/>
	)
}
