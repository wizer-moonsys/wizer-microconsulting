'use client'

import { useState } from 'react'
import { Users, Pencil, Trash2, Plus, X, Search, CheckCircle } from 'lucide-react'

interface Member {
  id: string
  name: string
  initials: string
  location: string
  profileComplete: boolean
}

interface Panel {
  id: string
  name: string
  members: Member[]
}

const ALL_MEMBERS: Member[] = [
  { id: 'p1', name: 'Alice Nguyen', initials: 'AN', location: 'Sydney, NSW', profileComplete: true },
  { id: 'p2', name: 'Robert Briggs', initials: 'RB', location: 'Dubbo, NSW', profileComplete: true },
  { id: 'p3', name: 'Mary Thorpe', initials: 'MT', location: 'Redfern, NSW', profileComplete: false },
  { id: 'p4', name: 'Emmanuel Torres', initials: 'ET', location: 'Penrith, NSW', profileComplete: true },
  { id: 'p5', name: 'Patricia Walsh', initials: 'PW', location: 'Blacktown, NSW', profileComplete: false },
  { id: 'p6', name: 'James Nguyen', initials: 'JN', location: 'Parramatta, NSW', profileComplete: true },
  { id: 'p7', name: 'Sandra Cooper', initials: 'SC', location: 'Liverpool, NSW', profileComplete: true },
  { id: 'p8', name: 'David Reid', initials: 'DR', location: 'Penrith, NSW', profileComplete: true },
  { id: 'p9', name: 'Leanne Watson', initials: 'LW', location: 'Newcastle, NSW', profileComplete: false },
]

const INITIAL_PANELS: Panel[] = [
  {
    id: 'panel-1',
    name: 'Elders & Knowledge Holders',
    members: [ALL_MEMBERS[0], ALL_MEMBERS[1], ALL_MEMBERS[3]],
  },
  {
    id: 'panel-2',
    name: 'Sydney Metro Community',
    members: [ALL_MEMBERS[2], ALL_MEMBERS[5], ALL_MEMBERS[6]],
  },
  {
    id: 'panel-3',
    name: 'Remote & Regional',
    members: [ALL_MEMBERS[4], ALL_MEMBERS[7], ALL_MEMBERS[8]],
  },
]

export default function CommunityPage() {
  const [panels, setPanels] = useState<Panel[]>(INITIAL_PANELS)
  const [editingPanel, setEditingPanel] = useState<Panel | null>(null)
  const [memberSearch, setMemberSearch] = useState('')

  const totalMembers = new Set(panels.flatMap(p => p.members.map(m => m.id))).size

  function openEdit(panel: Panel) {
    setEditingPanel({ ...panel, members: [...panel.members] })
    setMemberSearch('')
  }

  function removeMemberFromEdit(memberId: string) {
    setEditingPanel(prev => prev ? { ...prev, members: prev.members.filter(m => m.id !== memberId) } : prev)
  }

  function addMemberToEdit(member: Member) {
    setEditingPanel(prev => {
      if (!prev) return prev
      if (prev.members.find(m => m.id === member.id)) return prev
      return { ...prev, members: [...prev.members, member] }
    })
  }

  function saveEdit() {
    if (!editingPanel) return
    setPanels(prev => prev.map(p => p.id === editingPanel.id ? editingPanel : p))
    setEditingPanel(null)
  }

  function deletePanel(panelId: string) {
    setPanels(prev => prev.filter(p => p.id !== panelId))
  }

  function addPanel() {
    const newPanel: Panel = {
      id: `panel-${Date.now()}`,
      name: 'New Panel',
      members: [],
    }
    setPanels(prev => [...prev, newPanel])
    openEdit(newPanel)
  }

  const searchResults = memberSearch
    ? ALL_MEMBERS.filter(m =>
        m.name.toLowerCase().includes(memberSearch.toLowerCase()) &&
        !editingPanel?.members.find(em => em.id === m.id)
      )
    : []

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Panels</h1>
          <p className="text-sm text-gray-500 mt-1">Organise your community into groups. Payment comes through from the study.</p>
        </div>
        <button
          onClick={addPanel}
          className="flex items-center gap-2 bg-wizer-purple hover:bg-wizer-purple-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Panel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400">Total panels</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{panels.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400">Total members</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalMembers}</p>
        </div>
      </div>

      {/* Panel cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {panels.map(panel => (
          <div key={panel.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{panel.name}</h3>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(panel)} className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => deletePanel(panel.id)} className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Member avatars */}
            {panel.members.length > 0 && (
              <div className="flex -space-x-2 mb-3">
                {panel.members.slice(0, 5).map(m => (
                  <div
                    key={m.id}
                    title={m.name}
                    className="w-8 h-8 rounded-full bg-wizer-purple-light text-wizer-purple-dark flex items-center justify-center text-xs font-bold border-2 border-white"
                  >
                    {m.initials}
                  </div>
                ))}
                {panel.members.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold border-2 border-white">
                    +{panel.members.length - 5}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <Users className="w-4 h-4" />
              <span>{panel.members.length} member{panel.members.length !== 1 ? 's' : ''}</span>
            </div>

            <button
              onClick={() => openEdit(panel)}
              className="w-full border border-gray-200 hover:border-wizer-purple text-gray-600 hover:text-wizer-purple text-sm py-2 rounded-lg transition-colors"
            >
              + Add / Remove Members
            </button>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editingPanel && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900 text-lg">{editingPanel.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{editingPanel.members.length} current member{editingPanel.members.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setEditingPanel(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Panel name */}
              <input
                type="text"
                value={editingPanel.name}
                onChange={e => setEditingPanel(prev => prev ? { ...prev, name: e.target.value } : prev)}
                placeholder="Panel name…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wizer-purple"
              />

              {/* Search to add */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  placeholder="Search to add member…"
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-wizer-purple"
                />
              </div>

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="border border-gray-100 rounded-lg divide-y divide-gray-100 max-h-32 overflow-y-auto">
                  {searchResults.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { addMemberToEdit(m); setMemberSearch('') }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-wizer-purple-light text-left transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-wizer-purple-light text-wizer-purple-dark flex items-center justify-center text-xs font-bold shrink-0">
                        {m.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.location}</p>
                      </div>
                      {m.profileComplete && <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Current members */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">Current Members</p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {editingPanel.members.length === 0 ? (
                    <p className="text-xs text-gray-400 py-2">No members yet — search to add.</p>
                  ) : editingPanel.members.map(m => (
                    <div key={m.id} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="w-7 h-7 rounded-full bg-wizer-purple-light text-wizer-purple-dark flex items-center justify-center text-xs font-bold shrink-0">
                        {m.initials}
                      </div>
                      <p className="text-sm text-gray-900 flex-1">{m.name}</p>
                      <button
                        onClick={() => removeMemberFromEdit(m.id)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2 py-0.5 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setEditingPanel(null)}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 bg-wizer-purple hover:bg-wizer-purple-dark text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
