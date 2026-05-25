'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Users, MessageSquare, Calendar, DollarSign, MapPin, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  text: string
  type: string
  choices?: string[]
}

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
  questions: Question[]
  windowValue: number
  windowUnit: string
  status: 'submitted' | 'live' | 'complete' | 'rejected'
  submittedAt: string
  reviewNote?: string
  routedOrg?: string
  routeNote?: string
  routed?: boolean
}

const typeLabels: Record<string, string> = {
  yes_no: 'Yes / No',
  open: 'Open text',
  scale: 'Scale',
  multiple_choice: 'Multiple choice',
}

const ORGS = [
  { id: 'tranby', name: 'Tranby College', type: 'Indigenous Education', location: 'New South Wales', indigenous: true },
  { id: 'cad', name: 'CAD Frontiers', type: 'Health Research', location: 'Victoria', indigenous: false },
  { id: 'mrc', name: 'Melbourne Research Collective', type: 'Community Organisation', location: 'Victoria', indigenous: false },
]

// ── Demo studies (fallback when localStorage is empty) ───────────────────────
const DEMO_STUDIES: Study[] = [
  {
    id: 'demo-1',
    title: 'Housing Insecurity in Regional NSW',
    description: 'Exploring lived experiences of housing instability among Indigenous communities in regional and rural New South Wales.',
    isIndigenous: true,
    areas: ['New South Wales', 'Regional NSW'],
    cohortModel: 'same_panel',
    participants: 40,
    ratePerPerson: 25,
    totalBudget: 1000,
    questions: [
      { id: 'q1', text: 'Have you experienced difficulty securing stable housing in the past 12 months?', type: 'yes_no' },
      { id: 'q2', text: 'What is the biggest barrier to stable housing in your community?', type: 'open' },
      { id: 'q3', text: 'How would you rate the availability of affordable housing in your area?', type: 'scale' },
      { id: 'q4', text: 'Which government support programs have you accessed?', type: 'multiple_choice', choices: ['NRAS', 'Community Housing', 'Private rental assistance', 'None'] },
    ],
    windowValue: 14,
    windowUnit: 'days',
    status: 'submitted',
    submittedAt: '2026-05-18T09:30:00Z',
    routedOrg: 'tranby',
    routed: false,
  },
  {
    id: 'demo-2',
    title: 'Type 2 Diabetes Management in Urban Communities',
    description: 'Investigating self-management practices and barriers to healthcare access among urban Australians living with Type 2 diabetes.',
    isIndigenous: false,
    areas: ['Victoria', 'Melbourne'],
    cohortModel: 'same_panel',
    participants: 80,
    ratePerPerson: 30,
    totalBudget: 2400,
    questions: [
      { id: 'q1', text: 'How often do you monitor your blood glucose levels?', type: 'multiple_choice', choices: ['Multiple times daily', 'Once daily', 'A few times a week', 'Rarely'] },
      { id: 'q2', text: 'What is your biggest challenge in managing your diabetes?', type: 'open' },
      { id: 'q3', text: 'How confident do you feel managing your condition day-to-day?', type: 'scale' },
    ],
    windowValue: 21,
    windowUnit: 'days',
    status: 'live',
    submittedAt: '2026-05-01T14:00:00Z',
    routedOrg: 'cad',
    routed: true,
    routeNote: 'Please prioritise participants who have been diagnosed in the last 5 years.',
  },
  {
    id: 'demo-3',
    title: 'Remote Work Impact on Work-Life Balance',
    description: 'Examining how remote and hybrid work arrangements have affected wellbeing, productivity, and family dynamics in Melbourne.',
    isIndigenous: false,
    areas: ['Victoria'],
    cohortModel: 'same_panel',
    participants: 60,
    ratePerPerson: 20,
    totalBudget: 1200,
    questions: [
      { id: 'q1', text: 'Has remote work improved your work-life balance?', type: 'yes_no' },
      { id: 'q2', text: 'How many days per week do you work from home?', type: 'multiple_choice', choices: ['1-2 days', '3-4 days', '5 days (fully remote)', 'None'] },
      { id: 'q3', text: 'How has remote work affected your productivity?', type: 'scale' },
      { id: 'q4', text: 'What support would help you most in a remote setting?', type: 'open' },
    ],
    windowValue: 7,
    windowUnit: 'days',
    status: 'live',
    submittedAt: '2026-04-15T11:00:00Z',
    routedOrg: 'mrc',
    routed: true,
  },
  {
    id: 'demo-4',
    title: 'Digital Literacy Among Older Australians',
    description: 'Assessing digital skills confidence and barriers to technology adoption among Australians aged 65 and over.',
    isIndigenous: false,
    areas: ['New South Wales'],
    cohortModel: 'same_panel',
    participants: 50,
    ratePerPerson: 20,
    totalBudget: 1000,
    questions: [
      { id: 'q1', text: 'How comfortable are you using smartphones or tablets?', type: 'scale' },
      { id: 'q2', text: 'What technology do you use most frequently?', type: 'multiple_choice', choices: ['Smartphone', 'Tablet', 'Laptop/Desktop', 'None'] },
      { id: 'q3', text: 'What is the biggest barrier to using digital services?', type: 'open' },
    ],
    windowValue: 10,
    windowUnit: 'days',
    status: 'complete',
    submittedAt: '2026-03-01T08:00:00Z',
    routedOrg: 'mrc',
    routed: true,
  },
]

