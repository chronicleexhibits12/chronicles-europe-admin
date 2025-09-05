import { Home, Building, FileText, MapPin, Globe } from 'lucide-react'
import type { NavigationItem } from '@/data/commonTypes'

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: Home
  },
  {
    id: 'pages',
    label: 'Pages',
    href: '/pages',
    icon: FileText
  },
  {
    id: 'stands',
    label: 'Stands',
    href: '/stands',
    icon: Building
  },
  {
    id: 'about',
    label: 'About Us',
    href: '/about-us',
    icon: FileText
  },
  {
    id: 'cities',
    label: 'Cities',
    href: '/admin/cities',
    icon: MapPin
  },
  {
    id: 'countries',
    label: 'Countries',
    href: '/admin/countries',
    icon: Globe
  }
]