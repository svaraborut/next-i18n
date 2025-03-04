import { createNavigation } from '@/lib/i18n2/navigation'
import { i18nZones } from '@/lib/config'

export const { Link, useRouter, usePathname } = createNavigation({ zones: i18nZones })
