'use client'

import { useState } from 'react'
import { Users, BarChart2, CheckCircle, MapPin, ChevronRight, Mail, Calendar, TrendingUp } from 'lucide-react'

const ORGS = [
  {
    id: 'tranby',
    name: 'Tranby College',
    type: 'Indigenous Education',
    location: 'Glebe, New South Wales',
    indigenous: true,
    panelSize: 84,
    profilesComplete: 61,
    activeStudies: 1,
    completedStudies: 2,
    admin: 'Mark Saunders',
    adminEmail: 'mark@tranby.edu.au',
    joined: '2024-03-15',
    responseRate: 78,
    avgTurnaround: '4.2 days',
    totalEarned: 3850,
  },
  {
    id: 'cad',
    name: 'CAD Frontiers',
    type: 'Health Research',
    location: 'Melbourne, Victoria',
    indigenous: false,
    panelSize: 120,
    profilesComplete: 98,
    activeStudies: 2,
    completedStudies: 5,
    admin: 'Dr Sarah Chen',
    adminEmail: 'sarah.chen@cadfrontiers.org',
    joined: '2024-01-08',
    responseRate: 85,
    avgTurnaround: '3.1 days',
    totalEarned: 11200,
  },
  {
    id: 'mrc',
    name: 'Melbourne Research Collective',
    type: 'Community Organisation',
    location: 'Carlton, Victoria',
    indigenous: false,
    panelSize: 210,
    profilesComplete: 145,
    activeStudies: 0,
    completedStudies: 8,
    admin: 'James Whitfield',
    adminEmail: 'james@mrc.org.au',
    joined: '2023-11-20',
    responseRate: 71,
    avgTurnaround: '5.8 days',
    totalEarned: 18600,
  },
]

// Studies linked to each org — shown in the detail panel
const ORG_STUDIES: Record<string, { id: string; title: string; status: 'submitted' | 'live' | 'complete'; participants: number; submittedAt: string }[]> = {
  tranby: [
    { id: 'demo-1', title: 'Housing Insecurity in Regional NSW', status: 'submitted', participants: 40, submittedAt: '2026-05-18T09:30:00Z' },
  ],
  cad: [
    { id: 'demo-2', title: 'Type 2 Diabetes Management in Urban Communities', status: 'live', participants: 80, submittedAt: '2026-05-01T14:00:00Z' },
  ],
  mrc: [
    { id: 'demo-3', title: 'Remote Work Impact on Work-Life Balance', status: 'live', participants: 60, submittedAt: '2026-04-15T11:00:00Z' },
    { id: 'demo-4', title: 'Digital Literacy Among Older Australians', status: 'complete', participants: 50, submittedAt: '2026-03-01T08:00:00Z' },
  ],
}

const studyStatusStyle = {
  submitted: 'bg-yellow-100 text-yellow-700',
  live: 'bg-green-100 text-green-700',
  complete: 'bg-gray-100 text-gray-600',
}

export default function OrganizationsPage() {
  const [selected, setSelected] = useState<string | null>(null)

  const org = ORGS.find(o => o.id === selected)
  const orgStudies = selected ? (ORG_STUDIES[selected] ?? []) : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organisations</h1>
        <p className="text-sm text-gray-500 mt-1">Community partners who manage participant panels.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total orgs', value: ORGS.length },
          { label: 'Total panel members', value: ORGS.reduce((s, o) => s + o.panelSize, 0) },
          { label: 'Profiles complete', value: ORGS.reduce((s, o) => s + o.profilesComplete, 0) },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-5 items-start">
        {/* Org list */}
        <div className="flex-1 space-y-3">
          {ORGS.map(o => {
            const pct = Math.round((o.profilesComplete / o.panelSize) * 100)
            const isSelected = selected === o.id
            return (
              <button
                key={o.id}
                onClick={() => setSelected(isSelected ? null : o.id)}
                className={`w-full text-left bg-white rounded-xl border-2 p-5 transition-all ${
                  isSelected ? 'border-wizer-purple shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-gray-900">{o.name}</p>
                      {o.indigenous && (
                        <span className="px-2 py-0.5 bg-wizer-purple-light text-wizer-purple-dark text-xs rounded-full font-medium">Indigenous</span>
                      )}
                      {o.activeStudies > 0 && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">{o.activeStudies} live</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {o.location} · {o.type}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-gray-300 shrink-0 mt-1 transition-transform duration-200 ${isSelected ? 'rotate-90 text-wizer-purple' : ''}`} />
                </div>

                <div className="flex items-center gap-5 mt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {o.panelSize} panel</span>
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-wizer-purple-mid" /> {o.profilesComplete} profiles ({pct}%)</span>
                  <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3 text-green-400" /> {o.completedStudies} studies done</span>
                </div>

                {/* Profile completion bar */}
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-wizer-purple-mid rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </button>
            )
          })}
        </div>

        {/* Org detail panel */}
        {org && (
          <div className="w-80 shrink-0 space-y-4">

            {/* Contact & info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <div>
                <h2 className="font-semibold text-gray-900">{org.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{org.type}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Admin contact</p>
                  <p className="text-gray-900 font-medium">{org.admin}</p>
                  <a href={`mailto:${org.adminEmail}`} className="text-wizer-purple text-xs hover:underline">{org.adminEmail}</a>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Location</p>
                  <p className="text-gray-900">{org.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Partner since</p>
                  <p className="text-gray-900">{new Date(org.joined).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold text-gray-900">{org.activeStudies}</p>
                  <p className="text-xs text-gray-400">Active</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{org.completedStudies}</p>
                  <p className="text-xs text-gray-400">Complete</p>
                </div>
              </div>

              <a
                href={`mailto:${org.adminEmail}`}
                className="w-full flex items-center justify-center gap-2 text-sm text-wizer-purple hover:text-wizer-purple-dark font-medium border border-wizer-purple-light hover:bg-wizer-purple-light rounded-lg py-2 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                Email {org.name.split(' ')[0]}
              </a>
            </div>

            {/* Performance stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Performance</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-600"><TrendingUp className="w-3.5 h-3.5 text-green-500" /> Response rate</span>
                  <span className="font-semibold text-gray-900">{org.responseRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-600"><Calendar className="w-3.5 h-3.5 text-blue-400" /> Avg turnaround</span>
                  <span className="font-semibold text-gray-900">{org.avgTurnaround}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-gray-600"><Users className="w-3.5 h-3.5 text-wizer-purple-mid" /> Total earned</span>
                  <span className="font-semibold text-gray-900">${org.totalEarned.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Studies assigned to this org */}
            {orgStudies.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Studies</h3>
                <div className="space-y-2">
                  {orgStudies.map(s => (
                    <a
                      key={s.id}
                      href={`/admin/studies/${s.id}`}
                      className="flex items-start justify-between gap-2 p-3 rounded-lg border border-gray-100 hover:border-wizer-purple-light hover:bg-gray-50 transition-all group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">{s.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${studyStatusStyle[s.status]}`}>
                            {s.status === 'submitted' ? 'Under Review' : s.status === 'live' ? 'Live' : 'Complete'}
                          </span>
                          <span className="text-xs text-gray-400">{s.participants} participants</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-wizer-purple shrink-0 mt-0.5 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
