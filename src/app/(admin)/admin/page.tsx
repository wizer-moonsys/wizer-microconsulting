'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, BarChart2, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react'

interface Study {
  id: string
  title: string
  description: string
  isIndigenous: boolean
  areas: string[]
  participants: number
  ratePerPerson: number
  totalBudget: number
  questions: { id: string; text: string; type: string }[]
  windowValue: number
  windowUnit: string
  status: 'submitted' | 'live' | 'complete' | 'rejected'
  submittedAt: string
}

const statusConfig = {
  submitted: { label: 'Awaiting Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  live: { label: 'Live', color: 'bg-green-100 text-green-700', icon: BarChart2 },
  complete: { label: 'Complete', color: 'bg-gray-100 text-gray-600', icon: CheckCircle },
  rejected: { label: 'Returned', color: 'bg-red-100 text-red-600', icon: AlertCircle },
}

export default function AdminDashboard() {
  const [studies, setStudies] = useState<Study[]>([])

  useEffect(() => {
    const stored: Study[] = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    setStudies(stored)
  }, [])

  const queue = studies.filter(s => s.status === 'submitted')
  const live = studies.filter(s => s.status === 'live')
  const complete = studies.filter(s => s.status === 'complete')

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin</h1>
        <p className="text-sm text-gray-500 mt-1">Review and approve client study submissions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Awaiting Review', value: queue.length, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
          { label: 'Live Studies', value: live.length, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
          { label: 'Completed', value: complete.length, color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-5 ${s.bg}`}>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Review queue */}
      {queue.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            Review Queue
          </h2>
          <div className="space-y-3">
            {queue.map(study => (
              <StudyRow key={study.id} study={study} />
            ))}
          </div>
        </div>
      )}

      {/* Live */}
      {live.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-green-500" />
            Live
          </h2>
          <div className="space-y-3">
            {live.map(study => (
              <StudyRow key={study.id} study={study} />
            ))}
          </div>
        </div>
      )}

      {/* Complete */}
      {complete.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-gray-400" />
            Completed
          </h2>
          <div className="space-y-3">
            {complete.map(study => (
              <StudyRow key={study.id} study={study} />
            ))}
          </div>
        </div>
      )}

      {studies.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">No studies submitted yet. They will appear here when clients submit.</p>
        </div>
      )}

    </div>
  )
}

function StudyRow({ study }: { study: Study }) {
  const cfg = statusConfig[study.status] ?? statusConfig.submitted
  const Icon = cfg.icon
  const submitted = new Date(study.submittedAt).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <Link
      href={`/admin/studies/${study.id}`}
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
          {study.questions.length} questions · {study.participants} participants · ${(study.totalBudget * 1.10).toLocaleString()} · Submitted {submitted}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
    </Link>
  )
}
