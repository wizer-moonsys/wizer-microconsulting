'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ChevronLeft, Users, MessageSquare, Calendar, CheckCircle,
  Send, ChevronDown, ChevronUp, DollarSign, MapPin,
  Star, Filter, Search, AlertCircle, UserCheck, Pencil, RotateCcw, X
} from 'lucide-react'
import Link from 'next/link'

/* ─── Types ─────────────────────────────────────── */

interface Question { id: string; text: string; type: string; choices?: string[] }

interface Study {
  id: string; title: string; description: string
  isIndigenous: boolean; areas: string[]
  participants: number; questions: Question[]
  windowValue: number; windowUnit: string
  status: string; routeNote?: string; paymentTotal?: number
}

interface Member {
  id: string; name: string; initials: string; location: string
  profileComplete: boolean; decisionType: string; decisionCode: string
  experience: string[]; ethnicity: string; panelId: string | null
  nation: string; matchTags: string[]
}

interface Panel { id: string; name: string }

/* ─── Mock data ─────────────────────────────────── */

const MOCK_STUDIES: Study[] = [
  {
    id: 'study-transport',
    title: 'Transport Infrastructure Futures',
    description: 'Infrastructure NSW is consulting communities most impacted by planned transport upgrades across Greater Sydney. They are seeking voices from Aboriginal and Torres Strait Islander communities to help shape how the project is communicated and delivered.',
    isIndigenous: true,
    areas: ['Urban planning', 'Community impact', 'Transport access', 'Cultural safety'],
    participants: 30,
    questions: [
      { id: 'q1', text: 'How has recent transport development affected your community\'s access to services?', type: 'open' },
      { id: 'q2', text: 'What does culturally safe consultation look like in your experience?', type: 'open' },
      { id: 'q3', text: 'What would make you confident a major infrastructure project had genuinely heard community voices?', type: 'multiple_choice', choices: ['Direct community meetings', 'Independent review panel', 'Published outcomes report', 'Ongoing advisory role'] },
      { id: 'q4', text: 'Rate how well existing transport infrastructure serves your community (1 = very poorly, 10 = very well)', type: 'scale' },
      { id: 'q5', text: 'Should community consultation happen before or after project approval?', type: 'yes_no' },
      { id: 'q6', text: 'What is the single most important change that would improve transport access for your community?', type: 'open' },
      { id: 'q7', text: 'Would you be willing to participate in an ongoing advisory panel for this project?', type: 'yes_no' },
    ],
    windowValue: 7, windowUnit: 'days',
    status: 'submitted',
    routeNote: 'Kylee — this one is well suited to your urban mob panel. Client is keen on genuine First Nations voices with lived experience in the Sydney metro area.',
    paymentTotal: 4620,
  },
]

const PANELS: Panel[] = [
  { id: 'panel-1', name: 'Elders & Knowledge Holders' },
  { id: 'panel-2', name: 'Sydney Metro Community' },
  { id: 'panel-3', name: 'Remote & Regional' },
]

const decisionColors: Record<string, string> = {
  VIS: '#7b69af', GUA: '#e67e22', ACH: '#27ae60', COL: '#2980b9', ANA: '#8e44ad',
}

