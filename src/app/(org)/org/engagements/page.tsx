'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, BarChart2, CheckCircle, AlertCircle, ChevronRight, DollarSign, Users, HelpCircle } from 'lucide-react'

interface Study {
  id: string
  title: string
  description: string
  participants: number
  questions: { id: string; text: string }[]
  windowValue: number
  windowUnit: string
  status: 'submitted' | 'live' | 'complete' | 'rejected'
  submittedAt: string
  routedOrg?: string
  routeNote?: string
  paymentTotal?: number
}

// Mock "routed but not yet set up" requests that haven't come from localStorage
const MOCK_REQUESTS: Study[] = [
  {
    id: 'study-transport',
    title: 'Transport Infrastructure Futures',
    description: 'Infrastructure NSW is consulting communities most impacted by planned transport upgrades across Greater Sydney. They are seeking voices from Aboriginal and Torres Strait Islander communities to help shape how the project is communicated and delivered.',
    participants: 30,
    questions: [
      { id: 'q1', text: 'How has recent transport development affected your community\'s access to services?' },
      { id: 'q2', text: 'What does culturally safe consultation look like in your experience?' },
      { id: 'q3', text: 'What would make you confident a major infrastructure project had genuinely heard community voices?' },
    ],
    windowValue: 7,
    windowUnit: 'days',
    status: 'submitted',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    routedOrg: 'tranby',
    routeNote: 'Kylee — this one is well suited to your urban mob panel. Client is keen on genuine First Nations voices with lived experience in the Sydney metro area.',
    paymentTotal: 4620,
  },
]

const statusConfig = {
  submitted: {
    label: 'New request',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    dot: 'bg-orange-400',
    icon: AlertCircle,
    description: 'Routed to you — needs your panel set up before going live.',
  },
  live: {
    label: 'Live',
    color: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-400',
    icon: BarChart2,
    description: 'Participants are actively responding.',
  },
  complete: {
    label: 'Complete',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
    icon: CheckCircle,
    description: 'Study finished.',
  },
  rejected: {
    label: 'Returned',
    color: 'bg-red-100 text-red-600 border-red-200',
    dot: 'bg-red-400',
    icon: Clock,
    description: 'Returned to client.',
  },
}

const TABS = ['All', 'New requests', 'Live', 'Complete']

export default function OrgEngagementsPage() {
  const [localStudies, setLocalStudies] = useState<Study[]>([])
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    const all: Study[] = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    const ours = all.filter(s => s.routedOrg === 'tranby' || s.status === 'live')
    setLocalStudies(ours)
  }, [])

  const allStudies = [...MOCK_REQUESTS, ...localStudies]

  const filtered = allStudies.filter(s => {
    if (activeTab === 'All') return true
    if (activeTab === 'New requests') return s.status === 'submitted'
    if (activeTab === 'Live') return s.status === 'live'
    if (activeTab === 'Complete') return s.status === 'complete'
    return true
  })

  const newCount = allStudies.filter(s => s.status === 'submitted').length
  const liveCount = allStudies.filter(s => s.status === 'live').length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paid Engagements</h1>
        <p className="text-sm text-gray-500 mt-1">Study requests routed to Tranby College from Wizer.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-orange-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">New requests</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{newCount}</p>
          <p className="text-xs text-orange-600 mt-0.5">Awaiting panel setup</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-4 h-4 text-green-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{liveCount}</p>
          <p className="text-xs text-gray-400 mt-0.5">Participants responding</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-wizer-purple" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your management fees</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${allStudies.reduce((sum, s) => sum + (s.paymentTotal ?? s.participants * (s.questions?.length ?? 0) * 18), 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">50% of participant pool · your cut</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeTab === tab
                ? 'text-white border-transparent'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
            style={activeTab === tab ? { backgroundColor: '#7b69af', borderColor: '#7b69af' } : {}}
          >
            {tab}
            {tab === 'New requests' && newCount > 0 && (
              <span className="ml-1.5 bg-orange-400 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {newCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Engagement cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 text-sm">
            No engagements in this category yet.
          </div>
        )}
        {filtered.map(study => {
          const cfg = statusConfig[study.status]
          const Icon = cfg.icon
          const value = study.paymentTotal ?? study.participants * (study.questions?.length ?? 0) * 18

          return (
            <div key={study.id} className={`bg-white rounded-xl border overflow-hidden ${study.status === 'submitted' ? 'border-orange-200' : 'border-gray-200'}`}>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 mt-0.5 w-9 h-9 rounded-full flex items-center justify-center ${
                    study.status === 'submitted' ? 'bg-orange-50' :
                    study.status === 'live' ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      study.status === 'submitted' ? 'text-orange-500' :
                      study.status === 'live' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{study.title}</h3>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{study.description}</p>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> {study.participants} participants needed
                      </span>
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" /> {study.questions?.length ?? '?'} questions
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="font-semibold text-gray-700">${value.toLocaleString()}</span> total value
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/org/studies/${study.id}`}
                    className="shrink-0 flex items-center gap-1 text-sm font-medium text-wizer-purple hover:text-wizer-purple-dark transition-colors"
                  >
                    {study.status === 'submitted' ? 'Set up' : 'View'} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Wizer briefing note — only on new requests */}
                {study.status === 'submitted' && study.routeNote && (
                  <div className="mt-4 ml-13 bg-wizer-purple-xlight border border-wizer-purple-light rounded-lg px-4 py-3 ml-[52px]">
                    <p className="text-xs font-semibold text-wizer-purple uppercase tracking-wide mb-1">Note from Wizer</p>
                    <p className="text-sm text-wizer-purple-dark leading-relaxed">{study.routeNote}</p>
                  </div>
                )}

                {/* Action prompt for new requests */}
                {study.status === 'submitted' && (
                  <div className="mt-4 flex items-center justify-between ml-[52px]">
                    <p className="text-xs text-gray-400">
                      Received {new Date(study.submittedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })} · Select your panel to activate
                    </p>
                    <Link
                      href={`/org/studies/${study.id}`}
                      className="text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                      style={{ backgroundColor: '#7b69af' }}
                    >
                      Set up panel & invite →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
