'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Layers,
  UsersRound,
  Briefcase,
  Building2,
} from 'lucide-react'

// Mock badge count — in production this would come from a store/API
const PENDING_ENGAGEMENTS = 1

const communityItems = [
  { href: '/org', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/org/people', label: 'People', icon: Users },
  { href: '/org/groups', label: 'Groups', icon: UsersRound },
  { href: '/org/community', label: 'Panels', icon: Layers },
  { href: '/org/profile', label: 'Org Profile', icon: Building2 },
]

const engagementItems = [
  { href: '/org/engagements', label: 'All Engagements', icon: Briefcase, badge: PENDING_ENGAGEMENTS },
]

const roles = [
  { label: 'Super Admin', href: '/admin' },
  { label: 'Org Admin', href: '/org' },
  { label: 'Client', href: '/client' },
  { label: 'Participant', href: '/participant' },
]

export default function OrgSidebar() {
  const pathname = usePathname()

  function NavItem({ href, label, icon: Icon, badge, exact }: {
    href: string; label: string; icon: React.ElementType; badge?: number; exact?: boolean
  }) {
    const active = exact ? pathname === href : pathname.startsWith(href)
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="flex-1">{label}</span>
        {badge && badge > 0 && (
          <span className="bg-orange-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <aside className="w-52 shrink-0 min-h-screen flex flex-col" style={{ backgroundColor: '#4a3f7a' }}>

      {/* Logo + org name */}
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/org" className="text-xl font-bold text-white tracking-tight block mb-1">
          wizer
        </Link>
        <p className="text-white/50 text-xs">Tranby College</p>
      </div>

      {/* Community section */}
      <nav className="px-3 py-4 border-b border-white/10">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-2">Community</p>
        <div className="space-y-0.5">
          {communityItems.map(item => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>
      </nav>

      {/* Paid Engagements section */}
      <nav className="px-3 py-4 flex-1">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-widest px-3 mb-2">Paid Engagements</p>
        <div className="space-y-0.5">
          {engagementItems.map(item => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        {/* Quick-access incoming requests */}
        {PENDING_ENGAGEMENTS > 0 && (
          <Link href="/org/engagements" className="mx-1 mt-3 block bg-orange-400/20 border border-orange-400/30 rounded-lg px-3 py-2.5 hover:bg-orange-400/30 transition-colors">
            <p className="text-orange-300 text-xs font-semibold mb-0.5">New request</p>
            <p className="text-white/70 text-xs leading-snug">Transport Infrastructure Futures</p>
          </Link>
        )}
      </nav>

      {/* User */}
      <div className="px-5 py-4 border-t border-white/10 flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold shrink-0">
          TC
        </div>
        <p className="text-white/80 text-sm font-medium truncate">Org Admin</p>
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
