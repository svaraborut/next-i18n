import { createNavigation } from '@/lib/i18n2/navigation'
import { i18nZones } from '@/lib/config'

export const { Link, useRouter } = createNavigation({ zones: i18nZones })
