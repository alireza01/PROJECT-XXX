export interface User {
  id: string
  name: string
  email: string
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  user: User
  expires: string
}

export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: React.ComponentType<{ className?: string }>
  label?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItemWithChildren {} 