const ALL_MEMBERS: Member[] = [
  // Panel 1 — Elders & Knowledge Holders
  {
    id: 'p1', name: 'Alice Nguyen', initials: 'AN', location: 'Sydney, NSW',
    profileComplete: true, decisionType: 'The Visionary', decisionCode: 'VIS',
    experience: ['Community advocacy', 'Cultural heritage'], ethnicity: 'Aboriginal Australian',
    nation: 'Gadigal', panelId: 'panel-1',
    matchTags: ['First Nations', 'Sydney metro', 'Cultural safety experience'],
  },
  {
    id: 'p2', name: 'Robert Briggs', initials: 'RB', location: 'Dubbo, NSW',
    profileComplete: true, decisionType: 'The Guardian', decisionCode: 'GUA',
    experience: ['Land management', 'Local government'], ethnicity: 'Aboriginal Australian',
    nation: 'Wiradjuri', panelId: 'panel-1',
    matchTags: ['First Nations', 'Infrastructure experience', 'Community leadership'],
  },
  {
    id: 'p4', name: 'Emmanuel Torres', initials: 'ET', location: 'Penrith, NSW',
    profileComplete: true, decisionType: 'The Achiever', decisionCode: 'ACH',
    experience: ['Urban planning', 'Transport policy'], ethnicity: 'Torres Strait Islander',
    nation: 'Dharug', panelId: 'panel-1',
    matchTags: ['First Nations', 'Transport expertise', 'Western Sydney'],
  },
  // Panel 2 — Sydney Metro Community
  {
    id: 'p3', name: 'Mary Thorpe', initials: 'MT', location: 'Redfern, NSW',
    profileComplete: false, decisionType: 'The Collaborator', decisionCode: 'COL',
    experience: ['Community services', 'Youth work'], ethnicity: 'Aboriginal Australian',
    nation: 'Gadigal', panelId: 'panel-2',
    matchTags: ['First Nations', 'Sydney metro', 'Community services'],
  },
  {
    id: 'p6', name: 'James Nguyen', initials: 'JN', location: 'Parramatta, NSW',
    profileComplete: true, decisionType: 'The Visionary', decisionCode: 'VIS',
    experience: ['Business development', 'Community enterprise'], ethnicity: 'Aboriginal Australian',
    nation: 'Dharug', panelId: 'panel-2',
    matchTags: ['First Nations', 'Parramatta corridor', 'Business voice'],
  },
  {
    id: 'p7', name: 'Sandra Cooper', initials: 'SC', location: 'Liverpool, NSW',
    profileComplete: true, decisionType: 'The Guardian', decisionCode: 'GUA',
    experience: ['Health services', 'Community wellbeing'], ethnicity: 'Aboriginal Australian',
    nation: 'Dharug', panelId: 'panel-2',
    matchTags: ['First Nations', 'South-west Sydney', 'Health & wellbeing'],
  },
  // Panel 3 — Remote & Regional
  {
    id: 'p5', name: 'Patricia Walsh', initials: 'PW', location: 'Blacktown, NSW',
    profileComplete: false, decisionType: 'The Analyst', decisionCode: 'ANA',
    experience: ['Data & research', 'Policy review'], ethnicity: 'Aboriginal Australian',
    nation: 'Dharug', panelId: 'panel-3',
    matchTags: ['First Nations', 'Western Sydney', 'Research background'],
  },
  {
    id: 'p8', name: 'David Reid', initials: 'DR', location: 'Penrith, NSW',
    profileComplete: true, decisionType: 'The Achiever', decisionCode: 'ACH',
    experience: ['Construction', 'Trades & infrastructure'], ethnicity: 'Aboriginal Australian',
    nation: 'Dharug', panelId: 'panel-3',
    matchTags: ['First Nations', 'Infrastructure experience', 'Western Sydney'],
  },
  {
    id: 'p9', name: 'Leanne Watson', initials: 'LW', location: 'Newcastle, NSW',
    profileComplete: false, decisionType: 'The Visionary', decisionCode: 'VIS',
    experience: ['Education', 'Curriculum design'], ethnicity: 'Torres Strait Islander',
    nation: 'Awabakal', panelId: 'panel-3',
    matchTags: ['First Nations', 'Regional NSW', 'Education sector'],
  },
  // Individuals — not in any panel
  {
    id: 'ind-1', name: 'Cheryl Mundine', initials: 'CM', location: 'Lismore, NSW',
    profileComplete: true, decisionType: 'The Guardian', decisionCode: 'GUA',
    experience: ['Community law', 'Native title'], ethnicity: 'Aboriginal Australian',
    nation: 'Bundjalung', panelId: null,
    matchTags: ['First Nations', 'Bundjalung country', 'Legal expertise'],
  },
  {
    id: 'ind-2', name: 'Wayne Gorringe', initials: 'WG', location: 'Grafton, NSW',
    profileComplete: true, decisionType: 'The Achiever', decisionCode: 'ACH',
    experience: ['Transport & logistics', 'Regional development'], ethnicity: 'Aboriginal Australian',
    nation: 'Bundjalung', panelId: null,
    matchTags: ['First Nations', 'Bundjalung country', 'Transport experience'],
  },
  {
    id: 'ind-3', name: 'Sharon Williams', initials: 'SW', location: 'Moree, NSW',
    profileComplete: true, decisionType: 'The Visionary', decisionCode: 'VIS',
    experience: ['Agriculture', 'Rural community'], ethnicity: 'Aboriginal Australian',
    nation: 'Gamilaraay', panelId: null,
    matchTags: ['First Nations', 'Gamilaraay country', 'Rural NSW'],
  },
  {
    id: 'ind-4', name: 'Tony Briggs', initials: 'TB', location: 'Wollongong, NSW',
    profileComplete: false, decisionType: 'The Collaborator', decisionCode: 'COL',
    experience: ['Mining', 'Environmental assessment'], ethnicity: 'Aboriginal Australian',
    nation: 'Yuin', panelId: null,
    matchTags: ['First Nations', 'Yuin country', 'Environmental voice'],
  },
  {
    id: 'ind-5', name: 'Aunty Diane Johnson', initials: 'DJ', location: 'Tamworth, NSW',
    profileComplete: true, decisionType: 'The Guardian', decisionCode: 'GUA',
    experience: ['Cultural protocols', 'Elder governance'], ethnicity: 'Aboriginal Australian',
    nation: 'Gamilaraay', panelId: null,
    matchTags: ['First Nations', 'Elder voice', 'Cultural authority'],
  },
]

