'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Clock, BarChart2, CheckCircle, Users, MessageSquare, Calendar, MapPin, DollarSign } from 'lucide-react'
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
  questionCount: number
  questions: Question[]
  windowValue: number
  windowUnit: string
  status: 'submitted' | 'live' | 'complete'
  submittedAt: string
  coverImage?: string | null
}

const statusConfig = {
  submitted: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock, desc: 'Your study is being reviewed by the Wizer team. You\'ll hear back within 1 business day.' },
  live: { label: 'Live', color: 'bg-green-100 text-green-700', icon: BarChart2, desc: 'Your study is live and participants are responding.' },
  complete: { label: 'Complete', color: 'bg-gray-100 text-gray-600', icon: CheckCircle, desc: 'This study has closed. View your results below.' },
}

const typeLabels: Record<string, string> = {
  yes_no: 'Yes / No',
  open: 'Open text',
  scale: 'Scale',
  multiple_choice: 'Multiple choice',
}

export default function StudyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [study, setStudy] = useState<Study | null>(null)

  useEffect(() => {
    const stored: Study[] = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    const found = stored.find(s => s.id === id)
    if (found) setStudy(found)
  }, [id])

  if (!study) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>Study not found.</p>
        <Link href="/client" className="text-wizer-purple text-sm mt-2 inline-block hover:underline">← Back to My Studies</Link>
      </div>
    )
  }

  const cfg = statusConfig[study.status] ?? statusConfig.submitted
  const Icon = cfg.icon
  const submitted = new Date(study.submittedAt).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  // Payment model: client covers participant fees (50%) + org management fee (50%) + 10% platform fee
  const participantPool = study.totalBudget          // 50% — goes to participants
  const orgFee = study.totalBudget                    // 50% — goes to org/community manager
  const subtotal = participantPool + orgFee           // = totalBudget × 2
  const platformFee = subtotal * 0.10
  const grandTotal = subtotal + platformFee           // = totalBudget × 2.2
  const totalDue = grandTotal

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Back link */}
      <button
        onClick={() => router.push('/client')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        My Studies
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {study.coverImage && (
          <img src={study.coverImage} alt="Cover" className="w-full h-40 object-cover" />
        )}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {cfg.label}
                </span>
                {study.isIndigenous && (
                  <span className="px-2.5 py-1 bg-wizer-purple-light text-wizer-purple-dark text-xs rounded-full font-medium">Indigenous panel</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{study.title || 'Untitled study'}</h1>
              <p className="text-gray-500 mt-1">{study.description}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Submitted {submitted}</p>
          {/* Status message */}
          <div className="mt-4 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-600">
            {cfg.desc}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'Participants', value: study.participants },
          { icon: MessageSquare, label: 'Questions', value: study.questions.length },
          { icon: Calendar, label: 'Window', value: `${study.windowValue} ${study.windowUnit}` },
          { icon: DollarSign, label: 'Total paid', value: `$${totalDue.toLocaleString()}` },
        ].map(({ icon: StatIcon, label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-1">
            <StatIcon className="w-4 h-4 text-wizer-purple-mid" />
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
            <div className="flex-1">
              <p className="text-gray-900 text-sm">{q.text || <span className="text-gray-400 italic">No question text</span>}</p>
              <p className="text-xs text-gray-400 mt-0.5">{typeLabels[q.type] ?? q.type}</p>
              {q.choices && q.choices.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {q.choices.map((c, ci) => (
                    <span key={ci} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{c}</span>
                  ))}
                </div>
              )}
            </div>
            {/* Placeholder response indicator for 'live' studies */}
            {study.status === 'live' && (
              <div className="shrink-0 text-right">
                <p className="text-xs text-gray-400">Responses</p>
                <p className="text-sm font-semibold text-gray-700">—</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Community details */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Community & Location</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <span className="text-gray-400">Cohort model</span>
          <span className="text-gray-900">{study.cohortModel === 'same_panel' ? 'Same panel throughout' : 'Min participants per question'}</span>
          <span className="text-gray-400">Rate per person</span>
          <span className="text-gray-900">${study.ratePerPerson}</span>
          <span className="text-gray-400">Response window</span>
          <span className="text-gray-900">{study.windowValue} {study.windowUnit} per question</span>
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

      {/* Payment summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Payment Breakdown</h2>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <div>
              <span className="text-gray-700 font-medium">Participant fees</span>
              <p className="text-xs text-gray-400">{study.participants} participants × ${study.ratePerPerson} · paid per response</p>
            </div>
            <span className="text-gray-900 font-medium">${participantPool.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <div>
              <span className="text-gray-700 font-medium">Community management fee</span>
              <p className="text-xs text-gray-400">50% match — covers panel curation, coordination & quality</p>
            </div>
            <span className="text-gray-900 font-medium">${orgFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-2">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-gray-700">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Wizer platform fee (10%)</span>
            <span className="text-gray-700">${platformFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold border-t border-gray-100 pt-2">
            <span className="text-gray-900">Total charged</span>
            <span className="text-wizer-purple-dark text-base">${grandTotal.toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-wizer-purple-xlight border border-wizer-purple-light rounded-lg px-4 py-3 text-xs text-wizer-purple-dark">
          💳 Funds held in escrow and released after each question closes. Community manager receives their fee as responses are completed.
        </div>
      </div>

    </div>
  )
}
