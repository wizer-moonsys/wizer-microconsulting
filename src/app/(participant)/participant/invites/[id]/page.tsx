'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Clock, DollarSign, HelpCircle, Users, CheckCircle, X, MapPin, Calendar } from 'lucide-react'

const INVITE = {
  id: 'invite-transport',
  title: 'Transport Infrastructure Futures',
  org: 'Tranby College',
  client: 'Infrastructure NSW',
  invitedDate: '15 Mar 2026',
  expiresDate: '1 Apr 2026',
  briefing: `Infrastructure NSW is consulting with communities most impacted by planned transport upgrades across Greater Sydney. They're seeking voices from people with lived experience in affected areas, particularly those representing Aboriginal and Torres Strait Islander communities, to help shape how the project is communicated and delivered at a community level.

Your perspective as a community advocate and your background in business and program design makes you a strong fit for this study.`,
  matchReasons: [
    'Community advocate experience',
    'Aboriginal Australian background',
    'Program design expertise',
    'Sydney metro region',
  ],
  questions: 7,
  ratePerQuestion: 22,
  totalPotential: 154,
  estimatedMinutes: 5,
  durationWeeks: 10,
  topics: ['Urban planning', 'Community impact', 'Transport access', 'Cultural safety'],
  questionPreview: [
    'How has recent transport development affected your community\'s access to services?',
    'What does culturally safe consultation look like in your experience?',
    'What would make you confident a major infrastructure project had genuinely heard community voices?',
  ],
}

export default function InvitePage() {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'declined'>('pending')

  if (status === 'accepted') {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">You're in!</h2>
        <p className="text-gray-500 text-sm mb-1">
          You've accepted the invitation to <strong>{INVITE.title}</strong>.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          The first question will open shortly. We'll notify you when it's ready.
        </p>
        <Link
          href="/participant"
          className="inline-flex items-center gap-2 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          style={{ backgroundColor: '#7b69af' }}
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  if (status === 'declined') {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invitation declined</h2>
        <p className="text-gray-500 text-sm mb-8">
          No worries — you won't be enrolled in this study. We'll let you know about future opportunities.
        </p>
        <Link
          href="/participant"
          className="inline-flex items-center gap-2 text-gray-600 text-sm font-medium px-6 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link href="/participant" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5">
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Invite banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-3.5 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-orange-800">You've been invited to join this study</p>
            <p className="text-xs text-orange-600">Invited {INVITE.invitedDate} · Expires {INVITE.expiresDate}</p>
          </div>
        </div>
        <span className="shrink-0 text-xs font-bold text-orange-600 bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-full">
          Pending
        </span>
      </div>

      {/* Study header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">{INVITE.title}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {INVITE.org}
              </span>
              <span className="text-gray-300">·</span>
              <span>Commissioned by <strong className="text-gray-700">{INVITE.client}</strong></span>
            </div>
          </div>
        </div>

        {/* Topic pills */}
        <div className="flex flex-wrap gap-2">
          {INVITE.topics.map(t => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-wizer-purple-light text-wizer-purple-dark font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Earning + commitment stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">${INVITE.totalPotential}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total potential</p>
          <p className="text-xs text-gray-400">${INVITE.ratePerQuestion} per question</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-wizer-purple-light flex items-center justify-center mx-auto mb-2">
            <HelpCircle className="w-4 h-4 text-wizer-purple" />
          </div>
          <p className="text-xl font-bold text-gray-900">{INVITE.questions}</p>
          <p className="text-xs text-gray-400 mt-0.5">Questions total</p>
          <p className="text-xs text-gray-400">~{INVITE.estimatedMinutes} min each</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-gray-900">{INVITE.durationWeeks}wks</p>
          <p className="text-xs text-gray-400 mt-0.5">Study duration</p>
          <p className="text-xs text-gray-400">One question at a time</p>
        </div>
      </div>

      {/* Why you were selected */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Why you were selected</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {INVITE.matchReasons.map(r => (
            <span key={r} className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium">
              <CheckCircle className="w-3 h-3" /> {r}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{INVITE.briefing}</p>
      </div>

      {/* Question preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Question preview</h2>
        <p className="text-xs text-gray-400 mb-4">A sample of the kinds of questions in this study. Exact wording may vary.</p>
        <div className="space-y-3">
          {INVITE.questionPreview.map((q, i) => (
            <div key={i} className="flex gap-3">
              <div
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                style={{ backgroundColor: '#7b69af' }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{q}</p>
            </div>
          ))}
          <p className="text-xs text-gray-400 pl-8">+ {INVITE.questions - INVITE.questionPreview.length} more questions across the study</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-wizer-purple-xlight border border-wizer-purple-light rounded-xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-wizer-purple-dark mb-3">How this works</h2>
        <div className="space-y-2">
          {[
            'Questions open one at a time, roughly weekly.',
            'You have a few days to respond before each question closes.',
            `Each response earns you $${INVITE.ratePerQuestion} in Wizer credits.`,
            'Credits can be spent in the Wizer Rewards Shop.',
            'You can withdraw from the study at any time.',
          ].map((point, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="shrink-0 w-4 h-4 rounded-full bg-wizer-purple flex items-center justify-center mt-0.5">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                  <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-wizer-purple-dark">{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accept / Decline */}
      <div className="flex gap-3">
        <button
          onClick={() => setStatus('accepted')}
          className="flex-1 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
          style={{ backgroundColor: '#7b69af' }}
        >
          Accept invitation — join study
        </button>
        <button
          onClick={() => setStatus('declined')}
          className="px-6 text-gray-500 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Decline
        </button>
      </div>
      <p className="text-xs text-center text-gray-400 mt-3">
        By accepting you agree to respond honestly and keep study content confidential until published.
      </p>
    </div>
  )
}
