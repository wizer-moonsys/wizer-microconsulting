'use client'

import { useState } from 'react'
import { Search, CheckCircle, Clock, Users } from 'lucide-react'

const PARTICIPANTS = [
  { id: 'p1', name: 'Alice Nguyen', org: 'Tranby College', orgId: 'tranby', location: 'Sydney, NSW', profileComplete: true, questionsAnswered: 6, joined: '2024-04-02', indigenous: true },
  { id: 'p2', name: 'Robert Briggs', org: 'Tranby College', orgId: 'tranby', location: 'Dubbo, NSW', profileComplete: true, questionsAnswered: 4, joined: '2024-04-10', indigenous: true },
  { id: 'p3', name: 'Mary Thorpe', org: 'Tranby College', orgId: 'tranby', location: 'Redfern, NSW', profileComplete: false, questionsAnswered: 0, joined: '2024-05-01', indigenous: true },
  { id: 'p4', name: 'Dr James Liu', org: 'CAD Frontiers', orgId: 'cad', location: 'Melbourne, VIC', profileComplete: true, questionsAnswered: 12, joined: '2024-01-15', indigenous: false },
  { id: 'p5', name: 'Priya Sharma', org: 'CAD Frontiers', orgId: 'cad', location: 'Geelong, VIC', profileComplete: true, questionsAnswered: 9, joined: '2024-02-03', indigenous: false },
  { id: 'p6', name: 'Tom Edwards', org: 'CAD Frontiers', orgId: 'cad', location: 'Ballarat, VIC', profileComplete: true, questionsAnswered: 7, joined: '2024-02-20', indigenous: false },
  { id: 'p7', name: 'Sarah Mitchell', org: 'Melbourne Research Collective', orgId: 'mrc', location: 'Carlton, VIC', profileComplete: true, questionsAnswered: 18, joined: '2023-12-01', indigenous: false },
  { id: 'p8', name: 'David Osei', org: 'Melbourne Research Collective', orgId: 'mrc', location: 'Footscray, VIC', profileComplete: true, questionsAnswered: 14, joined: '2023-12-15', indigenous: false },
  { id: 'p9', name: 'Linda Park', org: 'Melbourne Research Collective', orgId: 'mrc', location: 'Brunswick, VIC', profileComplete: false, questionsAnswered: 2, joined: '2024-03-10', indigenous: false },
  { id: 'p10', name: 'Emmanuel Torres', org: 'Tranby College', orgId: 'tranby', location: 'Penrith, NSW', profileComplete: true, questionsAnswered: 3, joined: '2024-04-25', indigenous: true },
]

const ORG_FILTERS = ['All', 'Tranby College', 'CAD Frontiers', 'Melbourne Research Collective']

export default function ParticipantsPage() {
  const [search, setSearch] = useState('')
  const [orgFilter, setOrgFilter] = useState('All')
  const [profileFilter, setProfileFilter] = useState<'all' | 'complete' | 'incomplete'>('all')

  const filtered = PARTICIPANTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    const matchOrg = orgFilter === 'All' || p.org === orgFilter
    const matchProfile = profileFilter === 'all' ||
      (profileFilter === 'complete' ? p.profileComplete : !p.profileComplete)
    return matchSearch && matchOrg && matchProfile
  })

  const completeCount = PARTICIPANTS.filter(p => p.profileComplete).length
  const pct = Math.round((completeCount / PARTICIPANTS.length) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Participants</h1>
        <p className="text-sm text-gray-500 mt-1">All community members across partner organisations.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 flex items-center gap-1"><Users className="w-3 h-3" /> Total participants</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{PARTICIPANTS.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 flex items-center gap-1"><CheckCircle className="w-3 h-3 text-purple-400" /> Profiles complete</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{completeCount} <span className="text-sm text-gray-400 font-normal">({pct}%)</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3 text-yellow-400" /> Pending profiles</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{PARTICIPANTS.length - completeCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name or location…"
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 w-52"
          />
        </div>

        <select
          value={orgFilter}
          onChange={e => setOrgFilter(e.target.value)}
          className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {ORG_FILTERS.map(o => <option key={o}>{o}</option>)}
        </select>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'complete', 'incomplete'] as const).map(f => (
            <button
              key={f}
              onClick={() => setProfileFilter(f)}
              className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                profileFilter === f ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? 'All' : f === 'complete' ? 'Profile done' : 'Pending'}
            </button>
          ))}
        </div>

        <span className="text-xs text-gray-400 ml-auto">{filtered.length} shown</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Organisation</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Location</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Profile</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Questions answered</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{p.name}</p>
                  {p.indigenous && <span className="text-xs text-purple-600 font-medium">Indigenous</span>}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.org}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{p.location}</td>
                <td className="px-4 py-3">
                  {p.profileComplete ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                      <CheckCircle className="w-3 h-3" /> Complete
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full font-medium">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700">{p.questionsAnswered}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(p.joined).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No participants found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
