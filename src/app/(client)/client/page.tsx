'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, CheckCircle, BarChart2, ChevronRight } from 'lucide-react'

interface Study {
  id: string
  title: string
  description: string
  isIndigenous: boolean
  areas: string[]
  cohortModel: string
  participants: number
  ratePerPerson: number
  totalBudget: number
  questionCount: number
  questions: { id: string; text: string; type: string; choices?: string[] }[]
  windowValue: number
  windowUnit: string
  status: 'submitted' | 'live' | 'complete'
  submittedAt: string
}

const statusConfig = {
  submitted: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  live: { label: 'Live', color: 'bg-green-100 text-green-700', icon: BarChart2 },
  complete: { label: 'Complete', color: 'bg-gray-100 text-gray-600', icon: CheckCircle },
}

const SAMPLE_STUDIES: Study[] = [
  {
    id: 'sample-1',
    title: 'Climate Policy Priorities — Community Voice',
    description: 'We want to understand what climate-related issues matter most to our community members before the next policy roundtable in September.',
    isIndigenous: false,
    areas: ['Victoria', 'New South Wales'],
    cohortModel: 'same_panel',
    participants: 40,
    ratePerPerson: 145,
    totalBudget: 5800,
    questionCount: 2,
    questions: [
      { id: 'q1', text: 'Which climate issue do you think needs the most urgent policy attention in your region?', type: 'multiple_choice', choices: ['Water security', 'Bushfire risk', 'Coastal erosion', 'Urban heat', 'Renewable energy transition'] },
      { id: 'q2', text: 'How confident are you that government decision-makers understand the climate concerns of people in your community?', type: 'scale' },
    ],
    windowValue: 1,
    windowUnit: 'weeks',
    status: 'live',
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Indigenous Health Services Consultation',
    description: 'Gathering perspectives from community members on gaps and priorities in local health service delivery ahead of the regional health strategy review.',
    isIndigenous: true,
    areas: ['Northern Territory', 'Queensland'],
    cohortModel: 'same_panel',
    participants: 25,
    ratePerPerson: 145,
    totalBudget: 3625,
    questionCount: 2,
    questions: [
      { id: 'q1', text: 'What is the biggest barrier you or your family face when accessing health services in your community?', type: 'open' },
      { id: 'q2', text: 'Would you feel more comfortable accessing health services if they were delivered on Country?', type: 'yes_no' },
    ],
    windowValue: 2,
    windowUnit: 'weeks',
    status: 'submitted',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Transport Infrastructure Feedback — Western Suburbs',
    description: 'Short pulse study on resident priorities for the upcoming transport corridor announcement.',
    isIndigenous: false,
    areas: ['Melbourne — West'],
    cohortModel: 'same_panel',
    participants: 50,
    ratePerPerson: 145,
    totalBudget: 7250,
    questionCount: 1,
    questions: [
      { id: 'q1', text: 'Which transport improvement would make the biggest difference to your daily life?', type: 'multiple_choice', choices: ['More frequent trains', 'Better bus connections', 'Dedicated cycling lanes', 'Park and ride facilities', 'Improved footpaths'] },
    ],
    windowValue: 1,
    windowUnit: 'weeks',
    status: 'complete',
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function ClientDashboard() {
  const [studies, setStudies] = useState<Study[]>([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    setStudies(stored)
  }, [])

  function loadSamples() {
    const existing: Study[] = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    const withoutSamples = existing.filter(s => !s.id.startsWith('sample-'))
    const merged = [...SAMPLE_STUDIES, ...withoutSamples]
    localStorage.setItem('wizer_studies', JSON.stringify(merged))
    setStudies(merged)
  }

  function clearSamples() {
    const existing: Study[] = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    const withoutSamples = existing.filter(s => !s.id.startsWith('sample-'))
    localStorage.setItem('wizer_studies', JSON.stringify(withoutSamples))
    setStudies(withoutSamples)
  }

  const hasSamples = studies.some(s => s.id.startsWith('sample-'))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Studies</h1>
        <div className="flex items-center gap-2">
          {!hasSamples ? (
            <button
              onClick={loadSamples}
              className="text-sm text-gray-400 hover:text-gray-600 border border-dashed border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              Load sample studies
            </button>
          ) : (
            <button
              onClick={clearSamples}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear samples
            </button>
          )}
          <Link
            href="/client/new"
            className="bg-wizer-purple hover:bg-wizer-purple-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + New Study
          </Link>
        </div>
      </div>

      {studies.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No studies yet. Start your first community consultation.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={loadSamples}
              className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-4 py-2 rounded-lg transition-colors"
            >
              Load sample studies
            </button>
            <Link
              href="/client/new"
              className="inline-flex bg-wizer-purple hover:bg-wizer-purple-dark text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Start a Study
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {studies.map(study => {
            const cfg = statusConfig[study.status] ?? statusConfig.submitted
            const Icon = cfg.icon
            const submitted = new Date(study.submittedAt).toLocaleDateString('en-AU', {
              day: 'numeric', month: 'short', year: 'numeric',
            })
            return (
              <Link key={study.id} href={`/client/${study.id}`} className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-wizer-purple-light hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                      {study.isIndigenous && (
                        <span className="px-2 py-0.5 bg-wizer-purple-light text-wizer-purple-dark text-xs rounded-full font-medium">Indigenous</span>
                      )}
                    </div>
                    <h2 className="font-semibold text-gray-900 truncate">{study.title || 'Untitled study'}</h2>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{study.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-400">
                      <span>{study.questions.length} question{study.questions.length !== 1 ? 's' : ''}</span>
                      <span>{study.participants} participants</span>
                      <span>${(study.totalBudget * 1.10).toLocaleString()} total</span>
                      <span>Submitted {submitted}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
