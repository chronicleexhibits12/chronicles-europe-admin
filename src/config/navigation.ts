import { Home, Building, FileText } from 'lucide-react'
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
  }
  // {
  //   id: 'home-admin',
  //   label: 'Home Admin',
  //   href: '/admin/home',
  //   icon: Settings
  // },
  // {
  //   id: 'about-admin',
  //   label: 'About Admin',
  //   href: '/admin/about',
  //   icon: Info
  // }
]