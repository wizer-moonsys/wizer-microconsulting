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
  assignedOrg?: string
  inviteSent?: boolean
  cohortModel?: string
  routedOrg?: string
  routed?: boolean
}

const statusConfig = {
  submitted: { label: 'Awaiting Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  live: { label: 'Live', color: 'bg-green-100 text-green-700', icon: BarChart2 },
  complete: { label: 'Complete', color: 'bg-gray-100 text-gray-600', icon: CheckCircle },
  rejected: { label: 'Returned', color: 'bg-red-100 text-red-600', icon: AlertCircle },
}

// ── Demo data (shown when no real studies exist in localStorage) ──────────────
const DEMO_STUDIES: Study[] = [
  {
    id: 'demo-1',
    title: 'Housing Insecurity in Regional NSW',
    description: 'Exploring lived experiences of housing instability among Indigenous communities in regional and rural New South Wales.',
    isIndigenous: true,
    areas: ['New South Wales', 'Regional NSW'],
    participants: 40,
    ratePerPerson: 25,
    totalBudget: 1000,
    questions: [
      { id: 'q1', text: 'Have you experienced difficulty securing stable housing in the past 12 months?', type: 'yes_no' },
      { id: 'q2', text: 'What is the biggest barrier to stable housing in your community?', type: 'open' },
      { id: 'q3', text: 'How would you rate the availability of affordable housing in your area?', type: 'scale' },
      { id: 'q4', text: 'Which government support programs have you accessed?', type: 'multiple_choice' },
    ],
    windowValue: 14,
    windowUnit: 'days',
    status: 'submitted',
    submittedAt: '2026-05-18T09:30:00Z',
    assignedOrg: 'tranby',
    inviteSent: false,
    cohortModel: 'same_panel',
  },
  {
    id: 'demo-2',
    title: 'Type 2 Diabetes Management in Urban Communities',
    description: 'Investigating self-management practices and barriers to healthcare access among urban Australians living with Type 2 diabetes.',
    isIndigenous: false,
    areas: ['Victoria', 'Melbourne'],
    participants: 80,
    ratePerPerson: 30,
    totalBudget: 2400,
    questions: [
      { id: 'q1', text: 'How often do you monitor your blood glucose levels?', type: 'multiple_choice' },
      { id: 'q2', text: 'What is your biggest challenge in managing your diabetes?', type: 'open' },
      { id: 'q3', text: 'How confident do you feel managing your condition day-to-day?', type: 'scale' },
    ],
    windowValue: 21,
    windowUnit: 'days',
    status: 'live',
    submittedAt: '2026-05-01T14:00:00Z',
    assignedOrg: 'cad',
    inviteSent: true,
    cohortModel: 'same_panel',
    routedOrg: 'cad',
    routed: true,
  },
  {
    id: 'demo-3',
    title: 'Remote Work Impact on Work-Life Balance',
    description: 'Examining how remote and hybrid work arrangements have affected wellbeing, productivity, and family dynamics in Melbourne.',
    isIndigenous: false,
    areas: ['Victoria'],
    participants: 60,
    ratePerPerson: 20,
    totalBudget: 1200,
    questions: [
      { id: 'q1', text: 'Has remote work improved your work-life balance?', type: 'yes_no' },
      { id: 'q2', text: 'How many days per week do you work from home?', type: 'multiple_choice' },
      { id: 'q3', text: 'How has remote work affected your productivity?', type: 'scale' },
      { id: 'q4', text: 'What support would help you most in a remote setting?', type: 'open' },
    ],
    windowValue: 7,
    windowUnit: 'days',
    status: 'live',
    submittedAt: '2026-04-15T11:00:00Z',
    assignedOrg: 'mrc',
    inviteSent: true,
    cohortModel: 'same_panel',
    routedOrg: 'mrc',
    routed: true,
  },
  {
    id: 'demo-4',
    title: 'Digital Literacy Among Older Australians',
    description: 'Assessing digital skills confidence and barriers to technology adoption among Australians aged 65 and over.',
    isIndigenous: false,
    areas: ['New South Wales'],
    participants: 50,
    ratePerPerson: 20,
    totalBudget: 1000,
    questions: [
      { id: 'q1', text: 'How comfortable are you using smartphones or tablets?', type: 'scale' },
      { id: 'q2', text: 'What technology do you use most frequently?', type: 'multiple_choice' },
      { id: 'q3', text: 'What is the biggest barrier to using digital services?', type: 'open' },
    ],
    windowValue: 10,
    windowUnit: 'days',
    status: 'complete',
    submittedAt: '2026-03-01T08:00:00Z',
    assignedOrg: 'mrc',
    inviteSent: true,
    cohortModel: 'same_panel',
    routedOrg: 'mrc',
    routed: true,
  },
]

export default function AdminDashboard() {
  const [studies, setStudies] = useState<Study[]>([])

  useEffect(() => {
    const stored: Study[] = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    setStudies(stored.length > 0 ? stored : DEMO_STUDIES)
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
