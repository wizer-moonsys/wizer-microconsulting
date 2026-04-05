'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Check, X, Plus, Info, ImagePlus, Trash2 } from 'lucide-react'

// Australian location taxonomy for tag autocomplete
const AUSTRALIAN_LOCATIONS = [
  'New South Wales', 'Victoria', 'Queensland', 'South Australia',
  'Western Australia', 'Tasmania', 'Northern Territory', 'ACT',
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Darwin', 'Hobart', 'Canberra',
  'Western Sydney', 'South East Queensland', 'Hunter Valley', 'Central Coast',
  'Illawarra', 'Riverina', 'New England', 'Far North Queensland',
  'Kimberley', 'Pilbara', 'Goldfields', 'Wheatbelt', 'South West WA',
  'Top End', 'Barkly', 'Katherine', 'Alice Springs', 'Arnhem Land',
  'Cape York', 'Torres Strait', 'Gulf Country', 'Cairns Region',
  'Townsville', 'Mackay', 'Central Queensland', 'Wide Bay',
  'Gippsland', 'Loddon Mallee', 'Grampians', 'Barwon South West',
  'Eyre Peninsula', 'Flinders Ranges', 'Yorke Peninsula', 'Murray Mallee',
  'Remote', 'Rural', 'Regional', 'Metropolitan', 'Urban', 'National'
]

type QuestionType = 'yes_no' | 'open' | 'scale' | 'multiple_choice'

interface Question {
  id: string
  text: string
  type: QuestionType
  scaleMin?: number
  scaleMax?: number
  scaleMinLabel?: string
  scaleMaxLabel?: string
  choices?: string[]
  choiceImages?: (string | null)[]
}

const MIN_PARTICIPANTS = 10
const MIN_BUDGET = 1000
const INDIGENOUS_MIN_RATE = 60
const DEFAULT_RATE = 145