const typeLabels: Record<string, string> = {
  yes_no: 'Yes / No', open: 'Open text', scale: 'Scale 1–10', multiple_choice: 'Multiple choice',
}

const STEPS = ['Review brief', 'Curate panel', 'Review & send']

/* ─── Page ──────────────────────────────────────── */

export default function OrgStudyPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [study, setStudy] = useState<Study | null>(null)
  const [step, setStep] = useState(0)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [expandedPanels, setExpandedPanels] = useState<string[]>(['panel-1', 'panel-2', 'panel-3'])
  const [filterPanel, setFilterPanel] = useState<string>('all')
  const [filterNation, setFilterNation] = useState<string>('all')
  const [filterComplete, setFilterComplete] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<'panels' | 'individuals'>('panels')
  const [search, setSearch] = useState('')
  const [inviteSent, setInviteSent] = useState(false)
  const [customNote, setCustomNote] = useState('')
  const [editingMessage, setEditingMessage] = useState(false)
  const [messageDraft, setMessageDraft] = useState('')
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  useEffect(() => {
    const mock = MOCK_STUDIES.find(s => s.id === id)
    if (mock) { setStudy(mock); return }
    const stored: Study[] = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    const found = stored.find(s => s.id === id)
    if (found) setStudy(found)
  }, [id])

  function togglePanelExpand(panelId: string) {
    setExpandedPanels(prev => prev.includes(panelId) ? prev.filter(p => p !== panelId) : [...prev, panelId])
  }

  function togglePanelAll(panelId: string) {
    const ids = visibleMembers.filter(m => m.panelId === panelId).map(m => m.id)
    const allSelected = ids.every(id => selectedMembers.includes(id))
    setSelectedMembers(prev => allSelected ? prev.filter(id => !ids.includes(id)) : Array.from(new Set([...prev, ...ids])))
  }

  function toggleMember(memberId: string) {
    setSelectedMembers(prev => prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId])
  }

  function selectAll() { setSelectedMembers(visibleMembers.map(m => m.id)) }
  function clearAll() { setSelectedMembers([]) }

  const ALL_NATIONS = Array.from(new Set(ALL_MEMBERS.map(m => m.nation))).sort()

  const visibleMembers = ALL_MEMBERS.filter(m => {
    if (viewMode === 'panels' && filterPanel === 'individuals') return m.panelId === null
    if (viewMode === 'panels' && filterPanel !== 'all' && m.panelId !== filterPanel) return false
    if (viewMode === 'individuals') { /* show all, no panel filter */ }
    if (filterNation !== 'all' && m.nation !== filterNation) return false
    if (filterComplete && !m.profileComplete) return false
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) &&
        !m.experience.join(' ').toLowerCase().includes(search.toLowerCase()) &&
        !m.nation.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const selectedDetails = ALL_MEMBERS.filter(m => selectedMembers.includes(m.id))
  const target = study?.participants ?? 0
  const recommended = Math.ceil(target * 1.4)
  const atTarget = selectedMembers.length >= target
  const atRecommended = selectedMembers.length >= recommended
  const pct = Math.min(100, Math.round((selectedMembers.length / recommended) * 100))

  const defaultMessage = study
    ? `Hi [Name],\n\nTransby College has selected you to participate in a paid research study: "${study.title}".\n\nYou'll be asked ${study.questions.length} questions over the coming weeks, one at a time. Each question earns you Wizer credits to spend in the rewards shop.\n\nClick below to view and accept your invitation.`
    : ''

  const activeMessage = savedMessage ?? defaultMessage
  const isMessageModified = savedMessage !== null && savedMessage !== defaultMessage

  if (!study) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>Study not found.</p>
        <Link href="/org/engagements" className="text-wizer-purple text-sm mt-2 inline-block hover:underline">← Back to engagements</Link>
      </div>
    )
  }

  /* ── Sent state ── */
  if (inviteSent) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invitations sent!</h2>
        <p className="text-gray-500 text-sm mb-1">
          <strong>{selectedMembers.length} members</strong> have been invited to <strong>{study.title}</strong>.
        </p>
        <p className="text-gray-400 text-sm mb-8">They'll receive an invitation from Tranby College with a link to participate. You can track responses in Paid Engagements.</p>
        <Link
          href="/org/engagements"
          className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-lg"
          style={{ backgroundColor: '#7b69af' }}
        >
          Back to Engagements
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* Back */}
      <button onClick={() => router.push('/org/engagements')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-5">
        <ChevronLeft className="w-4 h-4" /> Paid Engagements
      </button>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                i === step ? 'text-white' :
                i < step ? 'text-wizer-purple hover:bg-wizer-purple-light' :
                'text-gray-400 cursor-default'
              }`}
              style={i === step ? { backgroundColor: '#7b69af' } : {}}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i < step ? 'bg-green-100 text-green-600' :
                i === step ? 'bg-white/30 text-white' :
                'bg-gray-100 text-gray-400'
              }`}>
                {i < step ? '✓' : i + 1}
              </span>
              {s}
            </button>
            {i < STEPS.length - 1 && <div className={`w-6 h-px mx-1 ${i < step ? 'bg-green-300' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* ══ STEP 0: Review brief ══ */}
      {step === 0 && (
        <div className="space-y-5">
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full">
              <AlertCircle className="w-3 h-3" /> New request — awaiting panel setup
            </span>
            {study.isIndigenous && (
              <span className="text-xs font-medium bg-wizer-purple-light text-wizer-purple-dark px-2.5 py-1 rounded-full">Indigenous panel</span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900">{study.title}</h1>

          {/* Wizer briefing note */}
          {study.routeNote && (
            <div className="bg-wizer-purple-xlight border border-wizer-purple-light rounded-xl px-5 py-4">
              <p className="text-xs font-semibold text-wizer-purple uppercase tracking-wide mb-1.5">Note from Wizer</p>
              <p className="text-sm text-wizer-purple-dark leading-relaxed">{study.routeNote}</p>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-gray-600 leading-relaxed">{study.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {study.areas?.map(a => (
                <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-wizer-purple-light text-wizer-purple-dark font-medium">{a}</span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Users, label: 'Participants needed', value: study.participants },
              { icon: MessageSquare, label: 'Questions', value: study.questions.length },
              { icon: Calendar, label: 'Response window', value: `${study.windowValue} ${study.windowUnit}` },
              { icon: DollarSign, label: 'Your management fee', value: study.paymentTotal ? `$${study.paymentTotal.toLocaleString()}` : '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className={`bg-white rounded-xl border p-4 ${label === 'Your management fee' ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                <Icon className={`w-4 h-4 mb-1 ${label === 'Your management fee' ? 'text-green-500' : 'text-wizer-purple-mid'}`} />
                <p className="text-xs text-gray-400">{label}</p>
                <p className={`text-base font-semibold ${label === 'Your management fee' ? 'text-green-700' : 'text-gray-900'}`}>{value}</p>
                {label === 'Your management fee' && (
                  <p className="text-xs text-green-600 mt-0.5">50% of participant pool</p>
                )}
              </div>
            ))}
          </div>

          {/* Payment model explainer */}
          <div className="bg-wizer-purple-xlight border border-wizer-purple-light rounded-xl px-5 py-4">
            <p className="text-xs font-semibold text-wizer-purple uppercase tracking-wide mb-3">How the payment works</p>
            <div className="grid grid-cols-3 gap-3 text-xs text-center">
              <div>
                <p className="font-semibold text-gray-700 mb-0.5">Participant pool</p>
                <p className="text-2xl font-bold text-gray-900">${study.paymentTotal?.toLocaleString() ?? '—'}</p>
                <p className="text-gray-500 mt-0.5">Split across {study.participants} participants</p>
                {study.paymentTotal && (
                  <p className="mt-2 inline-block bg-white border border-gray-200 text-gray-700 font-semibold rounded-full px-2.5 py-0.5">
                    ~${Math.round(study.paymentTotal / study.participants)} per person
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center text-gray-300 text-xl font-light">+</div>
              <div>
                <p className="font-semibold text-green-700 mb-0.5">Your management fee</p>
                <p className="text-2xl font-bold text-green-700">${study.paymentTotal?.toLocaleString() ?? '—'}</p>
                <p className="text-gray-500 mt-0.5">Equal match to the participant pool</p>
                <p className="mt-2 inline-block bg-green-50 border border-green-200 text-green-700 font-semibold rounded-full px-2.5 py-0.5">
                  Released as responses come in
                </p>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Questions</h2>
            {study.questions.map((q, i) => (
              <div key={q.id} className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-wizer-purple-light text-wizer-purple-dark flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-gray-900 text-sm">{q.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{typeLabels[q.type] ?? q.type}</p>
                  {q.choices && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {q.choices.map((c, ci) => <span key={ci} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{c}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(1)}
              className="text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
              style={{ backgroundColor: '#7b69af' }}
            >
              Curate your panel →
            </button>
          </div>
        </div>
      )}

      {/* ══ STEP 1: Curate panel ══ */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{study.title}</h1>
            <p className="text-sm text-gray-500 mt-1">Select the right people from your community for this study. Consider experience, decision profile, and location fit.</p>
          </div>

          {/* Participation tracker — sticky context */}
          <div className={`rounded-xl border p-4 ${atRecommended ? 'border-green-200 bg-green-50' : atTarget ? 'border-yellow-200 bg-yellow-50' : 'border-wizer-purple-light bg-wizer-purple-xlight'}`}>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">
                {atRecommended ? '✓ Great selection' : atTarget ? 'At minimum — a few more recommended' : `Select ${Math.max(0, recommended - selectedMembers.length)} more to reach recommended`}
              </span>
              <span className="font-bold text-gray-900">{selectedMembers.length} selected</span>
            </div>
            <div className="h-2 bg-white rounded-full border border-gray-200 overflow-hidden relative">
              <div className="absolute top-0 bottom-0 w-px bg-yellow-400 z-10" style={{ left: `${Math.round((target / recommended) * 100)}%` }} />
              <div className={`h-full rounded-full transition-all ${atRecommended ? 'bg-green-500' : atTarget ? 'bg-yellow-400' : 'bg-wizer-purple-mid'}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>0</span>
              <span className="text-yellow-600 font-medium">Target: {target}</span>
              <span className="text-gray-500">Recommended: {recommended} (+40% buffer)</span>
            </div>
          </div>

          {/* View mode + filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            {/* View toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 mr-1">Browse by:</span>
              {[
                { mode: 'panels' as const, label: 'Panels & groups' },
                { mode: 'individuals' as const, label: 'All individuals' },
              ].map(({ mode, label }) => (
                <button
                  key={mode}
                  onClick={() => { setViewMode(mode); setFilterPanel('all') }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    viewMode === mode
                      ? 'text-white border-transparent'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                  style={viewMode === mode ? { backgroundColor: '#7b69af' } : {}}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Filters row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-40">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text" placeholder="Search name, expertise, nation..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wizer-purple/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                {viewMode === 'panels' && (
                  <select
                    value={filterPanel} onChange={e => setFilterPanel(e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600 focus:outline-none bg-white"
                  >
                    <option value="all">All panels</option>
                    {PANELS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    <option value="individuals">Individuals (no panel)</option>
                  </select>
                )}
                <select
                  value={filterNation} onChange={e => setFilterNation(e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600 focus:outline-none bg-white"
                >
                  <option value="all">All nations</option>
                  {ALL_NATIONS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer whitespace-nowrap">
                  <input type="checkbox" checked={filterComplete} onChange={e => setFilterComplete(e.target.checked)} className="rounded" />
                  Profile complete
                </label>
              </div>
              <div className="flex gap-2 ml-auto">
                <button onClick={selectAll} className="text-xs text-wizer-purple font-medium hover:text-wizer-purple-dark">Select all</button>
                <span className="text-gray-300">|</span>
                <button onClick={clearAll} className="text-xs text-gray-500 hover:text-gray-700">Clear</button>
              </div>
            </div>
          </div>

          {/* Panel + member list */}
          <div className="space-y-3">

            {/* ── Individuals flat list (viewMode === 'individuals') ── */}
            {viewMode === 'individuals' && (
              <>
                {visibleMembers.length === 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 text-sm">
                    No individuals match your filters.
                  </div>
                )}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {visibleMembers.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">All community members ({visibleMembers.length})</p>
                      <div className="flex gap-3 text-xs">
                        <button onClick={selectAll} className="text-wizer-purple font-medium hover:text-wizer-purple-dark">Select all</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={clearAll} className="text-gray-500 hover:text-gray-700">Clear</button>
                      </div>
                    </div>
                  )}
                  <div className="divide-y divide-gray-50">
                    {visibleMembers.map(m => {
                      const isSelected = selectedMembers.includes(m.id)
                      const panelLabel = m.panelId
                        ? PANELS.find(p => p.id === m.panelId)?.name ?? 'Panel'
                        : 'Individual — no panel'
                      return (
                        <button
                          key={m.id}
                          onClick={() => toggleMember(m.id)}
                          className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors ${isSelected ? 'bg-wizer-purple-xlight' : 'bg-white hover:bg-gray-50'}`}
                        >
                          {/* Checkbox */}
                          <div className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-wizer-purple border-wizer-purple' : 'border-gray-300'}`}>
                            {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          {/* Avatar + decision badge */}
                          <div className="relative shrink-0">
                            <div className="w-9 h-9 rounded-full bg-wizer-purple-light flex items-center justify-center text-xs font-bold text-wizer-purple-dark">
                              {m.initials}
                            </div>
                            <div
                              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold border border-white"
                              style={{ backgroundColor: decisionColors[m.decisionCode] ?? '#7b69af' }}
                              title={m.decisionType}
                            >
                              {m.decisionCode.slice(0, 2)}
                            </div>
                          </div>
                          {/* Main info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                              <span className="text-xs font-medium" style={{ color: decisionColors[m.decisionCode] }}>{m.decisionType}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.panelId ? 'bg-wizer-purple-light text-wizer-purple-dark' : 'bg-gray-100 text-gray-500'}`}>
                                {panelLabel}
                              </span>
                              {!m.profileComplete && <span className="text-xs text-orange-500 font-medium">Profile incomplete</span>}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                              <MapPin className="w-3 h-3" /> {m.location}
                              <span className="text-gray-300">·</span>
                              <span>{m.nation} country</span>
                              <span className="text-gray-300">·</span>
                              <span>{m.ethnicity}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {m.experience.map(e => (
                                <span key={e} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{e}</span>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {m.matchTags.map(t => (
                                <span key={t} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-2.5 h-2.5" /> {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* ── Panel-grouped list (viewMode === 'panels') ── */}
            {viewMode === 'panels' && PANELS.map(panel => {
              const members = visibleMembers.filter(m => m.panelId === panel.id)
              if (filterPanel !== 'all' && filterPanel !== panel.id) return null
              if (members.length === 0) return null
              const expanded = expandedPanels.includes(panel.id)
              const allSel = members.every(m => selectedMembers.includes(m.id))
              const someSel = members.some(m => selectedMembers.includes(m.id)) && !allSel
              const selCount = members.filter(m => selectedMembers.includes(m.id)).length

              return (
                <div key={panel.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Panel header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <button
                      onClick={() => togglePanelAll(panel.id)}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        allSel ? 'border-wizer-purple bg-wizer-purple' : someSel ? 'border-wizer-purple-mid bg-wizer-purple-light' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {(allSel || someSel) && <div className="w-2 h-2 bg-white rounded-sm" />}
                    </button>
                    <button className="flex-1 flex items-center justify-between text-left" onClick={() => togglePanelExpand(panel.id)}>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{panel.name}</p>
                        <p className="text-xs text-gray-400">{members.length} members · {selCount} selected</p>
                      </div>
                      {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>

                  {/* Member cards */}
                  {expanded && (
                    <div className="divide-y divide-gray-50">
                      {members.map(m => {
                        const isSelected = selectedMembers.includes(m.id)
                        return (
                          <button
                            key={m.id}
                            onClick={() => toggleMember(m.id)}
                            className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors ${isSelected ? 'bg-wizer-purple-xlight' : 'bg-white hover:bg-gray-50'}`}
                          >
                            {/* Checkbox */}
                            <div className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-wizer-purple border-wizer-purple' : 'border-gray-300'}`}>
                              {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </div>

                            {/* Avatar + decision badge */}
                            <div className="relative shrink-0">
                              <div className="w-9 h-9 rounded-full bg-wizer-purple-light flex items-center justify-center text-xs font-bold text-wizer-purple-dark">
                                {m.initials}
                              </div>
                              <div
                                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold border border-white"
                                style={{ backgroundColor: decisionColors[m.decisionCode] ?? '#7b69af' }}
                                title={m.decisionType}
                              >
                                {m.decisionCode.slice(0, 2)}
                              </div>
                            </div>

                            {/* Main info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                                <span className="text-xs text-gray-400" style={{ color: decisionColors[m.decisionCode] }}>{m.decisionType}</span>
                                {!m.profileComplete && <span className="text-xs text-orange-500 font-medium">Profile incomplete</span>}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                <MapPin className="w-3 h-3" /> {m.location}
                                <span className="text-gray-300">·</span>
                                <span>{m.nation} country</span>
                                <span className="text-gray-300">·</span>
                                <span>{m.ethnicity}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {m.experience.map(e => (
                                  <span key={e} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{e}</span>
                                ))}
                              </div>
                              {/* Match tags */}
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {m.matchTags.map(t => (
                                  <span key={t} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-2.5 h-2.5" /> {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Individuals without panel (in panels view, when filter = individuals) */}
            {viewMode === 'panels' && filterPanel === 'individuals' && (() => {
              const indivs = visibleMembers.filter(m => m.panelId === null)
              if (indivs.length === 0) return (
                <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400 text-sm">
                  No individuals without a panel match your filters.
                </div>
              )
              return (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 flex-1">Individuals (no panel)</p>
                    <p className="text-xs text-gray-400">{indivs.length} members</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {indivs.map(m => {
                      const isSelected = selectedMembers.includes(m.id)
                      return (
                        <button
                          key={m.id}
                          onClick={() => toggleMember(m.id)}
                          className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors ${isSelected ? 'bg-wizer-purple-xlight' : 'bg-white hover:bg-gray-50'}`}
                        >
                          <div className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'bg-wizer-purple border-wizer-purple' : 'border-gray-300'}`}>
                            {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          <div className="relative shrink-0">
                            <div className="w-9 h-9 rounded-full bg-wizer-purple-light flex items-center justify-center text-xs font-bold text-wizer-purple-dark">{m.initials}</div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold border border-white"
                              style={{ backgroundColor: decisionColors[m.decisionCode] ?? '#7b69af' }} title={m.decisionType}>
                              {m.decisionCode.slice(0, 2)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                              <span className="text-xs font-medium" style={{ color: decisionColors[m.decisionCode] }}>{m.decisionType}</span>
                              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">No panel</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                              <MapPin className="w-3 h-3" /> {m.location}
                              <span className="text-gray-300">·</span>
                              <span>{m.nation} country</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {m.experience.map(e => <span key={e} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{e}</span>)}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {m.matchTags.map(t => (
                                <span key={t} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle className="w-2.5 h-2.5" /> {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => setStep(0)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={selectedMembers.length === 0}
              className="text-white text-sm font-semibold px-6 py-2.5 rounded-xl disabled:opacity-40 transition-colors"
              style={{ backgroundColor: '#7b69af' }}
            >
              Review & send — {selectedMembers.length} selected →
            </button>
          </div>
        </div>
      )}

      {/* ══ STEP 2: Review & send ══ */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Review & send invitations</h1>
            <p className="text-sm text-gray-500 mt-1">Check your selection before sending. Invitations go out under Tranby College's name.</p>
          </div>

          {/* Selection summary */}
          <div className={`rounded-xl border p-4 ${atRecommended ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className={`w-4 h-4 ${atRecommended ? 'text-green-600' : 'text-yellow-600'}`} />
              <p className={`text-sm font-semibold ${atRecommended ? 'text-green-800' : 'text-yellow-800'}`}>
                {selectedMembers.length} of {recommended} recommended selected
                {!atRecommended && ` — consider going back to add ${recommended - selectedMembers.length} more`}
              </p>
            </div>
            <p className="text-xs text-gray-500 ml-6">Study needs {target} responses · {recommended} invited accounts for drop-off</p>
          </div>

          {/* Selected people */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700">Selected participants ({selectedDetails.length})</p>
              <button onClick={() => setStep(1)} className="text-xs text-wizer-purple hover:text-wizer-purple-dark font-medium">Edit selection</button>
            </div>
            <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {selectedDetails.map(m => (
                <div key={m.id} className="flex items-center gap-3 px-5 py-2.5">
                  <div className="relative shrink-0">
                    <div className="w-7 h-7 rounded-full bg-wizer-purple-light flex items-center justify-center text-xs font-bold text-wizer-purple-dark">{m.initials}</div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[7px] font-bold border border-white"
                      style={{ backgroundColor: decisionColors[m.decisionCode] ?? '#7b69af' }}>
                      {m.decisionCode.slice(0, 2)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.location} · {m.ethnicity}</p>
                  </div>
                  {m.profileComplete
                    ? <span className="text-xs text-green-600 shrink-0 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Complete</span>
                    : <span className="text-xs text-orange-500 shrink-0">Incomplete profile</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Invitation message */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-700">Invitation message</p>
                {isMessageModified && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-wizer-purple-light text-wizer-purple font-medium">Edited</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isMessageModified && !editingMessage && (
                  <button
                    onClick={() => { setSavedMessage(null); setEditingMessage(false) }}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 font-medium"
                    title="Reset to default"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
                {!editingMessage ? (
                  <button
                    onClick={() => { setMessageDraft(activeMessage); setEditingMessage(true) }}
                    className="flex items-center gap-1.5 text-xs text-wizer-purple hover:text-wizer-purple-dark font-medium"
                  >
                    <Pencil className="w-3 h-3" /> Edit message
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingMessage(false)}
                    className="text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Edit mode */}
              {editingMessage ? (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Use <code className="bg-gray-100 px-1 rounded">[Name]</code> where you'd like each participant's name to appear.</p>
                  <textarea
                    autoFocus
                    value={messageDraft}
                    onChange={e => setMessageDraft(e.target.value)}
                    className="w-full border border-wizer-purple rounded-lg px-3 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-wizer-purple/20 resize-none font-mono leading-relaxed"
                    rows={8}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <button
                      onClick={() => { setMessageDraft(defaultMessage) }}
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore default
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingMessage(false)}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => { setSavedMessage(messageDraft); setEditingMessage(false) }}
                        className="px-3 py-1.5 text-xs font-medium text-white rounded-lg"
                        style={{ backgroundColor: '#7b69af' }}
                      >
                        Save message
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Preview mode */
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600 leading-relaxed">
                  {activeMessage.split('\n').map((line, i) =>
                    line === '' ? <div key={i} className="h-2" /> :
                    <p key={i} className={i === 0 ? 'font-medium text-gray-800' : ''}>{line}</p>
                  )}
                  {customNote && (
                    <p className="mt-2 italic text-gray-500 border-t border-gray-200 pt-2">"{customNote}"</p>
                  )}
                </div>
              )}

              {/* Personal note */}
              {!editingMessage && (
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Add a personal note (optional)</label>
                  <textarea
                    value={customNote}
                    onChange={e => setCustomNote(e.target.value)}
                    placeholder="e.g. We think your experience in urban planning makes you a particularly strong voice for this study..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-wizer-purple/20 resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-400 mt-1">This note is appended to the invitation and personalises it for each recipient.</p>
                </div>
              )}
            </div>
          </div>

          {/* Decision profile breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-wizer-purple" /> Decision profile mix
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(
                selectedDetails.reduce((acc, m) => {
                  acc[m.decisionType] = (acc[m.decisionType] ?? 0) + 1
                  return acc
                }, {} as Record<string, number>)
              ).map(([type, count]) => {
                const code = selectedDetails.find(m => m.decisionType === type)?.decisionCode ?? ''
                return (
                  <div key={type} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                      style={{ backgroundColor: decisionColors[code] ?? '#7b69af' }}>
                      {code.slice(0, 2)}
                    </div>
                    <span className="text-sm text-gray-700">{type}</span>
                    <span className="text-sm font-bold text-gray-900">×{count}</span>
                  </div>
                )
              })}
              {selectedDetails.length === 0 && <p className="text-sm text-gray-400">No members selected.</p>}
            </div>
          </div>

          {/* Send */}
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setInviteSent(true)}
              disabled={selectedMembers.length === 0}
              className="flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-xl disabled:opacity-40 transition-colors"
              style={{ backgroundColor: '#7b69af' }}
            >
              <Send className="w-4 h-4" />
              Send {selectedMembers.length} invitations
            </button>
          </div>
          <p className="text-xs text-center text-gray-400">
            Invitations will be sent under Tranby College's name. Participants can accept or decline.
          </p>
        </div>
      )}
    </div>
  )
}