// Mock participant data per study
const DEMO_PARTICIPANTS: Record<string, { name: string; status: 'responded' | 'invited' }[]> = {
  'demo-2': [
    { name: 'Alice Nguyen', status: 'responded' },
    { name: 'Robert Briggs', status: 'responded' },
    { name: 'Mary Thorpe', status: 'invited' },
    { name: 'Emmanuel Torres', status: 'responded' },
    { name: 'Patricia Walsh', status: 'invited' },
    { name: 'David Kim', status: 'responded' },
    { name: 'Sandra Murphy', status: 'responded' },
  ],
  'demo-3': [
    { name: 'Liam Chen', status: 'responded' },
    { name: 'Amara Osei', status: 'responded' },
    { name: 'Tom Rawlings', status: 'invited' },
    { name: 'Fatima Hassan', status: 'responded' },
    { name: 'Grace Petrov', status: 'invited' },
  ],
  'demo-4': [
    { name: 'Joan Whitmore', status: 'responded' },
    { name: 'Barry Fletcher', status: 'responded' },
    { name: 'Doris Chan', status: 'responded' },
    { name: 'Kevin Park', status: 'responded' },
    { name: 'Norma Gutierrez', status: 'responded' },
  ],
}

export default function AdminStudyReviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [study, setStudy] = useState<Study | null>(null)
  const [note, setNote] = useState('')
  const [done, setDone] = useState(false)

  // Routing state
  const [routedOrg, setRoutedOrg] = useState('')
  const [routeNote, setRouteNote] = useState('')
  const [routed, setRouted] = useState(false)

  const isDemo = id?.startsWith('demo-')

  useEffect(() => {
    if (isDemo) {
      const found = DEMO_STUDIES.find(s => s.id === id) ?? null
      if (found) {
        setStudy(found)
        setNote(found.reviewNote ?? '')
        setRoutedOrg(found.routedOrg ?? '')
        setRouteNote(found.routeNote ?? '')
        setRouted(found.routed ?? false)
      }
      return
    }
    const stored: Study[] = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    const found = stored.find(s => s.id === id)
    if (found) {
      setStudy(found)
      setNote(found.reviewNote ?? '')
      setRoutedOrg(found.routedOrg ?? '')
      setRouteNote(found.routeNote ?? '')
      setRouted(found.routed ?? false)
    }
  }, [id, isDemo])

  function saveToStorage(updates: Partial<Study>) {
    if (isDemo) {
      // For demo studies, just update local state
      setStudy(prev => prev ? { ...prev, ...updates } : prev)
      return
    }
    const stored: Study[] = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    const updated = stored.map(s => s.id === id ? { ...s, ...updates } : s)
    localStorage.setItem('wizer_studies', JSON.stringify(updated))
    setStudy(prev => prev ? { ...prev, ...updates } : prev)
  }

  function saveStatus(newStatus: 'live' | 'rejected') {
    saveToStorage({ status: newStatus, reviewNote: note, routedOrg, routeNote, routed })
    setDone(true)
    setTimeout(() => router.push('/admin'), 1400)
  }

  function sendToOrg() {
    saveToStorage({ routedOrg, routeNote, routed: true })
    setRouted(true)
  }

  if (!study) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>Study not found.</p>
        <Link href="/admin" className="text-wizer-purple text-sm mt-2 inline-block hover:underline">← Back to Admin</Link>
      </div>
    )
  }

  const participantPool = study.totalBudget
  const orgFee = study.totalBudget
  const subtotal = participantPool + orgFee
  const platformFee = subtotal * 0.10
  const grandTotal = subtotal + platformFee
  const totalDue = grandTotal
  const isReviewed = study.status !== 'submitted'
  const selectedOrg = ORGS.find(o => o.id === routedOrg)
  const participants = DEMO_PARTICIPANTS[study.id] ?? []
  const responded = participants.filter(p => p.status === 'responded')

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Back */}
      <button onClick={() => router.push('/admin')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Review Queue
      </button>

      {/* Success banner */}
      {done && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          {study.status === 'live' ? 'Study approved and set to live.' : 'Study returned to client.'} Redirecting…
        </div>
      )}

      {/* Already reviewed banner */}
      {isReviewed && !done && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
          This study has already been <strong>{study.status === 'live' ? 'approved' : study.status === 'complete' ? 'completed' : 'returned'}</strong>.
          {study.reviewNote && <span className="block mt-1 text-blue-600">Note: {study.reviewNote}</span>}
        </div>
      )}

      {/* Demo notice */}
      {isDemo && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700">
          This is demo data — actions below update the view temporarily and won't persist.
        </div>
      )}

      {/* Study header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {study.isIndigenous && (
            <span className="px-2.5 py-1 bg-wizer-purple-light text-wizer-purple-dark text-xs rounded-full font-medium">Indigenous panel</span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{study.title || 'Untitled study'}</h1>
        <p className="text-gray-500 mt-2">{study.description}</p>
        <p className="text-xs text-gray-400 mt-3">
          Submitted {new Date(study.submittedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'Participants', value: study.participants },
          { icon: MessageSquare, label: 'Questions', value: study.questions.length },
          { icon: Calendar, label: 'Window', value: `${study.windowValue} ${study.windowUnit}` },
          { icon: DollarSign, label: 'Total (inc. fee)', value: `$${totalDue.toLocaleString()}` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
            <Icon className="w-4 h-4 text-wizer-purple-mid mb-1" />
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-lg font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Questions</h2>
        {study.questions.map((q, i) => (
          <div key={q.id} className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-wizer-purple-light text-wizer-purple-dark flex items-center justify-center text-xs font-bold mt-0.5">
              {i + 1}
            </span>
            <div>
              <p className="text-gray-900 text-sm">{q.text || <span className="italic text-gray-400">No question text</span>}</p>
              <p className="text-xs text-gray-400 mt-0.5">{typeLabels[q.type] ?? q.type}</p>
              {q.choices && q.choices.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {q.choices.map((c, ci) => (
                    <span key={ci} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{c}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Route to org */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Route to Org Admin</h2>
          <p className="text-xs text-gray-400 mt-1">
            Pass this study to the relevant org admin. They will manage their own community and decide who to invite.
          </p>
        </div>

        {routed ? (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <div>
              <p className="font-medium">Passed to {selectedOrg?.name ?? routedOrg}</p>
              {routeNote && <p className="text-green-600 text-xs mt-0.5">"{routeNote}"</p>}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {ORGS.map(o => (
                <button
                  key={o.id}
                  onClick={() => setRoutedOrg(o.id === routedOrg ? '' : o.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    routedOrg === o.id
                      ? 'border-wizer-purple bg-wizer-purple-light text-wizer-purple-dark'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {o.name}
                  {o.indigenous && <span className="text-xs text-wizer-purple-mid">(Indigenous)</span>}
                </button>
              ))}
            </div>

            {routedOrg && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">Briefing note for {selectedOrg?.name} <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  value={routeNote}
                  onChange={e => setRouteNote(e.target.value)}
                  placeholder="Any context that will help them brief their community…"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-wizer-purple resize-none"
                />
                <button
                  onClick={sendToOrg}
                  className="text-sm text-wizer-purple hover:text-wizer-purple-dark font-medium"
                >
                  Send to {selectedOrg?.name} →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Location & Setup</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <span className="text-gray-400">Cohort model</span>
          <span className="text-gray-900">{study.cohortModel === 'same_panel' ? 'Same panel throughout' : 'Min per question'}</span>
          <span className="text-gray-400">Rate per person</span>
          <span className="text-gray-900">${study.ratePerPerson}</span>
        </div>
        {study.areas.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {study.areas.map(a => (
              <span key={a} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                <MapPin className="w-3 h-3" /> {a}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Payment */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Payment Breakdown</h2>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <div>
              <span className="text-gray-700 font-medium">Participant fees (50%)</span>
              <p className="text-xs text-gray-400">{study.participants} participants × ${study.ratePerPerson}</p>
            </div>
            <span className="text-gray-900">${participantPool.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <div>
              <span className="text-gray-700 font-medium">Org management fee (50%)</span>
              <p className="text-xs text-gray-400">Matched to participant pool — covers community curation</p>
            </div>
            <span className="text-gray-900">${orgFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-1.5">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-gray-700">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Wizer platform fee (10%)</span>
            <span className="text-gray-700">${platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-gray-100 pt-2">
            <span className="text-gray-900">Total charged to client</span>
            <span className="text-wizer-purple-dark text-base">${grandTotal.toLocaleString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-1">
          {[
            { label: 'To participants', amount: participantPool, color: 'bg-green-50 border-green-200 text-green-700' },
            { label: 'To org manager', amount: orgFee, color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { label: 'Wizer revenue', amount: platformFee, color: 'bg-wizer-purple-xlight border-wizer-purple-light text-wizer-purple' },
          ].map(item => (
            <div key={item.label} className={`rounded-lg border px-3 py-2 text-center ${item.color}`}>
              <p className="text-xs font-medium mb-0.5">{item.label}</p>
              <p className="text-sm font-bold">${item.amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Participants — shown once live or complete */}
      {(study.status === 'live' || study.status === 'complete') && participants.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Participants</h2>
            <span className="text-xs text-gray-400">
              {study.routedOrg ? `Managed by ${ORGS.find(o => o.id === study.routedOrg)?.name ?? study.routedOrg}` : 'No org assigned'}
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {participants.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-wizer-purple-light text-wizer-purple-dark flex items-center justify-center text-xs font-bold">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="text-sm text-gray-900">{p.name}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.status === 'responded'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {p.status === 'responded' ? 'Responded' : 'Invited'}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between text-sm">
            <span className="text-gray-500">Response rate</span>
            <span className="font-semibold text-gray-900">
              {responded.length} of {participants.length} invited{' '}
              <span className="text-gray-400 font-normal">({Math.round((responded.length / participants.length) * 100)}%)</span>
            </span>
          </div>
        </div>
      )}

      {/* Review decision */}
      {!isReviewed && !done && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Review Decision</h2>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note to the client (optional — shown if you return the study)…"
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-wizer-purple resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => saveStatus('rejected')}
              className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Return to Client
            </button>
            <button
              onClick={() => saveStatus('live')}
              className="flex items-center gap-2 bg-wizer-purple hover:bg-wizer-purple-dark text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ml-auto"
            >
              <CheckCircle className="w-4 h-4" />
              {selectedOrg ? `Approve & Send to ${selectedOrg.name}` : 'Approve & Go Live'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
