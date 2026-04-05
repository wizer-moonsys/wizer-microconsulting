'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const roles = [
  { label: 'Super Admin', href: '/admin', color: 'hover:text-red-400' },
  { label: 'Org Admin', href: '/org', color: 'hover:text-blue-400' },
  { label: 'Client', href: '/client', color: 'hover:text-purple-400' },
  { label: 'Participant', href: '/participant', color: 'hover:text-green-400' },
]

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/engagements', label: 'Engagements' },
  { href: '/admin/organizations', label: 'Organizations' },
]

// active check that also highlights sub-routes
function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname.startsWith(href)
}

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Dev role-switcher bar */}
      <div className="bg-gray-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 h-8">
          <span className="text-gray-500 mr-2">🛠 Dev:</span>
          {roles.map((role, i) => {
            const active = pathname.startsWith(role.href)
            return (
              <span key={role.href} className="flex items-center">
                {i > 0 && <span className="text-gray-600 mx-2">·</span>}
                <Link
                  href={role.href}
                  className={`transition-colors ${active ? 'text-white font-semibold underline' : `text-gray-400 ${role.color}`}`}
                >
                  {role.label}
                </Link>
              </span>
            )
          })}
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-lg font-bold text-wizer-purple">Wizer</Link>
              <span className="text-xs bg-wizer-purple-light text-wizer-purple-dark px-2 py-0.5 rounded-full font-medium">
                Super Admin
              </span>
              <div className="flex gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-wizer-purple-light text-wizer-purple-dark'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
