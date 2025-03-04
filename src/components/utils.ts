import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/*
 * Class composition function twMerge(clsx(...))
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
