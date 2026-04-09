'use client'

import Link from 'next/link'
import { CheckCircle, Clock, Lock, ChevronRight, Bell, ExternalLink } from 'lucide-react'

/* ─── Mock data ─────────────────────────────────── */

const PARTICIPANT = {
  name: 'Kylee Ingram',
  firstName: 'Kylee',
  photo: null,
  title: 'Creator | CEO Founder | Tech strategy',
  org: 'Tranby College',
  experience: ['Creative & Program Design', 'Business & Commercial', 'Business Strategy'],
  education: ['University of Sydney', 'TAFE NSW — Community Services'],
  ethnicity: ['Aboriginal Australian'],
  hobbies: ['Community advocacy', 'Sustainable tech'],
  joinedYear: 2024,
  balance: 145,
  totalEarned: 290,
  profileStrength: 72,
  profileChecklist: [
    { label: 'Add Profile Picture', done: false },
    { label: 'Add Bio', done: true },
    { label: 'Add Professions', done: true },
    { label: 'Add Educations', done: true },
    { label: 'Add Ethnicities', done: true },
    { label: 'Add Hobbies/Interests', done: false },
  ],
  decisionProfile: {
    type: 'The Visionary',
    description:
      'You are a Visionary, defined by your ability to think beyond the immediate and imagine transformative possibilities. Visionaries excel in roles where innovation, community voice, and future-focused thinking are essential. With a high level of openness to experience, you thrive in settings that reward unconventional thinking and inspire others to pursue ambitious goals.',
  },
}

const NOTIFICATIONS = [
  { id: 'n1', text: 'New question ready — Climate Policy Priorities', sub: 'Tranby College · Question 2 of 8 · closes in 4 days', time: '27 Mar 2026', type: 'question', studyId: 'study-1' },
  { id: 'n2', text: 'New question ready — Indigenous Health Services', sub: 'Tranby College · Question 1 of 6 · closes in 6 days', time: '25 Mar 2026', type: 'question', studyId: 'study-2' },
  { id: 'n3', text: 'Your response was recorded — Climate Policy Priorities', sub: 'Question 1 · +18 pts earned', time: '20 Mar 2026', type: 'answered', studyId: 'study-1' },
  { id: 'n4', text: 'You were invited to join a new study', sub: 'Transport Infrastructure Futures · via Tranby College', time: '15 Mar 2026', type: 'invite', studyId: 'invite-transport' },
]

