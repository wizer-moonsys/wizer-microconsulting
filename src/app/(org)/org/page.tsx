'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, BarChart2, CheckCircle, Users, ChevronRight } from 'lucide-react'

interface Study {
  id: string
  title: string
  description: string
  isIndigenous: boolean
  participants: number
  questions: { id: string }[]
  windowValue: number
  windowUnit: string
  status: 'submitted' | 'live' | 'complete' | 'rejected'
  submittedAt: string
  routedOrg?: string
  routeNote?: string
}

const PANEL = [
  { name: 'Alice Nguyen', profileComplete: true },
  { name: 'Robert Briggs', profileComplete: true },
  { name: 'Mary Thorpe', profileComplete: false },
  { name: 'Emmanuel Torres', profileComplete: true },
  { name: 'Patricia Walsh', profileComplete: false },
  { name: 'James Nguyen', profileComplete: true },
  { name: 'Sandra Cooper', profileComplete: true },
]

const statusConfig = {
  live: { label: 'Live', color: 'bg-green-100 text-green-700', icon: BarChart2 },
  submitted: { label: 'Incoming', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  complete: { label: 'Complete', color: 'bg-gray-100 text-gray-600', icon: CheckCircle },
  rejected: { label: 'Returned', color: 'bg-red-100 text-red-600', icon: Clock },
}

export default function OrgDashboard() {
  const [studies, setStudies] = useState<Study[]>([])

  useEffect(() => {
    const all: Study[] = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    // Show studies routed to Tranby OR that are live (approved)
    const ours = all.filter(s => s.routedOrg === 'tranby' || s.status === 'live')
    setStudies(ours)
  }, [])

  const profilesComplete = PANEL.filter(p => p.profileComplete).length
  const pct = Math.round((profilesComplete / PANEL.length) * 100)
  const incoming = studies.filter(s => s.status === 'live').length

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tranby College</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your community and incoming paid engagements.</p>
      </div>

      {/* New request alert */}
      <Link
        href="/org/engagements"
        className="flex items-center gap-4 bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 hover:bg-orange-100 transition-colors group"
      >
        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 text-orange-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-orange-800">New engagement request — action needed</p>
          <p className="text-xs text-orange-600 mt-0.5">Transport Infrastructure Futures · Set up your panel to activate this study</p>
        </div>
        <ChevronRight className="w-4 h-4 text-orange-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" /> Panel members</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{PANEL.length}</p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-wizer-purple-mid rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{profilesComplete} profiles complete ({pct}%)</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 flex items-center gap-1"><BarChart2 className="w-3 h-3" /> Active studies</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{incoming}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs text-gray-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{studies.filter(s => s.status === 'complete').length}</p>
        </div>
      </div>

      {/* Incoming studies */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Studies</h2>
          <Link href="/org/studies" className="text-sm text-wizer-purple hover:text-wizer-purple-dark">View all</Link>
        </div>

        {studies.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <p className="text-gray-400 text-sm">No studies assigned yet — Wizer will notify you when one comes through.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {studies.map(study => {
              const cfg = statusConfig[study.status] ?? statusConfig.submitted
              const Icon = cfg.icon
              return (
                <Link
                  key={study.id}
                  href={`/org/studies/${study.id}`}
                  className="flex items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-wizer-purple-light hover:shadow-sm transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                      {study.isIndigenous && (
                        <span className="px-2 py-0.5 bg-wizer-purple-light text-wizer-purple-dark text-xs rounded-full font-medium">Indigenous</span>
                      )}
                    </div>
                    <p className="font-medium text-gray-900 truncate">{study.title || 'Untitled study'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {study.questions.length} question{study.questions.length !== 1 ? 's' : ''} · {study.participants} participants · {study.windowValue} {study.windowUnit} window
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Community quick links */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Your Community</h2>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/org/people" className="bg-white rounded-xl border border-gray-200 p-4 hover:border-wizer-purple-light hover:shadow-sm transition-all group">
            <div className="w-8 h-8 rounded-full bg-wizer-purple-light flex items-center justify-center mb-3">
              <Users className="w-4 h-4 text-wizer-purple" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">People</p>
            <p className="text-xs text-gray-400 mt-0.5">{PANEL.length} members</p>
            <p className="text-xs text-wizer-purple mt-2 group-hover:text-wizer-purple-dark">Manage →</p>
          </Link>
          <Link href="/org/groups" className="bg-white rounded-xl border border-gray-200 p-4 hover:border-wizer-purple-light hover:shadow-sm transition-all group">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Groups</p>
            <p className="text-xs text-gray-400 mt-0.5">4 groups</p>
            <p className="text-xs text-wizer-purple mt-2 group-hover:text-wizer-purple-dark">Manage →</p>
          </Link>
          <Link href="/org/community" className="bg-white rounded-xl border border-gray-200 p-4 hover:border-wizer-purple-light hover:shadow-sm transition-all group">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mb-3">
              <BarChart2 className="w-4 h-4 text-green-500" />
            </div>
            <p className="font-semibold text-gray-900 text-sm">Panels</p>
            <p className="text-xs text-gray-400 mt-0.5">3 panels · {profilesComplete} complete</p>
            <p className="text-xs text-wizer-purple mt-2 group-hover:text-wizer-purple-dark">Manage →</p>
          </Link>
        </div>
      </div>

    </div>
  )
}
