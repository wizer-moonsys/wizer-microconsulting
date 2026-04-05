'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, BarChart2, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'

interface Study {
  id: string
  title: string
  isIndigenous: boolean
  participants: number
  totalBudget: number
  questions: { id: string }[]
  windowValue: number
  windowUnit: string
  status: 'submitted' | 'live' | 'complete' | 'rejected'
  submittedAt: string
  assignedOrg?: string
  inviteSent?: boolean
}

const ORGS: Record<string, string> = {
  tranby: 'Tranby College',
  cad: 'CAD Frontiers',
  mrc: 'Melbourne Research Collective',
}

const statusConfig = {
  submitted: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  live: { label: 'Live', color: 'bg-green-100 text-green-700', icon: BarChart2 },
  complete: { label: 'Complete', color: 'bg-gray-100 text-gray-600', icon: CheckCircle },
  rejected: { label: 'Returned', color: 'bg-red-100 text-red-600', icon: AlertCircle },
}

const filters = ['All', 'Under Review', 'Live', 'Complete', 'Returned'] as const
type Filter = typeof filters[number]

export default function EngagementsPage() {
  const [studies, setStudies] = useState<Study[]>([])
  const [filter, setFilter] = useState<Filter>('All')

  useEffect(() => {
    const stored: Study[] = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    setStudies(stored)
  }, [])

  const filtered = studies.filter(s => {
    if (filter === 'All') return true
    if (filter === 'Under Review') return s.status === 'submitted'
    if (filter === 'Live') return s.status === 'live'
    if (filter === 'Complete') return s.status === 'complete'
    if (filter === 'Returned') return s.status === 'rejected'
    return true
  })

  const totalBudget = studies.filter(s => s.status === 'live').reduce((sum, s) => sum + s.totalBudget * 1.10, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engagements</h1>
          <p className="text-sm text-gray-500 mt-1">All client studies across the platform.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Total in escrow (live)</p>
          <p className="text-xl font-bold text-wizer-purple-dark">${totalBudget.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f}
            {f !== 'All' && (
              <span className="ml-1.5 text-xs text-gray-400">
                ({studies.filter(s =>
                  f === 'Under Review' ? s.status === 'submitted' :
                  f === 'Live' ? s.status === 'live' :
                  f === 'Complete' ? s.status === 'complete' :
                  s.status === 'rejected'
                ).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Study</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Assigned to</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Participants</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Value</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Submitted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(study => {
              const cfg = statusConfig[study.status] ?? statusConfig.submitted
              const Icon = cfg.icon
              return (
                <tr key={study.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 max-w-xs truncate">{study.title || 'Untitled'}</p>
                    {study.isIndigenous && (
                      <span className="text-xs text-wizer-purple font-medium">Indigenous</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {study.assignedOrg ? (
                      <span className={study.inviteSent ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        {ORGS[study.assignedOrg] ?? study.assignedOrg}
                        {study.inviteSent && <span className="block text-xs text-green-500">Invited</span>}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{study.participants}</td>
                  <td className="px-4 py-3 text-gray-700">${(study.totalBudget * 1.10).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(study.submittedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/studies/${study.id}`} className="text-wizer-purple hover:text-wizer-purple-dark flex items-center gap-0.5 font-medium text-xs">
                      Review <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                  No engagements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
