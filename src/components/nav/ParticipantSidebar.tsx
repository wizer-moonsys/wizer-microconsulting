'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Rss,
  HelpCircle,
  Users,
  User,
  Building2,
  Layers,
  ShoppingBag,
} from 'lucide-react'

const navItems = [
  { href: '/participant', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/participant/feed', label: 'Your Feed', icon: Rss },
  { href: '/participant/questions', label: 'Questions', icon: HelpCircle },
  { href: '/participant/panels', label: 'Panels', icon: Layers },
  { href: '/participant/groups', label: 'Groups', icon: Users },
  { href: '/participant/people', label: 'People', icon: User },
  { href: '/participant/profile', label: 'Company Profile', icon: Building2 },
  { href: '/participant/shop', label: 'Rewards Shop', icon: ShoppingBag },
]

const roles = [
  { label: 'Super Admin', href: '/admin' },
  { label: 'Org Admin', href: '/org' },
  { label: 'Client', href: '/client' },
  { label: 'Participant', href: '/participant' },
]

export default function ParticipantSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-52 shrink-0 min-h-screen flex flex-col" style={{ backgroundColor: '#4a3f7a' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/participant" className="text-xl font-bold text-white tracking-tight">
          wizer
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Organisation */}
      <div className="px-5 pb-3 border-t border-white/10 pt-3">
        <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Organisation</p>
        <p className="text-white/70 text-sm">Tranby College</p>
      </div>

      {/* User */}
      <div className="px-5 py-4 border-t border-white/10 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
          KI
        </div>
        <p className="text-white/80 text-sm font-medium truncate">Kylee Ingram</p>
      </div>

      {/* Dev role-switcher */}
      <div className="px-3 pb-3 border-t border-white/10 pt-3">
        <p className="text-white/30 text-xs mb-2 font-mono">🛠 dev switch</p>
        <div className="flex flex-col gap-1">
          {roles.map(role => {
            const active = pathname.startsWith(role.href)
            return (
              <Link
                key={role.href}
                href={role.href}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  active ? 'bg-white/20 text-white font-semibold' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {role.label}
              </Link>
            )
          })}
        </div>
      </div>

    </aside>
  )
}
