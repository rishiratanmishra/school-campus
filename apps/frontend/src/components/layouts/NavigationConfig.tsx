import {  Bell,  User,  Menu,  X,  Home,  BarChart3,  Users,  Settings,  FileText,  Calendar,  Mail,  ShoppingCart, Sun, Moon, LogOut, ChevronDown} from 'lucide-react'


export const sidebarItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: ShoppingCart, label: 'Orders', href: '/orders', badge: '12' },
  { icon: FileText, label: 'Reports', href: '/reports' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Mail, label: 'Messages', href: '/messages', badge: '5' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]