export default function NewStudyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1 state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isIndigenous, setIsIndigenous] = useState(false)
  const [areas, setAreas] = useState<string[]>([])
  const [areaInput, setAreaInput] = useState('')
  const [areaSuggestions, setAreaSuggestions] = useState<string[]>([])
  const [windowValue, setWindowValue] = useState(1)
  const [windowUnit, setWindowUnit] = useState<'days' | 'weeks' | 'months'>('weeks')
  const [coverImage, setCoverImage] = useState<string | null>(null)

  // Step 2 state
  const [cohortModel, setCohortModel] = useState<'same_panel' | 'min_per_question'>('same_panel')
  const [participants, setParticipants] = useState(20)
  const [minPerQuestion, setMinPerQuestion] = useState(15)
  const [ratePerPerson, setRatePerPerson] = useState(DEFAULT_RATE)
  const [questionCount, setQuestionCount] = useState(2)

  // Step 3 state
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', type: 'yes_no' }
  ])

  // Computed values
  const windowDays = windowUnit === 'days' ? windowValue : windowUnit === 'weeks' ? windowValue * 7 : windowValue * 30
  const totalWeeks = Math.ceil((questions.length * windowDays) / 7)
  const effectiveRate = isIndigenous ? Math.max(ratePerPerson, INDIGENOUS_MIN_RATE) : ratePerPerson
  const activeParticipants = cohortModel === 'same_panel' ? participants : minPerQuestion
  const totalBudget = activeParticipants * effectiveRate
  const budgetValid = totalBudget >= MIN_BUDGET && activeParticipants >= MIN_PARTICIPANTS && effectiveRate >= (isIndigenous ? INDIGENOUS_MIN_RATE : 1)

  // Area autocomplete
  function handleAreaInput(value: string) {
    setAreaInput(value)
    if (value.length > 1) {
      const matches = AUSTRALIAN_LOCATIONS.filter(
        loc => loc.toLowerCase().includes(value.toLowerCase()) && !areas.includes(loc)
      ).slice(0, 6)
      setAreaSuggestions(matches)
    } else {
      setAreaSuggestions([])
    }
  }

  function addArea(area: string) {
    if (!areas.includes(area)) setAreas([...areas, area])
    setAreaInput('')
    setAreaSuggestions([])
  }

  function removeArea(area: string) {
    setAreas(areas.filter(a => a !== area))
  }

  // Questions
  function addQuestion() {
    if (questions.length >= questionCount) return
    setQuestions([...questions, {
      id: Date.now().toString(),
      text: '',
      type: 'yes_no'
    }])
  }

  function updateQuestion(id: string, updates: Partial<Question>) {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  function removeQuestion(id: string) {
    if (questions.length <= 1) return
    setQuestions(questions.filter(q => q.id !== id))
  }

  function addChoice(questionId: string) {
    setQuestions(questions.map(q => {
      if (q.id !== questionId) return q
      return { ...q, choices: [...(q.choices ?? ['', '']), ''] }
    }))
  }

  function updateChoice(questionId: string, index: number, value: string) {
    setQuestions(questions.map(q => {
      if (q.id !== questionId) return q
      const choices = [...(q.choices ?? [])]
      choices[index] = value
      return { ...q, choices }
    }))
  }

  function removeChoice(questionId: string, index: number) {
    setQuestions(questions.map(q => {
      if (q.id !== questionId) return q
      const choices = (q.choices ?? []).filter((_, i) => i !== index)
      const choiceImages = (q.choiceImages ?? []).filter((_, i) => i !== index)
      return { ...q, choices, choiceImages }
    }))
  }

  function updateChoiceImage(questionId: string, index: number, url: string | null) {
    setQuestions(questions.map(q => {
      if (q.id !== questionId) return q
      const choiceImages = [...(q.choiceImages ?? (q.choices ?? []).map(() => null))]
      choiceImages[index] = url
      return { ...q, choiceImages }
    }))
  }

  const step1Valid = title.trim().length > 0 && description.trim().length > 0
  const step2Valid = budgetValid
  const step3Valid = questions.every(q => q.text.trim().length > 0)

  function handleSubmit() {
    const study = {
      id: Date.now().toString(),
      title,
      description,
      isIndigenous,
      areas,
      cohortModel,
      participants: activeParticipants,
      ratePerPerson: effectiveRate,
      totalBudget,
      questionCount: questions.length,
      questions,
      windowValue,
      windowUnit,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    }
    const existing = JSON.parse(localStorage.getItem('wizer_studies') ?? '[]')
    localStorage.setItem('wizer_studies', JSON.stringify([study, ...existing]))
    router.push('/client')
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => step === 1 ? router.push('/client') : setStep(step - 1)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 1 ? 'Back to studies' : 'Back'}
        </button>
        <h1 className="text-2xl font-bold text-gray-900">New Community Study</h1>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-0 mb-8">
        {[
          { n: 1, label: 'Overview' },
          { n: 2, label: 'Community' },
          { n: 3, label: 'Questions' },
          { n: 4, label: 'Review & Pay' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step > s.n ? 'bg-purple-600 text-white' :
                step === s.n ? 'bg-purple-600 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {step > s.n ? <Check className="w-4 h-4" /> : s.n}
              </div>
              <span className={`text-xs mt-1 whitespace-nowrap ${step === s.n ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < 3 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > s.n ? 'bg-purple-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Study Details ── */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">About your study</h2>

            {/* Indigenous toggle — prominent at top */}
            <div className={`rounded-xl border-2 p-4 transition-colors ${isIndigenous ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Is this study going to Indigenous communities?</p>
                  {isIndigenous && (
                    <p className="text-xs text-amber-700 mt-1">
                      Your study will be routed to Tranby College, our Indigenous community partner.
                      A minimum fee applies: $1,000 total · $60 per person minimum.
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsIndigenous(!isIndigenous)}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${isIndigenous ? 'bg-amber-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${isIndigenous ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Study title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Financial Wellbeing Survey 2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">What are you trying to learn?</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Briefly describe the purpose of this study and what insights you're hoping to gain..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
            </div>

            {/* Cover image — optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover image <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              {coverImage ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 h-40">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setCoverImage(null)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-xl cursor-pointer transition-colors group">
                  <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-purple-500 mb-2" />
                  <span className="text-sm text-gray-400 group-hover:text-purple-500">Click to upload an image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) setCoverImage(URL.createObjectURL(file))
                    }}
                  />
                </label>
              )}
            </div>

          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Next: Community
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Panel & Budget ── */}
      {step === 2 && (
        <div className="space-y-6">

          {/* Cohort model */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Panel type</h2>
            <p className="text-sm text-gray-500">Do you want the same people answering every question, or just a minimum number per question?</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setCohortModel('same_panel')}
                className={`text-left p-4 rounded-xl border-2 transition-colors ${
                  cohortModel === 'same_panel'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <p className="font-medium text-gray-900 text-sm">Same Panel</p>
                <p className="text-xs text-gray-500 mt-1">The same committed group answers every question. Ideal for tracking opinions over time. Unlocks the AI Question Advisor.</p>
                {cohortModel === 'same_panel' && (
                  <span className="inline-block mt-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Selected</span>
                )}
              </button>

              <button
                onClick={() => setCohortModel('min_per_question')}
                className={`text-left p-4 rounded-xl border-2 transition-colors ${
                  cohortModel === 'min_per_question'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                <p className="font-medium text-gray-900 text-sm">Minimum Per Question</p>
                <p className="text-xs text-gray-500 mt-1">A rolling pool — different people can answer each question as long as the minimum is met. More flexible.</p>
                {cohortModel === 'min_per_question' && (
                  <span className="inline-block mt-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Selected</span>
                )}
              </button>
            </div>
          </div>

          {/* Participant numbers */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Participant numbers</h2>

            {cohortModel === 'same_panel' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How many participants in your panel?
                </label>
                <input
                  type="number"
                  min={MIN_PARTICIPANTS}
                  max={200}
                  value={participants}
                  onChange={e => setParticipants(parseInt(e.target.value) || MIN_PARTICIPANTS)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {participants < MIN_PARTICIPANTS && (
                  <p className="text-xs text-red-500 mt-1">Minimum {MIN_PARTICIPANTS} participants required</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum responses per question
                </label>
                <input
                  type="number"
                  min={MIN_PARTICIPANTS}
                  max={200}
                  value={minPerQuestion}
                  onChange={e => setMinPerQuestion(parseInt(e.target.value) || MIN_PARTICIPANTS)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {minPerQuestion < MIN_PARTICIPANTS && (
                  <p className="text-xs text-red-500 mt-1">Minimum {MIN_PARTICIPANTS} per question required</p>
                )}
              </div>
            )}
          </div>

          {/* Geographic areas */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-gray-900">Where should participants be from?</h2>
              <p className="text-sm text-gray-500 mt-1">Optional — leave blank for national reach</p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={areaInput}
                onChange={e => handleAreaInput(e.target.value)}
                placeholder="Type a location, e.g. Western Sydney..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {areaSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                  {areaSuggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => addArea(s)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-purple-50 hover:text-purple-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {areas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {areas.map(a => (
                  <span key={a} className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                    {a}
                    <button onClick={() => removeArea(a)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Study timing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-semibold text-gray-900">Study timing</h2>
            <p className="text-sm text-gray-500 -mt-2">How long should each question stay open before the next one is sent?</p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setWindowValue(Math.max(1, windowValue - 1))}
                className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-purple-400 text-gray-600 hover:text-purple-600 flex items-center justify-center font-bold text-lg transition-colors"
              >
                −
              </button>
              <span className="text-3xl font-bold text-purple-600 w-8 text-center">{windowValue}</span>
              <button
                onClick={() => setWindowValue(windowValue + 1)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-purple-400 text-gray-600 hover:text-purple-600 flex items-center justify-center font-bold text-lg transition-colors"
              >
                +
              </button>
              <div className="flex gap-1 ml-2">
                {(['days', 'weeks', 'months'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => setWindowUnit(u)}
                    className={`px-3 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${
                      windowUnit === u
                        ? 'border-purple-600 bg-purple-600 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-purple-300'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {windowUnit === 'days' && windowDays < 7 && (
              <p className="text-xs text-amber-600 flex items-center gap-1">
                <Info className="w-3 h-3" /> We recommend at least 1 week to give participants enough time to respond.
              </p>
            )}

            <div className="bg-blue-50 rounded-lg px-4 py-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                Each question stays open for <strong>{windowValue} {windowUnit}</strong>.
                Your total study length will depend on how many questions you add in Step 3.
              </p>
            </div>
          </div>

          {/* Starting questions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-gray-900">How many questions to start with?</h2>
              <p className="text-sm text-gray-500 mt-1">Best practice is to start with 1–2 and build on what you learn. You can add more later — each top-up is priced separately.</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuestionCount(Math.max(1, questionCount - 1))}
                className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-purple-400 text-gray-600 hover:text-purple-600 flex items-center justify-center font-bold text-lg transition-colors"
              >
                −
              </button>
              <span className="text-3xl font-bold text-purple-600 w-8 text-center">{questionCount}</span>
              <button
                onClick={() => setQuestionCount(questionCount + 1)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-purple-400 text-gray-600 hover:text-purple-600 flex items-center justify-center font-bold text-lg transition-colors"
              >
                +
              </button>
              {questionCount <= 2 && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">recommended</span>
              )}
            </div>
          </div>

          {/* Budget summary */}
          <div className={`rounded-xl border-2 p-6 ${budgetValid ? 'border-green-300 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <h2 className="font-semibold text-gray-900 mb-4">Budget estimate</h2>
            <div className="space-y-3 text-sm">

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Participants</span>
                <span className="font-medium">{activeParticipants}</span>
              </div>

              {/* Rate per person — editable for non-Indigenous, locked for Indigenous */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-600">Rate per person</span>
                  {isIndigenous && (
                    <span className="ml-2 text-xs text-amber-600">(min. ${INDIGENOUS_MIN_RATE} for Indigenous studies)</span>
                  )}
                </div>
                {isIndigenous ? (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      min={INDIGENOUS_MIN_RATE}
                      value={ratePerPerson}
                      onChange={e => setRatePerPerson(Math.max(INDIGENOUS_MIN_RATE, parseInt(e.target.value) || INDIGENOUS_MIN_RATE))}
                      className="w-20 px-2 py-1 border border-amber-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      min={1}
                      value={ratePerPerson}
                      onChange={e => setRatePerPerson(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Questions</span>
                <span className="font-medium">{questionCount}</span>
              </div>

              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-gray-900">Estimated total</span>
                  <p className="text-xs text-gray-400">{activeParticipants} participants × ${effectiveRate} per person</p>
                </div>
                <span className="font-bold text-xl text-gray-900">${totalBudget.toLocaleString()}</span>
              </div>
            </div>

            {!budgetValid && (
              <p className="text-xs text-red-600 mt-3">
                Minimum study is ${MIN_BUDGET.toLocaleString()} total with at least {MIN_PARTICIPANTS} participants.
                {isIndigenous && ` Rate must be at least $${INDIGENOUS_MIN_RATE} per person for Indigenous studies.`}
              </p>
            )}

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                The $145 per person covers up to 6–8 questions for the full study and is held in escrow before invitations go out. Participants are paid per response plus a completion bonus. If you need more questions beyond the included amount, you can top up at any time.
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-3 rounded-lg font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!step2Valid}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Next: Questions
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Questions ── */}
      {step === 3 && (
        <div className="space-y-6">

          {cohortModel === 'same_panel' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                <strong>AI Question Advisor is enabled</strong> for this study. After each question completes,
                Wizer will suggest follow-up questions based on the results.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {questions.map((q, index) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={index}
                total={questions.length}
                onUpdate={updates => updateQuestion(q.id, updates)}
                onRemove={() => removeQuestion(q.id)}
                onAddChoice={() => addChoice(q.id)}
                onUpdateChoice={(i, v) => updateChoice(q.id, i, v)}
                onRemoveChoice={i => removeChoice(q.id, i)}
                onUpdateChoiceImage={(i, url) => updateChoiceImage(q.id, i, url)}
              />
            ))}
          </div>

          <button
            onClick={addQuestion}
            className="w-full border-2 border-dashed border-purple-300 hover:border-purple-500 text-purple-600 hover:text-purple-700 rounded-xl py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add another question
          </button>

          <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-500">
              You can also add more questions later based on what the results show. Each question opens after the previous one closes.
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-3 rounded-lg font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!step3Valid || questions.length === 0}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Review & Pay
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Review & Pay ── */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Review & Pay</h2>
            <p className="text-sm text-gray-500 mt-1">Check everything looks right before we launch your study.</p>
          </div>

          {/* Study overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Study Overview</h3>
            {coverImage && (
              <img src={coverImage} alt="Cover" className="w-full h-32 object-cover rounded-lg" />
            )}
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="flex flex-wrap gap-2">
              {isIndigenous && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">Indigenous panel</span>
              )}
              {areas.map(a => (
                <span key={a} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{a}</span>
              ))}
            </div>
          </div>

          {/* Community & timing */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Community & Timing</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-gray-500">Cohort model</span>
              <span className="text-gray-900 font-medium">{cohortModel === 'same_panel' ? 'Same panel' : 'Min per question'}</span>
              <span className="text-gray-500">Participants</span>
              <span className="text-gray-900 font-medium">{activeParticipants}</span>
              <span className="text-gray-500">Response window</span>
              <span className="text-gray-900 font-medium">{windowValue} {windowUnit} per question</span>
              <span className="text-gray-500">Estimated duration</span>
              <span className="text-gray-900 font-medium">~{totalWeeks} {totalWeeks === 1 ? 'week' : 'weeks'} total</span>
            </div>
          </div>

          {/* Questions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{questions.length} Question{questions.length !== 1 ? 's' : ''}</h3>
            {questions.map((q, i) => (
              <div key={q.id} className="flex gap-3 text-sm">
                <span className="shrink-0 w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <div>
                  <p className="text-gray-900">{q.text || <span className="text-gray-400 italic">No question text</span>}</p>
                  <p className="text-gray-400 text-xs mt-0.5 capitalize">{q.type.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Payment Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <div>
                  <span className="text-gray-700 font-medium">Participant fees</span>
                  <p className="text-xs text-gray-400">{activeParticipants} participants × ${effectiveRate.toFixed(0)} · paid per response</p>
                </div>
                <span className="text-gray-900 font-medium">${totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-gray-700 font-medium">Community management fee</span>
                  <p className="text-xs text-gray-400">Matched 50/50 — covers panel curation & coordination</p>
                </div>
                <span className="text-gray-900 font-medium">${totalBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-1.5">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-gray-700">${(totalBudget * 2).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Wizer platform fee (10%)</span>
                <span className="text-gray-700">${(totalBudget * 2 * 0.10).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
                <span className="text-gray-900">Total due today</span>
                <span className="text-wizer-purple-dark text-base">${(totalBudget * 2.2).toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-wizer-purple-xlight rounded-lg px-4 py-3 text-xs text-wizer-purple-dark space-y-1">
              <p>💳 Funds held in escrow — participant fees released per response, management fee matched as responses come in.</p>
              <p>📄 An invoice will be emailed to you once the study is live.</p>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-3 rounded-lg font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Confirm & Submit Study
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Question Card Component ──
function QuestionCard({
  question, index, total,
  onUpdate, onRemove,
  onAddChoice, onUpdateChoice, onRemoveChoice, onUpdateChoiceImage
}: {
  question: Question
  index: number
  total: number
  onUpdate: (updates: Partial<Question>) => void
  onRemove: () => void
  onAddChoice: () => void
  onUpdateChoice: (i: number, v: string) => void
  onRemoveChoice: (i: number) => void
  onUpdateChoiceImage: (i: number, url: string | null) => void
}) {
  const typeLabels: Record<QuestionType, string> = {
    yes_no: 'Yes / No',
    open: 'Open text',
    scale: 'Scale',
    multiple_choice: 'Multiple choice',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-purple-600">Question {index + 1}</span>
        {total > 1 && (
          <button onClick={onRemove} className="text-gray-400 hover:text-red-500 p-1">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Question text */}
      <textarea
        value={question.text}
        onChange={e => onUpdate({ text: e.target.value })}
        placeholder="Type your question here..."
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none mb-4"
      />

      {/* Question type selector — tile style */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-500 mb-3">What type of question is this?</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              type: 'yes_no' as QuestionType,
              label: 'YES / NO',
              desc: 'Simple binary choice',
              icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                  <path d="M8 20 C8 20 10 24 16 24 C22 24 24 20 24 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="14" r="2" fill="currentColor"/>
                  <circle cx="20" cy="14" r="2" fill="currentColor"/>
                  <path d="M9 10 L7 8 M23 10 L25 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ),
            },
            {
              type: 'multiple_choice' as QuestionType,
              label: 'MULTIPLE CHOICE',
              desc: 'Pick from options',
              icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                  <rect x="6" y="6" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                  <rect x="18" y="6" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                  <rect x="6" y="18" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                  <rect x="18" y="18" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
                  <text x="9" y="14" fontSize="5" fill="currentColor" fontWeight="bold">a</text>
                  <text x="21" y="14" fontSize="5" fill="currentColor" fontWeight="bold">b</text>
                  <text x="9" y="26" fontSize="5" fill="currentColor" fontWeight="bold">c</text>
                  <text x="21" y="26" fontSize="5" fill="currentColor" fontWeight="bold">d</text>
                </svg>
              ),
            },
            {
              type: 'open' as QuestionType,
              label: 'OPEN ENDED',
              desc: 'Free text response',
              icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                  <path d="M6 8 C6 7 7 6 8 6 L24 6 C25 6 26 7 26 8 L26 20 C26 21 25 22 24 22 L14 22 L9 27 L9 22 L8 22 C7 22 6 21 6 20 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  <line x1="10" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="10" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
            },
            {
              type: 'scale' as QuestionType,
              label: 'OPINION SCALE',
              desc: 'Rate on a scale',
              icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                  <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.8"/>
                  <circle cx="16" cy="16" r="1.5" fill="currentColor"/>
                  <line x1="6" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="22" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="8" y1="22" x2="11" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="24" y1="10" x2="21" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="8" y1="10" x2="11" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="24" y1="22" x2="21" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              ),
            },
          ].map(({ type: t, label, desc, icon }) => {
            const active = question.type === t
            return (
              <button
                key={t}
                onClick={() => onUpdate({ type: t })}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center ${
                  active
                    ? 'border-wizer-purple bg-wizer-purple-xlight text-wizer-purple'
                    : 'border-gray-200 text-gray-500 hover:border-wizer-purple-soft hover:text-wizer-purple bg-white'
                }`}
              >
                <div className={active ? 'text-wizer-purple' : 'text-gray-400'}>{icon}</div>
                <div>
                  <p className={`text-xs font-bold tracking-wide ${active ? 'text-wizer-purple' : 'text-gray-700'}`}>{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Type-specific fields */}
      {question.type === 'scale' && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min value</label>
              <input
                type="number"
                value={question.scaleMin ?? 1}
                onChange={e => onUpdate({ scaleMin: parseInt(e.target.value) })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max value</label>
              <input
                type="number"
                value={question.scaleMax ?? 10}
                onChange={e => onUpdate({ scaleMax: parseInt(e.target.value) })}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min label (optional)</label>
              <input
                type="text"
                value={question.scaleMinLabel ?? ''}
                onChange={e => onUpdate({ scaleMinLabel: e.target.value })}
                placeholder="e.g. Not at all"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max label (optional)</label>
              <input
                type="text"
                value={question.scaleMaxLabel ?? ''}
                onChange={e => onUpdate({ scaleMaxLabel: e.target.value })}
                placeholder="e.g. Extremely"
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
              />
            </div>
          </div>
        </div>
      )}

      {question.type === 'multiple_choice' && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-3">
          <label className="block text-xs font-medium text-gray-500">Answer choices</label>
          {(question.choices ?? ['', '']).map((choice, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center gap-2">
                {/* Choice image thumbnail or upload button */}
                {question.choiceImages?.[i] ? (
                  <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 border border-gray-200">
                    <img src={question.choiceImages[i]!} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => onUpdateChoiceImage(i, null)}
                      className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="w-10 h-10 rounded border-2 border-dashed border-gray-300 hover:border-purple-400 flex items-center justify-center cursor-pointer shrink-0 transition-colors group">
                    <ImagePlus className="w-4 h-4 text-gray-300 group-hover:text-purple-400" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (file) onUpdateChoiceImage(i, URL.createObjectURL(file))
                      }}
                    />
                  </label>
                )}
                <input
                  type="text"
                  value={choice}
                  onChange={e => onUpdateChoice(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
                {(question.choices ?? []).length > 2 && (
                  <button onClick={() => onRemoveChoice(i)} className="text-gray-400 hover:text-red-500 shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={onAddChoice}
            className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 mt-1"
          >
            <Plus className="w-3 h-3" />
            Add option
          </button>
        </div>
      )}

      {question.type === 'yes_no' && (
        <div className="flex gap-2">
          <span className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Yes</span>
          <span className="px-4 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">No</span>
        </div>
      )}

      {question.type === 'open' && (
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-400 italic">Participants will type a free-text response</p>
        </div>
      )}
    </div>
  )
}
