'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, CheckCircle, Clock, Lock } from 'lucide-react'

const STUDY_DATA: Record<string, {
  title: string
  org: string
  ratePerQuestion: number
  totalQuestions: number
  currentQuestion: number
  question: {
    text: string
    type: 'yes_no' | 'open' | 'scale' | 'multiple_choice'
    choices?: string[]
  }
  previousQuestions: { n: number; summary: string }[]
}> = {
  'study-1': {
    title: 'Climate Policy Priorities — Community Voice',
    org: 'Tranby College',
    ratePerQuestion: 18,
    totalQuestions: 8,
    currentQuestion: 2,
    question: {
      text: 'How confident are you that government decision-makers understand the climate concerns of people in your community?',
      type: 'scale',
    },
    previousQuestions: [
      { n: 1, summary: 'Which climate issue needs the most urgent attention? — You answered: Water security' },
    ],
  },
  'study-2': {
    title: 'Indigenous Health Services Consultation',
    org: 'Tranby College',
    ratePerQuestion: 24,
    totalQuestions: 6,
    currentQuestion: 1,
    question: {
      text: 'What is the biggest barrier you or your family face when accessing health services in your community?',
      type: 'open',
    },
    previousQuestions: [],
  },
}

export default function StudyQuestionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const study = STUDY_DATA[id]

  const [scaleValue, setScaleValue] = useState<number | null>(null)
  const [openText, setOpenText] = useState('')
  const [yesNo, setYesNo] = useState<'yes' | 'no' | null>(null)
  const [choice, setChoice] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (!study) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>Study not found.</p>
        <button onClick={() => router.push('/participant')} className="text-wizer-purple text-sm mt-2 block mx-auto hover:underline">← Back</button>
      </div>
    )
  }

  const { question } = study
  const isAnswered =
    (question.type === 'scale' && scaleValue !== null) ||
    (question.type === 'open' && openText.trim().length > 0) ||
    (question.type === 'yes_no' && yesNo !== null) ||
    (question.type === 'multiple_choice' && choice !== null)

  function handleSubmit() {
    setSubmitted(true)
  }

  const upcomingCount = study.totalQuestions - study.currentQuestion

  return (
    <div className="max-w-xl mx-auto space-y-5">

      {/* Back */}
      <button onClick={() => router.push('/participant')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        My Studies
      </button>

      {/* Study context */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs text-gray-400 mb-1">{study.org}</p>
        <p className="font-semibold text-gray-900">{study.title}</p>

        {/* Question progress dots */}
        <div className="flex gap-1.5 mt-4">
          {Array.from({ length: study.totalQuestions }).map((_, i) => {
            const n = i + 1
            const isAnsweredQ = n < study.currentQuestion
            const isCurrent = n === study.currentQuestion
            return (
              <div
                key={n}
                title={`Question ${n}`}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  isAnsweredQ ? 'bg-green-400' :
                  isCurrent ? 'bg-wizer-purple' :
                  'bg-gray-100'
                }`}
              />
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Question {study.currentQuestion} of {study.totalQuestions} · {upcomingCount} more to come · +{study.ratePerQuestion}pts for this response
        </p>
      </div>

      {/* Previous question context */}
      {study.previousQuestions.length > 0 && (
        <div className="space-y-2">
          {study.previousQuestions.map(pq => (
            <div key={pq.n} className="flex items-start gap-2 bg-gray-50 rounded-lg px-4 py-3">
              <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500">{pq.summary}</p>
            </div>
          ))}
        </div>
      )}

      {/* Question card */}
      {submitted ? (
        <div className="bg-white rounded-xl border border-green-200 p-8 text-center space-y-3">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
          <p className="font-semibold text-gray-900">Thank you — response recorded!</p>
          <p className="text-sm text-gray-500">+{study.ratePerQuestion}pts has been added to your balance.</p>
          {upcomingCount > 0 && (
            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
              Question {study.currentQuestion + 1} will open in approximately {study.currentQuestion === 1 ? '7' : '7'} days. We'll let you know.
            </p>
          )}
          <button
            onClick={() => router.push('/participant')}
            className="mt-2 text-sm text-wizer-purple hover:text-wizer-purple-dark font-medium"
          >
            Back to My Studies
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
          <div className="flex items-center gap-2 text-xs text-wizer-purple font-medium">
            <Clock className="w-3.5 h-3.5" />
            Question {study.currentQuestion} of {study.totalQuestions} — open now
          </div>

          <p className="text-gray-900 font-medium text-lg leading-snug">{question.text}</p>

          {/* Yes / No */}
          {question.type === 'yes_no' && (
            <div className="flex gap-3">
              {['yes', 'no'].map(v => (
                <button
                  key={v}
                  onClick={() => setYesNo(v as 'yes' | 'no')}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold text-sm capitalize transition-all ${
                    yesNo === v ? 'border-wizer-purple bg-wizer-purple-light text-wizer-purple-dark' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}

          {/* Open text */}
          {question.type === 'open' && (
            <textarea
              value={openText}
              onChange={e => setOpenText(e.target.value)}
              placeholder="Share your thoughts…"
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-wizer-purple resize-none"
            />
          )}

          {/* Scale */}
          {question.type === 'scale' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <button
                    key={n}
                    onClick={() => setScaleValue(n)}
                    className={`flex-1 aspect-square rounded-lg border-2 text-sm font-semibold transition-all ${
                      scaleValue === n ? 'border-wizer-purple bg-wizer-purple text-white' : 'border-gray-200 text-gray-600 hover:border-wizer-purple-light'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Not at all confident</span>
                <span>Extremely confident</span>
              </div>
            </div>
          )}

          {/* Multiple choice */}
          {question.type === 'multiple_choice' && question.choices && (
            <div className="space-y-2">
              {question.choices.map(c => (
                <button
                  key={c}
                  onClick={() => setChoice(c)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    choice === c ? 'border-wizer-purple bg-wizer-purple-light text-wizer-purple-dark' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isAnswered}
            className="w-full bg-wizer-purple hover:bg-wizer-purple-dark disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            Submit Response · +{study.ratePerQuestion}pts
          </button>
        </div>
      )}

      {/* Upcoming questions */}
      {upcomingCount > 0 && !submitted && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Coming next</p>
          {Array.from({ length: Math.min(upcomingCount, 3) }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Question {study.currentQuestion + 1 + i} — opens in ~{(i + 1) * 7} days</span>
            </div>
          ))}
          {upcomingCount > 3 && (
            <p className="text-xs text-gray-300 pl-5">+ {upcomingCount - 3} more questions to follow</p>
          )}
        </div>
      )}

    </div>
  )
}