const STUDIES = [
  { id: 'study-1', title: 'Climate Policy Priorities — Community Voice', org: 'Tranby College', totalQuestions: 8, currentQuestion: 2, ratePerQuestion: 18, totalValue: 144, earned: 18, status: 'active', questions: [{ n: 1, status: 'answered', closedDaysAgo: 7 },{ n: 2, status: 'open', closesInDays: 4 },{ n: 3, status: 'upcoming', opensInDays: 5 },{ n: 4, status: 'upcoming', opensInDays: 12 },{ n: 5, status: 'upcoming', opensInDays: 19 },{ n: 6, status: 'upcoming', opensInDays: 26 },{ n: 7, status: 'upcoming', opensInDays: 33 },{ n: 8, status: 'upcoming', opensInDays: 40 }] },
  { id: 'study-2', title: 'Indigenous Health Services Consultation', org: 'Tranby College', totalQuestions: 6, currentQuestion: 1, ratePerQuestion: 24, totalValue: 144, earned: 0, status: 'active', questions: [{ n: 1, status: 'open', closesInDays: 6 },{ n: 2, status: 'upcoming', opensInDays: 8 },{ n: 3, status: 'upcoming', opensInDays: 15 },{ n: 4, status: 'upcoming', opensInDays: 22 },{ n: 5, status: 'upcoming', opensInDays: 29 },{ n: 6, status: 'upcoming', opensInDays: 36 }] },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function ParticipantDashboard() {
  const openCount = NOTIFICATIONS.filter(n => n.type === 'question').length
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{getGreeting()}, {PARTICIPANT.name}!</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start gap-5">
            <div className="shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7b69af, #5f5090)' }}>
              <div className="text-center leading-tight"><div className="text-xs font-semibold opacity-80 uppercase tracking-widest">The</div><div className="text-base font-black">VIS</div></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#7b69af' }}>Your Decision Profile · {PARTICIPANT.decisionProfile.type}</p>
                <button className="shrink-0 text-xs border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 px-3 py-1 rounded-full transition-colors">View full decision Profile</button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{PARTICIPANT.decisionProfile.description}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
            {openCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{openCount}</span>}
          </div>
          <div className="divide-y divide-gray-50">
            {NOTIFICATIONS.map(n => {
              const href = n.type === 'question' && n.studyId ? `/participant/study/${n.studyId}` : n.type === 'invite' && n.studyId ? `/participant/invites/${n.studyId}` : null
              const inner = (<><div className="shrink-0 mt-0.5">{n.type === 'question' && <div className="w-8 h-8 rounded-full bg-wizer-purple-light flex items-center justify-center"><Bell className="w-3.5 h-3.5 text-wizer-purple" /></div>}{n.type === 'answered' && <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center"><CheckCircle className="w-3.5 h-3.5 text-green-500" /></div>}{n.type === 'invite' && <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center"><ExternalLink className="w-3.5 h-3.5 text-orange-400" /></div>}</div><div className="flex-1 min-w-0"><p className="text-sm text-gray-800 font-medium">{n.text}</p><p className="text-xs text-gray-400 mt-0.5">{n.sub}</p></div><div className="flex items-center gap-2 shrink-0"><p className="text-xs text-gray-400">{n.time}</p>{n.type === 'invite' && <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">View invite</span>}{n.type === 'question' && href && <span className="text-xs font-semibold text-wizer-purple bg-wizer-purple-light px-2 py-0.5 rounded-full">Answer</span>}</div></>)
              return href ? <Link key={n.id} href={href} className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer">{inner}</Link> : <div key={n.id} className="flex items-start gap-4 px-5 py-3.5">{inner}</div>
            })}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3"><h2 className="text-base font-semibold text-gray-900">My Engagements</h2><span className="text-xs text-gray-400">{STUDIES.length} active</span></div>
          <div className="space-y-4">
            {STUDIES.map(study => {
              const openQ = study.questions.find(q => q.status === 'open')
              return (
                <div key={study.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="font-semibold text-gray-900">{study.title}</p><p className="text-xs text-gray-400 mt-0.5">{study.org} · {study.ratePerQuestion}pts/question · {study.totalValue}pts total</p></div>
                      {openQ ? <Link href={`/participant/study/${study.id}`} className="shrink-0 flex items-center gap-1.5 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium" style={{ backgroundColor: '#7b69af' }}>Answer <ChevronRight className="w-3.5 h-3.5" /></Link> : <span className="shrink-0 text-xs text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg">No open questions</span>}
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1.5"><span>Question {study.currentQuestion} of {study.totalQuestions}</span><span className="text-green-600 font-medium">{study.earned}pts earned</span></div>
                      <div className="flex gap-1">{study.questions.map(q => <div key={q.n} className={`flex-1 h-1.5 rounded-full transition-colors ${q.status === 'answered' ? 'bg-green-400' : q.status === 'open' ? 'bg-wizer-purple' : 'bg-gray-100'}`} />)}</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {study.questions.filter((q, i) => q.status !== 'upcoming' || i <= study.currentQuestion + 1).slice(0, 4).map(q => (
                      <div key={q.n} className={`flex items-center gap-3 px-4 py-2.5 ${q.status === 'open' ? 'bg-wizer-purple-xlight' : ''}`}>
                        {q.status === 'answered' && <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                        {q.status === 'open' && <Clock className="w-3.5 h-3.5 text-wizer-purple shrink-0" />}
                        {q.status === 'upcoming' && <Lock className="w-3.5 h-3.5 text-gray-300 shrink-0" />}
                        <p className={`text-sm flex-1 ${q.status === 'open' ? 'text-wizer-purple-dark font-medium' : q.status === 'answered' ? 'text-gray-500' : 'text-gray-300'}`}>Question {q.n}</p>
                        <p className={`text-xs shrink-0 ${q.status === 'open' ? 'text-wizer-purple font-medium' : 'text-gray-400'}`}>{q.status === 'answered' && `Closed ${q.closedDaysAgo}d ago`}{q.status === 'open' && `Closes in ${q.closesInDays}d`}{q.status === 'upcoming' && `~${q.opensInDays}d`}</p>
                        {q.status === 'answered' && <span className="text-xs text-green-600 font-medium shrink-0">+{study.ratePerQuestion}pts</span>}
                      </div>
                    ))}
                    {study.questions.filter(q => q.status === 'upcoming').length > 2 && <div className="px-4 py-2 text-xs text-gray-400">+ {study.questions.filter(q => q.status === 'upcoming').length - 2} more questions coming</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="w-72 shrink-0 space-y-0">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-5 text-center border-b border-gray-100"><div className="w-20 h-20 rounded-full bg-wizer-purple-light flex items-center justify-center text-wizer-purple-dark font-bold text-xl mx-auto mb-3">KI</div><p className="font-bold text-gray-900 text-base">{PARTICIPANT.name}</p><p className="text-xs text-gray-400 mt-0.5 leading-snug">{PARTICIPANT.title}</p></div>
          <div className="divide-y divide-gray-100">
            <div className="px-5 py-4"><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Experience</p><div className="space-y-1">{PARTICIPANT.experience.map(e => <p key={e} className="text-sm text-gray-700">{e}</p>)}</div></div>
            <div className="px-5 py-4"><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Education</p><div className="space-y-1">{PARTICIPANT.education.map(e => <p key={e} className="text-sm text-gray-700">{e}</p>)}</div></div>
            <div className="px-5 py-4"><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ethnicity</p><div className="space-y-1">{PARTICIPANT.ethnicity.map(e => <p key={e} className="text-sm text-gray-700">{e}</p>)}</div></div>
            <div className="px-5 py-4">
              <div className="flex justify-between items-center mb-2"><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Profile Strength</p><p className="text-xs font-bold text-wizer-purple">{PARTICIPANT.profileStrength}%</p></div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3"><div className="h-full rounded-full bg-wizer-purple" style={{ width: `${PARTICIPANT.profileStrength}%` }} /></div>
              <div className="space-y-2">{PARTICIPANT.profileChecklist.map(item => <div key={item.label} className="flex items-center gap-2.5"><div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${item.done ? 'bg-wizer-purple' : 'border border-gray-200'}`}>{item.done && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}</div><span className={`text-xs ${item.done ? 'text-gray-600' : 'text-gray-400'}`}>{item.label}</span></div>)}</div>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Wizer Credits</p><span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">Shop partner</span></div>
              <div className="flex justify-between text-sm mb-1.5"><span className="text-gray-500">Available to spend</span><span className="font-bold text-gray-900">{PARTICIPANT.balance} pts</span></div>
              <div className="flex justify-between text-sm mb-4"><span className="text-gray-500">Total earned</span><span className="font-semibold text-gray-700">{PARTICIPANT.totalEarned} pts</span></div>
              <Link href="/participant/shop" className="w-full block text-center text-white text-sm font-medium py-2 rounded-lg transition-colors" style={{ backgroundColor: '#7b69af' }}>Visit Rewards Shop →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
