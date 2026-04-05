'use client'

import { useState } from 'react'
import { Search, Download, Upload, UserPlus, Bell } from 'lucide-react'

const PEOPLE = [
  { id: 1, name: 'Alice Nguyen', email: 'alice.nguyen@email.com', role: 'Internal', groups: 2, panels: 1, profile: 'VISIONARY', decision: 'VIS', status: 'active', complete: true },
  { id: 2, name: 'Robert Briggs', email: 'robert.briggs@email.com', role: 'Internal', groups: 0, panels: 2, profile: 'GUARDIAN', decision: 'GUA', status: 'active', complete: true },
  { id: 3, name: 'Mary Thorpe', email: 'mary.thorpe@email.com', role: 'Internal', groups: 1, panels: 0, profile: 'N/A', decision: null, status: 'active', complete: false },
  { id: 4, name: 'Emmanuel Torres', email: 'emmanuel.torres@email.com', role: 'Internal', groups: 3, panels: 1, profile: 'ACHIEVER', decision: 'ACH', status: 'active', complete: true },
  { id: 5, name: 'Patricia Walsh', email: 'patricia.walsh@email.com', role: 'External', groups: 0, panels: 1, profile: 'N/A', decision: null, status: 'active', complete: false },
  { id: 6, name: 'James Nguyen', email: 'james.nguyen@email.com', role: 'Internal', groups: 2, panels: 2, profile: 'COLLABORATOR', decision: 'COL', status: 'active', complete: true },
  { id: 7, name: 'Sandra Cooper', email: 'sandra.cooper@email.com', role: 'Admin', groups: 1, panels: 1, profile: 'VISIONARY', decision: 'VIS', status: 'active', complete: true },
  { id: 8, name: 'Michael Nguyen', email: 'michael.nguyen@email.com', role: 'Internal', groups: 0, panels: 0, profile: 'N/A', decision: null, status: 'active', complete: false },
  { id: 9, name: 'Sarah Johnson', email: 'sarah.johnson@email.com', role: 'External', groups: 1, panels: 1, profile: 'GUARDIAN', decision: 'GUA', status: 'active', complete: true },
  { id: 10, name: 'David Williams', email: 'david.williams@email.com', role: 'Internal', groups: 2, panels: 0, profile: 'N/A', decision: null, status: 'active', complete: false },
]

const decisionColors: Record<string, string> = {
  VIS: '#7b69af',
  GUA: '#e67e22',
  ACH: '#27ae60',
  COL: '#2980b9',
}

export default function PeoplePage() {
  const [search, setSearch] = useState('')

  const filtered = PEOPLE.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage People</h1>
          <p className="text-sm text-gray-500 mt-1">All members in your Tranby College community.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-3.5 h-3.5" /> Download CSV
          </button>
          <button className="flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-3.5 h-3.5" /> Upload CSV
          </button>
          <button
            className="flex items-center gap-1.5 text-xs text-white px-3 py-2 rounded-lg transition-colors font-medium"
            style={{ backgroundColor: '#7b69af' }}
          >
            <UserPlus className="w-3.5 h-3.5" /> Add Person
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search people..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-wizer-purple/20 focus:border-wizer-purple"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Groups</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Panels</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Profile</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Decision</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(person => (
              <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{person.name}</td>
                <td className="px-4 py-3 text-gray-500">{person.email}</td>
                <td className="px-4 py-3">
                  <select
                    defaultValue={person.role}
                    className="text-xs border border-gray-200 rounded px-2 py-1 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-wizer-purple"
                  >
                    <option>Internal</option>
                    <option>External</option>
                    <option>Admin</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                    {person.groups}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-wizer-purple-light text-xs font-semibold text-wizer-purple">
                    {person.panels}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs font-semibold text-gray-500">{person.profile}</td>
                <td className="px-4 py-3">
                  {person.decision ? (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white ring-1 ring-gray-200"
                      style={{ backgroundColor: decisionColors[person.decision] ?? '#7b69af' }}
                      title={person.profile}
                    >
                      {person.decision}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {!person.complete && (
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-2 py-1 rounded transition-colors">
                        <Bell className="w-3 h-3" /> Remind
                      </button>
                    )}
                    <button className="text-xs text-gray-400 hover:text-red-500 transition-colors px-1">✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {filtered.length} of {PEOPLE.length} members</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">← Prev</button>
            <button className="px-2 py-1 rounded bg-wizer-purple text-white">1</button>
            <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">2</button>
            <button className="px-2 py-1 rounded border border-gray-200 hover:bg-gray-50">Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
